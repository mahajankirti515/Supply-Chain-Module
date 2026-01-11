const express = require('express');
const router = express.Router();
const goodsReceiptController = require('../controllers/goodsReceipt.controller');
const { validateGoodsReceipt } = require('../validators/goodsReceipt.validator');
const validate = require('../middleware/validate.middleware');

router.post('/', validateGoodsReceipt, validate, goodsReceiptController.createGoodsReceipt);
router.get('/', goodsReceiptController.getGoodsReceipts);
router.get('/:id', goodsReceiptController.getGoodsReceiptById);

module.exports = router;
