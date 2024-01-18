const fs = require('fs');

const filePath = './01-read-file/text.txt';

const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

readStream.on('data', (data) => {
  process.stdout.write(data);
});

readStream.on('end', () => {
  console.log('File reading completed.');
});

readStream.on('error', (err) => {
  console.error('Error reading the file:', err);
});
