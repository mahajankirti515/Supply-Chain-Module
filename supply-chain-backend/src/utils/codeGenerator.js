const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const PurchaseOrder = require('../models/PurchaseOrder');
const GoodsReceipt = require('../models/GoodsReceipt');
const { Invoice } = require('../models');

// VEN001, VEN002
async function generateVendorCode() {
  try {
    const lastVendor = await Vendor.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['vendorCode']
    });

    if (!lastVendor || !lastVendor.vendorCode) {
      return 'VEN001';
    }

    const lastNumber = parseInt(lastVendor.vendorCode.replace('VEN', ''), 10);
    
    if (isNaN(lastNumber)) {
      return 'VEN001';
    }
    
    return `VEN${String(lastNumber + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error('Generate Vendor Code Error:', error);
    return 'VEN001';
  }
}

// PRD001, PRD002
async function generateProductCode() {
  try {
    const lastProduct = await Product.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['productCode']
    });

    if (!lastProduct || !lastProduct.productCode) {
      return 'PRD001';
    }

    const lastNumber = parseInt(lastProduct.productCode.replace('PRD', ''), 10);
    
    if (isNaN(lastNumber)) {
      return 'PRD001';
    }
    
    return `PRD${String(lastNumber + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error('Generate Product Code Error:', error);
    return 'PRD001';
  }
}

async function generatePOCode() {
  const lastPO = await PurchaseOrder.findOne({
    order: [['createdAt', 'DESC']],
    attributes: ['poCode']
  });

  if (!lastPO) return 'PO001';

  const lastNumber = parseInt(lastPO.poCode.replace('PO', ''), 10);
  return `PO${String(lastNumber + 1).padStart(3, '0')}`;
}

async function generateGRNCode() {
  try {
    const lastGRN = await GoodsReceipt.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['grnCode']
    });

    if (!lastGRN || !lastGRN.grnCode) {
      return 'GRN001';
    }

    const lastNumber = parseInt(lastGRN.grnCode.replace('GRN', ''), 10);
    
    if (isNaN(lastNumber)) {
      return 'GRN001';
    }
    
    return `GRN${String(lastNumber + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error('Generate GRN Code Error:', error);
    return 'GRN001';
  }
}

// INV001, INV002
async function generateInvoiceCode() {
  try {
    const lastInvoice = await Invoice.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['invoiceNumber']
    });

    if (!lastInvoice || !lastInvoice.invoiceNumber) {
      return 'INV001';
    }

    const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('INV', ''), 10);
    
    if (isNaN(lastNumber)) {
      return 'INV001';
    }
    
    return `INV${String(lastNumber + 1).padStart(3, '0')}`;
  } catch (error) {
    console.error('Generate Invoice Code Error:', error);
    return 'INV001';
  }
}

module.exports = {
  generateVendorCode,
  generateProductCode,
  generatePOCode,
  generateGRNCode,
  generateInvoiceCode
};
