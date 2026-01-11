import React, { useState } from 'react';
import { ArrowLeft, Edit, Package, TrendingUp } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';

interface ProductDetailProps {
  productId?: string;
}

export function ProductDetail({ productId = 'PRD001' }: ProductDetailProps) {
  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const product = {
    id: 'PRD001',
    name: 'Cricket Bat - Professional',
    category: 'Sports Equipment',
    unit: 'Piece',
    sport: 'Cricket',
    facility: 'Cricket Ground',
    currentStock: 25,
    minStock: 10,
    status: 'In Stock',
    notes: 'Premium quality willow bat for professional matches',
  };

  const vendors = [
    { id: 'VEN001', name: 'SportsPro Equipment Ltd.', contact: 'Rajesh Kumar', lastSupply: '2024-11-20' },
    { id: 'VEN002', name: 'Premier Sports Solutions', contact: 'Vikram Singh', lastSupply: '2024-10-15' },
  ];

  const purchaseHistory = [
    { id: 'PO001', date: '2024-11-20', vendor: 'SportsPro Equipment Ltd.', quantity: 15, amount: '₹22,500' },
    { id: 'PO002', date: '2024-10-15', vendor: 'Premier Sports Solutions', quantity: 10, amount: '₹15,000' },
  ];

  const vendorColumns: TableColumn[] = [
    { key: 'id', label: 'Vendor ID', priority: 1 },
    { key: 'name', label: 'Vendor Name', priority: 2 },
    { key: 'contact', label: 'Contact', hiddenOn: ['mobile'] },
    { key: 'lastSupply', label: 'Last Supply', priority: 3 },
  ];

  const historyColumns: TableColumn[] = [
    { key: 'id', label: 'PO Number', priority: 1 },
    { key: 'date', label: 'Date', priority: 2 },
    { key: 'vendor', label: 'Vendor', hiddenOn: ['mobile'] },
    { key: 'quantity', label: 'Quantity', priority: 3 },
    { key: 'amount', label: 'Amount', priority: 4 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Products', path: '/supply-chain/products' },
          { label: product.name },
        ]}
      />

      <ResponsivePageHeader title={`Product Details - ${product.id}`} />

      <div className="p-6 space-y-6">
        <button
          onClick={() => navigateTo('/supply-chain/products')}
          className="flex items-center gap-2 text-[#0A6659] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#262C36] mb-2">{product.name}</h2>
              <div className="flex items-center gap-3">
                <span className={`status-badge ${product.status === 'In Stock' ? 'status-success' : 'status-danger'}`}>
                  {product.status}
                </span>
                <span className="text-sm text-[#718096]">Product ID: {product.id}</span>
              </div>
            </div>
            <button
              onClick={() => navigateTo(`/supply-chain/products/edit/${product.id}`)}
              className="h-[44px] px-6 border border-[#0A6659] text-[#0A6659] rounded-xl hover:bg-[#0A6659]/5 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#0A6659]/5 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-[#0A6659]" />
                <p className="text-sm text-[#718096]">Current Stock</p>
              </div>
              <p className="text-3xl font-bold text-[#0A6659]">{product.currentStock}</p>
              <p className="text-xs text-[#718096] mt-1">Min Stock: {product.minStock}</p>
            </div>

            <div>
              <p className="text-xs text-[#718096] mb-1">Category</p>
              <p className="text-sm font-medium text-[#262C36] mb-3">{product.category}</p>
              <p className="text-xs text-[#718096] mb-1">Unit</p>
              <p className="text-sm font-medium text-[#262C36]">{product.unit}</p>
            </div>

            <div>
              <p className="text-xs text-[#718096] mb-1">Linked Sport</p>
              <p className="text-sm font-medium text-[#262C36] mb-3">{product.sport}</p>
              <p className="text-xs text-[#718096] mb-1">Linked Facility</p>
              <p className="text-sm font-medium text-[#262C36]">{product.facility}</p>
            </div>
          </div>

          {product.notes && (
            <div className="mt-4 p-3 bg-[#F7F7F7] rounded-lg">
              <p className="text-xs text-[#718096] mb-1">Notes</p>
              <p className="text-sm text-[#262C36]">{product.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h3 className="font-semibold text-[#262C36] mb-4">Vendor List</h3>
          <ResponsiveTable
            columns={vendorColumns}
            data={vendors}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            onRowClick={(row) => navigateTo(`/supply-chain/vendors/${row.id}`)}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h3 className="font-semibold text-[#262C36] mb-4">Purchase History</h3>
          <ResponsiveTable
            columns={historyColumns}
            data={purchaseHistory}
            currentPage={1}
            totalPages={1}
            onPageChange={() => {}}
            onRowClick={(row) => navigateTo(`/supply-chain/purchase-orders/${row.id}`)}
          />
        </div>
      </div>
    </div>
  );
}