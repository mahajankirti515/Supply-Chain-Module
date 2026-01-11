import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { Breadcrumb } from '../../components/Breadcrumb';
import { FilterButtonDropdown } from '../../components/FilterButtonDropdown';
import { ExportButtonDropdown } from '../../components/ExportButtonDropdown';
import { ImportButtonDropdown } from '../../components/ImportButtonDropdown';
import { exportTableToCSV } from '../../utils/csvUtils';
import { useResponsive } from '../../design-system/useResponsive';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchVendors, deleteVendor, updateVendorStatus } from '../../store/slices/vendorSlice';

export function VendorsListing() {
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const { vendors, loading, total, page, totalPages } = useAppSelector((state) => state.vendors);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Load vendors on component mount and when filters change
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== 'all') params.status = statusFilter;

    dispatch(fetchVendors(params));
  }, [dispatch, currentPage, pageSize, searchQuery, statusFilter]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  // Filter data locally for category (since backend doesn't support it yet)
  const getFilteredData = () => {
    if (!Array.isArray(vendors)) return [];
    let filtered = [...vendors];

    // Apply category filter locally
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(v => 
        v.categories?.some((cat: string) => 
          cat.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      const exportData = filteredData.map(vendor => ({
        'Vendor ID': vendor.vendorCode,
        'Vendor Name': vendor.vendorName,
        'Contact Person': vendor.contactPerson,
        'Phone': vendor.phone,
        'Email': vendor.email,
        'Categories': vendor.categories.join(', '),
        'Status': vendor.status,
      }));
      exportTableToCSV(exportData, 'vendors.csv');
    }
  };

  const handleImport = (file: File) => {
    console.log('Importing file:', file.name);
    // Implement import logic
  };

  const handleRowClick = (row: any) => {
    navigateTo(`/supply-chain/vendors/${row.id}`);
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await dispatch(deleteVendor(vendorId)).unwrap();
        // Refresh the list
        dispatch(fetchVendors({ page: currentPage, limit: pageSize }));
      } catch (error) {
        console.error('Error deleting vendor:', error);
      }
    }
  };

  const handleStatusToggle = async (vendorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await dispatch(updateVendorStatus({ id: vendorId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Error updating vendor status:', error);
    }
  };

  const columns: TableColumn[] = [
    { key: 'vendorCode', label: 'Vendor ID', priority: 1 },
    { key: 'vendorName', label: 'Vendor Name', priority: 2 },
    { key: 'contactPerson', label: 'Contact Person', hiddenOn: ['mobile'] },
    { key: 'phone', label: 'Phone', hiddenOn: ['mobile', 'tablet'] },
    { key: 'email', label: 'Email', hiddenOn: ['mobile'] },
    {
      key: 'categories',
      label: 'Linked Categories',
      hiddenOn: ['mobile', 'tablet'],
      renderCell: (row) => (
        <span className="text-sm text-[#262C36]">
          {row.categories.join(', ')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      priority: 3,
      renderCell: (row) => (
        <span
          className={`status-badge ${
            row.status === 'active' ? 'status-success' : 'status-danger'
          }`}
        >
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      priority: 4,
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
                  navigateTo(`/supply-chain/vendors/${row.id}`);
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
                  navigateTo(`/supply-chain/vendors/edit/${row.id}`);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Vendor
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteVendor(row.id);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#F56565] hover:bg-[#FEF2F2] flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Vendor
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
          { label: 'Vendors' },
        ]}
      />

      <ResponsivePageHeader title="Vendors" />

      <div className="p-6 space-y-6">
        {/* Filters and Actions */}
        <div className="bg-white rounded-xl border border-[#262C3633] p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3 mb-4`}>
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-[#262C3633] rounded-xl text-[#262C36] placeholder:text-[#718096]"
              />
            </div>

            {/* Filter Dropdown */}
            <FilterButtonDropdown
              filters={[
                {
                  id: 'status',
                  label: 'Status',
                  options: [
                    { label: 'All Status', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
                {
                  id: 'category',
                  label: 'Category',
                  options: [
                    { label: 'All Categories', value: 'all' },
                    { label: 'Sports Equipment', value: 'sports equipment' },
                    { label: 'Apparel', value: 'apparel' },
                    { label: 'Gym Equipment', value: 'gym equipment' },
                    { label: 'Safety Equipment', value: 'safety equipment' },
                  ],
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                },
              ]}
              onClear={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
            />

            {/* Export Dropdown */}
            <ExportButtonDropdown onExport={handleExport} />

            {/* Import Dropdown */}
            <ImportButtonDropdown onImport={handleImport} />

            {/* Add New Vendor Button */}
            <button
              onClick={() => navigateTo('/supply-chain/vendors/add')}
              className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add New Vendor
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
                <p className="text-[#718096]">Loading vendors...</p>
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

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-[#262C3633]">
            <p className="text-sm text-[#718096]">
              Showing <strong className="text-[#262C36]">{filteredData?.length || 0}</strong> of{' '}
              <strong className="text-[#262C36]">{total || 0}</strong> vendors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
