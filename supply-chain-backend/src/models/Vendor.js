const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vendor = sequelize.define(
  "Vendor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vendorCode: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      field: "vendor_code",
    },
    vendorName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "vendor_name",
    },
    contactPerson: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "contact_person",
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    gst: {
      type: DataTypes.STRING(50),
    },
    categories: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "active",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_deleted",
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "vendors",
    underscored: true,
    paranoid: false,
    defaultScope: {
      where: { isDeleted: false },
    },
    scopes: {
      withDeleted: { where: {} },
    },
  }
);

module.exports = Vendor;
