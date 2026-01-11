import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Package, ShoppingCart, FileCheck } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchVendorById, clearCurrentVendor } from '../../store/slices/vendorSlice';

interface VendorDetailProps {
  vendorId?: string;
}

export function VendorDetail({ vendorId = 'VEN001' }: VendorDetailProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'invoices'>('products');
  const dispatch = useAppDispatch();
  const { currentVendor, loading } = useAppSelector((state) => state.vendors);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorById(vendorId));
    }
    return () => {
      dispatch(clearCurrentVendor());
    };
  }, [dispatch, vendorId]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
          <p className="text-[#262C36]">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!currentVendor) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#262C36] mb-4">Vendor not found</p>
          <button
            onClick={() => navigateTo('/supply-chain/vendors')}
            className="text-[#0A6659] hover:underline"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  const vendor = currentVendor;

  // Mock products
  const products = [
    { id: 'PRD001', name: 'Cricket Bat - Professional', category: 'Sports Equipment', unit: 'Piece', quantity: 25 },
    { id: 'PRD002', name: 'Cricket Ball - Leather', category: 'Sports Equipment', unit: 'Dozen', quantity: 50 },
    { id: 'PRD003', name: 'Team Jersey - Cricket', category: 'Apparel', unit: 'Piece', quantity: 100 },
  ];

  // Mock purchase orders
  const purchaseOrders = [
    { id: 'PO001', date: '2024-11-20', items: 5, amount: '₹45,000', status: 'Received' },
    { id: 'PO002', date: '2024-11-15', items: 3, amount: '₹28,500', status: 'Sent' },
    { id: 'PO003', date: '2024-11-10', items: 8, amount: '₹67,200', status: 'Received' },
  ];

  // Mock invoices
  const invoices = [
    { id: 'INV001', poRef: 'PO001', date: '2024-11-21', amount: '₹45,000', status: 'Paid' },
    { id: 'INV002', poRef: 'PO002', date: '2024-11-16', amount: '₹28,500', status: 'Pending' },
  ];

  const productColumns: TableColumn[] = [
    { key: 'id', label: 'Product ID', priority: 1 },
    { key: 'name', label: 'Product Name', priority: 2 },
    { key: 'category', label: 'Category', hiddenOn: ['mobile'] },
    { key: 'unit', label: 'Unit', hiddenOn: ['mobile'] },
    { key: 'quantity', label: 'Quantity Supplied', priority: 3 },
  ];

  const orderColumns: TableColumn[] = [
    { key: 'id', label: 'PO Number', priority: 1 },
    { key: 'date', label: 'Date', priority: 2 },
    { key: 'items', label: 'Items', hiddenOn: ['mobile'] },
    { key: 'amount', label: 'Amount', priority: 3 },
    {
      key: 'status',
      label: 'Status',
      priority: 4,
      renderCell: (row) => (
        <span className={`status-badge ${row.status === 'Received' ? 'status-success' : 'status-info'}`}>
          {row.status}
        </span>
      ),
    },
  ];

  const invoiceColumns: TableColumn[] = [
    { key: 'id', label: 'Invoice Number', priority: 1 },
    { key: 'poRef', label: 'PO Reference', priority: 2 },
    { key: 'date', label: 'Date', hiddenOn: ['mobile'] },
    { key: 'amount', label: 'Amount', priority: 3 },
    {
      key: 'status',
      label: 'Status',
      priority: 4,
      renderCell: (row) => (
        <span className={`status-badge ${row.status === 'Paid' ? 'status-success' : 'status-warning'}`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Vendors', path: '/supply-chain/vendors' },
          { label: vendor.vendorName },
        ]}
      />

      <ResponsivePageHeader title={`Vendor Details - ${vendor.vendorCode}`} />

      <div className="p-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigateTo('/supply-chain/vendors')}
          className="flex items-center gap-2 text-[#0A6659] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Vendors
        </button>

        {/* Vendor Overview Card */}
        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#262C36] mb-2">{vendor.vendorName}</h2>
              <div className="flex items-center gap-3">
                <span className={`status-badge ${vendor.status === 'active' ? 'status-success' : 'status-danger'}`}>
                  {vendor.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-[#718096]">Vendor ID: {vendor.vendorCode}</span>
              </div>
            </div>
            <button
              onClick={() => navigateTo(`/supply-chain/vendors/edit/${vendor.id}`)}
              className="h-[44px] px-6 border border-[#0A6659] text-[#0A6659] rounded-xl hover:bg-[#0A6659]/5 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Vendor
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-[#262C36] mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#718096]" />
                  <div>
                    <p className="text-xs text-[#718096]">Phone</p>
                    <p className="text-sm text-[#262C36]">{vendor.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#718096]" />
                  <div>
                    <p className="text-xs text-[#718096]">Email</p>
                    <p className="text-sm text-[#262C36]">{vendor.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#718096] mt-1" />
                  <div>
                    <p className="text-xs text-[#718096]">Address</p>
                    <p className="text-sm text-[#262C36]">{vendor.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="font-semibold text-[#262C36] mb-3">Business Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-[#718096]">Contact Person</p>
                  <p className="text-sm text-[#262C36]">{vendor.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-[#718096]">GST / Tax ID</p>
                  <p className="text-sm text-[#262C36]">{vendor.gst || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-[#718096]">Registered Since</p>
                  <p className="text-sm text-[#262C36]">{new Date(vendor.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-[#262C36] mb-3">Categories Supplied</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.categories.map((cat) => (
                  <span key={cat} className="px-3 py-1 bg-[#0A6659]/10 text-[#0A6659] text-xs rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-xl border border-[#262C3633] overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-[#E5E7EB]">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'products'
                  ? 'text-[#0A6659] border-b-2 border-[#0A6659] bg-[#0A6659]/5'
                  : 'text-[#718096] hover:text-[#262C36] hover:bg-[#F7F7F7]'
              }`}
            >
              <Package className="w-4 h-4" />
              Supplied Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'orders'
                  ? 'text-[#0A6659] border-b-2 border-[#0A6659] bg-[#0A6659]/5'
                  : 'text-[#718096] hover:text-[#262C36] hover:bg-[#F7F7F7]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'invoices'
                  ? 'text-[#0A6659] border-b-2 border-[#0A6659] bg-[#0A6659]/5'
                  : 'text-[#718096] hover:text-[#262C36] hover:bg-[#F7F7F7]'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Invoice History ({invoices.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'products' && (
              <ResponsiveTable
                columns={productColumns}
                data={products}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
              />
            )}

            {activeTab === 'orders' && (
              <ResponsiveTable
                columns={orderColumns}
                data={purchaseOrders}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                onRowClick={(row) => navigateTo(`/supply-chain/purchase-orders/${row.id}`)}
              />
            )}

            {activeTab === 'invoices' && (
              <ResponsiveTable
                columns={invoiceColumns}
                data={invoices}
                currentPage={1}
                totalPages={1}
                onPageChange={() => {}}
                onRowClick={(row) => navigateTo(`/supply-chain/invoices/${row.id}`)}
              />
            )}
          </div>
        </div>

        {/* Status Control */}
        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <h3 className="font-semibold text-[#262C36] mb-4">Vendor Status Control</h3>
          <div className="flex items-center gap-4">
            <button
              className={`px-6 py-2 rounded-xl transition-colors ${
                vendor.status === 'active'
                  ? 'bg-[#48BB78] text-white'
                  : 'border border-[#48BB78] text-[#48BB78] hover:bg-[#48BB78]/5'
              }`}
            >
              Activate Vendor
            </button>
            <button
              className={`px-6 py-2 rounded-xl transition-colors ${
                vendor.status === 'inactive'
                  ? 'bg-[#F56565] text-white'
                  : 'border border-[#F56565] text-[#F56565] hover:bg-[#F56565]/5'
              }`}
            >
              Deactivate Vendor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Edit, Mail, Phone, MapPin, FileText, Package, ShoppingCart, FileCheck } from 'lucide-react';
// import { Breadcrumb } from '../../components/Breadcrumb';
// import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
// import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
// import { useAppDispatch, useAppSelector } from '../../store/hooks';
// import { fetchVendorById, clearCurrentVendor } from '../../store/slices/vendorSlice';

// interface VendorDetailProps {
//   vendorId?: string;
// }

// export function VendorDetail({ vendorId = 'VEN001' }: VendorDetailProps) {
//   const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'invoices'>('products');
  
//   // Add these lines:
//   const dispatch = useAppDispatch();
//   const { currentVendor, loading } = useAppSelector((state) => state.vendors);

//   useEffect(() => {
//     if (vendorId) {
//       dispatch(fetchVendorById(vendorId));
//     }
//     return () => {
//       dispatch(clearCurrentVendor());
//     };
//   }, [dispatch, vendorId]);


// export function VendorDetail({ vendorId = 'VEN001' }: VendorDetailProps) {
//   const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'invoices'>('products');

//   const navigateTo = (path: string) => {
//     const event = new CustomEvent('navigate', { detail: { path } });
//     window.dispatchEvent(event);
//   };

  
//   // Mock products
//   const products = [
//     { id: 'PRD001', name: 'Cricket Bat - Professional', category: 'Sports Equipment', unit: 'Piece', quantity: 25 },
//     { id: 'PRD002', name: 'Cricket Ball - Leather', category: 'Sports Equipment', unit: 'Dozen', quantity: 50 },
//     { id: 'PRD003', name: 'Team Jersey - Cricket', category: 'Apparel', unit: 'Piece', quantity: 100 },
//   ];

//   // Mock purchase orders
//   const purchaseOrders = [
//     { id: 'PO001', date: '2024-11-20', items: 5, amount: '₹45,000', status: 'Received' },
//     { id: 'PO002', date: '2024-11-15', items: 3, amount: '₹28,500', status: 'Sent' },
//     { id: 'PO003', date: '2024-11-10', items: 8, amount: '₹67,200', status: 'Received' },
//   ];

//   // Mock invoices
//   const invoices = [
//     { id: 'INV001', poRef: 'PO001', date: '2024-11-21', amount: '₹45,000', status: 'Paid' },
//     { id: 'INV002', poRef: 'PO002', date: '2024-11-16', amount: '₹28,500', status: 'Pending' },
//   ];

//   const productColumns: TableColumn[] = [
//     { key: 'id', label: 'Product ID', priority: 1 },
//     { key: 'name', label: 'Product Name', priority: 2 },
//     { key: 'category', label: 'Category', hiddenOn: ['mobile'] },
//     { key: 'unit', label: 'Unit', hiddenOn: ['mobile'] },
//     { key: 'quantity', label: 'Quantity Supplied', priority: 3 },
//   ];

//   const orderColumns: TableColumn[] = [
//     { key: 'id', label: 'PO Number', priority: 1 },
//     { key: 'date', label: 'Date', priority: 2 },
//     { key: 'items', label: 'Items', hiddenOn: ['mobile'] },
//     { key: 'amount', label: 'Amount', priority: 3 },
//     {
//       key: 'status',
//       label: 'Status',
//       priority: 4,
//       renderCell: (row) => (
//         <span className={`status-badge ${row.status === 'Received' ? 'status-success' : 'status-info'}`}>
//           {row.status}
//         </span>
//       ),
//     },
//   ];

//   const invoiceColumns: TableColumn[] = [
//     { key: 'id', label: 'Invoice Number', priority: 1 },
//     { key: 'poRef', label: 'PO Reference', priority: 2 },
//     { key: 'date', label: 'Date', hiddenOn: ['mobile'] },
//     { key: 'amount', label: 'Amount', priority: 3 },
//     {
//       key: 'status',
//       label: 'Status',
//       priority: 4,
//       renderCell: (row) => (
//         <span className={`status-badge ${row.status === 'Paid' ? 'status-success' : 'status-warning'}`}>
//           {row.status}
//         </span>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F7F7F7]">
//       <Breadcrumb
//         items={[
//           { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
//           { label: 'Vendors', path: '/supply-chain/vendors' },
//           { label: vendor.vendorName },
//         ]}
//       />

//       <ResponsivePageHeader title={`Vendor Details - ${vendor.id}`} />

//       <div className="p-6 space-y-6">
//         {/* Back Button */}
//         <button
//           onClick={() => navigateTo('/supply-chain/vendors')}
//           className="flex items-center gap-2 text-[#0A6659] hover:underline"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Vendors
//         </button>

//         {/* Vendor Overview Card */}
//         <div className="bg-white rounded-xl border border-[#262C3633] p-6">
//           <div className="flex items-start justify-between mb-6">
//             <div>
//               <h2 className="text-2xl font-semibold text-[#262C36] mb-2">{vendor.vendorName}</h2>
//               <div className="flex items-center gap-3">
//                 <span className={`status-badge ${vendor.status === 'Active' ? 'status-success' : 'status-danger'}`}>
//                   {vendor.status}
//                 </span>
//                 <span className="text-sm text-[#718096]">Vendor ID: {vendor.id}</span>
//               </div>
//             </div>
//             <button
//               onClick={() => navigateTo(`/supply-chain/vendors/edit/${vendor.id}`)}
//               className="h-[44px] px-6 border border-[#0A6659] text-[#0A6659] rounded-xl hover:bg-[#0A6659]/5 transition-colors flex items-center gap-2"
//             >
//               <Edit className="w-4 h-4" />
//               Edit Vendor
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Contact Information */}
//             <div>
//               <h3 className="font-semibold text-[#262C36] mb-3">Contact Information</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <Phone className="w-4 h-4 text-[#718096]" />
//                   <div>
//                     <p className="text-xs text-[#718096]">Phone</p>
//                     <p className="text-sm text-[#262C36]">{vendor.phone}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <Mail className="w-4 h-4 text-[#718096]" />
//                   <div>
//                     <p className="text-xs text-[#718096]">Email</p>
//                     <p className="text-sm text-[#262C36]">{vendor.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <MapPin className="w-4 h-4 text-[#718096] mt-1" />
//                   <div>
//                     <p className="text-xs text-[#718096]">Address</p>
//                     <p className="text-sm text-[#262C36]">{vendor.address}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Business Information */}
//             <div>
//               <h3 className="font-semibold text-[#262C36] mb-3">Business Information</h3>
//               <div className="space-y-3">
//                 <div>
//                   <p className="text-xs text-[#718096]">Contact Person</p>
//                   <p className="text-sm text-[#262C36]">{vendor.contactPerson}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#718096]">GST / Tax ID</p>
//                   <p className="text-sm text-[#262C36]">{vendor.gstNumber}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs text-[#718096]">Registered Since</p>
//                   <p className="text-sm text-[#262C36]">{vendor.registeredDate}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Categories & Notes */}
//             <div>
//               <h3 className="font-semibold text-[#262C36] mb-3">Categories Supplied</h3>
//               <div className="flex flex-wrap gap-2 mb-4">
//                 {vendor.categories.map((cat) => (
//                   <span key={cat} className="px-3 py-1 bg-[#0A6659]/10 text-[#0A6659] text-xs rounded-full">
//                     {cat}
//                   </span>
//                 ))}
//               </div>
//               {vendor.notes && (
//                 <div className="mt-4">
//                   <p className="text-xs text-[#718096] mb-1">Notes</p>
//                   <p className="text-sm text-[#262C36]">{vendor.notes}</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Tabs Section */}
//         <div className="bg-white rounded-xl border border-[#262C3633] overflow-hidden">
//           {/* Tab Headers */}
//           <div className="flex border-b border-[#E5E7EB]">
//             <button
//               onClick={() => setActiveTab('products')}
//               className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                 activeTab === 'products'
//                   ? 'text-[#0A6659] border-b-2 border-[#0A6659] bg-[#0A6659]/5'
//                   : 'text-[#718096] hover:text-[#262C36] hover:bg-[#F7F7F7]'
//               }`}
//             >
//               <Package className="w-4 h-4" />
//               Supplied Products ({products.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('orders')}
//               className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                 activeTab === 'orders'
//                   ? 'text-[#0A6659] border-b-2 border-[#0A6659] bg-[#0A6659]/5'
//                   : 'text-[#718096] hover:text-[#262C36] hover:bg-[#F7F7F7]'
//               }`}
//             >
//               <ShoppingCart className="w-4 h-4" />
//               Purchase Orders ({purchaseOrders.length})
//             </button>
//             <button
//               onClick={() => setActiveTab('invoices')}
//               className={`flex-1 px-6 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
//                 activeTab === 'invoices'
//                   ? 'text-[#0A6659] border-b-2 border-[#0A6659] bg-[#0A6659]/5'
//                   : 'text-[#718096] hover:text-[#262C36] hover:bg-[#F7F7F7]'
//               }`}
//             >
//               <FileCheck className="w-4 h-4" />
//               Invoice History ({invoices.length})
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="p-6">
//             {activeTab === 'products' && (
//               <ResponsiveTable
//                 columns={productColumns}
//                 data={products}
//                 currentPage={1}
//                 totalPages={1}
//                 onPageChange={() => {}}
//               />
//             )}

//             {activeTab === 'orders' && (
//               <ResponsiveTable
//                 columns={orderColumns}
//                 data={purchaseOrders}
//                 currentPage={1}
//                 totalPages={1}
//                 onPageChange={() => {}}
//                 onRowClick={(row) => navigateTo(`/supply-chain/purchase-orders/${row.id}`)}
//               />
//             )}

//             {activeTab === 'invoices' && (
//               <ResponsiveTable
//                 columns={invoiceColumns}
//                 data={invoices}
//                 currentPage={1}
//                 totalPages={1}
//                 onPageChange={() => {}}
//                 onRowClick={(row) => navigateTo(`/supply-chain/invoices/${row.id}`)}
//               />
//             )}
//           </div>
//         </div>

//         {/* Status Control */}
//         <div className="bg-white rounded-xl border border-[#262C3633] p-6">
//           <h3 className="font-semibold text-[#262C36] mb-4">Vendor Status Control</h3>
//           <div className="flex items-center gap-4">
//             <button
//               className={`px-6 py-2 rounded-xl transition-colors ${
//                 vendor.status === 'Active'
//                   ? 'bg-[#48BB78] text-white'
//                   : 'border border-[#48BB78] text-[#48BB78] hover:bg-[#48BB78]/5'
//               }`}
//             >
//               Activate Vendor
//             </button>
//             <button
//               className={`px-6 py-2 rounded-xl transition-colors ${
//                 vendor.status === 'Inactive'
//                   ? 'bg-[#F56565] text-white'
//                   : 'border border-[#F56565] text-[#F56565] hover:bg-[#F56565]/5'
//               }`}
//             >
//               Deactivate Vendor
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
