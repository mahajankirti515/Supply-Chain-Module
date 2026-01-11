import React, { useState } from 'react';
import { useResponsive } from '../../design-system/useResponsive';
import { ResponsiveSidebar, NavItem } from './ResponsiveSidebar';
import { ResponsiveTopBar } from './ResponsiveTopBar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  navItems?: NavItem[];
  activeNav?: string;
  onNavigate?: (path: string) => void;
}

export function ResponsiveLayout({
  children,
  navItems,
  activeNav,
  onNavigate,
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Sidebar */}
      <ResponsiveSidebar
        navItems={navItems}
        activeItem={activeNav}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Top Bar */}
      <ResponsiveTopBar
        onMenuClick={() => setSidebarOpen(true)}
        notificationCount={3}
      />

      {/* Main Content */}
      <main
        className={`
          ${isMobile ? 'pt-[var(--header-mobile)]' : 'pt-[var(--header-desktop)]'}
          ${isTablet ? 'pl-[var(--sidebar-collapsed)]' : isMobile ? 'pl-0' : 'pl-[var(--sidebar-expanded)]'}
          transition-all duration-300
        `}
      >
        <div className="container-responsive section-padding">
          {children}
        </div>
      </main>
    </div>
  );
}
