const express = require('express');
const router = express.Router();

const controller = require('../controllers/mainController');

router.get('/', controller.home);
router.get('/login', controller.login);
router.get('/productCart', controller.productCart);
router.get('/productDetail', controller.productDetail);
router.get('/register', controller.register);
router.get('/productList', controller.productList);
router.get('/editProduct', controller.editProduct)
router.get('/createProduct', controller.createProduct)

module.exports = router;