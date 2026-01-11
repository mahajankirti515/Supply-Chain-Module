const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  invoiceId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'invoice_id'
  },

  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id'
  },

  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_name'
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'unit_price'
  },

  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },

  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },

  total: {
    type: DataTypes.DECIMAL(10, 2)
  }
}, {
  tableName: 'invoice_items',
  underscored: true
});

module.exports = InvoiceItem;
