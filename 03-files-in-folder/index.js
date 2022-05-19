const path = require('path');
const fs = require('fs');

async function myReadDir(pathFolder) {
  try {
    const files = await fs.promises.readdir(pathFolder);
    for (let file of files) {
      fs.stat(
        path.resolve('03-files-in-folder', 'secret-folder', `${file}`),
        (err, stats) => {
          if (err) throw err;
          if (stats.isFile()) {
            file = file.split('.').join(' - ') + ' - ' + stats.size + 'b';
            console.log(file);
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
}
myReadDir(path.resolve('03-files-in-folder', 'secret-folder'));
