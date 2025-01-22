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

const execInterrupt = (message) => {
  if (message.trim().toLowerCase() === 'exit') {
    process.exit();
  }
};
rl.question(HELLO_PHRASE, (answer) => {
  stream.write(answer + '\n');

  execInterrupt(answer);

  rl.on('line', (line) => {
    stream.write(line + '\n');
    execInterrupt(line);
  });

  rl.on('history', (data) => {
    console.log(data);
  });
});

process.on('exit', () => {
  process.stdout.write(`\n${GOODBYE_PHRASE}`);
});
