const href = window.location.href
document.querySelector('#page-back').addEventListener('click', () => {
    
    document.location.href = href.slice(0,href.indexOf('templates/') + 'templates/'.length) + 'mainWindow.html'
})