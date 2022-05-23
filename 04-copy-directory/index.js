const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve('04-copy-directory', 'files');
const targetPath = path.resolve('04-copy-directory', 'files-copy');

async function removeFolder(path) {
  const files = await fs.promises.readdir(path);
  for (let file of files) {
    await fs.promises.unlink(`${targetPath}/${file}`);
  }
}

async function copyDir(pathFolder) {
  await fs.promises.mkdir(targetPath, { recursive: true });
  console.log('Copied successfully');

  const files = await fs.promises.readdir(pathFolder);
  for (let file of files) {
    await fs.promises.copyFile(
      `${sourcePath}/${file}`,
      `${targetPath}/${file}`
    );
  }
}

async function runFunctions() {
  const stat = await fs.promises.stat(targetPath).catch(() => null);
  if (stat) {
    await removeFolder(targetPath);
  }
  await copyDir(sourcePath);
}

runFunctions();
