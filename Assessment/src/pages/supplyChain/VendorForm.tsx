import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createVendor, updateVendor, fetchVendorById, clearCurrentVendor } from '../../store/slices/vendorSlice';
import { CreateVendorRequest } from '../../api/vendorApi';

interface VendorFormProps {
  vendorId?: string;
  isEdit?: boolean;
}

export function VendorForm({ vendorId, isEdit = false }: VendorFormProps) {
  const dispatch = useAppDispatch();
  const { currentVendor, loading } = useAppSelector((state) => state.vendors);
  
  const [formData, setFormData] = useState({
    vendorName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    gst: '',
    categories: [] as string[],
    status: 'active' as 'active' | 'inactive',
  });

  // Load vendor data for edit mode
  useEffect(() => {
    if (isEdit && vendorId) {
      dispatch(fetchVendorById(vendorId));
    }
    return () => {
      dispatch(clearCurrentVendor());
    };
  }, [dispatch, isEdit, vendorId]);

  // Populate form when vendor data is loaded
  useEffect(() => {
    if (currentVendor && isEdit) {
      setFormData({
        vendorName: currentVendor.vendorName,
        contactPerson: currentVendor.contactPerson,
        phone: currentVendor.phone,
        email: currentVendor.email,
        address: currentVendor.address || '',
        gst: currentVendor.gst || '',
        categories: currentVendor.categories,
        status: currentVendor.status,
      });
    }
  }, [currentVendor, isEdit]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', formData);
    
    try {
      if (isEdit && vendorId) {
        await dispatch(updateVendor({ id: vendorId, data: formData })).unwrap();
        navigateTo(`/supply-chain/vendors/${vendorId}`);
      } else {
        const result = await dispatch(createVendor(formData as CreateVendorRequest)).unwrap();
        navigateTo(`/supply-chain/vendors/${result.id}`);
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      // Handle error (show toast, etc.)
    }
  };

  const categoryOptions = [
    'Sports Equipment',
    'Apparel', 
    'Gym Equipment',
    'Swimming Gear',
    'Accessories',
    'Safety Equipment',
    'Maintenance',
  ];

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
          <p className="text-[#262C36]">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Vendors', path: '/supply-chain/vendors' },
          { label: isEdit ? 'Edit Vendor' : 'Add New Vendor' },
        ]}
      />

      <ResponsivePageHeader title={isEdit ? 'Edit Vendor' : 'Add New Vendor'} />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigateTo('/supply-chain/vendors')}
            className="mb-6 flex items-center gap-2 text-[#0A6659] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Vendors
          </button>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#262C3633] p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-[#262C36] mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Vendor Name <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="Enter vendor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Contact Person <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="Enter contact person name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Phone <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Email <span className="text-[#F56565]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="vendor@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-[#262C3633] rounded-xl resize-none"
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    GST / Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                    placeholder="Enter GST number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#262C36] mb-2">
                    Status <span className="text-[#F56565]">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full h-[44px] px-4 border border-[#262C3633] rounded-xl"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold text-[#262C36] mb-4">Categories Supplied</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categoryOptions.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            categories: [...formData.categories, category],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            categories: formData.categories.filter((c) => c !== category),
                          });
                        }
                      }}
                      className="w-4 h-4 text-[#0A6659] border-[#262C3633] rounded"
                    />
                    <span className="text-sm text-[#262C36]">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={() => navigateTo('/supply-chain/vendors')}
                className="h-[44px] px-6 border border-[#262C3633] text-[#262C36] rounded-xl hover:bg-[#F7F7F7] transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading ? 'Saving...' : (isEdit ? 'Update Vendor' : 'Save Vendor')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
