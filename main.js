const { app, BrowserWindow } = require('electron')
const path = require('path')
const fs = require("fs");
const path = require("path");

const userConfig = require('./config.json');
userConfig.pauseAfterLoad = userConfig.pauseAfterLoad || 1000;
userConfig.interval = userConfig.interval || 60 * 60 * 15;

let Number_Of_Shots_Taken = 0;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  mainWindow.loadFile('index.html');

  takeScreenshots(mainWindow);
  const intervalId = setInterval(() => takeScreenshots(mainWindow, intervalId), userConfig.interval);
}

function takeScreenshots(mainWindow, intervalId) {
  Object.keys(userConfig.uris).forEach(i => takeScreenshot({
    mainWindow, filename: i, uri: userConfig.uris[i]
  }));

  if (userConfig.maxScreenshots) {
    Number_Of_Shots_Taken++;
    if (Number_Of_Shots_Taken >= userConfig.maxScreenshots) {
      clearInterval(intervalId);
    }
  }
}

function takeScreenshot({ mainWindow, filename, uri }) {
  const d = (new Date().toString()).replace(/\W+/g, '_');

  // To Do make a dir per URI
  const dir = path.join(__dirname, 'screenshots/', filename);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const path = dir + '/' + d + '.png';
  console.log("Do ", uri, " -> ", path);

  mainWindow.show();
  mainWindow.maximize();

  mainWindow.loadURL(uri).then(() => {
    setTimeout(() => capture(mainWindow, path), userConfig.pauseAfterLoad);
  });
}

function capture(mainWindow, file) {
  mainWindow.webContents.capturePage()
    .then((img) => {

      fs.writeFile(file, img.toPNG(), (err) => {
        if (err) {
          console.error("Error: ", err);
          throw err;
        }
        console.log("Saved " + url + " at " + file);
        mainWindow.loadFile('index.html');
      });
    });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

