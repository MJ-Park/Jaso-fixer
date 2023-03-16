const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const iconv = require('iconv-lite');
const { dirname } = require('path');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 380,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.on('ondragstart', (event, filePath) => {
  event.sender.startDrag({
    file: filePath,
    icon: path.join(__dirname, 'assets/icon.png')
  });
});

ipcMain.on('ondragover', (event, filePath) => {
  event.preventDefault();
});

ipcMain.on('ondrop', (event, filePath) => {
  const oldPath = filePath;
  
  // 폴더인 경우
  if (fs.lstatSync(filePath).isDirectory()) {
    const files = fs.readdirSync(filePath);
    files.forEach(file => {
      const oldFilePath = path.join(filePath, file);
      // const newFilePath = path.join(path.dirname(filePath), normalizeFileName(file));
      const newFilePath = path.join(filePath, normalizeFileName(file));
      fs.renameSync(oldFilePath, newFilePath);
    });
  } else { // 파일인 경우
    const oldFileName = path.basename(filePath);
    const newFileName = normalizeFileName(oldFileName);
    const newPath = path.join(path.dirname(filePath), newFileName);

    fs.renameSync(oldPath, newPath);
  }

  console.log('renamed!');
});

function normalizeFileName(fileName) {
  return fileName.normalize('NFC');
}

// ipcMain.on('ondrop', (event, filePath) => {
//     const oldPath = filePath;
//     const oldFileName = path.basename(filePath);
    
//     const newFileName = oldFileName.normalize('NFC');
//     console.log('normalized :  ' ,`${newFileName}` );
//     const newPath = path.join(path.dirname(filePath), newFileName);

//     fs.rename(oldPath, newPath, function (err) {
//         if (err) throw err
//         console.log('renamed!')
//     })
// })
    