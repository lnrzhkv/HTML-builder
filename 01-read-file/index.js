const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const targetFilePath = path.join(__dirname, 'text.txt');

const file = fs.createReadStream(targetFilePath, 'utf-8');

file.on('data', (fileContent) => {
  stdout.write(fileContent);
});
