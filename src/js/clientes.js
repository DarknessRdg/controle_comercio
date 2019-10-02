const Materialize = require('../js/MaterializeListeners')
const ConnectionDataBase = require('../models/Connection')
const { Client, ClientPhone, ClientAddress } = require('../models/Client')
const Sequelize = require('sequelize')
const Op = Sequelize.Op;
const FormatName = require('../js/utils/formatNames')


Materialize.tabs()
Materialize.date()
Materialize.modal()


document.querySelector('#form-create').addEventListener('submit', createClient)

document.querySelector('#search-input').addEventListener('keyup', pressedEnter)


async function pressedEnter(event) {
    const ENTER = 13
    if (event.keyCode === ENTER) {
        const search = event.path[0].value
        event.path[0].value = ''
        const models = await searClient(search)
        renderClients(models)
    }
}


async function searClient(searchParam) {
    const like = '%'+searchParam.toLowerCase()+'%'
    return await Client.findAll({where: {
        [Op.or]: [
            {name: {[Op.like]: like}},
            {cpf: searchParam.replace('-', '').replace('.', '')}
        ]
    }})
}


async function createClient(event) {
    event.preventDefault()
    let clientDatas = getClientDatas('name', 'cpf', 'birth')
    clientDatas.name = clientDatas.name.toLowerCase()
    clientDatas.cpf = clientDatas.cpf.replace('.', '').replace('-', '')

    let adressDatas = getClientAddress('adress-bairro', 'adress-rua', 'adress-numero', 'adress-cep', 'adress-complemento')
    let phoneDatas = getClientFone('phone')
    
    ConnectionDataBase.transaction(async (t) => {
        let newClient = await Client.create(clientDatas)
        
        adressDatas.clientId = newClient.dataValues.id
        phoneDatas.clientId = newClient.dataValues.id

        if (adressDatas.cep != '')
            await ClientAddress.create(adressDatas)
        
        if (phoneDatas.phone != '')
            await ClientPhone.create(phoneDatas)
    }).then(() => {
        M.toast({html: 'Client criado com sucesso!', classes: 'rounded green'});
        
        clearFlields([
            'name', 'birth', 'cpf', 
            'phone', 
            'adress-bairro', 'adress-rua', 'adress-numero', 'adress-cep', 'adress-complemento'
        ])
        
    }).catch(error =>{
        M.toast({html: 'Cliente não foi criado!', classes: 'rounded red'});
        console.log(error);
    })  
}


function getClientDatas(nodeIdName, nodeIdCpf, nodeIdBirth) {
    let datas = {}
    datas.name = document.querySelector('#'+nodeIdName).value
    datas.cpf = document.querySelector('#'+nodeIdCpf).value
    
    let inputBirth = document.querySelector('#'+nodeIdBirth)
    datas.birthDate = M.Datepicker.getInstance(inputBirth).date
    
    return datas;
}


function getClientFone(nodeId) {
    let datas = {}
    datas.phone = document.querySelector('#'+nodeId).value
    return datas
}


function getClientAddress(nodeNeighborhood, nodeStreet, nodeNumber, nodeCep, nodeComplement) {
    let datas = {}
    datas.neighborhood = document.querySelector('#'+nodeNeighborhood).value
    datas.street = document.querySelector('#'+nodeStreet).value
    datas.cep = document.querySelector('#'+nodeCep).value
    datas.numer = document.querySelector('#'+nodeNumber).value
    datas.complement = document.querySelector('#'+nodeComplement).value

    return datas
}


function clearFlields(idList) {
    for (id of idList)
        document.querySelector('#'+id).value = ''
}


function renderClients(clients) {
    let divToRender = document.querySelector('#clients')
    divToRender.innerHTML = ''

    if (clients.length === 0)
        return
    
    let ul = document.createElement('ul')
    ul.classList.add('collection')
    
    for (client of clients) { 
        let li = createClientLi(client.dataValues)
        ul.appendChild(li)
    }

    divToRender.appendChild(ul)
    openModalEditListener()
}


function createClientLi(client) {
    let li = document.createElement('li')
    li.classList.add('collection-item')
    li.setAttribute('id', client.id)

    let content = document.createElement('div')
    content.appendChild(document.createTextNode(FormatName.person(client.name)))

    let icon = document.createElement('a')
    icon.classList.add('secondary-content')
    icon.classList.add('open-modal')

    icon.innerHTML = '<i class="material-icons">send</i>'
    content.appendChild(icon)

    li.appendChild(content)
    return li
}


function openModalEditListener() {
    document.querySelectorAll('.open-modal').forEach(node => {
        node.addEventListener('click', openModalEdit)
    })
}

async function openModalEdit(event) {
    const LI_PATH = event.target === 'I' ? 2 : 3
    const li = event.path[LI_PATH]
    const id = li.getAttribute('id')

    const client = await Client.findOne({where: {id: id}})
    const fones = await ClientPhone.findAll({where: {clientId: id}})
    const adress = await ClientAddress.findAll({where: {clientId: id}})
    
    const modal = document.querySelector('.modal-edit')
    const modalHeader = modal.querySelector('#modal-header')
    const notinhasLink = modal.querySelector('.notinhas')

    modalHeader.innerHTML = FormatName.person(client.dataValues.name)
    notinhasLink.setAttribute('href', '../templates/notinha.html?id=' + client.dataValues.id)

    renderModalClient(client, fones, adress)
    M.Modal.getInstance(modal).open()
}


function renderModalClient(client, fones, adress) {

}