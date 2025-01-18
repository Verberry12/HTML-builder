const fs = require('fs');
const path = require('path');

const currentFilePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(currentFilePath);

readStream.on('data', (data) => {
  console.log(data.toString());
});
