// routes/product.routes.js
const router = require('express').Router();
const controller = require('../controllers/product.controller');

router.post('/', controller.createProduct);
router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.patch('/:id/status', controller.updateProductStatus);

module.exports = router;
