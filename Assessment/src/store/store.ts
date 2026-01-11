import { configureStore } from '@reduxjs/toolkit';
import vendorReducer from './slices/vendorSlice';
import productReducer from './slices/productSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import invoiceReducer from './slices/invoiceSlice';
import goodsReceiptReducer from './slices/goodsReceiptSlice';

export const store = configureStore({
  reducer: {
    vendors: vendorReducer,
    products: productReducer,
    purchaseOrders: purchaseOrderReducer,
    invoices: invoiceReducer,
    goodsReceipts: goodsReceiptReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
