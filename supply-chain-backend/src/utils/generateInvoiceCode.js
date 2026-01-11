const { Invoice } = require('../models');
const { Op } = require('sequelize');

const generateInvoiceCode = async () => {
  const year = new Date().getFullYear();

  const lastInvoice = await Invoice.findOne({
    where: {
      invoiceCode: {
        [Op.like]: `INV-${year}-%`
      }
    },
    order: [['createdAt', 'DESC']]
  });

  let next = 1;
  if (lastInvoice) {
    next = parseInt(lastInvoice.invoiceCode.split('-')[2]) + 1;
  }

  return `INV-${year}-${String(next).padStart(4, '0')}`;
};

module.exports = generateInvoiceCode;
