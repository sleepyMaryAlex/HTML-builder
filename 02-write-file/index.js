const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getAnswer() {
  return new Promise((resolve) => {
    rl.question('', (answer) => {
      resolve(answer);
    });
  });
}

async function writeToFile(filePath) {
  let answer = await getAnswer();
  while (answer.trim() !== 'exit') {
    await fs.promises.appendFile(filePath, answer + '\n');
    answer = await getAnswer();
  }
  rl.write('Thank you. Have a nice day!');
  rl.close();
}

async function processFile() {
  rl.on('SIGINT', () => {
    rl.write('Thank you. Have a nice day!');
    rl.close();
  });
  rl.write('Hello, write some text, please!' + '\n');
  const filePath = path.resolve('02-write-file', 'text.txt');
  const stat = await fs.promises.stat(filePath).catch(() => null);
  if (stat) {
    await fs.promises.unlink(filePath);
  }
  await fs.promises.open(filePath, 'a+');
  await writeToFile(filePath);
}

processFile();
