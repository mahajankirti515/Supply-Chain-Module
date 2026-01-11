import React, { useState } from 'react';
import { useResponsive } from '../../design-system/useResponsive';
import { MoreVertical, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  renderCell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  hiddenOn?: ('mobile' | 'tablet')[];
  priority?: number; // 1 = highest (always visible)
}

export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger';
}

interface ResponsiveTableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    totalItems?: number;
  };
  // Support for individual pagination props (backward compatibility)
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  rowKey?: string;
  compact?: boolean;
}

export function ResponsiveTable<T extends Record<string, any>>({
  columns,
  data,
  actions,
  onRowClick,
  loading,
  emptyMessage = 'No data available',
  pagination,
  currentPage: directCurrentPage,
  totalPages: directTotalPages,
  onPageChange: directOnPageChange,
  pageSize: directPageSize,
  totalItems: directTotalItems,
  rowKey = 'id',
  compact = false,
}: ResponsiveTableProps<T>) {
  const { isMobile, isTablet } = useResponsive();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  // Support both pagination object and individual props
  const paginationConfig = pagination || (directCurrentPage && directTotalPages && directOnPageChange ? {
    currentPage: directCurrentPage,
    totalPages: directTotalPages,
    onPageChange: directOnPageChange,
    pageSize: directPageSize,
    totalItems: directTotalItems,
  } : undefined);

  const handleSort = (key: string) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === 'asc' 
          ? { key, direction: 'desc' } 
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((current) => {
      const newSet = new Set(current);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  // Filter columns based on viewport
  const visibleColumns = columns.filter((col) => {
    if (isMobile && col.hiddenOn?.includes('mobile')) return false;
    if (isTablet && col.hiddenOn?.includes('tablet')) return false;
    return true;
  });

  const hiddenColumns = columns.filter((col) => {
    if (isMobile && col.hiddenOn?.includes('mobile')) return true;
    if (isTablet && col.hiddenOn?.includes('tablet')) return true;
    return false;
  });

  // Mobile: Card View
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-12 text-[var(--text-secondary)]">{emptyMessage}</div>
          ) : (
            sortedData.map((row, index) => (
              <div
                key={row[rowKey] || index}
                className="bg-white rounded-lg border border-[var(--border)] p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {visibleColumns.map((col) => (
                  <div key={col.key} className="flex justify-between items-start mb-2 last:mb-0">
                    <span className="text-sm text-[var(--text-secondary)] font-medium">{col.label}:</span>
                    <span className="text-sm text-[var(--text-primary)] text-right ml-2">
                      {col.renderCell ? col.renderCell(row) : row[col.key]}
                    </span>
                  </div>
                ))}
                
                {actions && actions.length > 0 && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          action.variant === 'danger'
                            ? 'bg-[var(--error-50)] text-[var(--error)] hover:bg-[var(--error-100)]'
                            : 'bg-[var(--background-secondary)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {paginationConfig && <PaginationControls pagination={paginationConfig} />}
      </div>
    );
  }

  // Desktop/Tablet: Table View
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border border-[#262C3633]">
            <thead>
              <tr className="bg-[#262C36] bg-opacity-80 border-b border-[#262C3633]">
                {visibleColumns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-4 py-3 text-left text-sm font-medium text-white ${
                      col.sortable ? 'cursor-pointer hover:bg-[#262C36] hover:bg-opacity-90 select-none' : ''
                    }`}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {col.label}
                      {col.sortable && (
                        <span className="text-white opacity-70">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronDown className="w-4 h-4 opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {actions && actions.length > 0 && (
                  <th className="px-4 py-3 text-right text-sm font-medium text-white w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    Loading...
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-[var(--text-secondary)]">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                sortedData.map((row, index) => (
                  <React.Fragment key={row[rowKey] || index}>
                    <tr
                      className={`border-b border-[#262C3633] hover:bg-[#0A66590D] transition-colors ${
                        onRowClick ? 'cursor-pointer' : ''
                      } ${compact ? 'h-[56px]' : 'h-[56px]'}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      {visibleColumns.map((col) => (
                        <td key={col.key} className="px-4 py-3 text-sm text-[var(--text-primary)]">
                          <div className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                            {col.renderCell ? col.renderCell(row) : row[col.key]}
                          </div>
                        </td>
                      ))}
                      {actions && actions.length > 0 && (
                        <td className="px-4 py-3 text-right relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenActionMenu(openActionMenu === row[rowKey] ? null : row[rowKey]);
                            }}
                            className="p-2 hover:bg-[var(--hover-bg)] rounded transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-[var(--text-secondary)]" />
                          </button>

                          {openActionMenu === row[rowKey] && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenu(null);
                                }}
                              />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--border)] py-1 z-20">
                                {actions.map((action, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.onClick(row);
                                      setOpenActionMenu(null);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                                      action.variant === 'danger'
                                        ? 'text-[var(--error)] hover:bg-[var(--error-50)]'
                                        : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                                    }`}
                                  >
                                    {action.icon}
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                    
                    {/* Expanded row for hidden columns (tablet only) */}
                    {isTablet && hiddenColumns.length > 0 && expandedRows.has(row[rowKey]) && (
                      <tr className="bg-[var(--background-tertiary)] border-b border-[var(--border)]">
                        <td colSpan={visibleColumns.length + (actions ? 1 : 0)} className="px-4 py-3">
                          <div className="grid grid-cols-2 gap-3">
                            {hiddenColumns.map((col) => (
                              <div key={col.key}>
                                <span className="text-xs text-[var(--text-secondary)] font-medium">{col.label}:</span>
                                <div className="text-sm text-[var(--text-primary)] mt-1">
                                  {col.renderCell ? col.renderCell(row) : row[col.key]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paginationConfig && <PaginationControls pagination={paginationConfig} />}
    </div>
  );
}

// Pagination Controls Component
function PaginationControls({ pagination }: { pagination: ResponsiveTableProps['pagination'] }) {
  if (!pagination) return null;

  const { currentPage, totalPages, onPageChange, pageSize, totalItems } = pagination;

  const startItem = ((currentPage - 1) * (pageSize || 10)) + 1;
  const endItem = Math.min(currentPage * (pageSize || 10), totalItems || 0);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-[var(--border)] rounded-lg">
      <div className="text-sm text-[var(--text-secondary)]">
        {totalItems ? (
          <>Showing {startItem} to {endItem} of {totalItems} results</>
        ) : (
          <>Page {currentPage} of {totalPages}</>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 border border-[var(--border)] rounded-md text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={i}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? 'bg-[var(--primary)] text-white'
                    : 'border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 border border-[var(--border)] rounded-md text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}