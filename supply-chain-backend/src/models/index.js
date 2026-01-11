const Vendor = require("./Vendor");
const Product = require("./Product");
const PurchaseOrder = require("./PurchaseOrder");
const PurchaseOrderItem = require("./PurchaseOrderItem");
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const GoodsReceipt = require('./GoodsReceipt');
const GoodsReceiptItem = require('./GoodsReceiptItem');


// Vendor → Purchase Orders
Vendor.hasMany(PurchaseOrder, {
  foreignKey: "vendor_id",
  as: "purchaseOrders",
});
PurchaseOrder.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });

// PO → Items
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: "po_id", as: "items" });
PurchaseOrderItem.belongsTo(PurchaseOrder, {
  foreignKey: "po_id",
  as: "purchaseOrder",
});

// Product → PO Items
Product.hasMany(PurchaseOrderItem, {
  foreignKey: "product_id",
  as: "orderItems",
});
PurchaseOrderItem.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product",
});

// GRN relations
GoodsReceipt.belongsTo(PurchaseOrder, { foreignKey: "poId", as: "purchaseOrder" });
GoodsReceipt.belongsTo(Vendor, { foreignKey: "vendorId", as: "vendor" });

GoodsReceipt.hasMany(GoodsReceiptItem, {
  foreignKey: "goodsReceiptId",
  as: "items",
});

GoodsReceiptItem.belongsTo(GoodsReceipt, {
  foreignKey: "goodsReceiptId",
  as: "goodsReceipt",
});

GoodsReceiptItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});

Invoice.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'vendor' });
Invoice.belongsTo(PurchaseOrder, { foreignKey: 'poId', as: 'purchaseOrder' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

module.exports = {
  Vendor,
  Product,
  PurchaseOrder,
  PurchaseOrderItem,
  Invoice,
  InvoiceItem,
  GoodsReceipt,
  GoodsReceiptItem
};
