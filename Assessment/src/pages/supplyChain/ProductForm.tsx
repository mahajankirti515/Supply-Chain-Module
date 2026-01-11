import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';

interface ProductFormProps {
  productId?: string;
  isEdit?: boolean;
}

export function ProductForm({ productId, isEdit = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    unit: 'Piece',
    sport: '',
    facility: '',
    minStock: '',
    notes: '',
  });

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(`/supply-chain/products/${productId || 'PRD006'}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Products', path: '/supply-chain/products' },
          { label: isEdit ? 'Edit Product' : 'Add New Product' },
        ]}
      />

      <ResponsivePageHeader title={isEdit ? 'Edit Product' : 'Add New Product'} />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigateTo('/supply-chain/products')}
            className="mb-6 flex items-center gap-2 text-[#0A6659] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#262C3633] p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[#262C36] mb-4">Product Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Product Name <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Category <span className="text-[#F56565]">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                  >
                    <option value="">Select category</option>
                    <option value="Sports Equipment">Sports Equipment</option>
                    <option value="Gym Equipment">Gym Equipment</option>
                    <option value="Swimming Gear">Swimming Gear</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Safety Equipment">Safety Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Unit <span className="text-[#F56565]">*</span>
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                  >
                    <option value="Piece">Piece</option>
                    <option value="Dozen">Dozen</option>
                    <option value="Set">Set</option>
                    <option value="Kg">Kg</option>
                    <option value="Liter">Liter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Linked Sport
                  </label>
                  <select
                    value={formData.sport}
                    onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                  >
                    <option value="">None</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Football">Football</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Linked Facility
                  </label>
                  <select
                    value={formData.facility}
                    onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                  >
                    <option value="">None</option>
                    <option value="Cricket Ground">Cricket Ground</option>
                    <option value="Football Field">Football Field</option>
                    <option value="Tennis Court">Tennis Court</option>
                    <option value="Swimming Pool">Swimming Pool</option>
                    <option value="Gym">Gym</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Minimum Stock <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="Enter minimum stock"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#262C36] mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-[#262C3633] rounded-xl resize-none"
                    rows={4}
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => navigateTo('/supply-chain/products')}
                className="h-[44px] px-6 border border-[#262C3633] text-[#262C36] rounded-xl hover:bg-[#F7F7F7] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isEdit ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
