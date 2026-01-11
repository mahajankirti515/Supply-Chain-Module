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
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice';

export function ProductsListing() {
  const { isMobile } = useResponsive();
  const dispatch = useAppDispatch();
  const { products, loading, total } = useAppSelector((state) => state.products);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  useEffect(() => {
    const params: any = { page: currentPage, limit: pageSize };
    if (searchQuery) params.search = searchQuery;
    if (categoryFilter !== 'all') params.category = categoryFilter;
    if (sportFilter !== 'all') params.sport = sportFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    
    dispatch(fetchProducts(params));
  }, [dispatch, currentPage, pageSize, searchQuery, categoryFilter, sportFilter, statusFilter]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProduct(id));
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      exportTableToCSV(products, 'products.csv');
    }
  };

  const handleImport = (file: File) => {
    console.log('Importing file:', file.name);
  };

  const handleRowClick = (row: any) => {
    navigateTo(`/supply-chain/products/${row.id}`);
  };

  const columns: TableColumn[] = [
    { key: 'productCode', label: 'Item ID', priority: 1 },
    { key: 'productName', label: 'Item Name', priority: 2 },
    { key: 'category', label: 'Category', hiddenOn: ['mobile'] },
    { key: 'unit', label: 'Unit', hiddenOn: ['mobile', 'tablet'] },
    { key: 'sport', label: 'Linked Sport', hiddenOn: ['mobile'] },
    { key: 'facility', label: 'Linked Facility', hiddenOn: ['mobile', 'tablet'] },
    { key: 'currentStock', label: 'Current Stock', priority: 3 },
    {
      key: 'status',
      label: 'Status',
      priority: 4,
      renderCell: (row) => (
        <span
          className={`status-badge ${
            row.status === 'In Stock'
              ? 'status-success'
              : row.status === 'Low Stock'
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
                  navigateTo(`/supply-chain/products/${row.id}`);
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
                  navigateTo(`/supply-chain/products/edit/${row.id}`);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Product
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row.id);
                  setShowActionMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm text-[#F56565] hover:bg-[#FEF2F2] flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Product
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
          { label: 'Products / Supplies' },
        ]}
      />

      <ResponsivePageHeader title="Products / Supplies" />

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-[#262C3633] p-4">
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3 mb-4`}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[44px] pl-10 pr-4 border border-[#262C3633] rounded-xl text-[#262C36] placeholder:text-[#718096]"
              />
            </div>

            <FilterButtonDropdown
              filters={[
                {
                  id: 'category',
                  label: 'Category',
                  options: [
                    { label: 'All Categories', value: 'all' },
                    { label: 'Sports Equipment', value: 'Sports Equipment' },
                    { label: 'Gym Equipment', value: 'Gym Equipment' },
                    { label: 'Swimming Gear', value: 'Swimming Gear' },
                  ],
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                },
                {
                  id: 'sport',
                  label: 'Sport',
                  options: [
                    { label: 'All Sports', value: 'all' },
                    { label: 'Cricket', value: 'Cricket' },
                    { label: 'Football', value: 'Football' },
                    { label: 'Tennis', value: 'Tennis' },
                    { label: 'Swimming', value: 'Swimming' },
                  ],
                  value: sportFilter,
                  onChange: setSportFilter,
                },
                {
                  id: 'status',
                  label: 'Stock Status',
                  options: [
                    { label: 'All Status', value: 'all' },
                    { label: 'In Stock', value: 'In Stock' },
                    { label: 'Low Stock', value: 'Low Stock' },
                    { label: 'Out of Stock', value: 'Out of Stock' },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
              onClear={() => {
                setCategoryFilter('all');
                setSportFilter('all');
                setStatusFilter('all');
              }}
            />

            <ExportButtonDropdown onExport={handleExport} />
            <ImportButtonDropdown onImport={handleImport} />

            <button
              onClick={() => navigateTo('/supply-chain/products/add')}
              className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-[#718096]">Loading products...</div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={products}
              currentPage={currentPage}
              totalPages={Math.ceil(total / pageSize)}
              onPageChange={setCurrentPage}
              onRowClick={handleRowClick}
            />
          )}

          <div className="mt-4 pt-4 border-t border-[#262C3633]">
            <p className="text-sm text-[#718096]">
              Showing <strong className="text-[#262C36]">{products?.length || 0}</strong> of{' '}
              <strong className="text-[#262C36]">{total || 0}</strong> products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



















// import React, { useState } from 'react';
// import { Search, Plus, MoreVertical, Edit, Eye, Trash2 } from 'lucide-react';
// import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
// import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
// import { Breadcrumb } from '../../components/Breadcrumb';
// import { FilterButtonDropdown } from '../../components/FilterButtonDropdown';
// import { ExportButtonDropdown } from '../../components/ExportButtonDropdown';
// import { ImportButtonDropdown } from '../../components/ImportButtonDropdown';
// import { exportTableToCSV } from '../../utils/csvUtils';
// import { useResponsive } from '../../design-system/useResponsive';

// export function ProductsListing() {
//   const { isMobile } = useResponsive();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [sportFilter, setSportFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

//   const navigateTo = (path: string) => {
//     const event = new CustomEvent('navigate', { detail: { path } });
//     window.dispatchEvent(event);
//   };

//   const products = [
//     {
//       id: 'PRD001',
//       name: 'Cricket Bat - Professional',
//       category: 'Sports Equipment',
//       unit: 'Piece',
//       sport: 'Cricket',
//       facility: 'Cricket Ground',
//       currentStock: 25,
//       minStock: 10,
//       status: 'In Stock',
//     },
//     {
//       id: 'PRD002',
//       name: 'Football - Match Quality',
//       category: 'Sports Equipment',
//       unit: 'Piece',
//       sport: 'Football',
//       facility: 'Football Field',
//       currentStock: 40,
//       minStock: 15,
//       status: 'In Stock',
//     },
//     {
//       id: 'PRD003',
//       name: 'Tennis Racket',
//       category: 'Sports Equipment',
//       unit: 'Piece',
//       sport: 'Tennis',
//       facility: 'Tennis Court',
//       currentStock: 5,
//       minStock: 8,
//       status: 'Low Stock',
//     },
//     {
//       id: 'PRD004',
//       name: 'Swimming Goggles',
//       category: 'Swimming Gear',
//       unit: 'Piece',
//       sport: 'Swimming',
//       facility: 'Swimming Pool',
//       currentStock: 30,
//       minStock: 20,
//       status: 'In Stock',
//     },
//     {
//       id: 'PRD005',
//       name: 'Gym Mat',
//       category: 'Gym Equipment',
//       unit: 'Piece',
//       sport: 'Fitness',
//       facility: 'Gym',
//       currentStock: 0,
//       minStock: 10,
//       status: 'Out of Stock',
//     },
//   ];

//   const getFilteredData = () => {
//     let filtered = [...products];

//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter(p => p.category.toLowerCase().includes(categoryFilter));
//     }

//     if (sportFilter !== 'all') {
//       filtered = filtered.filter(p => p.sport.toLowerCase() === sportFilter);
//     }

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(p => p.status.toLowerCase().replace(' ', '-') === statusFilter);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.id.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered;
//   };

//   const filteredData = getFilteredData();

//   const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
//     if (format === 'csv') {
//       exportTableToCSV(filteredData, 'products.csv');
//     }
//   };

//   const handleImport = (file: File) => {
//     console.log('Importing file:', file.name);
//   };

//   const handleRowClick = (row: any) => {
//     navigateTo(`/supply-chain/products/${row.id}`);
//   };

//   const columns: TableColumn[] = [
//     { key: 'id', label: 'Item ID', priority: 1 },
//     { key: 'name', label: 'Item Name', priority: 2 },
//     { key: 'category', label: 'Category', hiddenOn: ['mobile'] },
//     { key: 'unit', label: 'Unit', hiddenOn: ['mobile', 'tablet'] },
//     { key: 'sport', label: 'Linked Sport', hiddenOn: ['mobile'] },
//     { key: 'facility', label: 'Linked Facility', hiddenOn: ['mobile', 'tablet'] },
//     { key: 'currentStock', label: 'Current Stock', priority: 3 },
//     {
//       key: 'status',
//       label: 'Status',
//       priority: 4,
//       renderCell: (row) => (
//         <span
//           className={`status-badge ${
//             row.status === 'In Stock'
//               ? 'status-success'
//               : row.status === 'Low Stock'
//               ? 'status-warning'
//               : 'status-danger'
//           }`}
//         >
//           {row.status}
//         </span>
//       ),
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       priority: 5,
//       renderCell: (row) => (
//         <div className="relative">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setShowActionMenu(showActionMenu === row.id ? null : row.id);
//             }}
//             className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors"
//           >
//             <MoreVertical className="w-4 h-4 text-[#718096]" />
//           </button>
//           {showActionMenu === row.id && (
//             <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-10">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigateTo(`/supply-chain/products/${row.id}`);
//                   setShowActionMenu(null);
//                 }}
//                 className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
//               >
//                 <Eye className="w-4 h-4" />
//                 View Details
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   navigateTo(`/supply-chain/products/edit/${row.id}`);
//                   setShowActionMenu(null);
//                 }}
//                 className="w-full px-4 py-2 text-left text-sm text-[#262C36] hover:bg-[#F7F7F7] flex items-center gap-2"
//               >
//                 <Edit className="w-4 h-4" />
//                 Edit Product
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setShowActionMenu(null);
//                 }}
//                 className="w-full px-4 py-2 text-left text-sm text-[#F56565] hover:bg-[#FEF2F2] flex items-center gap-2"
//               >
//                 <Trash2 className="w-4 h-4" />
//                 Delete Product
//               </button>
//             </div>
//           )}
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-[#F7F7F7]">
//       <Breadcrumb
//         items={[
//           { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
//           { label: 'Products / Supplies' },
//         ]}
//       />

//       <ResponsivePageHeader title="Products / Supplies" />

//       <div className="p-6 space-y-6">
//         <div className="bg-white rounded-xl border border-[#262C3633] p-4">
//           <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3 mb-4`}>
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full h-[44px] pl-10 pr-4 border border-[#262C3633] rounded-xl text-[#262C36] placeholder:text-[#718096]"
//               />
//             </div>

//             <FilterButtonDropdown
//               filters={[
//                 {
//                   id: 'category',
//                   label: 'Category',
//                   options: [
//                     { label: 'All Categories', value: 'all' },
//                     { label: 'Sports Equipment', value: 'sports equipment' },
//                     { label: 'Gym Equipment', value: 'gym equipment' },
//                     { label: 'Swimming Gear', value: 'swimming gear' },
//                   ],
//                   value: categoryFilter,
//                   onChange: setCategoryFilter,
//                 },
//                 {
//                   id: 'sport',
//                   label: 'Sport',
//                   options: [
//                     { label: 'All Sports', value: 'all' },
//                     { label: 'Cricket', value: 'cricket' },
//                     { label: 'Football', value: 'football' },
//                     { label: 'Tennis', value: 'tennis' },
//                     { label: 'Swimming', value: 'swimming' },
//                   ],
//                   value: sportFilter,
//                   onChange: setSportFilter,
//                 },
//                 {
//                   id: 'status',
//                   label: 'Stock Status',
//                   options: [
//                     { label: 'All Status', value: 'all' },
//                     { label: 'In Stock', value: 'in-stock' },
//                     { label: 'Low Stock', value: 'low-stock' },
//                     { label: 'Out of Stock', value: 'out-of-stock' },
//                   ],
//                   value: statusFilter,
//                   onChange: setStatusFilter,
//                 },
//               ]}
//               onClear={() => {
//                 setCategoryFilter('all');
//                 setSportFilter('all');
//                 setStatusFilter('all');
//               }}
//             />

//             <ExportButtonDropdown onExport={handleExport} />
//             <ImportButtonDropdown onImport={handleImport} />

//             <button
//               onClick={() => navigateTo('/supply-chain/products/add')}
//               className="h-[44px] px-6 bg-[#0A6659] text-white rounded-xl hover:bg-[#0A6659]/90 transition-colors flex items-center gap-2 whitespace-nowrap"
//             >
//               <Plus className="w-5 h-5" />
//               Add New Product
//             </button>
//           </div>

//           <ResponsiveTable
//             columns={columns}
//             data={filteredData}
//             currentPage={currentPage}
//             totalPages={Math.ceil(filteredData.length / pageSize)}
//             onPageChange={setCurrentPage}
//             onRowClick={handleRowClick}
//           />

//           <div className="mt-4 pt-4 border-t border-[#262C3633]">
//             <p className="text-sm text-[#718096]">
//               Showing <strong className="text-[#262C36]">{filteredData.length}</strong> of{' '}
//               <strong className="text-[#262C36]">{products.length}</strong> products
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
