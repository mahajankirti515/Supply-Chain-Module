import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchVendors } from '../../store/slices/vendorSlice';
import { fetchProducts } from '../../store/slices/productSlice';
import { createPurchaseOrder } from '../../store/slices/purchaseOrderSlice';
import { toast } from 'sonner';

interface PurchaseOrderFormProps {
  poId?: string;
  isEdit?: boolean;
}

export function PurchaseOrderForm({ poId, isEdit = false }: PurchaseOrderFormProps) {
  const dispatch = useAppDispatch();
  const { vendors } = useAppSelector((state) => state.vendors);
  const { products } = useAppSelector((state) => state.products);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: '',
    expectedDelivery: '',
    notes: '',
  });

  const [items, setItems] = useState([
    { productId: '', quantity: '', rate: '' },
  ]);

  useEffect(() => {
    dispatch(fetchVendors({ limit: 100 }));
    dispatch(fetchProducts({ limit: 100 }));
  }, [dispatch]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.some(item => !item.productId || !item.quantity || !item.rate)) {
      toast.error('Please fill all item details');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        vendorId: formData.vendorId,
        expectedDelivery: formData.expectedDelivery,
        notes: formData.notes,
        items: items.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
        }))
      };

      const resultAction = await dispatch(createPurchaseOrder(payload));
      
      if (createPurchaseOrder.fulfilled.match(resultAction)) {
        toast.success('Purchase Order created successfully!');
        navigateTo('/supply-chain/purchase-orders');
      } else {
        toast.error('Failed to create Purchase Order');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: '', rate: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Purchase Orders', path: '/supply-chain/purchase-orders' },
          { label: isEdit ? 'Edit Purchase Order' : 'Add New Purchase Order' },
        ]}
      />

      <ResponsivePageHeader title={isEdit ? 'Edit Purchase Order' : 'Add New Purchase Order'} />

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigateTo('/supply-chain/purchase-orders')}
            className="mb-6 flex items-center gap-2 text-[#0A6659] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Purchase Orders
          </button>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#262C3633] p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#262C36] mb-4">PO Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Vendor <span className="text-[#F56565]">*</span>
                  </label>
                  <select
                    required
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl bg-white"
                  >
                    <option value="">Select vendor</option>
                    {vendors?.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>{vendor.vendorName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Expected Delivery Date <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expectedDelivery}
                    onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#262C36]">Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 text-[#0A6659] border border-[#0A6659] rounded-xl hover:bg-[#0A6659]/5"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-3 bg-[#F7F7F7] rounded-lg relative">
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-sm font-medium text-[#262C36] mb-2">Product</label>
                      <select
                        required
                        value={item.productId}
                        onChange={(e) => updateItem(index, 'productId', e.target.value)}
                        className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl bg-white"
                      >
                        <option value="">Select product</option>
                        {products?.map(prod => (
                          <option key={prod.id} value={prod.id}>{prod.productName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-sm font-medium text-[#262C36] mb-2">Qty</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl bg-white"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-sm font-medium text-[#262C36] mb-2">Rate</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', e.target.value)}
                        className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl bg-white"
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-10 md:col-span-2">
                      <label className="block text-sm font-medium text-[#262C36] mb-2">Amount</label>
                      <div className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl bg-white flex items-center">
                        ₹{(Number(item.quantity || 0) * Number(item.rate || 0)).toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                        className="w-full h-[44px] flex items-center justify-center text-[#F56565] hover:bg-[#FEF2F2] rounded-xl disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262C36] mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-[#262C3633] rounded-xl resize-none"
                rows={4}
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => navigateTo('/supply-chain/purchase-orders')}
                className="h-[44px] px-6 border border-[#262C3633] text-[#262C36] rounded-xl hover:bg-[#F7F7F7] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isEdit ? 'Update Purchase Order' : 'Save Purchase Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
