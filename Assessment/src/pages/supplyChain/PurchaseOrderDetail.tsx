import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, CheckCircle, Send, XCircle } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPurchaseOrderById, clearCurrentPurchaseOrder, updatePurchaseOrderStatus } from '../../store/slices/purchaseOrderSlice';
import { createGoodsReceipt } from '../../store/slices/goodsReceiptSlice';
import { toast } from 'sonner';

interface PurchaseOrderDetailProps {
  poId?: string;
}

export function PurchaseOrderDetail({ poId }: PurchaseOrderDetailProps) {
  const dispatch = useAppDispatch();
  const { currentPurchaseOrder, loading } = useAppSelector((state) => state.purchaseOrders);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (poId) {
      dispatch(fetchPurchaseOrderById(poId));
    }
    return () => {
      dispatch(clearCurrentPurchaseOrder());
    };
  }, [dispatch, poId]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!currentPurchaseOrder) return;
    
    try {
      setIsProcessing(true);
      const resultAction = await dispatch(updatePurchaseOrderStatus({ id: currentPurchaseOrder.id, status: newStatus }));
      
      if (updatePurchaseOrderStatus.fulfilled.match(resultAction)) {
        toast.success(`Purchase Order ${newStatus === 'cancelled' ? 'cancelled' : 'marked as ' + newStatus} successfully!`);
      } else {
        toast.error(`Failed to update status to ${newStatus}`);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAsReceived = async () => {
    if (!currentPurchaseOrder) return;

    try {
      setIsProcessing(true);
      
      const grnData = {
        poId: currentPurchaseOrder.id,
        vendorId: currentPurchaseOrder.vendorId,
        receivedDate: new Date().toISOString().split('T')[0],
        items: currentPurchaseOrder.items?.map((item: any) => ({
          productId: item.productId,
          orderedQty: item.quantity,
          receivedQty: item.quantity, // Default to full receipt
          damagedQty: 0,
        })) || []
      };

      const resultAction = await dispatch(createGoodsReceipt(grnData));
      
      if (createGoodsReceipt.fulfilled.match(resultAction)) {
        toast.success('Goods Receipt created and stock updated!');
        // Small delay to let user see success before redirect
        setTimeout(() => {
          navigateTo(`/supply-chain/goods-receipt/${resultAction.payload.id}`);
        }, 1500);
      } else {
        toast.error('Failed to create Goods Receipt');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
          <p className="text-[#718096]">Loading purchase order details...</p>
        </div>
      </div>
    );
  }

  if (!currentPurchaseOrder) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#262C36] mb-4">Purchase Order not found</p>
          <button
            onClick={() => navigateTo('/supply-chain/purchase-orders')}
            className="text-[#0A6659] hover:underline"
          >
            Back to Purchase Orders
          </button>
        </div>
      </div>
    );
  }

  const po = currentPurchaseOrder;
  const statusDisplay = po.status.charAt(0).toUpperCase() + po.status.slice(1);

  // Transform items for table display
  const items = po.items?.map((item: any) => ({
    id: item.id || item.productId,
    product: item.product?.productName || item.productName || 'N/A',
    quantity: item.quantity,
    rate: `₹${Number(item.rate).toLocaleString('en-IN')}`,
    amount: `₹${Number(item.amount || item.quantity * item.rate).toLocaleString('en-IN')}`,
  })) || [];

  const itemColumns: TableColumn[] = [
    { key: 'product', label: 'Product', priority: 1 },
    { key: 'quantity', label: 'Quantity', priority: 2 },
    { key: 'rate', label: 'Rate', hiddenOn: ['mobile'] },
    { key: 'amount', label: 'Amount', priority: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Purchase Orders', path: '/supply-chain/purchase-orders' },
          { label: `PO ${po.poCode}` },
        ]}
      />

      <ResponsivePageHeader title={`Purchase Order - ${po.poCode}`} />

      <div className="p-6 space-y-6">
        <button
          onClick={() => navigateTo('/supply-chain/purchase-orders')}
          className="flex items-center gap-2 text-[#0A6659] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Purchase Orders
        </button>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#262C36] mb-2">Purchase Order {po.poCode}</h2>
              <span
                className={`status-badge ${
                  po.status === 'received'
                    ? 'status-success'
                    : po.status === 'sent'
                    ? 'status-info'
                    : po.status === 'draft'
                    ? 'status-warning'
                    : 'status-danger'
                }`}
              >
                {statusDisplay}
              </span>
            </div>
            <button
              onClick={() => navigateTo(`/supply-chain/purchase-orders/edit/${po.id}`)}
              className="h-[44px] px-6 border border-[#0A6659] text-[#0A6659] rounded-xl hover:bg-[#0A6659]/5 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit PO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-[#718096] mb-1">Vendor</p>
              <button
                onClick={() => navigateTo(`/supply-chain/vendors/${po.vendorId}`)}
                className="text-sm font-medium text-[#0A6659] hover:underline text-left"
              >
                {po.vendor?.vendorName || 'N/A'}
              </button>
            </div>
            <div>
              <p className="text-xs text-[#718096] mb-1">Expected Delivery</p>
              <p className="text-sm font-medium text-[#262C36]">
                {new Date(po.expectedDelivery).toLocaleDateString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#718096] mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-[#0A6659]">
                ₹{Number(po.totalAmount).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {po.notes && (
            <div className="mt-4 p-3 bg-[#F7F7F7] rounded-lg">
              <p className="text-xs text-[#718096] mb-1">Notes</p>
              <p className="text-sm text-[#262C36]">{po.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h3 className="font-semibold text-[#262C36] mb-4">Items ({po.totalItems})</h3>
          <ResponsiveTable
            columns={itemColumns}
            data={items}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            onRowClick={(row) => navigateTo(`/supply-chain/products/${row.id}`)}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h3 className="font-semibold text-[#262C36] mb-4">Actions</h3>
          <div className="flex items-center gap-4 flex-wrap">
            {po.status === 'draft' && (
              <button 
                onClick={() => handleUpdateStatus('sent')}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#3B82F6]/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Mark as Sent
              </button>
            )}
            {po.status === 'sent' && (
              <button 
                onClick={handleMarkAsReceived}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#48BB78] text-white rounded-xl hover:bg-[#48BB78]/90 flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Mark as Received
              </button>
            )}
            {po.status !== 'cancelled' && po.status !== 'received' && (
              <button 
                onClick={() => handleUpdateStatus('cancelled')}
                disabled={isProcessing}
                className="px-6 py-2 border border-[#F56565] text-[#F56565] rounded-xl hover:bg-[#FEF2F2] flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F56565]"></div>
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Cancel PO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
