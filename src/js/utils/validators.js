"use strict";

class Product {
    constructor(name, price, barcode) {
        this.name = name.toLowerCase()
        this.price = price.replace(',', '.').replace('R$', '')
        this.barcode = barcode
        this.error = {}
    }

    validateName() {
        for (let i = 0 ; i < this.name.length; i++) {
            if (this.name[i] != ' ') {
                return true
            }
        }
        this.error.name = 'Nome não pode ficar vazio.'
        return false
    }

    validatePrice() {
        if (!this.price) {
            this.error.price = 'Preço não pode ficar vazio.'
        }

        if (isNaN(this.price)) {
            this.error.price = 'Preço não é um número.'
            return false
        }
        else
            return true
    }

    validateBarCode() {
        if (!this.barcode) {
            this.error.barCode = 'Código de barras não pode ficar vazio.'
        }

        for (let i = 0; i < this.barcode.length; i++) {
            if ('0' <= this.barcode[i] && this.barcode[i] <= '9')
                continue
            else {
                this.error.barCode = 'Código de barras só pode ter números.'
                return false
            }
        }
        return true
    }

    isValid() {
        this.validateName()
        this.validatePrice()
        this.validateBarCode() 
        
        return Object.keys(this.error).length === 0
    }
}


module.exports = {
    Product
}