const fs = require('fs');
const path = require('path');

let data = '';
const rs = fs.ReadStream(path.resolve('01-read-file', 'text.txt'));
rs.on('data', (chunk) => {
  data += chunk.toString();
});
rs.on('end', () => {
  console.log(data);
});
