import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { purchaseOrderApi, PurchaseOrder, CreatePurchaseOrderRequest } from '../../api/purchaseOrderApi';

// Async Thunks
export const fetchPurchaseOrders = createAsyncThunk(
  'purchaseOrders/fetchPurchaseOrders',
  async (params?: {
    search?: string;
    status?: string;
    vendorId?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await purchaseOrderApi.getPurchaseOrders(params);
    return response;
  }
);

export const fetchPurchaseOrderById = createAsyncThunk(
  'purchaseOrders/fetchPurchaseOrderById',
  async (id: string) => {
    const response = await purchaseOrderApi.getPurchaseOrderById(id);
    return response.data;
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/createPurchaseOrder',
  async (data: CreatePurchaseOrderRequest) => {
    const response = await purchaseOrderApi.createPurchaseOrder(data);
    return response.data;
  }
);

export const updatePurchaseOrderStatus = createAsyncThunk(
  'purchaseOrders/updatePurchaseOrderStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await purchaseOrderApi.updatePurchaseOrderStatus(id, status);
    return response.data;
  }
);

// State Interface
interface PurchaseOrderState {
  purchaseOrders: PurchaseOrder[];
  currentPurchaseOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
}

// Initial State
const initialState: PurchaseOrderState = {
  purchaseOrders: [],
  currentPurchaseOrder: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
};

// Slice
const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPurchaseOrder: (state) => {
      state.currentPurchaseOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Purchase Orders
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          // Direct array response
          state.purchaseOrders = action.payload;
          state.total = action.payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else if (action.payload.data) {
          // Response with data property
          state.purchaseOrders = action.payload.data;
          state.total = action.payload.total || action.payload.data.length;
          state.page = action.payload.page || 1;
          state.totalPages = action.payload.totalPages || Math.ceil((action.payload.total || action.payload.data.length) / 10);
        } else {
          // Fallback
          state.purchaseOrders = [];
          state.total = 0;
          state.page = 1;
          state.totalPages = 0;
        }
      })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch purchase orders';
      })
      
      // Fetch Purchase Order By ID
      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPurchaseOrder = action.payload;
      })
      .addCase(fetchPurchaseOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch purchase order';
      })
      
      // Create Purchase Order
      .addCase(createPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh the list after creation
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create purchase order';
      })
      
      // Update Purchase Order Status
      .addCase(updatePurchaseOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPurchaseOrder = action.payload;
        const index = state.purchaseOrders.findIndex(po => po.id === action.payload.id);
        if (index !== -1) {
          state.purchaseOrders[index] = action.payload;
        }
      })
      .addCase(updatePurchaseOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update status';
      });
  },
});

export const { clearError, clearCurrentPurchaseOrder } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
