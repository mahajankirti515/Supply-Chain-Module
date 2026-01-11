import { apiClient } from './config';

export interface Product {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  unit: string;
  sport?: string;
  facility?: string;
  currentStock: number;
  minStock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  productName: string;
  category: string;
  unit: string;
  sport?: string;
  facility?: string;
  minStock: number;
  notes?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductsResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: Product[];
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export const productApi = {
  getProducts: async (params?: {
    search?: string;
    category?: string;
    sport?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductsResponse> => {
    const response = await apiClient.get('/products', { params });
    return response.data;
  },

  getProductById: async (id: string): Promise<ProductResponse> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: UpdateProductRequest): Promise<ProductResponse> => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
};
