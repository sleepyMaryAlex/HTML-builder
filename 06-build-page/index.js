const fs = require('fs');
const path = require('path');

async function createOutputFolder() {
  const folderPath = path.resolve('06-build-page', 'project-dist');
  await fs.promises.mkdir(folderPath, { recursive: true });
}

async function removeFile(file) {
  const filePath = path.resolve('06-build-page', 'project-dist', file);
  const stat = await fs.promises.stat(filePath).catch(() => null);
  if (stat) {
    await fs.promises.unlink(filePath);
  }
}

async function createHTML() {
  const templatePath = path.resolve('06-build-page', 'template.html');
  let template = await fs.promises.readFile(templatePath, 'binary');

  const componentsPath = path.resolve('06-build-page', 'components');
  let components = await fs.promises.readdir(componentsPath);
  components = components
    .map((component) => component.split('.'))
    .filter((component) => component[1] === 'html')
    .map((component) => component[0]);

  for (let component of components) {
    if (template.replace(/\s/g, '').includes(`{{${component}}}`)) {
      const componentPath = path.resolve(componentsPath, `${component}.html`);
      const componentContent = await fs.promises.readFile(componentPath);
      template = template.replace(`{{${component}}}`, componentContent);
    }
  }

  const htmlPath = path.resolve('06-build-page', 'project-dist', 'index.html');
  await fs.promises.appendFile(htmlPath, template);
}

async function createCSS() {
  const stylesPath = path.resolve('06-build-page', 'styles');
  let files = await fs.promises.readdir(stylesPath);
  const targetPath = path.resolve('06-build-page', 'project-dist', 'style.css');
  files = files.filter((file) => file.split('.')[1] === 'css');
  for (let i = 0; i < files.length; i++) {
    const filePath = path.resolve(stylesPath, files[i]);
    const fileContent = await fs.promises.readFile(filePath, 'binary');

    await fs.promises.appendFile(
      targetPath,
      i === 0 ? fileContent : '\n' + '\n' + fileContent
    );
  }
}

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

async function copyDir(sourceFolderPath, targetFolderPath) {
  await fs.promises.mkdir(targetFolderPath, { recursive: true });
  const elements = await fs.promises.readdir(sourceFolderPath);

  for (let element of elements) {
    const elementSourcePath = path.resolve(sourceFolderPath, element);
    const elementTargetPath = path.resolve(targetFolderPath, element);
    const stats = await fs.promises.stat(elementSourcePath);
    if (stats.isDirectory()) {
      await fs.promises.mkdir(elementTargetPath, { recursive: true });
      await copyDir(elementSourcePath, elementTargetPath);
    } else {
      await fs.promises.copyFile(elementSourcePath, elementTargetPath);
    }
  }
}

async function removeAssets() {
  const assetsPath = path.resolve('06-build-page', 'project-dist', 'assets');
  const stat = await fs.promises.stat(assetsPath).catch(() => null);
  if (stat) {
    await removeFiles(assetsPath);
  }
}

async function runFunctions() {
  await createOutputFolder();
  await removeFile('index.html');
  await createHTML();
  await removeFile('style.css');
  await createCSS();
  await removeAssets();
  await copyDir(
    path.resolve('06-build-page', 'assets'),
    path.resolve('06-build-page', 'project-dist', 'assets')
  );
}

runFunctions();
