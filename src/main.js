const electron = require('electron')
const url = require('url')
const path = require('path')

const {app,  BrowserWindow, Menu} = electron

let DEBUG = true;

let mainWindow;

// Listen for the app to be ready
app.on('ready', function() {
    // create new window
    mainWindow = new BrowserWindow({});

    // load html file into the window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/templates/mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('close', () => {
        app.quit()  // close all windows when closed
    })

    // build main menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)  // insert new menu
    mainWindow.maximize()
})

// create menu template
const mainMenuTemplate = [
    {
        label: 'Produtos',
        submenu: [
            {label: "Novo produto"},
            {label: "Pesquisar produto"}
        ]
    }
]


if (DEBUG) {
    mainMenuTemplate.push({
        label: 'Dev tools',
        submenu: [
            {
                label: 'Inspecionar',
                accelerator: 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role: 'reload',
                accelerator: 'Ctrl+R'
            }
        ]
    })
}

