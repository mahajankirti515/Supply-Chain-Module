const sequelize = require("../config/database");
const {
  Vendor,
  Product,
  PurchaseOrder,
  PurchaseOrderItem,
} = require("../models");

const { generatePOCode } = require("../utils/codeGenerator");
const { PO_STATUS } = require("../utils/constants");
const { Op } = require("sequelize");

const createPurchaseOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { vendorId, expectedDelivery, items, notes } = req.body;

    if (!vendorId || !expectedDelivery || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const vendor = await Vendor.findByPk(vendorId, { transaction });

    if (!vendor) {
      const error = new Error("Vendor not found");
      error.statusCode = 404;
      throw error;
    }

    const poItems = [];
    let totalItems = 0;
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      
      if (!product) {
        throw new Error(`Product mapping failed for ID: ${item.productId}`);
      }

      const quantity = Number(item.quantity);
      const rate = Number(item.rate);
      const rowAmount = quantity * rate;

      totalItems += quantity;
      totalAmount += rowAmount;

      poItems.push({
        productId: product.id,
        quantity,
        rate,
        amount: rowAmount,
      });
    }

    const poCode = await generatePOCode();

    const po = await PurchaseOrder.create(
      {
        poCode,
        vendorId: vendor.id,
        expectedDelivery,
        totalItems,
        totalAmount,
        notes,
        status: PO_STATUS.DRAFT,
      },
      { transaction }
    );

    await PurchaseOrderItem.bulkCreate(
      poItems.map((i) => ({ ...i, poId: po.id })),
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Purchase Order created successfully",
      data: po,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const getPurchaseOrders = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const where = {};

    if (search) {
      where.poCode = { [Op.iLike]: `%${search}%` };
    }

    const offset = (page - 1) * limit;

    const { rows: orders, count } = await PurchaseOrder.findAndCountAll({
      where,
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['vendorName']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

const getPurchaseOrderById = async (req, res, next) => {
  try {
    const po = await PurchaseOrder.findByPk(req.params.id, {
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['vendorName']
        },
        {
          model: PurchaseOrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['productName']
            }
          ]
        }
      ]
    });

    if (!po) {
      const error = new Error('Purchase Order not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: po
    });
  } catch (error) {
    next(error);
  }
};

const updatePurchaseOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(PO_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const po = await PurchaseOrder.findByPk(id);

    if (!po) {
      const error = new Error("Purchase Order not found");
      error.statusCode = 404;
      throw error;
    }

    await po.update({ status });

    // Fetch updated PO with associations
    const updatedPo = await PurchaseOrder.findByPk(id, {
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["vendorName"],
        },
        {
          model: PurchaseOrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["productName"],
            },
          ],
        },
      ],
    });

    res.json({
      success: true,
      data: updatedPo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrderStatus,
};
