import { apiClient } from './config';

// Types
export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  poId?: string;
  vendor?: {
    vendorName: string;
    email?: string;
    phone?: string;
    address?: string;
    gst?: string;
  };
  items?: InvoiceItem[];
  poReference?: string;
  purchaseOrder?: {
    poCode: string;
    totalAmount: number;
  };
  invoiceDate: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled';
  invoiceDocument?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  vendorId: string;
  poId?: string;
  poReference?: string;
  invoiceDate: string;
  amount: number;
  invoiceDocument?: string;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {}

export interface InvoicesResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: Invoice[];
}

export interface InvoiceResponse {
  success: boolean;
  data: Invoice;
}

// API Functions
export const invoiceApi = {
  // Get all invoices
  getInvoices: async (params?: {
    search?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<InvoicesResponse> => {
    const response = await apiClient.get('/invoices', { params });
    return response.data;
  },

  // Get invoice by ID
  getInvoiceById: async (id: string): Promise<InvoiceResponse> => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },

  // Create invoice
  createInvoice: async (data: CreateInvoiceRequest): Promise<InvoiceResponse> => {
    const response = await apiClient.post('/invoices', data);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id: string, paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled'): Promise<InvoiceResponse> => {
    const response = await apiClient.patch(`/invoices/${id}/payment-status`, { paymentStatus });
    return response.data;
  },
};
