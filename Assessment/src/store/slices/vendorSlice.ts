import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { vendorApi, Vendor, CreateVendorRequest, UpdateVendorRequest } from '../../api/vendorApi';

// Async Thunks
export const fetchVendors = createAsyncThunk(
  'vendors/fetchVendors',
  async (params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await vendorApi.getVendors(params);
    return response;
  }
);

export const fetchVendorById = createAsyncThunk(
  'vendors/fetchVendorById',
  async (id: string) => {
    const response = await vendorApi.getVendorById(id);
    return response.data;
  }
);

export const createVendor = createAsyncThunk(
  'vendors/createVendor',
  async (data: CreateVendorRequest) => {
    const response = await vendorApi.createVendor(data);
    return response.data;
  }
);

export const updateVendor = createAsyncThunk(
  'vendors/updateVendor',
  async ({ id, data }: { id: string; data: UpdateVendorRequest }) => {
    const response = await vendorApi.updateVendor(id, data);
    return response.data;
  }
);

export const deleteVendor = createAsyncThunk(
  'vendors/deleteVendor',
  async (id: string) => {
    await vendorApi.deleteVendor(id);
    return id;
  }
);

export const updateVendorStatus = createAsyncThunk(
  'vendors/updateVendorStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
    const response = await vendorApi.updateVendorStatus(id, status);
    return response.data;
  }
);

// State Interface
interface VendorState {
  vendors: Vendor[];
  currentVendor: Vendor | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
}

// Initial State
const initialState: VendorState = {
  vendors: [],
  currentVendor: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
};

// Slice
const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vendors
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vendors';
      })
      
      // Fetch Vendor By ID
      .addCase(fetchVendorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVendor = action.payload;
      })
      .addCase(fetchVendorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vendor';
      })
      
      // Create Vendor
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create vendor';
      })
      
      // Update Vendor
      .addCase(updateVendor.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
        if (state.currentVendor?.id === action.payload.id) {
          state.currentVendor = action.payload;
        }
      })
      
      // Delete Vendor
      .addCase(deleteVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(v => v.id !== action.payload);
        state.total -= 1;
      })
      
      // Update Vendor Status
      .addCase(updateVendorStatus.fulfilled, (state, action) => {
        const index = state.vendors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vendors[index] = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentVendor } = vendorSlice.actions;
export default vendorSlice.reducer;