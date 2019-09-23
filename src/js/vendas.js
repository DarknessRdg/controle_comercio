const { Product } = require('../models/Product')
const FormatNumber = require('../js/utils/formatNumbers')
const MaterializeListener = require('../js/MaterializeListeners')


MaterializeListener.tooltips()
MaterializeListener.collapsible()

document.querySelector('#addProduct').addEventListener('click', addProductToTable)

document.querySelector('#barCode').addEventListener('keyup', clickAddOnEnterPressed)
document.querySelector('#quantity').addEventListener('keyup', clickAddOnEnterPressed)

document.querySelector('#descount-product-percent').addEventListener('blur', () => {
    document.querySelector('#descount-product-money').value = ''
})
document.querySelector('#descount-product-money').addEventListener('blur', () => {
    document.querySelector('#descount-product-percent').value = ''
})

document.querySelector('.modal').querySelector('.save').addEventListener('click', descounOnTableRow)


let SHOP_CAR = []


function clickAddOnEnterPressed(event) {
    const ENTER = 13
    if (event.keyCode === ENTER)
        document.querySelector('#addProduct').click()
}


async function addProductToTable() {
    let barCode = document.querySelector('#barCode')
    let quantity = document.querySelector('#quantity')
    let product = await getProduct(barCode.value.trim())

    if (product != null) {
        addToShopCar(product, quantity.value)
        renderTableOfProducts()
    }
    else {
<<<<<<< HEAD
        M.toast({html: 'Produto nao encontrado', classes: 'rounded red'});
=======
        M.toast({html: 'Produto nao encontrado', classes: 'red darken-4'});
>>>>>>> 5a501b3a3df03043148832c022260e416d9fb852
    }
    barCode.value = ''
    quantity.value = '1'
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
    
    M.toast({html: `${product.dataValues.name.toUpperCase()} adicionado!`, classes: 'rounded green'});
}


function removeFromShopCar(event) {
    const target = event.target
    const pathTr = target.nodeName === 'I' ? 3 : 2
    
    let barCode = event.path[pathTr].getAttribute('bar-code')

    SHOP_CAR = SHOP_CAR.filter(product => {
        return product.product.dataValues.barCode != barCode
    })
    
    renderTableOfProducts()
}


function decreaseOne(event) {
    const target = event.target
    const pathTr = target.nodeName === 'I' ? 3 : 2

    let barCode = event.path[pathTr].getAttribute('bar-code')
    
    for (let i = 0; i < SHOP_CAR.length; i++) {
        let productInside = SHOP_CAR[i]

        if (productInside.product.dataValues.barCode === barCode) {
            productInside.quantity -= 1;
            if (productInside.quantity === 0)
                SHOP_CAR.splice(i, 1)
        }
    }
    renderTableOfProducts()
}


function descounOnTableRow() {
    const modal = document.querySelector('.modal')
    let percent = modal.querySelector('#descount-product-percent').value
    let money = modal.querySelector('#descount-product-money').value
    money = money.replace(',' , '.')
    const barCode = modal.querySelector('#bar-code-for-descount').innerHTML

    const isPercent = percent != ''
    let descount;
    if (isPercent)
        descount = parseInt(percent)
    else
        descount = parseFloat(money)
    
    descountProduct(descount, barCode, {percent: isPercent})
    renderTableOfProducts()
}


function descountProduct(descount, barCode, type) {
    if (type.percent) {
        descount = 1 - (descount / 100)
    }

    for (let i = 0; i < SHOP_CAR.length; i++) {
        let productInside = SHOP_CAR[i]
        let productBarCode = productInside.product.dataValues.barCode
        
        if (productBarCode === barCode) {
            let price = productInside.product.dataValues.price
            
            if (type.percent)
                price = price * descount
            else
                price -= descount
            price = price > 0 ? price : 0   
            price = parseFloat(price.toFixed(2))
            productInside.product.dataValues.price = price
            break
        }
    }
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
    
    const btnDelete = `<button class="waves-effect waves-light btn red darken-2 delete" type="button">
        <i class="samll material-icons">delete</i></button> `
    
    const btnDecrease = `<button class="waves-effect waves-light btn deep-orange darken-2 decrease" type="button">
            <i class="samll material-icons">exposure_neg_1</i></button> `
    
    const btnDescount = `<button 
        class="waves-effect waves-light btn light-blue darken-4 add-descount tooltipped modal-trigger" 
        type="button" data-position="bottom" data-tooltip="Desconto no produto" 
        data-target="modal-descount">
            <i class="fas fa-percent font-size-1"></i></button> `

    name.appendChild(document.createTextNode(product.dataValues.name.toUpperCase()))
    quantityCell.appendChild(document.createTextNode(quantity))
    btn.innerHTML = btnDelete + btnDecrease + btnDescount
        
        

    const priceFormated = FormatNumber.real(product.dataValues.price)
    price.appendChild(document.createTextNode(priceFormated))
    listennerActionOnTable()
    MaterializeListener.modal()
}


function updateTotalValue() {
    let sum = 0
    SHOP_CAR.forEach(product => { sum += product.product.dataValues.price * product.quantity})

    document.querySelector('#total').innerHTML = FormatNumber.real(sum)
}


function openModalDescount(event) {
    const target = event.target
    const pathTr = target.nodeName === 'I' ? 3 : 2

    let barCode = event.path[pathTr].getAttribute('bar-code')
    let product = SHOP_CAR.filter(prod => { return prod.product.dataValues.barCode === barCode})[0]

    let modal = document.querySelector('.modal')
    modal.querySelector('#bar-code-for-descount').innerHTML = barCode
    modal.querySelector('#product-descount-name').innerHTML = product.product.dataValues.name.toUpperCase()

    let instance = M.Modal.getInstance(modal);
    instance.open()
}


function listennerActionOnTable() {
    listennerOnDelete()
    listennetOnDecrease()
    listennerOnDescount()
    MaterializeListener.tooltips()
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


function listennerOnDescount() {
    document.querySelectorAll('.add-descount').forEach(node => {
        node.addEventListener('click', openModalDescount)
    })
}