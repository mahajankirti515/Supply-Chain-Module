const Product = require("../models/Product");
const { generateProductCode } = require("../utils/codeGenerator");
const { Op } = require("sequelize");

const createProduct = async (req, res) => {
  try {
    const { productName, category, unit, sport, facility, minStock } = req.body;

    if (!productName || !category || !unit || !minStock) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // AUTO-GENERATE productCode
    const productCode = await generateProductCode();

    const product = await Product.create({
      productCode,
      productName,
      category,
      unit,
      sport,
      facility,
      minStock,
      currentStock: 0,
      status: "instock",
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const where = { isDeleted: false };

    if (status) {
      // Handle the case where the frontend sends formatted status like 'In Stock'
      const statusMap = {
        'In Stock': 'instock',
        'Low Stock': 'lowstock',
        'Out of Stock': 'outofstock'
      };
      where.status = statusMap[status] || status.toLowerCase().replace(/\s+/g, '');
    }

    if (search) {
      where[Op.or] = [
        { productName: { [Op.iLike]: `%${search}%` } },
        { productCode: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const offset = (page - 1) * limit;

    const { rows: products, count } = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// get product by id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findOne({
      where: {
        id,
        isDeleted: false,
      },
      attributes: [
        "id",
        "productCode",
        "productName",
        "category",
        "unit",
        "sport",
        "facility",
        "minStock",
        "currentStock",
        "status",
        "createdAt",
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, unit, sport, facility, minStock } = req.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      productName,
      category,
      unit,
      sport,
      facility,
      minStock,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      isDeleted: true,
      deletedAt: new Date(),
      // deletedBy: req.user.id
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// update product status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["active", "inactive"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.update({
      status,
      statusUpdatedAt: new Date(),
      // statusUpdatedBy: req.user.id
    });

    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: {
        id: product.id,
        status: product.status,
      },
    });
  } catch (error) {
    console.error("Update Product Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product status",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
};
