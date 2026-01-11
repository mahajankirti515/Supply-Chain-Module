const sequelize = require('../config/database');
const { Invoice, InvoiceItem, Vendor, PurchaseOrder, Product, PurchaseOrderItem } = require('../models');
const { generateInvoiceCode } = require('../utils/codeGenerator');
const { Op } = require('sequelize');

// Create Invoice
const createInvoice = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      vendorId,
      poId,
      poReference,
      invoiceDate,
      amount,
      invoiceDocument
    } = req.body;

    // Validation
    if (!vendorId || !invoiceDate || !amount) {
      const error = new Error('Required fields missing');
      error.statusCode = 400;
      throw error;
    }

    // Auto-generate invoice number
    const invoiceNumber = await generateInvoiceCode();

    const invoice = await Invoice.create({
      invoiceNumber,
      vendorId,
      poId,
      poReference,
      invoiceDate,
      amount,
      paymentStatus: 'pending',
      invoiceDocument,
      status: 'active'
    }, { transaction });

    // NEW LOGIC: If poId is provided, fetch items from Purchase Order and create InvoiceItems
    if (poId) {
      const poItems = await PurchaseOrder.findByPk(poId, {
        include: [{
          model: PurchaseOrderItem,
          as: 'items',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['productName']
          }]
        }],
        transaction
      });

      if (poItems && poItems.items) {
        const invoiceItemsData = poItems.items.map(item => ({
          invoiceId: invoice.id,
          productId: item.productId,
          productName: item.product?.productName || 'Unknown Product',
          quantity: item.quantity,
          unitPrice: item.rate,
          total: item.amount,
          tax: 0,
          discount: 0
        }));

        await InvoiceItem.bulkCreate(invoiceItemsData, { transaction });
      }
    }

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully with items',
      data: invoice
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Create Invoice Error:', error);
    next(error);
  }
};

// Get All Invoices
const getInvoices = async (req, res, next) => {
  try {
    const { search, paymentStatus, page = 1, limit = 10 } = req.query;
    const where = {};

    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where[Op.or] = [
        { invoiceNumber: { [Op.iLike]: `%${search}%` } },
        { poReference: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { rows: invoices, count } = await Invoice.findAndCountAll({
      where,
      include: [{
        model: Vendor,
        as: 'vendor',
        attributes: ['vendorName']
      }],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      total: count,
      page: Number(page),
      totalPages: Math.ceil(count / limit),
      data: invoices
    });

  } catch (error) {
    next(error);
  }
};

// Get Invoice by ID
const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['vendorName', 'email', 'phone', 'address', 'gst']
        },
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['poCode', 'totalAmount']
        },
        {
          model: InvoiceItem,
          as: 'items',
          attributes: ['id', 'productId', 'productName', 'quantity', 'unitPrice', 'total']
        }
      ]
    });

    if (!invoice) {
      const error = new Error('Invoice not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    next(error);
  }
};

// Update Payment Status
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowedStatus = ['pending', 'paid', 'overdue', 'cancelled'];
    if (!allowedStatus.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Update status
    await invoice.update({ paymentStatus });

    // Re-fetch with associations to prevent UI data loss
    const updatedInvoice = await Invoice.findByPk(id, {
      include: [
        {
          model: Vendor,
          as: 'vendor',
          attributes: ['vendorName', 'email', 'phone', 'address', 'gst']
        },
        {
          model: PurchaseOrder,
          as: 'purchaseOrder',
          attributes: ['poCode', 'totalAmount']
        },
        {
          model: InvoiceItem,
          as: 'items',
          attributes: ['id', 'productId', 'productName', 'quantity', 'unitPrice', 'total']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: updatedInvoice
    });

  } catch (error) {
    console.error('Update Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updatePaymentStatus
};
