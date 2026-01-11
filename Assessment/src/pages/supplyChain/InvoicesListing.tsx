import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Eye } from 'lucide-react';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { Breadcrumb } from '../../components/Breadcrumb';
import { FilterButtonDropdown } from '../../components/FilterButtonDropdown';
import { ExportButtonDropdown } from '../../components/ExportButtonDropdown';
import { ImportButtonDropdown } from '../../components/ImportButtonDropdown';
import { exportTableToCSV } from '../../utils/csvUtils';
import { useResponsive } from '../../design-system/useResponsive';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchInvoices } from '../../store/slices/invoiceSlice';

export function InvoicesListing() {
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const { invoices, loading, total, page, totalPages } = useAppSelector((state) => state.invoices);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Load invoices on component mount and when filters change
  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: pageSize,
    };

    if (searchQuery) params.search = searchQuery;
    if (statusFilter !== 'all') params.paymentStatus = statusFilter;

    dispatch(fetchInvoices(params));
  }, [dispatch, currentPage, pageSize, searchQuery, statusFilter]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  // Transform data for table display
  const transformedData = Array.isArray(invoices) ? invoices.map(inv => ({
    id: inv.invoiceNumber,
    vendor: inv.vendor?.vendorName || 'N/A',
    poReference: inv.poReference || 'N/A',
    invoiceDate: new Date(inv.invoiceDate).toLocaleDateString('en-GB'),
    amount: `₹${Number(inv.amount).toLocaleString('en-IN')}`,
    paymentStatus: inv.paymentStatus?.charAt(0).toUpperCase() + inv.paymentStatus?.slice(1) || 'N/A',
    originalId: inv.id,
  })) : [];

  const filteredData = transformedData;

  const columns: TableColumn[] = [
    { key: 'id', label: 'Invoice Number', priority: 1 },
    { key: 'vendor', label: 'Vendor', priority: 2 },
    { key: 'poReference', label: 'PO Reference', hiddenOn: ['mobile'] },
    { key: 'invoiceDate', label: 'Invoice Date', hiddenOn: ['mobile'] },
    { key: 'amount', label: 'Amount', priority: 3 },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      priority: 4,
      renderCell: (row) => (
        <span className={`status-badge ${row.paymentStatus === 'Paid' ? 'status-success' : 'status-warning'}`}>
          {row.paymentStatus}
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
            className="p-2 hover:bg-[#F7F7F7] rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-[#718096]" />
          </button>
          {showActionMenu === row.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const invId = row.originalId || row.id;
                  navigateTo(`/supply-chain/invoices/${invId}`);
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
                  const invId = row.originalId || row.id;
                  navigateTo(`/supply-chain/invoices/edit/${invId}`);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Invoice
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
          { label: 'Invoices' },
        ]}
      />

      <ResponsivePageHeader title="Invoices" />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-[#262C3633] p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3 mb-4`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <input
                type="text"
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-[#262C3633] rounded-xl"
              />
            </div>

            <FilterButtonDropdown
              filters={[
                {
                  id: 'status',
                  label: 'Payment Status',
                  options: [
                    { label: 'All Status', value: 'all' },
                    { label: 'Paid', value: 'paid' },
                    { label: 'Pending', value: 'pending' },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
              onClear={() => setStatusFilter('all')}
            />

            <ExportButtonDropdown onExport={(format) => exportTableToCSV(filteredData, 'invoices.csv')} />
            <ImportButtonDropdown onImport={(file) => console.log(file)} />

            <button
              onClick={() => navigateTo('/supply-chain/invoices/add')}
              className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Invoice
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
                <p className="text-[#718096]">Loading invoices...</p>
              </div>
            </div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={filteredData}
              currentPage={currentPage}
              totalPages={totalPages || Math.ceil(filteredData.length / pageSize)}
              onPageChange={setCurrentPage}
              onRowClick={(row) => {
                const invId = row.originalId || row.id;
                navigateTo(`/supply-chain/invoices/${invId}`);
              }}
            />
          )}

          <div className="mt-4 pt-4 border-t border-[#262C3633]">
            <p className="text-sm text-[#718096]">
              Showing <strong className="text-[#262C36]">{filteredData?.length || 0}</strong> of{' '}
              <strong className="text-[#262C36]">{total || 0}</strong> invoices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
