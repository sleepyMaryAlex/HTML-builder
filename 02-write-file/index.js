const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function fileHandler() {
  fs.open(path.resolve('02-write-file', 'text.txt'), 'a+', textHandler);
}
fileHandler();

let fileContent = '';
let message = 'Hello, write some text, please!\n';

function textHandler() {
  rl.question(message, (answer) => {
    if (answer.trim() !== 'exit') {
      message = '';
      fs.writeFile(path.resolve('02-write-file', 'text.txt'), fileContent + answer, (err) => {
        if (err) throw err;
        fileContent += answer + '\n';
      });
      textHandler();
    } else {
      console.log('Thank you. Have a nice day!');
      rl.close();
    }
  });
}

rl.on('SIGINT', () => {
  console.log('Thank you. Have a nice day!');
  rl.close();
});
