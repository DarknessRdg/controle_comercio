const electron = require('electron')
const url = require('url')
const path = require('path')

const {app,  BrowserWindow} = electron

let mainWindow;

// Listen for the app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
        },
        minWidth: 800,
        minHeight: 500,
        center: true
    });

    mainWindow.setMenuBarVisibility(false)

    electron.globalShortcut.register('Ctrl+R', () => {
        mainWindow.reload()
    })

    electron.globalShortcut.register('Ctrl+I', () => {
        mainWindow.webContents.openDevTools()
    })

    // load html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/templates/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('close', () => {
        app.quit()  // close all windows when closed
    })

    mainWindow.maximize()
})
