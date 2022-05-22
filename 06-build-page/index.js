const fs = require("fs");
const path = require("path");

// create folder project-dist

fs.mkdir(
  path.resolve("06-build-page", "project-dist"),
  { recursive: true },
  (err) => {
    if (err) throw err;
    console.log("Created successfully");
  }
);

// check if index.html exists and remove

fs.access(path.resolve("06-build-page", "project-dist", "index.html"), (err) => {
  if (!err) {
    fs.unlink(
      path.resolve("06-build-page", "project-dist", "index.html"),
      (err) => {
        if (err) throw err;
      }
    );
  }
});

// add index.html

async function createHTML() {
  let template = await fs.promises.readFile(
    path.resolve("06-build-page", "template.html"),
    "binary"
  );

  let components = await fs.promises.readdir(
    path.resolve("06-build-page", "components")
  );
  components = components
    .map((component) => component.split("."))
    .filter((component) => component[1] === "html")
    .map((component) => component[0]);

    for (let component of components) {
      if (template.replace(/\s/g, '').includes(`{{${component}}}`)) {
        let data = await fs.promises.readFile(path.resolve("06-build-page", "components", `${component}.html`));
        template = template.replace(`{{${component}}}`, data);
      }
    }
    fs.open(path.resolve("06-build-page", "project-dist", "index.html"), 'w', (err) => {
      if (err) throw err;
      fs.appendFile(path.resolve("06-build-page", "project-dist", "index.html"), template, (err) => {
        if (err) throw err;
      })
    })
}

// check if style.css exists and remove

fs.access(path.resolve("06-build-page", "project-dist", "style.css"), (err) => {
  if (!err) {
    fs.unlink(
      path.resolve("06-build-page", "project-dist", "style.css"),
      (err) => {
        if (err) throw err;
      }
    );
  }
});

// add file style.css

fs.readdir(path.resolve("06-build-page", "styles"), (err, files) => {
  if (err) throw err;
  files = files.filter((file) => file.split(".")[1] === "css");
  for (let i = 0; i < files.length; i++) {
    let data = "";
    const rs = fs.createReadStream(
      path.resolve("06-build-page", "styles", `${files[i]}`)
    );
    rs.on("data", (chunk) => {
      data += chunk.toString();
    });
    rs.on("end", () => {
      fs.appendFile(
        path.resolve("06-build-page", "project-dist", "style.css"),
        i === 0 ? data : "\n" + data,
        (err) => {
          if (err) throw err;
        }
      );
    });
  }
});

// remove assets

async function removeFiles(folderPath) {
  const elements = await fs.promises.readdir(folderPath);
  for (let element of elements) {
    const elementPath = path.resolve(folderPath, element);
    const stat = await fs.promises.stat(elementPath);
    if (stat.isFile()) {
      await fs.promises.unlink(elementPath);
    } else {
      await removeFiles(elementPath);
      await fs.promises.rmdir(elementPath);
    }
  }
}

// copy assets folder

async function copyDir(sourceFolderPath, targetFolderPath) {
  createFolder(targetFolderPath);
  const elements = await fs.promises.readdir(sourceFolderPath);

  for (let element of elements) {
    const elementSourcePath = path.resolve(sourceFolderPath, element);
    const elementTargetPath = path.resolve(targetFolderPath, element);
    fs.stat(elementSourcePath, (err, stats) => {
      if (err) throw err;
      if (stats.isDirectory()) {
        createFolder(elementTargetPath);
        copyDir(elementSourcePath, elementTargetPath);
      } else {
        fs.copyFile(elementSourcePath, elementTargetPath, (err) => {
          if (err) throw err;
        });
      }
    });
  }
}

function createFolder(path) {
  fs.mkdir(path, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

async function runFunctions() {
  const assetsPath = path.resolve("06-build-page", "project-dist", "assets");
  const stat = await fs.promises.stat(assetsPath).catch((_) => null);
  if (stat) {
    await removeFiles(assetsPath);
  }
  await copyDir(
    path.resolve("06-build-page", "assets"),
    path.resolve("06-build-page", "project-dist", "assets")
  );
  await createHTML();
}

runFunctions();
