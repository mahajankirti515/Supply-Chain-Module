const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  invoiceNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    field: 'invoice_number'
  },

  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'vendor_id'
  },

  poReference: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'po_reference'
  },

  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'invoice_date'
  },

  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  paymentStatus: {
    type: DataTypes.ENUM('paid', 'pending', 'overdue', 'cancelled'),
    defaultValue: 'pending',
    field: 'payment_status'
  },

  invoiceDocument: {
    type: DataTypes.STRING,
    field: 'invoice_document'
  },

  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },

  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted'
  }

}, {
  tableName: 'invoices',
  underscored: true,
  paranoid: false,
  defaultScope: {
    where: { isDeleted: false }
  }
});

module.exports = Invoice;
