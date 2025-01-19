const fs = require('fs');
const path = require('path');
const readline = require('readline');

const targetFile = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(targetFile);
stream.write('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const HELLO_PHRASE = 'Hello!!! Write your text here please: ';
const GOODBYE_PHRASE = 'Goodbye! Have a great day!';

rl.question(HELLO_PHRASE, (answer) => {
  stream.write(answer + '\n');

  rl.on('line', (line) => {
    stream.write(line + '\n');

    if (line.trim().toLowerCase() === 'exit') {
      process.exit();
    }
  });
});

process.on('exit', () => {
  process.stdout.write(`\n${GOODBYE_PHRASE}`);
});
