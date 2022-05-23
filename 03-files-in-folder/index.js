const path = require('path');
const fs = require('fs');

async function myReadDir(pathFolder) {
  const files = await fs.promises.readdir(pathFolder);
  for (let file of files) {
    const filePath = path.resolve('03-files-in-folder', 'secret-folder', file);
    const stats = await fs.promises.stat(filePath);
    if (stats.isFile()) {
      file = file.split('.').join(' - ') + ' - ' + stats.size + 'b';
      console.log(file);
    }
  }
}

myReadDir(path.resolve('03-files-in-folder', 'secret-folder'));