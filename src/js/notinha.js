const { Product } = require('../models/Product')
const { Order, OrderProduct } = require('../models/Order')
const { Client } = require('../models/Client')
const MaterializeListeners = require('../js/MaterializeListeners')
const NumberFormater = require('../js/utils/formatNumbers')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


const URL = document.URL

MaterializeListeners.select()
MaterializeListeners.modal()
document.addEventListener('DOMContentLoaded', documentLoaded)

document.querySelector('#filter').addEventListener('submit', filterNotinhas)

function listenerDetailButtons() {
    document.querySelectorAll('.details').forEach(node => {
        node.addEventListener('click', openModalDetail)
    })
}

function listenerUnpaidButtons() {
    document.querySelectorAll('.unpaid-btn').forEach(node => {
        node.addEventListener('click', confirmPaid)
    })
} 


function getClientId(URL) {
    return URL.split('?id')[1]
}

function documentLoaded() {
    setDefaultInputYear();
}


function setDefaultInputYear() {
    let date = new Date()
    document.querySelector('#year-input').value = date.getFullYear()
}


async function filterNotinhas(event) {
    event.preventDefault()
    document.querySelector('#notinhas').innerHTML = ''
    renderLoadingNotinhas(true)
    
    const startDate = getStartDate()
    const endDate = getEndDate()
    const clientId = getClientId(URL)
    
    const where = prepareQuery(clientId, startDate, endDate) 
    const orders = await Order.findAll({where, order: [['id', 'ASC']]})
    let promise = renderOrders(orders)
    
    await Promise.all([promise])
    listenerDetailButtons()
    listenerUnpaidButtons()
    renderLoadingNotinhas(false)
}


function getStartDate() {
    let month = document.querySelector('#month-input').value
    const year = document.querySelector('#year-input').value
    const day = 1

    if (month === '')
        month = 0

    return new Date(year, month, day)
}

function getEndDate() {
    let month = document.querySelector('#month-input').value
    const year = document.querySelector('#year-input').value
    const day = 31

    if (month === '')
        month = 11

    return new Date(year, month, day)
}


function prepareQuery(clientId, startDate, endDate) {
    const paidOnly = document.querySelector('#paid-input').checked
    const unpaindOnly = document.querySelector("#unpaid-input").checked
    const createdAt = {
        [Op.between]: [startDate, endDate]
    }

    let query = {createdAt}

    if (clientId)
        query.clientId = clientId
    
    if (paidOnly)
        query.paid = true
    else if (unpaindOnly)
        query.paid = false
    
        return query;
}


function renderLoadingNotinhas(visible) {
    let spinner = document.querySelector('.spinners')
    if (visible)
        spinner.classList.remove('hide')    
    else
        spinner.classList.add('hide')

}


async function renderOrders(orders) {
    let notinhas = document.querySelector('#notinhas')
    for (order of orders) {
        notinhas.appendChild(await createNotinhNode(order))
    }
    
}

async function createNotinhNode(order) {
    order = order.dataValues

    let div = document.createElement('div')
    div.classList.add('col')
    div.classList.add('m3')
    div.classList.add('mt-2')

    let card = document.createElement('div')
    card.setAttribute('order-id', order.id)
    card.classList.add('card')
    card.classList.add('notinha')
    div.appendChild(card)

    let btnStatus = document.createElement('button')
    btnStatus.setAttribute('type', 'button')
    btnStatus.classList.add('btn')
    btnStatus.classList.add('status')
    btnStatus.classList.add('green')
    btnStatus.classList.add('waves-effect')
    btnStatus.classList.add('waves-light')
    btnStatus.innerHTML = '<i class="large material-icons">check</i>'

    if (!order.paid) {
        card.classList.add('fiada')
        btnStatus.innerHTML = '<i class="large material-icons">close</i>'
        btnStatus.classList.remove('green')
        btnStatus.classList.add('red')
        btnStatus.classList.add('unpaid-btn')
    }
    
    card.appendChild(await createCardContent(order))
    card.appendChild(createCardFooter())
    card.appendChild(btnStatus)

    return div
}

async function createCardContent(order) {
    let cardContent = document.createElement('div')
    cardContent.classList.add('card-content')

    let title = document.createElement('span')
    title.classList.add('card-title')
    title.appendChild(document.createTextNode(`Nº : ${order.id}`))
    cardContent.appendChild(title)

    let date = document.createElement('p')
    const dateString = order.createdAt.toLocaleString().replace(' ', ' - ')
    date.appendChild(document.createTextNode(dateString))
    cardContent.appendChild(date)

    let clientName = document.createElement('p')
    clientName.classList.add('mt-3')
    let name = 'Cliente não identificado'
    if (order.clientId)
        name = await Client.findOne({where: {id: order.clientId}}).name
    clientName.appendChild(document.createTextNode(name))
    cardContent.appendChild(clientName)

    let total = document.createElement('h5')
    const orderProducts = await OrderProduct.findAll({where: {orderId: order.id}})

    let totalSum = orderProducts.reduce((sum, current) => {
            return sum + current.dataValues.productPrice * current.dataValues.quantity}, 0)
    
    total.appendChild(document.createTextNode('Total: ' + NumberFormater.real(totalSum)))
    total.classList.add('mt-5')
    cardContent.appendChild(total)
    
    let status = document.createElement('p')
    if (order.paid)
        status.innerHTML = 'STATUS: <span class="green-text">PAGA</span>'
    else
        status.innerHTML = 'STATUS: <span class="red-text">PENDENTE</span>'
    cardContent.appendChild(status)
    return cardContent
}


function createCardFooter() {
    let details = document.createElement('button')
    details.setAttribute('type', 'button')
    details.classList.add('details')
    details.classList.add('btn')
    details.classList.add('white')
    details.classList.add('black-text')
    details.classList.add('waves-effect')
    details.classList.add('waves-black')
    details.innerHTML = '<i class="large material-icons">format_list_numbered</i>'
    
    return details
}


async function openModalDetail(event) {
    const CARD_PATH = event.target.nodeName === 'I' ? 2 : 1
    const card = event.path[CARD_PATH]
    const orderId = card.getAttribute('order-id')
    
    const modal = document.querySelector('.modal')
    let modalContent = modal.querySelector('.modal-content')
    const ul = await createOrderItemList(orderId)
    modalContent.innerHTML = ''
    modalContent.appendChild(ul)

    const instance = M.Modal.getInstance(modal)
    instance.open()
}


async function createOrderItemList(id) {
    const orderProducts = await OrderProduct.findAll({where: {orderId: id}})

    let ul = document.createElement('ul')
    ul.classList.add('collection')
    ul.classList.add('with-header')

    let header = document.createElement('li')
    header.classList.add('collection-header')

    let headerTitle = document.createElement('h4')
    headerTitle.appendChild(document.createTextNode('N°: ' + String(id)))
    headerTitle.classList.add('white')
    headerTitle.classList.add('p-4')
    headerTitle.classList.add('mb-0')
    header.appendChild(headerTitle)
    ul.appendChild(headerTitle)
    
    for (product of orderProducts) {
        let li = document.createElement('li')
        li.classList.add('collection-item')
    
        let quantity = document.createElement('span')
        quantity.classList.add('badge')
        quantity.appendChild(document.createTextNode(product.dataValues.quantity))
        
        li.appendChild(quantity)

        let productDatas = await Product.findOne({where: {id: product.dataValues.productId}})
        let priceFormated = NumberFormater.real(product.dataValues.productPrice)
        li.appendChild(document.createTextNode(productDatas.dataValues.name.toUpperCase() + ' - ' + priceFormated))

        ul.appendChild(li)
    }

    return ul
}


async function confirmPaid(event) {
    const CARD_PATH = event.target.nodeName === 'I' ? 2 : 1
    const card = event.path[CARD_PATH]
    const orderId = card.getAttribute('order-id')

    const confirm = window.confirm('Deseja realmente alterar o status da notinha para paga?')
    
    if (confirm) {
        let order = await Order.findOne({where: {id: orderId}})
        try{
            await order.update({paid: true})
            M.toast({html: 'Notinha atualizada com sucesso!', classes: 'rounded green'})
        }catch(erro) {
            console.log(error)
            M.toast({html: 'Error ao ataualizar notinha!', classes: 'rounded red'})
        }
    }

    filterNotinhas(new Event('submit'))
}