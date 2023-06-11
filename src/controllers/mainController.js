const path = require('path');

const controller = {
    home: (req, res) => {
        res.render('home')
    },
    login: (req, res) => {
        res.render('login')
    },
    productCart: (req, res) => {
        res.render('productCart')
    },
    productDetail: (req, res) => {
        res.render('productDetail')
    },
    register: (req, res) => {
        res.render('register')
    },
    productList: (req, res) => {
        res.render('productList')
    },
    editProduct: (req,res) => {
        res.render('editProduct')
    },
    createProduct: (req,res) => {
        res.render('createProduct')
    }
    
};

module.exports = controller;