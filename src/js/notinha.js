const { Product } = require('../models/Product')
const { Order, OrderProduct } = require('../models/Order')
const MaterializeListeners = require('../js/MaterializeListeners')
const NumberFormater = require('../js/utils/formatNumbers')
const Sequelize = require('sequelize')
const Op = Sequelize.Op


const URL = document.URL

MaterializeListeners.select()
document.addEventListener('DOMContentLoaded', documentLoaded)

document.querySelector('#filter').addEventListener('submit', filterNotinhas)


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
    
    const startDate = getStartDate()
    const endDate = getEndDate()
    const clientId = getClientId(URL)
    
    const where = prepareQuery(clientId, startDate, endDate) 
    const orders = await Order.findAll({where})
    renderOrders(orders)
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
    const createdAt = {
        [Op.between]: [startDate, endDate]
    }

    if (clientId)
        return {clientId, createdAt}
    else {
        return {createdAt}
    }
}

async function onlyPaid() {
    let paid = document.querySelector('#paid-input')
    if (paid.checked) {
        renderLoadingNotinhas(true)

        document.querySelector('#unpaid-input').checked = false
        const orders = await Order.findAll({
            where: {
                paid: true
            }
        })

        renderLoadingNotinhas(false)
        renderOrders(orders)
    }
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
        notinhas.appendChild(createNotinhNode(order))
    }
    
}

function createNotinhNode(order) {
    order = order.dataValues

    let div = document.createElement('div')
    div.classList.add('col')
    div.classList.add('m4')

    let card = document.createElement('div')
    card.classList.add('card')
    div.appendChild(card)
    
    let cardContent = document.createElement('div')
    cardContent.classList.add('card-content')
    card.appendChild(cardContent)

    let title = document.createElement('span')
    title.classList.add('card-title')
    title.appendChild(document.createTextNode(`Nº : ${order.id}`))
    cardContent.appendChild(title)

    let date = document.createElement('p')
    date.appendChild(document.createTextNode(order.createdAt.toLocaleString().replace(' ', ' - ')))
    cardContent.appendChild(date)

    return div
}