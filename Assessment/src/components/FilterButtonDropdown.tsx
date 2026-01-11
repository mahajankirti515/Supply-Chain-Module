import { useState, useRef, useEffect } from 'react';
import { Filter, Search, Calendar, RefreshCw, X } from 'lucide-react';

interface FilterButtonDropdownProps {
  onApplyFilters?: (filters: FilterState) => void;
  moduleType?: 'sports' | 'facilities' | 'bookings' | 'members' | 'employees' | 'offers' | 'memberships' | 'roles' | 'transactions' | 'reports' | 'default';
}

interface FilterState {
  searchKeyword?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sport?: string;
  facility?: string;
  branch?: string;
}

export function FilterButtonDropdown({ onApplyFilters, moduleType = 'default' }: FilterButtonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
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

  const handleApplyFilters = () => {
    onApplyFilters?.(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({});
    onApplyFilters?.({});
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-[44px] px-4 inline-flex items-center gap-2 border border-[#262C3633] rounded-lg bg-white text-[#262c36] hover:bg-[#f5faf9] transition-colors text-sm"
      >
        <Filter className="size-[18px]" />
        <span>Filter</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-[320px] bg-white border border-[#262C3633] rounded-[10px] shadow-lg">
          <div className="p-[16px] space-y-[16px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-[12px] border-b border-[#e7e7e7]">
              <h3 className="text-[16px] text-[#262c36]">Filter Options</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="size-[24px] flex items-center justify-center rounded-[4px] hover:bg-[#f5faf9] text-[#718096]"
              >
                <X className="size-[16px]" />
              </button>
            </div>

            {/* Filter: Search by Keyword */}
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[8px] text-[14px] text-[#262c36]">
                <Search className="size-[16px] text-[#718096]" />
                <span>Search by Keyword</span>
              </div>
              <input
                type="text"
                placeholder="Enter keyword..."
                value={filters.searchKeyword || ''}
                onChange={(e) => setFilters({ ...filters, searchKeyword: e.target.value })}
                className="w-full h-[40px] px-[12px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#262c36] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#0a6659] focus:ring-1 focus:ring-[#0a6659]"
              />
            </div>

            {/* Filter: Status */}
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[8px] text-[14px] text-[#262c36]">
                <Filter className="size-[16px] text-[#718096]" />
                <span>Filter by Status</span>
              </div>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full h-[40px] px-[12px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#262c36] focus:outline-none focus:border-[#0a6659] focus:ring-1 focus:ring-[#0a6659] bg-white"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                {moduleType === 'bookings' && (
                  <>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </>
                )}
                {moduleType === 'transactions' && (
                  <>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                    <option value="Refunded">Refunded</option>
                  </>
                )}
              </select>
            </div>

            {/* Filter: Date Range */}
            <div className="space-y-[8px]">
              <div className="flex items-center gap-[8px] text-[14px] text-[#262c36]">
                <Calendar className="size-[16px] text-[#718096]" />
                <span>Date Range</span>
              </div>
              <div className="grid grid-cols-2 gap-[8px]">
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="h-[40px] px-[12px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#262c36] focus:outline-none focus:border-[#0a6659] focus:ring-1 focus:ring-[#0a6659]"
                />
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="h-[40px] px-[12px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#262c36] focus:outline-none focus:border-[#0a6659] focus:ring-1 focus:ring-[#0a6659]"
                />
              </div>
            </div>

            {/* Filter: Sport / Facility (conditional) */}
            {(moduleType === 'bookings' || moduleType === 'facilities') && (
              <div className="space-y-[8px]">
                <div className="flex items-center gap-[8px] text-[14px] text-[#262c36]">
                  <Filter className="size-[16px] text-[#718096]" />
                  <span>Filter by Sport / Facility</span>
                </div>
                <select
                  value={filters.sport || ''}
                  onChange={(e) => setFilters({ ...filters, sport: e.target.value })}
                  className="w-full h-[40px] px-[12px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#262c36] focus:outline-none focus:border-[#0a6659] focus:ring-1 focus:ring-[#0a6659] bg-white"
                >
                  <option value="">All Sports/Facilities</option>
                  <option value="Football">Football</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Cricket">Cricket</option>
                </select>
              </div>
            )}

            {/* Filter: Branch (conditional for bookings and other modules) */}
            {(moduleType === 'bookings' || moduleType === 'members' || moduleType === 'employees' || moduleType === 'sports' || moduleType === 'offers' || moduleType === 'memberships' || moduleType === 'transactions') && (
              <div className="space-y-[8px]">
                <div className="flex items-center gap-[8px] text-[14px] text-[#262c36]">
                  <Filter className="size-[16px] text-[#718096]" />
                  <span>Filter by Branch</span>
                </div>
                <select
                  value={filters.branch || ''}
                  onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                  className="w-full h-[40px] px-[12px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#262c36] focus:outline-none focus:border-[#0a6659] focus:ring-1 focus:ring-[#0a6659] bg-white"
                >
                  <option value="">All Branches</option>
                  <option value="BRN001">Main Sports Complex</option>
                  <option value="BRN002">Tennis Court A</option>
                  <option value="BRN003">Badminton Arena</option>
                  <option value="BRN004">Swimming Pool</option>
                  <option value="BRN005">Cricket Ground</option>
                  <option value="BRN006">Gymnasium</option>
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-[8px] pt-[12px] border-t border-[#e7e7e7]">
              <button
                onClick={handleResetFilters}
                className="flex-1 h-[40px] inline-flex items-center justify-center gap-[8px] border border-[#d1d5db] rounded-[8px] text-[14px] text-[#718096] bg-white hover:bg-[#f9fafb] transition-colors"
              >
                <RefreshCw className="size-[16px]" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 h-[40px] inline-flex items-center justify-center gap-[8px] bg-[#0a6659] text-white rounded-[8px] hover:bg-[#085548] transition-colors text-[14px]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}