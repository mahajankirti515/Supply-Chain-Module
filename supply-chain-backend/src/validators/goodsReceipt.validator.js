const { body } = require('express-validator');

const validateGoodsReceipt = [
  body('poId').isUUID().withMessage('Purchase Order ID must be a valid UUID'),
  body('vendorId').isUUID().withMessage('Vendor ID must be a valid UUID'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.productId').isUUID().withMessage('Product ID must be a valid UUID'),
  body('items.*.orderedQty').isInt({ min: 1 }).withMessage('Ordered quantity must be at least 1'),
  body('items.*.receivedQty').isInt({ min: 0 }).withMessage('Received quantity cannot be negative'),
];

module.exports = {
  validateGoodsReceipt,
};
