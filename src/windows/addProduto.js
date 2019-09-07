function createAddProdutoWindow() {
    // create new window
    addWindow = new BrowserWindow({
        title: 'Adicionar produto',
        width: 500,
        height: 800
    });

    // load html file into the window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/templates/addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))


}