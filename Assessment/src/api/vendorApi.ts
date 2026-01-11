import { apiClient } from './config';

// Types
export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  gst?: string;
  categories: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorRequest {
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  gst?: string;
  categories: string[];
  status?: 'active' | 'inactive';
}

export interface UpdateVendorRequest extends Partial<CreateVendorRequest> {}

export interface VendorsResponse {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: Vendor[];
}

export interface VendorResponse {
  success: boolean;
  data: Vendor;
}

// API Functions
export const vendorApi = {
  // Get all vendors
  getVendors: async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<VendorsResponse> => {
    const response = await apiClient.get('/vendors', { params });
    return response.data;
  },

  // Get vendor by ID
  getVendorById: async (id: string): Promise<VendorResponse> => {
    const response = await apiClient.get(`/vendors/${id}`);
    return response.data;
  },

  // Create vendor
  createVendor: async (data: CreateVendorRequest): Promise<VendorResponse> => {
    const response = await apiClient.post('/vendors', data);
    return response.data;
  },

  // Update vendor
  updateVendor: async (id: string, data: UpdateVendorRequest): Promise<VendorResponse> => {
    const response = await apiClient.put(`/vendors/${id}`, data);
    return response.data;
  },

  // Delete vendor
  deleteVendor: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete(`/vendors/${id}`);
    return response.data;
  },

  // Update vendor status
  updateVendorStatus: async (id: string, status: 'active' | 'inactive'): Promise<VendorResponse> => {
    const response = await apiClient.patch(`/vendors/${id}/status`, { status });
    return response.data;
  },
};