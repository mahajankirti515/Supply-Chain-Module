// models/PurchaseOrder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  poCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  totalItems: DataTypes.INTEGER,
  totalAmount: DataTypes.DECIMAL(10,2),
  expectedDelivery: DataTypes.DATE,
  notes: DataTypes.TEXT,
  status: {
    type: DataTypes.ENUM('draft','sent','received','cancelled'),
    defaultValue: 'draft'
  }
}, {
  tableName: 'purchase_orders',
  underscored: true
});

module.exports = PurchaseOrder;
