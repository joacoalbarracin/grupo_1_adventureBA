const { body } = require('express-validator')

module.exports = [
    body('name').optional().notEmpty().withMessage('Indica el nombre del producto'),
    body('description').optional().isLength({min: 20, max:240}).withMessage('La descripción debe tener un mínimo de 20 caracteres y un máximo de 240'),
    body('price').optional().isFloat({min:5, max:200}).withMessage('El precio debe ser mayor a 5 y menor a 200 USD'),
    body('discount').optional().isFloat({min:5}).withMessage('El descuento debe ser mayor a 5%'),
]