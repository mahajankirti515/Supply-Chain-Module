import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Eye, XCircle } from 'lucide-react';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { Breadcrumb } from '../../components/Breadcrumb';
import { FilterButtonDropdown } from '../../components/FilterButtonDropdown';
import { ExportButtonDropdown } from '../../components/ExportButtonDropdown';
import { ImportButtonDropdown } from '../../components/ImportButtonDropdown';
import { exportTableToCSV } from '../../utils/csvUtils';
import { useResponsive } from '../../design-system/useResponsive';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPurchaseOrders } from '../../store/slices/purchaseOrderSlice';

export function PurchaseOrdersListing() {
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const { purchaseOrders, loading, total, page, totalPages } = useAppSelector((state) => state.purchaseOrders);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Load purchase orders on component mount and when filters change
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== 'all') params.status = statusFilter;

    dispatch(fetchPurchaseOrders(params));
  }, [dispatch, currentPage, pageSize, searchQuery, statusFilter]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  // Transform data for table display
  const transformedData = Array.isArray(purchaseOrders) ? purchaseOrders.map(po => ({
    id: po.poCode,
    vendor: po.vendor?.vendorName || 'N/A',
    totalItems: po.totalItems,
    totalAmount: `₹${Number(po.totalAmount).toLocaleString('en-IN')}`,
    expectedDelivery: new Date(po.expectedDelivery).toLocaleDateString('en-GB'),
    status: po.status.charAt(0).toUpperCase() + po.status.slice(1),
    originalId: po.id,
  })) : [];

  // Filter data locally for vendor (since backend doesn't support it yet)
  const getFilteredData = () => {
    let filtered = [...transformedData];

    if (vendorFilter !== 'all') {
      filtered = filtered.filter(po => 
        po.vendor.toLowerCase().includes(vendorFilter.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      exportTableToCSV(filteredData, 'purchase-orders.csv');
    }
  };

  const handleImport = (file: File) => {
    console.log('Importing file:', file.name);
  };

  const handleRowClick = (row: any) => {
    // Use originalId if available, otherwise use id
    const poId = row.originalId || row.id;
    navigateTo(`/supply-chain/purchase-orders/${poId}`);
  };

  const columns: TableColumn[] = [
    { key: 'id', label: 'PO Number', priority: 1 },
    { key: 'vendor', label: 'Vendor', priority: 2 },
    { key: 'totalItems', label: 'Total Items', hiddenOn: ['mobile'] },
    { key: 'totalAmount', label: 'Total Amount', priority: 3 },
    { key: 'expectedDelivery', label: 'Expected Delivery', hiddenOn: ['mobile'] },
    {
      key: 'status',
      label: 'Status',
      priority: 4,
      renderCell: (row) => (
        <span
          className={`status-badge ${
            row.status === 'Received'
              ? 'status-success'
              : row.status === 'Sent'
              ? 'status-info'
              : row.status === 'Draft'
              ? 'status-warning'
              : 'status-danger'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: 5,
      renderCell: (row) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(showActionMenu === row.id ? null : row.id);
            }}
            className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#718096]" />
          </button>
          {showActionMenu === row.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const poId = row.originalId || row.id;
                  navigateTo(`/supply-chain/purchase-orders/${poId}`);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const poId = row.originalId || row.id;
                  navigateTo(`/supply-chain/purchase-orders/edit/${poId}`);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit PO
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#F56565] hover:bg-[#FEF2F2] flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Cancel PO
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Purchase Orders' },
        ]}
      />

      <ResponsivePageHeader title="Purchase Orders" />

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-[#262C3633] p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3 mb-4`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <input
                type="text"
                placeholder="Search purchase orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-[#262C3633] rounded-xl text-[#262C36] placeholder:text-[#718096]"
              />
            </div>

            <FilterButtonDropdown
              filters={[
                {
                  id: 'status',
                  label: 'Status',
                  options: [
                    { label: 'All Status', value: 'all' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Sent', value: 'sent' },
                    { label: 'Received', value: 'received' },
                    { label: 'Cancelled', value: 'cancelled' },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
                {
                  id: 'vendor',
                  label: 'Vendor',
                  options: [
                    { label: 'All Vendors', value: 'all' },
                    { label: 'SportsPro', value: 'sportspro' },
                    { label: 'FitGear', value: 'fitgear' },
                    { label: 'Aqua Sports', value: 'aqua sports' },
                  ],
                  value: vendorFilter,
                  onChange: setVendorFilter,
                },
              ]}
              onClear={() => {
                setStatusFilter('all');
                setVendorFilter('all');
              }}
            />

            <ExportButtonDropdown onExport={handleExport} />
            <ImportButtonDropdown onImport={handleImport} />

            <button
              onClick={() => navigateTo('/supply-chain/purchase-orders/add')}
              className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add New PO
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
                <p className="text-[#718096]">Loading purchase orders...</p>
              </div>
            </div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={filteredData}
              currentPage={currentPage}
              totalPages={totalPages || Math.ceil(filteredData.length / pageSize)}
              onPageChange={setCurrentPage}
              onRowClick={handleRowClick}
            />
          )}

          <div className="mt-4 pt-4 border-t border-[#262C3633]">
            <p className="text-sm text-[#718096]">
              Showing <strong className="text-[#262C36]">{filteredData.length}</strong> of{' '}
              <strong className="text-[#262C36]">{total || purchaseOrders.length}</strong> purchase orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
