import React, { useState, useEffect } from "react";
import { useResponsive } from "../../design-system/useResponsive";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Dumbbell,
  Building2,
  CreditCard,
  Gift,
  Shield,
  FileText,
  Bell,
  Settings,
  BarChart3,
  UserCog,
  X,
  ChevronDown,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string | number;
  children?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard />,
    path: "/",
  },
  {
    id: "bookings",
    label: "Bookings",
    icon: <CalendarDays />,
    path: "/bookings",
  },
  {
    id: "members",
    label: "Members",
    icon: <Users />,
    path: "/members",
  },
  {
    id: "master",
    label: "Master",
    icon: <Settings />,
    path: "/master",
    children: [
      {
        id: "sports",
        label: "Sports",
        icon: <Dumbbell />,
        path: "/master/sports",
      },
      {
        id: "facilities",
        label: "Facilities",
        icon: <Building2 />,
        path: "/master/facilities",
      },
      {
        id: "memberships",
        label: "Memberships",
        icon: <CreditCard />,
        path: "/master/memberships",
      },
      {
        id: "employees",
        label: "Employees",
        icon: <UserCog />,
        path: "/master/employees",
      },
      {
        id: "promotions",
        label: "Promotions",
        icon: <Gift />,
        path: "/master/promotions",
      },
      {
        id: "roles",
        label: "Roles & Access",
        icon: <Shield />,
        path: "/master/roles",
      },
    ],
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: <CreditCard />,
    path: "/transactions",
  },
  {
    id: "reports",
    label: "Reports",
    icon: <BarChart3 />,
    path: "/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings />,
    path: "/settings",
    children: [
      {
        id: "terms",
        label: "Terms & Conditions",
        icon: <FileText />,
        path: "/settings/terms",
      },
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell />,
        path: "/settings/notifications",
      },
      {
        id: "audit",
        label: "Audit Trail",
        icon: <FileText />,
        path: "/settings/audit",
      },
    ],
  },
];

interface ResponsiveSidebarProps {
  navItems?: NavItem[];
  activeItem?: string;
  onNavigate?: (path: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

// Helper function to check if a route is active based on current path
function isRouteActive(
  itemPath: string,
  currentPath: string,
  item: NavItem,
): boolean {
  // If current path exactly matches item path
  if (currentPath === itemPath) return true;

  // If current path starts with item path (for nested routes)
  // e.g., /members/detail/123 should match /members
  if (currentPath.startsWith(itemPath + "/")) return true;

  // Check if any children are active
  if (item.children) {
    return item.children.some((child) =>
      isRouteActive(child.path, currentPath, child),
    );
  }

  return false;
}

// Helper function to find which parent item should be active based on route
function findActiveParent(
  navItems: NavItem[],
  currentPath: string,
): string | null {
  for (const item of navItems) {
    if (isRouteActive(item.path, currentPath, item)) {
      return item.id;
    }
    if (item.children) {
      for (const child of item.children) {
        if (isRouteActive(child.path, currentPath, child)) {
          return item.id; // Return parent ID if child is active
        }
      }
    }
  }
  return null;
}

export function ResponsiveSidebar({
  navItems = defaultNavItems,
  activeItem,
  onNavigate,
  isOpen: controlledOpen,
  onClose,
}: ResponsiveSidebarProps) {
  const { isMobile, isTablet } = useResponsive();
  const [expandedItems, setExpandedItems] = useState<
    Set<string>
  >(new Set());

  // Auto-expand parent items if their children are active
  useEffect(() => {
    if (activeItem) {
      const activeParent = findActiveParent(
        navItems,
        activeItem,
      );
      if (activeParent) {
        setExpandedItems((prev) => {
          const newSet = new Set(prev);
          newSet.add(activeParent);
          return newSet;
        });
      }
    }
  }, [activeItem, navItems]);

  const toggleExpanded = (id: string) => {
    setExpandedItems((current) => {
      const newSet = new Set(current);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Mobile: Drawer overlay
  if (isMobile) {
    return (
      <>
        {controlledOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-[var(--z-modal-backdrop)]"
              onClick={onClose}
            />
            <div
              className={`
              fixed top-0 left-0 bottom-0
              w-[var(--sidebar-mobile)]
              bg-white
              z-[var(--z-modal)]
              transform transition-transform duration-300
              ${controlledOpen ? "translate-x-0" : "-translate-x-full"}
              overflow-y-auto
              shadow-xl
            `}
            >
              <div className="p-4 border-b border-[#262C36]/10 flex items-center justify-between">
                <h2
                  className="font-semibold text-lg text-[#262C36]"
                  style={{ fontFamily: "Inter" }}
                >
                  KhelKud Admin
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#0A66590D] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#262C36]" />
                </button>
              </div>
              <nav className="p-4">
                {navItems.map((item) => (
                  <NavItemComponent
                    key={item.id}
                    item={item}
                    currentPath={activeItem || ""}
                    expanded={expandedItems.has(item.id)}
                    onToggle={() => toggleExpanded(item.id)}
                    onNavigate={(path) => {
                      onNavigate?.(path);
                      onClose?.();
                    }}
                    collapsed={false}
                  />
                ))}
              </nav>
            </div>
          </>
        )}
      </>
    );
  }

  // Tablet: Collapsed by default (icon-only)
  if (isTablet) {
    return (
      <div
        className={`
        fixed top-0 left-0 bottom-0
        w-[var(--sidebar-collapsed)]
        bg-white
        border-r border-[#262C36]/10
        z-[var(--z-fixed)]
        overflow-y-auto
      `}
      >
        <div className="h-16 flex items-center justify-center border-b border-[#262C36]/10">
          <div className="w-8 h-8 bg-[#0A6659] rounded-lg flex items-center justify-center text-white font-bold">
            K
          </div>
        </div>
        <nav className="p-2">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              currentPath={activeItem || ""}
              expanded={false}
              onToggle={() => {}}
              onNavigate={onNavigate}
              collapsed={true}
            />
          ))}
        </nav>
      </div>
    );
  }

  // Desktop & Projector: Full sidebar
  return (
    <div
      className={`
      fixed top-0 left-0 bottom-0
      w-[var(--sidebar-expanded)]
      bg-white
      border-r border-[#262C36]/10
      z-[var(--z-fixed)]
      overflow-y-auto
    `}
    >
      <div className="h-16 flex items-center px-6 border-b border-[#262C36]/10">
        <h1
          className="text-base font-semibold text-[#262C36]"
          style={{ fontFamily: "Inter" }}
        >
          KHELKUD
        </h1>
      </div>
      <nav className="p-4">
        {navItems.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            currentPath={activeItem || ""}
            expanded={expandedItems.has(item.id)}
            onToggle={() => toggleExpanded(item.id)}
            onNavigate={onNavigate}
            collapsed={false}
          />
        ))}
      </nav>
    </div>
  );
}

function NavItemComponent({
  item,
  currentPath,
  expanded,
  onToggle,
  onNavigate,
  collapsed,
  depth = 0,
}: {
  item: NavItem;
  currentPath: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate?: (path: string) => void;
  collapsed: boolean;
  depth?: number;
}) {
  const isActive = isRouteActive(item.path, currentPath, item);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggle();
      // If parent item has a path, navigate to it
      if (item.path) {
        onNavigate?.(item.path);
      }
    } else {
      onNavigate?.(item.path);
    }
  };

  // Collapsed sidebar (icon-only mode)
  if (collapsed) {
    return (
      <div className="relative group mb-1">
        <button
          onClick={handleClick}
          className={`
            w-full
            h-12
            flex items-center justify-center
            rounded-lg
            transition-all duration-150
            ${
              isActive
                ? "bg-[#0A6659] text-white"
                : "text-[#262C36] hover:bg-[#0A66590D]"
            }
          `}
        >
          <span className="w-5 h-5">{item.icon}</span>
          {item.badge && (
            <span className="absolute top-1 right-1 w-5 h-5 bg-[#F56565] text-white text-xs rounded-full flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </button>
        {/* Tooltip on hover */}
        <div
          className="
          absolute left-full top-1/2 -translate-y-1/2 ml-2
          px-3 py-1.5
          bg-[#262C36] text-white
          rounded
          text-sm whitespace-nowrap
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all
          pointer-events-none
          z-50
        "
          style={{ fontFamily: "Inter" }}
        >
          {item.label}
        </div>
      </div>
    );
  }

  // Expanded sidebar (full mode)
  return (
    <div className={`mb-1 ${depth > 0 ? "ml-4" : ""}`}>
      <button
        onClick={handleClick}
        className={`
          w-full
          h-11
          flex items-center gap-3
          px-3
          rounded-lg
          transition-all duration-150
          ${
            isActive
              ? "bg-[#0A6659] text-white"
              : "text-[#262C36] hover:bg-[#0A66590D]"
          }
        `}
        style={{ fontFamily: "Inter" }}
      >
        <span
          className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-white" : "text-[#262C36]"}`}
        >
          {item.icon}
        </span>
        <span
          className={`flex-1 text-left text-sm font-medium ${isActive ? "text-white" : "text-[#262C36]"}`}
        >
          {item.label}
        </span>
        {item.badge && (
          <span
            className={`px-2 py-0.5 text-xs rounded-full ${
              isActive
                ? "bg-white/20 text-white"
                : "bg-[#F56565] text-white"
            }`}
          >
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-150 ${expanded ? "rotate-180" : ""} ${
              isActive ? "text-white" : "text-[#262C36]"
            }`}
          />
        )}
      </button>
      {hasChildren && expanded && (
        <div className="mt-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              currentPath={currentPath}
              expanded={false}
              onToggle={() => {}}
              onNavigate={onNavigate}
              collapsed={false}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}