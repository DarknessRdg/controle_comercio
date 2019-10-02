function product(name) {
    return name.toUpperCase()
}

function person(name) {
    let nameFormated = ''
    for (parcialName of name.split(' ')) 
        nameFormated += parcialName.charAt(0).toUpperCase() + parcialName.substr(1).toLowerCase()

    return nameFormated
}


module.exports = { product, person }