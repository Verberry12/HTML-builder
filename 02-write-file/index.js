const fs = require('fs');
const path = require('path');
const rl = require('readline');

const newFilePath = path.join(__dirname, 'text.txt');

const readLine = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Enter text into new file');

let inputLines = [];

readLine.on('line', (line) => {
  if (line.toLowerCase() === 'exit') {
    readLine.close();
  } else {
    inputLines.push(line);
  }
});

readLine.on('close', () => {
  const textToWrite = inputLines.join('\n');
  fs.writeFile(newFilePath, textToWrite, { encoding: 'utf8' }, () => {
    console.log('Text is written to file text.txt');
  });
});
