const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');
const { stdout } = process;

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);
  files.forEach((file) => {
    if (file.isFile()) {
      const currFilePath = path.join(folderPath, file.name);
      const currNameFile = path.parse(currFilePath).name;
      const currExtensionFile = path.parse(currFilePath).ext.slice(1);
      fs.stat(currFilePath, (err, stats) => {
        if (err) console.log(err.message);
        stdout.write(
          `${currNameFile} - ${currExtensionFile} - ${stats.size / 1000}kb\n`,
        );
      });
    }
  });
});
