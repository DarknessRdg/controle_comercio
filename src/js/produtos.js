const Electron = require('electron')
const { Product, ComboProducts } = require('../models/Product')
const MaterializeListeners = require('../js/MaterializeListeners')
const Sequelize = require('sequelize')
const NumberFormater = require('../js/utils/formatNumbers')
const Op = Sequelize.Op

let PRODUCTS_ON_DATABASE = []
getAllProducts()

MaterializeListeners.tabs()
MaterializeListeners.modal()


document.querySelector('#search-input').addEventListener('keyup', () => {
    let value = document.querySelector('#search-input').value
    const filteredList = searchProduct(value);
    
    return renderListProducst(filteredList, 'list-products')   
})


document.querySelector('#combo').addEventListener('change', () => {
    let div = document.querySelector('#combo-div')

    let combosProducts = []
    renderCombo(combosProducts)
    div.hidden = !div.hidden
})


function searchProduct(parameter) {
    parameter = parameter.toLowerCase()
    const list = PRODUCTS_ON_DATABASE.filter(product => {
            const name = product.dataValues.name.toLowerCase()
            const barCode = product.dataValues.barCode.toUpperCase()

            return name.indexOf(parameter) != -1 || barCode.indexOf(parameter) != -1
        })

    return list;
}


async function getAllProducts() {
    const all = await Product.findAll({});
    PRODUCTS_ON_DATABASE = all;
    document.getElementById('search-input').disabled = false
    document.getElementById('label-search').innerHTML = 'Pesquisar Produtos'
}


document.querySelector('#combo-add-product').addEventListener('click', function() {
    
})

function renderCombo(combosProducts) {
    let div = document.querySelector('#combo-div')
    
    combosProducts.forEach(element => {
         
    })

}


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('her')
    if (createProduct()) {
        clearAddFields();
    } else {
        console.log('dey nerda')
    }
})


function createProduct() {
    const name = document.querySelector('#name').value
    const barCode = document.querySelector('#bar-code').value
    const price = document.querySelector('#price').value
    const isCombo = document.querySelector('#combo').checked

    Product.create({name, barCode, price, isCombo})
    .then(product => {
        if (isCombo) {
            combosProducts.forEach(comboProduct => {
                console.log('1')
                
                Product.findOne({where: {barCode: comboProduct.barCode}}, {raw: true})
                    .then(productForCombo => {
                        ComboProducts.create({
                            comboId: product.id,
                            productsId: productForCombo.id
                        }).then(relation => {
                            console.log('create ' + relation)
                        }).catch(error => {
                            console.log(error)
                            return false
                        })
                    })
                    .catch(error => {
                        console.log('not find one ' + error)
                        return false
                    })
            })
        }

    })
    .catch(error => {
        console.log('error create')
        console.log(error)
        return false
    }) 

    return true;
}


function renderListProducst(list, nodeId) {
    let node = document.querySelector(`#${nodeId}`)

    if (list.length === 0) {
        node.innerHTML = ''
        return
    }

    ul = '<ul class="collapsible ">'
    list.forEach(product => {
        const name = product.dataValues.name
        const barCode = product.dataValues.barCode
        const price = product.dataValues.price 
        const id = product.dataValues.id
        
        ul += `<li id=${id}>
            <div class="collapsible-header">
                ${name.toUpperCase()} 
                <span class="new price-badge #0d47a1 blue darken-4">
                    ${NumberFormater.real(price)}
                </span></div>
            <div class="collapsible-body">
                <p class="d-inline mr-3">
                    <span><i class="material-icons">attach_money</i></span>
                    <span class="align-top">${NumberFormater.real(price)}</span>
                </p>
                <p class="d-inline mr-5">
                    <span><i class="material-icons rotate-90">format_align_justify</i></span>
                    <span class="align-top">${barCode}</span>
                </p>
                <p>
                    <button data-target="edit-product" class="btn modal-edit grey darken-3" >
                        <i class="material-icons align-bottom mr-1">edit</i>Editar</button>
                    
                    <button data-target="delete-product" class="ml-4 btn modal-delete red darken-4" >
                        <i class="material-icons align-bottom mr-1">delete</i>Excluir</button>
                </p>
            </div>
        </li>`
    })
    ul += '</ul>'
    
    node.innerHTML = ul;
    MaterializeListeners.collapsible()
    modalEditListener()
}


function clearAddFields() {
    document.querySelector('#name').value = ''
    document.querySelector('#bar-code').value = ''
    document.querySelector('#price').value = ''
    document.querySelector('#combo').checked = false
}

function modalEditListener() {
    document.querySelectorAll('.modal-edit').forEach(element => {
        element.addEventListener('click', event => {
            const liIndex = 3;
            const id = event.path[liIndex].id

            const product = PRODUCTS_ON_DATABASE.filter(product => {
                return parseInt(product.dataValues.id) == parseInt(id)
            })[0]

            openEditModal(product)
        })
    })
}


function openEditModal(product) {
    const modal = document.querySelector('#edit-product')

    modal.querySelector('#name-edit').value = product.dataValues.name
    modal.querySelector('#price-edit').value = product.dataValues.price
    modal.querySelector('#bar-code-edit').value = product.dataValues.barCode
    modal.querySelector('#combo-edit').checked = product.dataValues.combo
    
    M.updateTextFields()
    modal.M_Modal.open()
}