const fs = require('fs');
const path = require('path');
const sourcePath = path.resolve('05-merge-styles', 'styles');
const targetPath = path.resolve(
  '05-merge-styles',
  'project-dist',
  'bundle.css'
);

async function removeFile() {
  const stat = await fs.promises.stat(targetPath).catch(() => null);
  if (stat) {
    await fs.promises.unlink(targetPath);
  }
}

async function createBundle() {
  let files = await fs.promises.readdir(sourcePath);
  files = files.filter((file) => file.split('.')[1] === 'css');
  for (let i = 0; i < files.length; i++) {
    const fileContent = await fs.promises.readFile(
      `${sourcePath}/${files[i]}`,
      'binary'
    );

    await fs.promises.appendFile(
      targetPath,
      i === 0 ? fileContent : '\n' + fileContent
    );
  }
}

async function runFunctions() {
  await removeFile();
  await createBundle();
}

runFunctions();