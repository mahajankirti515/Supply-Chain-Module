const express = require("express");
const router = express.Router();
const controller = require("../controllers/vendor.controller");

router.post("/", controller.createVendor);
router.get("/", controller.getVendors);
router.get("/:id", controller.getVendorById);
router.put("/:id", controller.updateVendor);
router.delete("/:id", controller.deleteVendor);
router.patch("/:id/status", controller.updateVendorStatus);

module.exports = router;
