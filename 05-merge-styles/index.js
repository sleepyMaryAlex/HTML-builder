const fs = require('fs');
const path = require('path');

fs.access(
  path.resolve('05-merge-styles', 'project-dist', 'bundle.css'),
  (err) => {
    if (!err) {
      fs.unlink(
        path.resolve('05-merge-styles', 'project-dist', 'bundle.css'),
        (err) => {
          if (err) throw err;
        }
      );
    }
  }
);

fs.readdir(path.resolve('05-merge-styles', 'styles'), (err, files) => {
  if (err) throw err;
  files = files.filter((file) => file.split('.')[1] === 'css');
  for (let i = 0; i < files.length; i++) {
    let data = '';
    const rs = fs.createReadStream(
      path.resolve('05-merge-styles', 'styles', `${files[i]}`)
    );
    rs.on('data', (chunk) => {
      data += chunk.toString();
    });
    rs.on('end', () => {
      fs.appendFile(
        path.resolve('05-merge-styles', 'project-dist', 'bundle.css'),
        i === 0 ? data : '\n' + data,
        (err) => {
          if (err) throw err;
        }
      );
    });
  }
});
