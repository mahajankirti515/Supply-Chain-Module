import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Eye } from 'lucide-react';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { Breadcrumb } from '../../components/Breadcrumb';
import { FilterButtonDropdown } from '../../components/FilterButtonDropdown';
import { ExportButtonDropdown } from '../../components/ExportButtonDropdown';
import { exportTableToCSV } from '../../utils/csvUtils';
import { useResponsive } from '../../design-system/useResponsive';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchGoodsReceipts } from '../../store/slices/goodsReceiptSlice';

export function GoodsReceiptListing() {
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const { goodsReceipts, loading, total } = useAppSelector((state) => state.goodsReceipts);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchGoodsReceipts());
  }, [dispatch]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const transformData = () => {
    return goodsReceipts.map(grn => ({
      id: grn.grnCode,
      poReference: grn.purchaseOrder?.poCode || 'N/A',
      vendor: grn.vendor?.vendorName || 'N/A',
      receivedDate: new Date(grn.receivedDate).toLocaleDateString('en-GB'),
      status: grn.status.charAt(0).toUpperCase() + grn.status.slice(1),
      originalId: grn.id
    }));
  };

  const getFilteredData = () => {
    let transformed = transformData();
    if (statusFilter !== 'all') {
      transformed = transformed.filter(g => g.status.toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchQuery) {
      transformed = transformed.filter(g =>
        g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.poReference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.vendor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return transformed;
  };

  const filteredData = getFilteredData();

  const columns: TableColumn[] = [
    { key: 'id', label: 'GRN ID', priority: 1 },
    { key: 'poReference', label: 'PO Reference', priority: 2 },
    { key: 'vendor', label: 'Vendor', hiddenOn: ['mobile'] },
    { key: 'receivedDate', label: 'Received Date', priority: 3 },
    {
      key: 'status',
      label: 'Status',
      priority: 4,
      renderCell: (row) => (
        <span className={`status-badge ${row.status === 'Confirmed' ? 'status-success' : 'status-warning'}`}>
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
            className="p-2 hover:bg-[#F7F7F7] rounded-lg"
          >
            <MoreVertical className="w-4 h-4 text-[#718096]" />
          </button>
          {showActionMenu === row.id && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(`/supply-chain/goods-receipt/${row.originalId}`);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
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
          { label: 'Goods Receipt' },
        ]}
      />

      <ResponsivePageHeader title="Goods Receipt (GRN)" />

      <div className="p-6">
        <div className="bg-white rounded-xl border border-[#262C3633] p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3 mb-4`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <input
                type="text"
                placeholder="Search GRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-[#262C3633] rounded-xl"
              />
            </div>

            <FilterButtonDropdown
              filters={[
                {
                  id: 'status',
                  label: 'Status',
                  options: [
                    { label: 'All Status', value: 'all' },
                    { label: 'Confirmed', value: 'confirmed' },
                    { label: 'Pending', value: 'pending' },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
              onClear={() => setStatusFilter('all')}
            />

            <ExportButtonDropdown onExport={(format) => exportTableToCSV(filteredData, 'grn.csv')} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
                <p className="text-[#718096]">Loading GRN records...</p>
              </div>
            </div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={filteredData}
              currentPage={currentPage}
              totalPages={Math.ceil(filteredData.length / pageSize)}
              onPageChange={setCurrentPage}
              onRowClick={(row) => navigateTo(`/supply-chain/goods-receipt/${row.originalId}`)}
            />
          )}

          <div className="mt-4 pt-4 border-t border-[#262C3633]">
            <p className="text-sm text-[#718096]">
              Showing <strong className="text-[#262C36]">{filteredData.length}</strong> of{' '}
              <strong className="text-[#262C36]">{total || goodsReceipts.length}</strong> GRN records
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
