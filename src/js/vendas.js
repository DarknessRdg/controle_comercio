const { Product } = require('../models/Product')
const { Order, OrderProduct } = require('../models/Order')
const { Client } = require('../models/Client')
const FormatNumber = require('../js/utils/formatNumbers')
const MaterializeListener = require('../js/MaterializeListeners')
const ConnectionDatabase = require('../models/Connection')


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

document.querySelector('.modal').querySelector('.save').addEventListener('click', discountOnTableRow)
document.querySelector('.modal').querySelectorAll('input').forEach(input => {
    input.addEventListener('keyup', modalDefaultButton)
})

document.querySelector("#endShopping").addEventListener('click', endShopping)

document.querySelector('#modal-end-shop').
    querySelector('.save-end-shop').addEventListener('click', saveList)

document.querySelector('#modal-end-shop').
    querySelector('#client-money').addEventListener('change', calculatePayback);
document.querySelector('#modal-end-shop').
    querySelector('#client-money').addEventListener('keyup', calculatePayback);

document.querySelector('#modal-end-shop').
    querySelector('.add-discount').addEventListener('click', discountOnTotal);


let SHOP_CAR = []


function calculatePayback(event) {
    const input = document.querySelector('#client-money');
    const paybackNode = document.querySelector('#payback');

    const value = input.value.toLowerCase();
    const totalText = document.querySelector('#total-end-shop').innerHTML;
    const totalValue = parseFloat(totalText.replace('R$&nbsp;', '').replace(',', '.'));

    if (isNaN(value) || value === '' || parseFloat(value) <= totalValue) {
        paybackNode.innerHTML = FormatNumber.real(0.0);
        return;
    }
    
    const payback = (parseFloat(value) - totalValue).toFixed(2);

    paybackNode.innerHTML = FormatNumber.real(payback);
}


function clickAddOnEnterPressed(event) {
    const ENTER = 13
    if (event.keyCode === ENTER)
        document.querySelector('#addProduct').click()
}


function modalDefaultButton(event) {
    const ENTER = 13
    if (event.keyCode === ENTER) {
        const modal = document.querySelector('.modal')
        modal.querySelector('.save').click()
    }
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
        M.toast({html: 'Produto nao encontrado', classes: 'rounded red no-print'});
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
    
    M.toast({html: `${product.dataValues.name.toUpperCase()} adicionado!`, classes: 'rounded green no-print'});
}


function removeFromShopCar(event) {
    const target = event.target
    const pathTr = target.nodeName === 'I' ? 3 : 2
    
    let barCode = event.path[pathTr].getAttribute('bar-code')

    SHOP_CAR = SHOP_CAR.filter(product => {
        return product.product.dataValues.barCode !== barCode
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


function shopCarTotal() {
    let sum = 0;
    SHOP_CAR.forEach(product => { sum += product.product.dataValues.price * product.quantity});
    return sum;
}



function discountOnTotal(event) {
    const discountPercent = document.querySelector('#discount-percent').value
    const discountMoney = document.querySelector('#discount-money').value

    const total = shopCarTotal();
    let newTotal;

    if (discountPercent === '' && discountMoney === '') {
        M.toast({html: 'Desconto inválido', classes: 'red'})
        return
    }


    if (discountMoney === '')
        newTotal = total * (1 - (parseInt(discountPercent)) / 100);
    else if (discountPercent === '')
        newTotal = total - parseFloat(discountMoney);
    
    M.toast({html: `desconto ${total - newTotal} de aplicado!` })
    
    const remove = (total - newTotal) / SHOP_CAR.length;

    SHOP_CAR.forEach(product => {
        product.product.dataValues.price -= remove
    })
    document.querySelector('#total-end-shop').innerHTML = FormatNumber.real(shopCarTotal())
    calculatePayback()
}


function discountOnTableRow(event) {
    event.preventDefault()

    const modal = document.querySelector('.modal')
    let percent = modal.querySelector('#descount-product-percent').value
    let money = modal.querySelector('#descount-product-money').value
    money = money.replace(',' , '.')
    const barCode = modal.querySelector('#bar-code-for-descount').innerHTML

    const isPercent = percent !== ''
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

    let amountDescount = 0

    for (let i = 0; i < SHOP_CAR.length; i++) {
        let productInside = SHOP_CAR[i]
        let productBarCode = productInside.product.dataValues.barCode
        
        if (productBarCode === barCode) {
            let price = productInside.product.dataValues.price
            const originalPrice = price
            
            if (type.percent)
                price = price * descount
            else
                price -= descount
            price = price > 0 ? price : 0   
            price = parseFloat(price.toFixed(2))
            productInside.product.dataValues.price = price

            amountDescount = originalPrice - price
            break
        }
    }
    M.toast({html: 'Desconto: R$ ' + amountDescount, classes: 'rounded no-print'});
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
        class="waves-effect waves-light btn light-blue darken-4 add-descount tooltipped modal-trigger no-print" 
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
    const sum = shopCarTotal();
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


async function endShopping() {
    if (SHOP_CAR.length === 0)
        M.toast({html: 'Lista vazia!', classes: 'rounded red no-print'})
    else {
        document.querySelector('#total-end-shop').innerHTML = FormatNumber.real(shopCarTotal());
        openEndShoppingModal()
    }
}


function openEndShoppingModal() {
    const modal = document.querySelector('#modal-end-shop')
    const instance = M.Modal.getInstance(modal)
    instance.open()
}


function modalEditClearFields() {
    const modal = document.querySelector('#modal-end-shop');
    modal.querySelector('#client-cpf').value = '';
    modal.querySelector('#is-unpaid').checked =  false;
    modal.querySelector('#discount-percent').value = '';
    modal.querySelector('#discount-money').value = '';
    modal.querySelector('#client-money').value = '';
    modal.querySelector('#total-end-shop').value = FormatNumber.real(0.0)
    modal.querySelector('#payback').value = FormatNumber.real(0.0)
}


async function saveList() {
    const modal = document.querySelector('#modal-end-shop');
    const instance = M.Modal.getInstance(modal);
    const cpf = modal.querySelector('#client-cpf').value.replace(',', '').replace('.', '');
    const unpaid = modal.querySelector('#is-unpaid').checked;
    instance.close();
    modalEditClearFields()

    let clientId = await Client.findOne({where: {cpf}});
    clientId = clientId !== null ? clientId.dataValues.id : null;

    const order = await Order.create({paid: !unpaid, clientId});
    const orderId = order.dataValues.id;

    let promise = ConnectionDatabase.transaction(t => {

        let promise = SHOP_CAR.map( (product) => {
            const productId = product.product.dataValues.id;
            const quantity = product.quantity;
            const productPrice = product.product.dataValues.price;
            OrderProduct.create({productId, quantity, productPrice, orderId}, {transaction: t})
        });

        return Promise.all(promise);
    }).then(result => {
        M.toast({html: 'Compra salva!', classes: 'rounded green no-print'});
    }).catch(error => {
        M.toast({html: 'Error salvar ao salvar compra!', classes: 'rounded red'});
        console.log(error)
    });

    await Promise.resolve(promise)

    const listOfProducts = await OrderProduct.findAll(
        {where: {orderId}
    })

    await renderNotinha(listOfProducts)
    window.print()
    SHOP_CAR = []
    renderTableOfProducts()
}


async function renderNotinha(orderProducts) {
    const notinha = document.querySelector('#notinha')
    const date = notinha.querySelector('.date')
    const idCupom = notinha.querySelector('.id-cupom')
    const total = notinha.querySelector('.total')
    
    let tbody = notinha.querySelector('table>tbody')
    tbody.innerHTML = ''
    const totalPrice = await notinhaProducts(tbody, orderProducts)
    notinhaDate(date)
    idCupom.innerHTML = orderProducts[0].dataValues.orderId
    total.innerHTML = totalPrice
}


function notinhaDate(node) {
    const date = new Date()
    const strDate = date.toLocaleDateString()
    const time = date.getHours().toString() + ':' + date.getMinutes().toString()
    node.innerHTML = strDate + ' ' + time
}


async function notinhaProducts(tbody, model) {
    let sum = 0
    const promisse = model.map(async (orderProduct) => {
        let row = tbody.insertRow(-1)
        let name = row.insertCell(0)
        let quantity = row.insertCell(1)
        let price = row.insertCell(2)
        price.classList.add('text-right')
        quantity.classList.add('text-center')

        const product = await Product.findOne({
            where: {
                id: orderProduct.dataValues.productId
            }
        })

        name.appendChild(document.createTextNode(product.dataValues.name.toUpperCase()))
        quantity.appendChild(document.createTextNode(orderProduct.dataValues.quantity))        

        let priceFormated = FormatNumber.real(orderProduct.dataValues.productPrice)
        priceFormated = priceFormated.replace('R$', '.')
        price.appendChild(document.createTextNode(priceFormated))

        sum += orderProduct.dataValues.productPrice * orderProduct.dataValues.quantity
    })
    await Promise.all(promisse)

    return sum;
}