const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productCode: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      field: "product_code",
    },
    productName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sport: {
      type: DataTypes.STRING(100),
    },
    facility: {
      type: DataTypes.STRING(100),
    },
    currentStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "current_stock",
      validate: {
        min: 0,
      },
    },
    minStock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: "min_stock",
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("instock", "low_stock", "out_of_stock"),
      defaultValue: "instock",
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
    tableName: "products",
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

module.exports = Product;
