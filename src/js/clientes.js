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

    let addressDatas = getClientAddress('address-bairro', 'address-rua', 'address-numero', 'address-cep', 'address-complemento')
    let phoneDatas = getClientFone('phone')
    
    ConnectionDataBase.transaction(async (t) => {
        let newClient = await Client.create(clientDatas, {transaction: t})
        
        addressDatas.clientId = newClient.dataValues.id
        phoneDatas.clientId = newClient.dataValues.id

        if (addressDatas.cep != '')
            await ClientAddress.create(addressDatas, {transaction: t})
        
        if (phoneDatas.phone != '')
            await ClientPhone.create(phoneDatas, {transaction: t})
    }).then(() => {
        M.toast({html: 'Cliente criado com sucesso!', classes: 'rounded green'});
        
        clearFlields([
            'name', 'birth', 'cpf', 
            'phone', 
            'address-bairro', 'address-rua', 'address-numero', 'address-cep', 'address-complemento'
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
    datas.number = document.querySelector('#'+nodeNumber).value
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
    const phones = await ClientPhone.findAll({where: {clientId: id}})
    const address = await ClientAddress.findAll({where: {clientId: id}})
    
    const modal = document.querySelector('.modal-edit')
    const modalHeader = modal.querySelector('#modal-header')
    const notinhasLink = modal.querySelector('.notinhas')
    const editLink = modal.querySelector('.edit-datas')

    modalHeader.innerHTML = FormatName.person(client.dataValues.name)
    notinhasLink.setAttribute('href', '../templates/notinha.html?id=' + client.dataValues.id)
    editLink.addEventListener('click', () => { disableEditInputs(false) })

    renderModalClient(client, phones, address)
    M.Modal.getInstance(modal).open()
}


function renderModalClient(client, phones, address) {
    const modal = document.querySelector('.modal-edit')
    const content = modal.querySelector('.content')
    content.innerHTML = ''
    let h6 = document.createElement('h6')
    h6.classList.add('bold')
    h6.innerHTML = 'Dados do cliente:'

    const clientNode = createDataClient(client)
    clientNode.name.setAttribute('id', 'name-edit')
    clientNode.cpf.setAttribute('id', 'cpf-edit')
    clientNode.birthDate.setAttribute('id', 'birth-date-edit')
    
    let labelName = document.createElement('label')
    labelName.setAttribute('for', 'name-edit')
    labelName.appendChild(document.createTextNode('Nome'))

    let labelCpf = document.createElement('label')
    labelCpf.setAttribute('for', 'cpf-edit')
    labelCpf.appendChild(document.createTextNode('CPF'))
    
    let labelBirth = document.createElement('label')
    labelBirth.setAttribute('for', 'birth-date-edit')
    labelBirth.appendChild(document.createTextNode('Data de nascimento'))

    content.appendChild(h6)
    content.appendChild(labelCpf)
    content.appendChild(clientNode.cpf)
    content.appendChild(labelName)
    content.appendChild(clientNode.name)
    content.appendChild(labelBirth)
    content.appendChild(clientNode.birthDate)

    const phoneNode = createClientPhones(phones)
    h6 = document.createElement('h6')
    h6.classList.add('bold')
    h6.innerHTML = 'Contatos:'
    content.appendChild(h6)
    for (node of phoneNode)
        content.appendChild(node)

    const addressNode = createClientAddress(address)
    h6 = document.createElement('h6')
    h6.classList.add('bold')
    h6.innerHTML = 'Endereço:'
    content.appendChild(h6)
    for (node of addressNode) {
        content.appendChild(node.neihg.label)
        content.appendChild(node.neihg.input)
        
        content.appendChild(node.street.label)
        content.appendChild(node.street.input)
        
        content.appendChild(node.number.label)
        content.appendChild(node.number.input)
        
        content.appendChild(node.cep.label)
        content.appendChild(node.cep.input)
        
        content.appendChild(node.complement.label)
        content.appendChild(node.complement.input)
    }

    let save = document.createElement('button')
    save.setAttribute('type', 'button')
    save.classList.add('btn')
    save.classList.add('waves-effect')
    save.classList.add('waves-light')
    save.classList.add('save-edit')
    save.appendChild(document.createTextNode('Salvar'))
    content.appendChild(save)

    disableEditInputs(true)
    listenerUpdate()
}


function createDataClient(client) {
    client = client.dataValues

    let name = document.createElement('input')
    name.setAttribute('type', 'text')
    name.setAttribute('value', client.name)

    let cpf = document.createElement('input')
    cpf.setAttribute('type', 'text')
    cpf.setAttribute('value', client.cpf)
    
    let birthDate = document.createElement('input')
    birthDate.setAttribute('type', 'date')
    birthDate.setAttribute('value', client.birthDate)

    return {name, cpf ,birthDate}
}


function createClientPhones(phones) {
    let list = []
    for (phone of phones) {
        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.classList.add('phone-edit')
        input.setAttribute('value', phone.dataValues.phone)
        input.disabled = true
        
        list.push(input)
    }

    return list
}


function createClientAddress(address) {
    let list = []

    const disable = node => {
        node.disabled = true
    }

    for (model of address) {
        let neihg = createInput('bairro-edit', 'Bairro')
        neihg.input.value = model.dataValues.neighborhood
        disable(neihg.input)

        let street = createInput('rua-edit', 'Rua')
        street.input.value = model.dataValues.street
        disable(street.input)

        let num = createInput('num-edit', 'Número')
        num.input.value = model.dataValues.number
        disable(num.input)
        
        let cep = createInput('cep-edit', 'CEP')
        cep.input.value = model.dataValues.cep
        disable(cep.input)

        let complement = createInput('complement-edit', 'Complemento')
        complement.input.value = model.dataValues.complement
        disable(complement.input)

        list.push({neihg, street, number: num, complement, cep})
    }

    return list
}


function createInput(id, name) {
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('id', id)

    let label = document.createElement('label')
    label.setAttribute('for', id)
    label.appendChild(document.createTextNode(name))

    return {input, label}
}


function disableEditInputs(disabled) {
    const modal = document.querySelector('.modal-edit')
    for (input of modal.querySelectorAll('input')) {
        if (input.getAttribute('id') != 'cpf-edit')
            input.disabled = disabled
    }

    let save = modal.querySelector('.save-edit')
    save.disabled = disabled
}


function listenerUpdate() {
    const modal = document.querySelector('.modal-edit')
    modal.querySelector('.save-edit').addEventListener('click', updateClient)
}


async function updateClient() {
    const modal = document.querySelector('.modal-edit')
    const cpf = modal.querySelector('#cpf-edit').value
    const name = modal.querySelector('#name-edit').value.toLowerCase()
    const birthDate = new Date(modal.querySelector('#birth-date-edit').value)
    const clientDatas = {name, birthDate}

    const phones = Array.from(modal.querySelectorAll('.phone-edit')).map(node => node.value)
    
    const neighborhood = modal.querySelector('#bairro-edit').value
    const street = modal.querySelector('#rua-edit').value
    const number = modal.querySelector('#num-edit').value
    const cep = modal.querySelector('#cep-edit').value
    const complement = modal.querySelector('#complement-edit').value
    const addressDatas = {neighborhood, street, number, cep, complement }

    const client = await Client.findOne({where: { cpf }})
    addressDatas.clientId = client.id

    ConnectionDataBase.transaction(async (t) => {
        await client.update(clientDatas, {transaction: t})
        
        
        if (addressDatas.cep != '') {
            let address = await ClientAddress.findOne({where: {clientId: client.id}})
            await address.update(addressDatas, {transaction: t})
        }
        
        const phonesDataBase = await ClientPhone.findAll({ where: {clientId: client.id }})

        for (phone in phones) {
            for (phoneOnData in phonesDataBase) {
                if (phone != phoneOnData)
                    return
                let phoneDatas = {phone: phones[phone], clientId: client.dataValues.id }
                
                if (phones[phone] != '') {
                    await phonesDataBase[phoneOnData].update(phoneDatas, {transaction: t})
                }
            }
        }
    }).then(() => {
        M.toast({html: 'Cliente atualizado com sucesso!', classes: 'rounded green'});
        disableEditInputs(true)
    }).catch(error =>{
        M.toast({html: 'Cliente não foi ataualizado!', classes: 'rounded red'});
        console.log(error);
    })  

}