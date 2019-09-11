function real(number) {
    number = parseFloat(number)
    const formated = number.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    return formated
}


module.exports = {
    real,
}
