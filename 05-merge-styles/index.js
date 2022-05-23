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

// fs.readdir(path.resolve('05-merge-styles', 'styles'), (err, files) => {
//   if (err) throw err;
//   files = files.filter((file) => file.split('.')[1] === 'css');
//   for (let i = 0; i < files.length; i++) {
//     let data = '';
//     const rs = fs.createReadStream(
//       path.resolve('05-merge-styles', 'styles', `${files[i]}`)
//     );
//     rs.on('data', (chunk) => {
//       data += chunk.toString();
//     });
//     rs.on('end', () => {
//       fs.appendFile(
//         path.resolve('05-merge-styles', 'project-dist', 'bundle.css'),
//         i === 0 ? data : '\n' + data,
//         (err) => {
//           if (err) throw err;
//         }
//       );
//     });
//   }
// });
async function runFunctions() {
  await removeFile();
  await createBundle();
}

runFunctions();