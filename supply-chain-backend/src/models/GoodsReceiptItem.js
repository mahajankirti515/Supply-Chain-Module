const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoodsReceiptItem = sequelize.define('GoodsReceiptItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  goodsReceiptId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'goods_receipt_id'
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id'
  },
  orderedQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ordered_qty'
  },
  receivedQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'received_qty'
  },
  damagedQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'damaged_qty'
  },
  status: {
    type: DataTypes.ENUM('complete', 'partial'),
    allowNull: false
  }
}, {
  tableName: 'goods_receipt_items',
  underscored: true
});

module.exports = GoodsReceiptItem;
