const Electron = require('electron')
const { Product, ComboProducts } = require('../models/Product');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, 'click');
});

document.querySelector('#autocomplete-input').addEventListener('keyup', () => {

    let value = document.querySelector('#autocomplete-input').value
    if (value.length != 2)
        return
    
    const p = '%' + value + '%'
    Product.findAll({
        where: {
            [Op.or]: [
                {name: {[Op.iLike]: p}},
                {barCode: {[Op.iLike]: p}}
            ]
        }
    }).then(list => {
        let div = document.querySelector("#list-products")
        
        let produtos = ''
        for(let i = 0 ; i < list.length; i++) {
            produtos += `<li> 
                            <div class="collapsible-header">${list[i].name}</div>   
                            <div class="collapsible-body"><p>
                                <p><i class="material-icons mr-2" style="transform: rotate(90deg);">format_align_justify</i><span>${list[i].barCode}</span<</p>
                                <p> <i class="material-icons">attach_money</i><span>${list[i].price}<span/> </p>
                                
                                <button class="btn waves-effect waves-light grey darken-3" type="submit" name="action">Editar
                                    <i class="material-icons right">edit</i>
                                </button>
                            </div>
                        </li>`
        }
        div.innerHTML = produtos
        document.querySelector('#list-products').hidden = false

        console.log(list)
    }).catch(error => {console.log('deu ruim' + error)})
    
})


document.addEventListener('DOMContentLoaded', function() {    
    const elems = document.querySelectorAll('.tabs')
    const instance = M.Tabs.init(elems, 'click')
});



let combosProducts;
document.querySelector('#combo').addEventListener('change', function() {
    const hidden = 'hidden'
    let div = document.querySelector('#combo-div')

    
    combosProducts = [{barCode: '123'}]
    renderCombo(combosProducts)
    div.hidden = !div.hidden
})

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
        console.log()
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


function clearAddFields() {
    document.querySelector('#name').value = ''
    document.querySelector('#bar-code').value = ''
    document.querySelector('#price').value = ''
    document.querySelector('#combo').checked = false
}
