import React, { useState } from 'react';
import { useResponsive } from '../../design-system/useResponsive';
import { Search, Bell, Menu, User, ChevronDown, Settings, LogOut, Building2 } from 'lucide-react';
import { useGlobalFilter } from '../../contexts/GlobalFilterContext';

interface ResponsiveTopBarProps {
  onMenuClick?: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  notificationCount?: number;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

export function ResponsiveTopBar({
  onMenuClick,
  user = { name: 'Admin User', email: 'admin@khelkud.com' },
  notificationCount = 0,
  onSearch,
  onNotificationClick,
  onProfileClick,
  onLogout,
}: ResponsiveTopBarProps) {
  const { isMobile, isTablet } = useResponsive();
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Safe access to global filter (with fallback)
  let selectedBranch = 'all';
  let setSelectedBranch = (value: string) => {};
  
  try {
    const globalFilter = useGlobalFilter();
    selectedBranch = globalFilter.selectedBranch;
    setSelectedBranch = globalFilter.setSelectedBranch;
  } catch (e) {
    // Not wrapped in provider, use local state
  }

  // Mock branches data
  const branches = [
    { id: 'all', name: 'All Branches' },
    { id: 'BRN001', name: 'Main Sports Complex' },
    { id: 'BRN002', name: 'Tennis Court A' },
    { id: 'BRN003', name: 'Badminton Arena' },
    { id: 'BRN004', name: 'Swimming Pool' },
    { id: 'BRN005', name: 'Cricket Ground' },
    { id: 'BRN006', name: 'Gymnasium' },
  ];

  return (
    <header className={`
      fixed top-0 right-0 left-0
      ${isMobile ? 'h-[var(--header-mobile)]' : 'h-[var(--header-desktop)]'}
      ${isTablet ? 'left-[var(--sidebar-collapsed)]' : isMobile ? 'left-0' : 'left-[var(--sidebar-expanded)]'}
      bg-white
      border-b border-[var(--border)]
      z-[var(--z-sticky)]
      transition-all duration-300
    `}>
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          {(isMobile || isTablet) && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-[var(--hover-bg)] rounded-lg touch-target"
            >
              <Menu className="w-5 h-5 text-[var(--text-primary)]" />
            </button>
          )}

          {/* Search */}
          {isMobile ? (
            <>
              {!searchExpanded ? (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 hover:bg-[var(--hover-bg)] rounded-lg touch-target"
                >
                  <Search className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full h-10 pl-10 pr-3 bg-[var(--background-secondary)] border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      autoFocus
                      onBlur={() => setSearchExpanded(false)}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                placeholder="Search..."
                className={`
                  w-full
                  ${isTablet ? 'h-10' : 'h-11'}
                  pl-10 pr-3
                  bg-[var(--background-secondary)]
                  border-none
                  rounded-lg
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                `}
              />
            </div>
          )}
        </div>

        {/* Center: Facility Selector (Desktop/Tablet) */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--text-secondary)]" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className={`
                ${isTablet ? 'h-10 px-3' : 'h-11 px-4'}
                bg-[var(--background-secondary)]
                border border-[var(--border)]
                rounded-lg
                text-sm
                font-medium
                text-[var(--text-primary)]
                focus:outline-none focus:ring-2 focus:ring-[var(--primary)]
                min-w-[200px]
              `}
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right: Notifications + User menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-[var(--hover-bg)] rounded-lg touch-target"
          >
            <Bell className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-[var(--text-secondary)]`} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-[var(--error)] text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`
                flex items-center gap-2
                p-1.5
                hover:bg-[var(--hover-bg)]
                rounded-lg
                transition-all
                touch-target
              `}
            >
              <div className={`
                ${isMobile ? 'w-8 h-8' : 'w-9 h-9'}
                rounded-full
                bg-[var(--primary)]
                flex items-center justify-center
                text-white
                font-medium
              `}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              {!isMobile && (
                <>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className={`
                  absolute right-0 top-full mt-2
                  ${isMobile ? 'w-48' : 'w-64'}
                  bg-white
                  border border-[var(--border)]
                  rounded-lg
                  shadow-lg
                  z-20
                  overflow-hidden
                `}>
                  {/* User Info (mobile) */}
                  {isMobile && (
                    <div className="p-3 border-b border-[var(--border)]">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{user.email}</p>
                    </div>
                  )}

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onProfileClick?.();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--hover-bg)] flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>

                  <div className="border-t border-[var(--border)]">
                    <button
                      onClick={() => {
                        onLogout?.();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-[var(--error)] hover:bg-[var(--error-50)] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}