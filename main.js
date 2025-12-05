const { app, BrowserWindow } = require('electron');

/**
 * WebThings Desktop App.
 * 
 * Main script.
 */
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
  });

  mainWindow.loadFile('src/index.html');

  if(process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});