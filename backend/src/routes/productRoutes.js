const express = require('express');
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addProduct);
router.put('/:id', updateProduct); // Ruta para actualizar producto
router.delete('/:id', deleteProduct);

module.exports = router;
