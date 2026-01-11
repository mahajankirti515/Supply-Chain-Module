import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, FileSpreadsheet, CheckSquare } from 'lucide-react';
import { exportToCSV, exportToXLSX, formatDataForExport } from '../lib/exportUtils';
import { toast } from 'sonner@2.0.3';

interface ExportButtonDropdownProps {
  data: any[];
  filename: string;
  excludeFields?: string[];
  selectedRowsData?: any[];
}

export function ExportButtonDropdown({ 
  data, 
  filename,
  excludeFields = ['id', 'image'],
  selectedRowsData = []
}: ExportButtonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = async (format: 'csv' | 'xlsx', selectedOnly = false) => {
    const dataToExport = selectedOnly && selectedRowsData.length > 0 ? selectedRowsData : data;

    if (!dataToExport || dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const formattedData = formatDataForExport(dataToExport, excludeFields);

      if (format === 'csv') {
        exportToCSV(formattedData, filename);
        toast.success(`Exported ${dataToExport.length} records to CSV`);
      } else {
        exportToXLSX(formattedData, filename);
        toast.success(`Exported ${dataToExport.length} records to XLSX`);
      }

      setIsOpen(false);
    } catch (error) {
      toast.error('Export failed. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-[44px] px-[18px] inline-flex items-center gap-[8px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#374151] bg-white hover:bg-[#f9fafb] transition-colors flex-shrink-0 whitespace-nowrap ${
          isOpen ? 'border-[#0a6659] bg-[#f5faf9]' : ''
        }`}
      >
        <Upload className="size-[18px] flex-shrink-0" />
        <span className="whitespace-nowrap">Export</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[260px] bg-white border border-[#262C3633] rounded-[10px] shadow-lg overflow-hidden">
          {/* Export as CSV */}
          <button
            onClick={() => handleExport('csv', false)}
            className="w-full flex items-center gap-[12px] px-[16px] py-[14px] text-[14px] text-[#262c36] hover:bg-[#f5faf9] transition-colors text-left"
          >
            <FileText className="size-[16px] text-[#718096] flex-shrink-0" />
            <span>Export as CSV</span>
          </button>

          {/* Divider */}
          <div className="h-[1px] bg-[#e7e7e7] mx-[16px]" />

          {/* Export as XLSX */}
          <button
            onClick={() => handleExport('xlsx', false)}
            className="w-full flex items-center gap-[12px] px-[16px] py-[14px] text-[14px] text-[#262c36] hover:bg-[#f5faf9] transition-colors text-left"
          >
            <FileSpreadsheet className="size-[16px] text-[#718096] flex-shrink-0" />
            <span>Export as XLSX</span>
          </button>

          {/* Export Selected Rows (conditionally shown) */}
          {selectedRowsData && selectedRowsData.length > 0 && (
            <>
              {/* Divider */}
              <div className="h-[1px] bg-[#e7e7e7] mx-[16px]" />

              <button
                onClick={() => handleExport('csv', true)}
                className="w-full flex items-center gap-[12px] px-[16px] py-[14px] text-[14px] text-[#262c36] hover:bg-[#f5faf9] transition-colors text-left"
              >
                <CheckSquare className="size-[16px] text-[#718096] flex-shrink-0" />
                <div className="flex flex-col">
                  <span>Export Selected Rows</span>
                  <span className="text-[12px] text-[#718096]">{selectedRowsData.length} row(s) selected</span>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
