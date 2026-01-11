const express = require('express');
const router = express.Router();
const controller = require('../controllers/invoice.controller');

router.post('/', controller.createInvoice);
router.get('/', controller.getInvoices);
router.get('/:id', controller.getInvoiceById);
router.patch('/:id/payment-status', controller.updatePaymentStatus);

module.exports = router;
