import React, { useState } from 'react';
import { Download, TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsiveTable, TableColumn } from '../../components/responsive/ResponsiveTable';
import { ExportButtonDropdown } from '../../components/ExportButtonDropdown';
import { exportTableToCSV } from '../../utils/csvUtils';

export function SupplyChainReports() {
  const [activeReport, setActiveReport] = useState<'vendor' | 'monthly' | 'category' | 'asset'>('vendor');

  const vendorWiseSpend = [
    { vendor: 'SportsPro Equipment Ltd.', totalSpend: '₹1,25,000', orders: 12, avgOrderValue: '₹10,416' },
    { vendor: 'FitGear Supplies', totalSpend: '₹85,000', orders: 8, avgOrderValue: '₹10,625' },
    { vendor: 'Aqua Sports International', totalSpend: '₹67,200', orders: 6, avgOrderValue: '₹11,200' },
  ];

  const monthlyProcurement = [
    { month: 'November 2024', totalOrders: 15, totalAmount: '₹2,45,000', avgPerOrder: '₹16,333' },
    { month: 'October 2024', totalOrders: 12, totalAmount: '₹1,95,000', avgPerOrder: '₹16,250' },
    { month: 'September 2024', totalOrders: 10, totalAmount: '₹1,65,000', avgPerOrder: '₹16,500' },
  ];

  const categoryWise = [
    { category: 'Sports Equipment', totalSpend: '₹1,85,000', percentage: '52%' },
    { category: 'Gym Equipment', totalSpend: '₹95,000', percentage: '27%' },
    { category: 'Swimming Gear', totalSpend: '₹45,000', percentage: '13%' },
    { category: 'Apparel', totalSpend: '₹30,000', percentage: '8%' },
  ];

  const vendorColumns: TableColumn[] = [
    { key: 'vendor', label: 'Vendor', priority: 1 },
    { key: 'totalSpend', label: 'Total Spend', priority: 2 },
    { key: 'orders', label: 'Orders', hiddenOn: ['mobile'] },
    { key: 'avgOrderValue', label: 'Avg Order Value', priority: 3 },
  ];

  const monthlyColumns: TableColumn[] = [
    { key: 'month', label: 'Month', priority: 1 },
    { key: 'totalOrders', label: 'Total Orders', priority: 2 },
    { key: 'totalAmount', label: 'Total Amount', priority: 3 },
    { key: 'avgPerOrder', label: 'Avg/Order', hiddenOn: ['mobile'] },
  ];

  const categoryColumns: TableColumn[] = [
    { key: 'category', label: 'Category', priority: 1 },
    { key: 'totalSpend', label: 'Total Spend', priority: 2 },
    { key: 'percentage', label: 'Percentage', priority: 3 },
  ];

  const reports = [
    { id: 'vendor', label: 'Vendor-wise Spend', icon: <Package className="w-5 h-5" />, color: '#0A6659' },
    { id: 'monthly', label: 'Monthly Procurement', icon: <TrendingUp className="w-5 h-5" />, color: '#48BB78' },
    { id: 'category', label: 'Category-wise Purchases', icon: <ShoppingCart className="w-5 h-5" />, color: '#3B82F6' },
    { id: 'asset', label: 'Asset-linked Purchases', icon: <DollarSign className="w-5 h-5" />, color: '#ECC94B' },
  ];

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    let data: any[] = [];
    let filename = '';

    switch (activeReport) {
      case 'vendor':
        data = vendorWiseSpend;
        filename = 'vendor-wise-spend.csv';
        break;
      case 'monthly':
        data = monthlyProcurement;
        filename = 'monthly-procurement.csv';
        break;
      case 'category':
        data = categoryWise;
        filename = 'category-wise-purchases.csv';
        break;
    }

    if (format === 'csv') {
      exportTableToCSV(data, filename);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Reports' },
        ]}
      />

      <ResponsivePageHeader title="Supply Chain Reports" />

      <div className="p-6 space-y-6">
        {/* Report Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setActiveReport(report.id as any)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                activeReport === report.id
                  ? 'border-[#0A6659] bg-[#0A6659]/5'
                  : 'border-[#E5E7EB] hover:border-[#0A6659]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${report.color}20`, color: report.color }}
                >
                  {report.icon}
                </div>
                <p className="text-sm font-medium text-[#262C36]">{report.label}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Report Table */}
        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#262C36]">
              {reports.find(r => r.id === activeReport)?.label}
            </h3>
            <ExportButtonDropdown onExport={handleExport} />
          </div>

          {activeReport === 'vendor' && (
            <ResponsiveTable
              columns={vendorColumns}
              data={vendorWiseSpend}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          )}

          {activeReport === 'monthly' && (
            <ResponsiveTable
              columns={monthlyColumns}
              data={monthlyProcurement}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          )}

          {activeReport === 'category' && (
            <ResponsiveTable
              columns={categoryColumns}
              data={categoryWise}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          )}

          {activeReport === 'asset' && (
            <div className="p-8 text-center text-[#718096]">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Asset-linked purchases report coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
