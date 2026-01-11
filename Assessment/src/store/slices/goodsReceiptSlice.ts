import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { goodsReceiptApi, GoodsReceipt } from '../../api/goodsReceiptApi';

// Async Thunks
export const fetchGoodsReceipts = createAsyncThunk(
  'goodsReceipts/fetchGoodsReceipts',
  async () => {
    const response = await goodsReceiptApi.getGoodsReceipts();
    return response;
  }
);

export const fetchGoodsReceiptById = createAsyncThunk(
  'goodsReceipts/fetchGoodsReceiptById',
  async (id: string) => {
    const response = await goodsReceiptApi.getGoodsReceiptById(id);
    return response.data;
  }
);

export const createGoodsReceipt = createAsyncThunk(
  'goodsReceipts/createGoodsReceipt',
  async (data: any) => {
    const response = await goodsReceiptApi.createGoodsReceipt(data);
    return response.data;
  }
);

// State Interface
interface GoodsReceiptState {
  goodsReceipts: GoodsReceipt[];
  currentGoodsReceipt: GoodsReceipt | null;
  loading: boolean;
  error: string | null;
  total: number;
}

// Initial State
const initialState: GoodsReceiptState = {
  goodsReceipts: [],
  currentGoodsReceipt: null,
  loading: false,
  error: null,
  total: 0,
};

// Slice
const goodsReceiptSlice = createSlice({
  name: 'goodsReceipts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentGoodsReceipt: (state) => {
      state.currentGoodsReceipt = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Goods Receipts
      .addCase(fetchGoodsReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoodsReceipts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.goodsReceipts = action.payload.data;
          state.total = action.payload.data.length;
        } else {
          state.goodsReceipts = [];
          state.total = 0;
        }
      })
      .addCase(fetchGoodsReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch goods receipts';
      })
      
      // Fetch Goods Receipt By ID
      .addCase(fetchGoodsReceiptById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoodsReceiptById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGoodsReceipt = action.payload;
      })
      .addCase(fetchGoodsReceiptById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch goods receipt details';
      })
      
      // Create Goods Receipt
      .addCase(createGoodsReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoodsReceipt.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createGoodsReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create goods receipt';
      });
  },
});

export const { clearError, clearCurrentGoodsReceipt } = goodsReceiptSlice.actions;
export default goodsReceiptSlice.reducer;
