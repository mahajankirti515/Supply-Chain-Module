import React, { useEffect } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGoodsReceiptById, clearCurrentGoodsReceipt } from '../../store/slices/goodsReceiptSlice';

interface GoodsReceiptDetailProps {
  grnId?: string;
}

export function GoodsReceiptDetail({ grnId }: GoodsReceiptDetailProps) {
  const dispatch = useAppDispatch();
  const { currentGoodsReceipt, loading } = useAppSelector((state) => state.goodsReceipts);

  useEffect(() => {
    if (grnId) {
      dispatch(fetchGoodsReceiptById(grnId));
    }
    return () => {
      dispatch(clearCurrentGoodsReceipt());
    };
  }, [dispatch, grnId]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
          <p className="text-[#718096]">Loading goods receipt details...</p>
        </div>
      </div>
    );
  }

  if (!currentGoodsReceipt) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#262C36] mb-4">Goods Receipt not found</p>
          <button
            onClick={() => navigateTo('/supply-chain/goods-receipt')}
            className="text-[#0A6659] hover:underline"
          >
            Back to Goods Receipt
          </button>
        </div>
      </div>
    );
  }

  const grn = currentGoodsReceipt;
  
  // Transform items for table display
  const items = grn.items?.map((item: any) => ({
    id: item.productId,
    product: item.product?.productName || 'N/A',
    ordered: item.orderedQty,
    received: item.receivedQty,
    damage: item.damagedQty,
    status: item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'N/A',
  })) || [];

  const itemColumns: TableColumn[] = [
    { key: 'product', label: 'Product', priority: 1 },
    { key: 'ordered', label: 'Ordered', priority: 2 },
    { key: 'received', label: 'Received', priority: 3 },
    { key: 'damage', label: 'Damage', hiddenOn: ['mobile'] },
    { key: 'status', label: 'Status', priority: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Goods Receipt', path: '/supply-chain/goods-receipt' },
          { label: `GRN ${grn.grnCode}` },
        ]}
      />

      <ResponsivePageHeader title={`Goods Receipt - ${grn.grnCode}`} />

      <div className="p-6 space-y-6">
        <button
          onClick={() => navigateTo('/supply-chain/goods-receipt')}
          className="flex items-center gap-2 text-[#0A6659] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Goods Receipt
        </button>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h2 className="text-2xl font-semibold text-[#262C36] mb-4">{grn.grnCode}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-[#718096]">PO Reference</p>
              <button
                onClick={() => navigateTo(`/supply-chain/purchase-orders/${grn.poId}`)}
                className="text-sm font-medium text-[#0A6659] hover:underline text-left"
              >
                {grn.purchaseOrder?.poCode || 'N/A'}
              </button>
            </div>
            <div>
              <p className="text-xs text-[#718096]">Vendor</p>
              <button
                onClick={() => navigateTo(`/supply-chain/vendors/${grn.vendorId}`)}
                className="text-sm font-medium text-[#0A6659] hover:underline text-left"
              >
                {grn.vendor?.vendorName || 'N/A'}
              </button>
            </div>
            <div>
              <p className="text-xs text-[#718096]">Received Date</p>
              <p className="text-sm font-medium text-[#262C36]">
                {new Date(grn.receivedDate).toLocaleDateString('en-GB')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h3 className="font-semibold text-[#262C36] mb-4">Received Items ({items.length})</h3>
          <ResponsiveTable
            columns={itemColumns}
            data={items}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            onRowClick={(row) => navigateTo(`/supply-chain/products/${row.id}`)}
          />
        </div>

        {grn.status === 'pending' && (
          <div className="bg-white rounded-xl border border-[#262C3633] p-6">
            <h3 className="font-semibold text-[#262C36] mb-4">Actions</h3>
            <button className="px-6 py-2 bg-[#48BB78] text-white rounded-xl hover:bg-[#48BB78]/90 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Confirm Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
