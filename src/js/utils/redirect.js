function getBaseUrl() {
    const { URL } = document
    const folder = 'templates/'
    const index = URL.indexOf(folder)
    const baseUrl = URL.slice(0, index + folder.length)

    return baseUrl
}

function redirect(to) {
    window.location.href = getBaseUrl() + to
}

function redirectTargetBlank(to) {
    window.open(getBaseUrl() + to, '_blank');
}


module.exports = { redirect, redirectTargetBlank }