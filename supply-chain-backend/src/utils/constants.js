const PO_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  RECEIVED: 'received',
  CANCELLED: 'cancelled'
};

const GRN_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed'
};

const INVOICE_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  PARTIAL: 'partial'
};

const VENDOR_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

module.exports = {
  PO_STATUS,
  GRN_STATUS,
  INVOICE_STATUS,
  VENDOR_STATUS
};
