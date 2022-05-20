const fs = require('fs');
const path = require('path');

async function removeFolder(path) {
  const files = await fs.promises.readdir(path);
  for (let file of files) {
    fs.unlink(`04-copy-directory/files-copy/${file}`, (err) => {
      if (err) throw err;
    });
  }
}

async function copyDir(pathFolder) {
  try {
    fs.mkdir(
      path.resolve('04-copy-directory', 'files-copy'),
      { recursive: true },
      (err) => {
        if (err) throw err;
        console.log('Copied successfully');
      }
    );

    const files = await fs.promises.readdir(pathFolder);
    for (let file of files) {
      fs.copyFile(
        path.resolve('04-copy-directory', 'files', `${file}`),
        path.resolve('04-copy-directory', 'files-copy', `${file}`),
        (err) => {
          if (err) throw err;
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
}

fs.stat(path.resolve('04-copy-directory', 'files-copy'), (err) => {
  if (!err) {
    removeFolder(path.resolve('04-copy-directory', 'files-copy'));
  }
  copyDir(path.resolve('04-copy-directory', 'files'));
});
