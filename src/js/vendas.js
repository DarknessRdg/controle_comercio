const { Product } = require('../models/Product')
const FormatNumber = require('../js/utils/formatNumbers')
const MaterializeListener = require('../js/MaterializeListeners')


document.querySelector('#addProduct').addEventListener('click', addProductToTable)
MaterializeListener.tooltips()


let SHOP_CAR = []


async function addProductToTable() {
    let barCode = document.querySelector('#barCode')
    let quantity = document.querySelector('#quantity')
    let product = await getProduct(barCode.value.trim())

    if (product != null) {
        addToShopCar(product, quantity.value)
        renderTableOfProducts()
        barCode.value = ''
        quantity.value = '1'
    }
    else {
        M.toast({html: 'Produto nao encontrado', });
    }
}


async function getProduct(barCode) {
    try {
        const product = await Product.findOne({where: {barCode}})
        return product
    }
    catch(error) {
        console.log(error)
        return null;
    }
}


function addToShopCar(product, quantity) {
    quantity = parseInt(quantity)
    let added = false
    
    for (let i = 0; i < SHOP_CAR.length; i++) {
        let productInside = SHOP_CAR[i]

        if (productInside.product.dataValues.id === product.dataValues.id){
            productInside.quantity += quantity;
            added = true;
        }
    }

    if (!added)
        SHOP_CAR.push({product, quantity})
    
    M.toast({html: 'Produto adicionado!', classes: 'rounded'});
}


function removeFromShopCar(event) {
    let barCode = event.path[3].getAttribute('bar-code')

    SHOP_CAR = SHOP_CAR.filter(product => {
        return product.product.dataValues.barCode.indexOf(barCode) === -1
    })
    
    renderTableOfProducts()
}


function decreaseOne(event) {
    let barCode = event.path[3].getAttribute('bar-code')
    
    for (let i = 0; i < SHOP_CAR.length; i++) {
        let productInside = SHOP_CAR[i]

        if (productInside.product.dataValues.barCode.indexOf(barCode) != -1) {
            productInside.quantity -= 1;
            if (productInside.quantity === 0)
                SHOP_CAR.splice(i, 1)
        }
    }
    renderTableOfProducts()
}


function renderTableOfProducts() {
    document.getElementsByTagName('tbody')[0].innerHTML = ''
    SHOP_CAR.forEach(productInside => {
        createTableRow(productInside.product, productInside.quantity)
    })

    updateTotalValue();
}

function createTableRow(product, quantity) {
    let tableBody = document.querySelector('tbody')
    let newRow = tableBody.insertRow(-1);

    newRow.setAttribute('bar-code', product.dataValues.barCode)

    let name = newRow.insertCell(0)
    let quantityCell = newRow.insertCell(1)
    let price = newRow.insertCell(2)
    let btn = newRow.insertCell(3)
    
    
    name.appendChild(document.createTextNode(product.dataValues.name.toUpperCase()))
    quantityCell.appendChild(document.createTextNode(quantity))
    btn.innerHTML = `<button class="waves-effect waves-light btn red darken-2 delete" type="button"><i class="samll material-icons">delete</i></button>
    <button class="waves-effect waves-light btn   deep-orange darken-2 decrease" type="button"><i class="samll material-icons">exposure_neg_1</i></button>`
    const priceFormated = FormatNumber.real(product.dataValues.price)
    price.appendChild(document.createTextNode(priceFormated))
    listennerActionOnTable()
}


function updateTotalValue() {
    let sum = 0
    SHOP_CAR.forEach(product => { sum += product.product.dataValues.price * product.quantity})

    document.querySelector('#total').innerHTML = FormatNumber.real(sum)
}


function listennerActionOnTable() {
    listennerOnDelete()
    listennetOnDecrease()
}

function listennerOnDelete() {
    document.querySelectorAll('.delete').forEach(node => {
        node.addEventListener('click', removeFromShopCar)
    })
}


function listennetOnDecrease() {
    document.querySelectorAll('.decrease').forEach(node => {
        node.addEventListener('click', decreaseOne)
    })
}