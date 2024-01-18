const fsPromises = require('fs').promises;
const path = require('path');

const srcPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files_copy');

async function copyDir() {
  try {
    await fsPromises.rm(copyPath, { force: true, recursive: true });
    await fsPromises.mkdir(copyPath, { recursive: true });
    const doc = await fsPromises.readdir(
      srcPath,
      { withFileTypes: true },
      (err, doc) => {
        return doc;
      },
    );
    doc.forEach((file) => {
      const docStartPath = path.join(srcPath, file.name);
      const docplacePath = path.join(copyPath, file.name);
      fsPromises.copyFile(docStartPath, docplacePath);
    });
  } catch (err) {
    console.log(err.message);
  }
}

copyDir();
