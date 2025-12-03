const { app, BrowserWindow } = require('electron');

/**
 * WebThings Desktop App.
 * 
 * Main script.
 */

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 768
  })

  win.loadFile('src/index.html')
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