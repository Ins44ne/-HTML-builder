const fs = require('fs/promises');
const path = require('path');

const projectPath = 'project-dist';
const stylePath = 'styles';
const assetsPath = 'assets';
const styleFile = 'style.css';
const htmlFile = 'index.html';
const tempFile = 'template.html';
const compPath = 'components';

async function createFolder(_folder) {
  try {
    await fs.rm(_folder, { recursive: true, force: true });
    await fs.mkdir(_folder, { recursive: true });
  } catch (error) {
    console.error(
      `An error occurred while creating the folder: ${error.message}`,
    );
  }
}

async function copyDirRecursively(initial, copy) {
  await fs.mkdir(copy, { recursive: true });

  const files = await fs.readdir(initial);

  files.forEach(async (file) => {
    const initFilePath = path.join(initial, file);
    const copyFilePath = path.join(copy, file);
    const stats = await fs.stat(initFilePath);

    if (stats.isFile()) {
      await fs.copyFile(initFilePath, copyFilePath);
    } else if (stats.isDirectory()) {
      await copyDirRecursively(initFilePath, copyFilePath);
    }
  });
}

async function buildStylesBundle(_destinationFolder) {
  const stylesFolder = path.join(__dirname, stylePath);
  const stylesBundleFile = path.join(_destinationFolder, styleFile);

  try {
    const cssFiles = await fs.readdir(stylesFolder);
    const cssBundle = await fs.open(stylesBundleFile, 'w');

    for (const file of cssFiles) {
      const pathFile = path.join(stylesFolder, file);
      const fileStat = await fs.stat(pathFile);

      if (fileStat.isFile() && file.match(/\.css$/)) {
        const cssContent = await fs.readFile(pathFile, 'utf-8');
        await cssBundle.write(`${cssContent}\n`);
      }
    }

    await cssBundle.close();
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function replacetempTags(template, compFolder, output) {
  try {
    const tempContent = await fs.readFile(template, 'utf-8');
    const tempTags = tempContent.match(/\{\{(\w+)\}\}/g);

    if (tempTags) {
      let modContent = tempContent;
      for (const tag of tempTags) {
        const tagName = tag.slice(2, -2);
        const compFilePath = path.join(compFolder, `${tagName}.html`);

        try {
          if (path.extname(compFilePath).toLowerCase() === '.html') {
            const compContent = await fs.readFile(compFilePath, 'utf-8');
            modContent = modContent.replace(tag, compContent);
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
      await fs.writeFile(output, modContent, 'utf-8');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

(async function () {
  const projectFolder = path.join(__dirname, projectPath);
  const templateFile = path.join(__dirname, tempFile);
  const compFolder = path.join(__dirname, compPath);

  await createFolder(projectFolder);

  await copyDirRecursively(
    path.join(__dirname, assetsPath),
    path.join(projectFolder, assetsPath),
  );
  await replacetempTags(
    templateFile,
    compFolder,
    path.join(projectFolder, htmlFile),
  );
  await buildStylesBundle(projectFolder);
})();
