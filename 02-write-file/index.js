const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

const pathFile = path.join(__dirname, 'textFile.txt');
const output = fs.createWriteStream(pathFile);

process.on('exit', () => stdout.write('Good Bye.'));
process.on('SIGINT', () => process.exit());

stdout.write('Hello. Write your text below:\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().includes('exit')) process.exit();
  output.write(chunk);
});
