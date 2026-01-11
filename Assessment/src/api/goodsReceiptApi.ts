import apiClient from './config';

export interface GoodsReceiptItem {
  productId: string;
  productName?: string;
  productCode?: string;
  orderedQty: number;
  receivedQty: number;
  damagedQty: number;
  status?: string;
}

export interface GoodsReceipt {
  id?: string;
  grnCode: string;
  poId: string;
  vendorId: string;
  receivedDate: string;
  status: string;
  vendor?: {
    vendorName: string;
  };
  purchaseOrder?: {
    poCode: string;
  };
  items?: GoodsReceiptItem[];
  createdAt?: string;
}

export const goodsReceiptApi = {
  // Get all goods receipts
  getGoodsReceipts: async () => {
    const response = await apiClient.get('/goods-receipts');
    return response.data;
  },

  // Get a single goods receipt by ID
  getGoodsReceiptById: async (id: string) => {
    const response = await apiClient.get(`/goods-receipts/${id}`);
    return response.data;
  },

  // Create a new goods receipt
  createGoodsReceipt: async (data: any) => {
    const response = await apiClient.post('/goods-receipts', data);
    return response.data;
  },
};

export default goodsReceiptApi;
