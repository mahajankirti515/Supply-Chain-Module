import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { invoiceApi, Invoice, CreateInvoiceRequest } from '../../api/invoiceApi';

// Async Thunks
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params?: {
    search?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await invoiceApi.getInvoices(params);
    return response;
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id: string) => {
    const response = await invoiceApi.getInvoiceById(id);
    return response.data;
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (data: CreateInvoiceRequest) => {
    const response = await invoiceApi.createInvoice(data);
    return response.data;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'invoices/updatePaymentStatus',
  async ({ id, paymentStatus }: { id: string; paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled' }) => {
    const response = await invoiceApi.updatePaymentStatus(id, paymentStatus);
    return response.data;
  }
);

// State Interface
interface InvoiceState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
}

// Initial State
const initialState: InvoiceState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 0,
};

// Slice
const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoices';
      })
      
      // Fetch Invoice By ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch invoice';
      })
      
      // Create Invoice
      .addCase(createInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create invoice';
      })
      
      // Update Payment Status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.invoices.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index] = action.payload;
        }
        if (state.currentInvoice?.id === action.payload.id) {
          state.currentInvoice = action.payload;
        }
      });
  },
});

export const { clearError, clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
