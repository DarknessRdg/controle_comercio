const Electron = require('electron')
const { Product, ComboProducts } = require('../models/Product')
const MaterializeListeners = require('../js/MaterializeListeners')
const Sequelize = require('sequelize')
const NumberFormater = require('../js/utils/formatNumbers')
const validators = require('../js/utils/validators')
const Op = Sequelize.Op

let PRODUCTS_ON_DATABASE = []
getAllProducts()

MaterializeListeners.tabs()
MaterializeListeners.modal()


document.querySelector('#refreshProducts').addEventListener('click', getAllProducts)


document.querySelector('#search-input').addEventListener('keyup', () => {
    let value = document.querySelector('#search-input').value
    const filteredList = searchProduct(value);
    
    renderListProducst(filteredList, 'list-products')
})


document.querySelector('#form-create').addEventListener('submit', function(event) {
    event.preventDefault();
    createProduct()    
})


document.querySelector('#form-update').addEventListener('submit', event => {
    event.preventDefault()
    updateProduct()
})


document.querySelector('#name').addEventListener('focusout', () => {
    let name = document.querySelector('#name').value
    let validator = new validators.Product(name, '', '')

    if (!validator.validateName()) {
        addError('name', validator.error.name)
    }
})


document.querySelector('#price').addEventListener('focusout', () => {
    let price = document.querySelector('#price').value
    let validator = new validators.Product('', price, '')

    if (!validator.validatePrice()) {
        addError('price', validator.error.price)
    }
})


document.querySelector('#bar-code').addEventListener('focusout', () => {
    let barCode = document.querySelector('#bar-code').value
    let validator = new validators.Product('', '', barCode)

    if (!validator.validateBarCode()) {
        addError('bar-code', validator.error.barCode)
    }
})

document.querySelector('#name-edit').addEventListener('focusout', () => {
    let name = document.querySelector('#name-edit').value
    let validator = new validators.Product(name, '', '')

    if (!validator.validateName()) {
        addError('name-edit', validator.error.name)
    }
})


document.querySelector('#price-edit').addEventListener('focusout', () => {
    let price = document.querySelector('#price-edit').value
    let validator = new validators.Product('', price, '')

    if (!validator.validatePrice()) {
        addError('price-edit', validator.error.price)
    }
})


document.querySelector('#bar-code-edit').addEventListener('focusout', () => {
    let barCode = document.querySelector('#bar-code-edit').value
    let validator = new validators.Product('', '', barCode)

    if (!validator.validateBarCode()) {
        addError('bar-code-edit', validator.error.barCode)
    }
})

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

    document.querySelectorAll('.modal-delete').forEach(element => {
        element.addEventListener('click', event => {
            const liIndex = 3;
            const id = event.path[liIndex].id

            const product = PRODUCTS_ON_DATABASE.filter(product => {
                return parseInt(product.dataValues.id) == parseInt(id)
            })[0]

            const destroy = async (product) => {
                product.destroy()
                .then(retorno => {
                    event.path[liIndex].remove()
                })
            }
            destroy(product)
        })
    })
}


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
    document.getElementById('search-input').disabled = true
    document.getElementById('label-search').innerHTML = 'Carregando produtos...'
    document.getElementById('load-products').classList.remove('hidden')
    
    PRODUCTS_ON_DATABASE = []
    const all = await Product.findAll({});
    all.forEach(product => {
        PRODUCTS_ON_DATABASE.push(product)
    })

    document.getElementById('search-input').disabled = false
    document.getElementById('label-search').innerHTML = 'Pesquisar Produtos'
    document.getElementById('load-products').classList.add('hidden')

    renderListProducst([], 'list-products')
}


async function createProduct() {
    const name = document.querySelector('#name').value.toUpperCase()
    const barCode = document.querySelector('#bar-code').value
    const price = document.querySelector('#price').value.replace(',', '.')

    let validator = new validators.Product(name, price, barCode)
    if (validator.isValid()) {
        
        let deleted = await Product.findAll({
            where: {
                barCode
            },
            paranoid: false
        })

        if (deleted.length === 0) {
            try {
                let newProduct = await Product.create({name, barCode, price})
                M.toast({html: 'Produto adicionardo com sucesso!', classes: 'rounded green'})
            }catch (error) {
                M.toast({html: 'Error ao adicionar produto!', classes: 'rounded red'})
                return
            }
        }else {
            deleted = deleted[0]
            deleted.setDataValue('deletedAt', null)
            deleted.update({name, barCode, price, deletedAt: null})
            M.toast({html: 'Produto ataualizado com sucesso!', classes: 'rounded blue'})
        }

        clearAddFields()
        getAllProducts()
    }
    else {
        Object.keys(validator.error).forEach(field => {
            let error = validator.error[field]
            if (field === 'barCode')
                field = 'bar-code'

            addError(field, error)
        })
    }
}


async function updateProduct() {
    const nameInput = document.querySelector('#name-edit')
    const priceInput = document.querySelector('#price-edit')
    const barCodeInput = document.querySelector('#bar-code-edit') 
    
    let product = searchProduct(barCodeInput.value)[0]
    console.log(product)
    await product.update({
            name: nameInput.value,
            price: priceInput.value.replace(',' , '.'),
            barCode: barCodeInput.value
        })
    
    nameInput.value = ''
    priceInput.value = ''
    barCodeInput.value = ''
    
    M.updateTextFields()
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


function addError(field, error) {
    let input = document.querySelector('#' + field)
    let label = input.nextElementSibling
    let span = label.nextElementSibling
    
    span.setAttribute('data-error', error)
    input.classList.add('invalid')
}

function clearAddFields() {
    const clearField = (field) => {
        field.classList.remove('valid')
        field.classList.remove('invalid')
        field.value = ''
    }

    let name = document.querySelector('#name')
    let barCode = document.querySelector('#bar-code')
    let price = document.querySelector('#price')

    clearField(name)
    clearField(barCode)
    clearField(price)

    M.updateTextFields()
}


function openEditModal(product) {
    const modal = document.querySelector('#edit-product')

    modal.querySelector('#name-edit').value = product.dataValues.name
    modal.querySelector('#price-edit').value = product.dataValues.price
    modal.querySelector('#bar-code-edit').value = product.dataValues.barCode
    
    M.updateTextFields()
    modal.M_Modal.open()
}