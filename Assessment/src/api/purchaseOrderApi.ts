import { apiClient } from './config';

// Types
export interface PurchaseOrderItem {
  id?: string;
  productId: string;
  productName?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PurchaseOrder {
  id: string;
  poCode: string;
  vendorId: string;
  vendor?: {
    vendorName: string;
  };
  totalItems: number;
  totalAmount: number;
  expectedDelivery: string;
  notes?: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  items?: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderRequest {
  vendorId: string;
  expectedDelivery: string;
  items: Array<{
    productId: string;
    quantity: number;
    rate: number;
  }>;
  notes?: string;
}

export interface UpdatePurchaseOrderRequest {
  expectedDelivery?: string;
  items?: Array<{
    productId: string;
    quantity: number;
    rate: number;
  }>;
  notes?: string;
}

export interface PurchaseOrdersResponse {
  success: boolean;
  total?: number;
  page?: number;
  totalPages?: number;
  data: PurchaseOrder[];
}

export interface PurchaseOrderResponse {
  success: boolean;
  data: PurchaseOrder;
}

// API Functions
export const purchaseOrderApi = {
  // Get all purchase orders
  getPurchaseOrders: async (params?: {
    search?: string;
    status?: string;
    vendorId?: string;
    page?: number;
    limit?: number;
  }): Promise<PurchaseOrdersResponse> => {
    const response = await apiClient.get('/purchase-orders', { params });
    return response.data;
  },

  // Get purchase order by ID
  getPurchaseOrderById: async (id: string): Promise<PurchaseOrderResponse> => {
    const response = await apiClient.get(`/purchase-orders/${id}`);
    return response.data;
  },

  // Create purchase order
  createPurchaseOrder: async (data: CreatePurchaseOrderRequest): Promise<PurchaseOrderResponse> => {
    const response = await apiClient.post('/purchase-orders', data);
    return response.data;
  },

  // Update purchase order status
  updatePurchaseOrderStatus: async (id: string, status: string): Promise<PurchaseOrderResponse> => {
    const response = await apiClient.patch(`/purchase-orders/${id}/status`, { status });
    return response.data;
  },
};
