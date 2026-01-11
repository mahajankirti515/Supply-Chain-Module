const sequelize = require("../config/database");
const {
  Vendor,
  Product,
  PurchaseOrder,
  GoodsReceipt,
  GoodsReceiptItem,
} = require("../models");
const { generateGRNCode } = require("../utils/codeGenerator");
const { PO_STATUS, GRN_STATUS } = require("../utils/constants");

const createGoodsReceipt = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { poId, vendorId, items, receivedDate } = req.body;

    if (!poId || !vendorId || !items?.length) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const grnCode = await generateGRNCode();

    // 1. Create Goods Receipt
    const grn = await GoodsReceipt.create(
      {
        grnCode,
        poId,
        vendorId,
        receivedDate: receivedDate || new Date(),
        status: GRN_STATUS.CONFIRMED,
      },
      { transaction }
    );

    // 2. Process items, update stock, and prepare GRN items
    const grnItems = [];
    for (const item of items) {
      // Find product to update stock
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Update Product Stock
      await product.update(
        { 
          currentStock: product.currentStock + Number(item.receivedQty) 
        },
        { transaction }
      );

      grnItems.push({
        goodsReceiptId: grn.id,
        productId: item.productId,
        orderedQty: item.orderedQty,
        receivedQty: item.receivedQty,
        damagedQty: item.damagedQty || 0,
        status: item.receivedQty >= item.orderedQty ? 'complete' : 'partial',
      });
    }

    // 3. Create GRN Items in bulk
    await GoodsReceiptItem.bulkCreate(grnItems, { transaction });

    // 4. Update linked Purchase Order status to RECEIVED
    await PurchaseOrder.update(
      { status: PO_STATUS.RECEIVED },
      { where: { id: poId }, transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Goods Receipt created successfully and Inventory updated",
      data: grn,
    });
  } catch (error) {
    await transaction.rollback();
    next(error); // Pass error to global error handler
  }
};

const getGoodsReceipts = async (req, res, next) => {
  try {
    const grns = await GoodsReceipt.findAll({
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["vendorName"],
        },
        {
          model: PurchaseOrder,
          as: "purchaseOrder",
          attributes: ["poCode"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: grns,
    });
  } catch (error) {
    next(error);
  }
};

const getGoodsReceiptById = async (req, res, next) => {
  try {
    const grn = await GoodsReceipt.findByPk(req.params.id, {
      include: [
        {
          model: Vendor,
          as: "vendor",
          attributes: ["vendorName"],
        },
        {
          model: PurchaseOrder,
          as: "purchaseOrder",
          attributes: ["poCode"],
        },
        {
          model: GoodsReceiptItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["productName", "productCode"],
            },
          ],
        },
      ],
    });

    if (!grn) {
      const error = new Error("Goods Receipt not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: grn,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGoodsReceipt,
  getGoodsReceipts,
  getGoodsReceiptById,
};
