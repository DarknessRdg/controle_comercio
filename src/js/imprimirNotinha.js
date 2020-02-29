const { OrderProduct } = require('../models/Order')
const { Product } = require('../models/Product')
const FormatNumber = require('../js/utils/formatNumbers')


const currentURL = document.URL

function getOrderId() {
    return currentURL.split('?id=')[1]
}

async function printNotinha() {
    const orderId = getOrderId()

    const listOfProducts = await OrderProduct.findAll({
        where: { orderId }
    })

    await renderNotinha(listOfProducts)

    window.print()
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

    let priceFormated = FormatNumber.real(totalPrice)
    priceFormated = priceFormated.replace('R$', '')

    total.innerHTML = priceFormated
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
        name.setAttribute('align', 'left')

        let quantity = row.insertCell(1)
        quantity.setAttribute('align', 'center')

        let price = row.insertCell(2)
        price.setAttribute('align', 'right')

        const product = await Product.findOne({
            where: {
                id: orderProduct.dataValues.productId
            }
        })

        name.appendChild(document.createTextNode(product.dataValues.name.toUpperCase()))
        quantity.appendChild(document.createTextNode(orderProduct.dataValues.quantity))

        let priceFormated = FormatNumber.real(orderProduct.dataValues.productPrice)
        priceFormated = priceFormated.replace('R$', '')
        price.appendChild(document.createTextNode(priceFormated))

        sum += orderProduct.dataValues.productPrice * orderProduct.dataValues.quantity
    })
    await Promise.all(promisse)

    return sum;
}

printNotinha()