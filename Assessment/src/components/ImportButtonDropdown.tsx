import { useState, useRef, useEffect } from 'react';
import { Download, Upload, FileText } from 'lucide-react';
import { parseCSV, parseXLSX, validateFileType, generateSampleCSV } from '../lib/importUtils';
import { toast } from 'sonner@2.0.3';

interface ImportButtonDropdownProps {
  onImport?: (data: any[]) => void;
  sampleFields?: { name: string; example: string }[];
  moduleName?: string;
}

export function ImportButtonDropdown({ 
  onImport, 
  sampleFields = [],
  moduleName = 'data'
}: ImportButtonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = async (file: File) => {
    if (!validateFileType(file)) {
      toast.error('Invalid file type. Please upload CSV or XLSX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let data: any[] = [];

      if (extension === 'csv') {
        data = await parseCSV(file);
      } else if (extension === 'xlsx' || extension === 'xls') {
        data = await parseXLSX(file);
      }

      onImport?.(data);
      toast.success(`Successfully imported ${data.length} records`);
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to parse file. Please check the format.');
      console.error('Import error:', error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setIsOpen(false);
  };

  const handleDownloadTemplate = () => {
    if (sampleFields.length > 0) {
      generateSampleCSV(sampleFields);
      toast.success('Template downloaded successfully');
      setIsOpen(false);
    } else {
      toast.error('No template available for this module');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          // Reset input value to allow re-selecting the same file
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Import Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-[44px] px-[18px] inline-flex items-center gap-[8px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#374151] bg-white hover:bg-[#f9fafb] transition-colors flex-shrink-0 whitespace-nowrap ${
          isOpen ? 'border-[#0a6659] bg-[#f5faf9]' : ''
        }`}
      >
        <Download className="size-[18px] flex-shrink-0" />
        <span className="whitespace-nowrap">Import</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[280px] bg-white border border-[#262C3633] rounded-[10px] shadow-lg overflow-hidden">
          {/* Import CSV File Option */}
          <button
            onClick={handleImportClick}
            className="w-full flex items-center gap-[12px] px-[16px] py-[14px] text-[14px] text-[#262c36] hover:bg-[#f5faf9] transition-colors text-left"
          >
            <Upload className="size-[16px] text-[#718096] flex-shrink-0" />
            <span>Import CSV File</span>
          </button>

          {/* Divider */}
          <div className="h-[1px] bg-[#e7e7e7] mx-[16px]" />

          {/* Download Template CSV Option */}
          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center gap-[12px] px-[16px] py-[14px] text-[14px] text-[#262c36] hover:bg-[#f5faf9] transition-colors text-left"
          >
            <FileText className="size-[16px] text-[#718096] flex-shrink-0" />
            <span>Download Template CSV</span>
          </button>
        </div>
      )}
    </div>
  );
}
