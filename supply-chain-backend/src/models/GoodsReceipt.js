const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoodsReceipt = sequelize.define('GoodsReceipt', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  grnCode: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    field: 'grn_code'
  },
  poId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'po_id'
  },
  vendorId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'vendor_id'
  },
  receivedDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    field: 'received_date'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed'),
    defaultValue: 'pending'
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted'
  }
}, {
  tableName: 'goods_receipts',
  underscored: true
});

module.exports = GoodsReceipt;
