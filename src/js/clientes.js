const Materialize = require('../js/MaterializeListeners')
const ConnectionDataBase = require('../models/Connection')
const { Client, ClientPhone, ClientAdress } = require('../models/Client')

Materialize.tabs()
Materialize.date()


document.querySelector('#form-create').addEventListener('submit', createClient)


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
            await ClientAdress.create(adressDatas)
        
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