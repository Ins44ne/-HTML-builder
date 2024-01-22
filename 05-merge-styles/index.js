const fs = require('fs');
const path = require('path');

const startFolder = './05-merge-styles/styles';
const resultFolder = './05-merge-styles/project-dist';
const outputFile = 'bundle.css';

fs.readdir(startFolder, (err, files) => {
  if (err) {
    console.error('Error reading styles folder:', err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const stylesArray = cssFiles.map((file) => {
    const filePath = path.join(startFolder, file);
    return fs.readFileSync(filePath, 'utf8');
  });

  const comboStyles = stylesArray.join('\n');

  const resultPath = path.join(resultFolder, outputFile);
  fs.writeFileSync(resultPath, comboStyles, 'utf8');

  console.log('Bundle.css has been successfully created.');
});
