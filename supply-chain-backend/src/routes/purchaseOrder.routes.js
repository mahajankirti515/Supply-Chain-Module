const router = require('express').Router();
const controller = require('../controllers/purchaseOrder.controller.js');

router.post("/", controller.createPurchaseOrder);
router.get("/", controller.getPurchaseOrders);
router.get("/:id", controller.getPurchaseOrderById);
router.patch("/:id/status", controller.updatePurchaseOrderStatus);

module.exports = router;