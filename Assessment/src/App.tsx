import React, { useState } from 'react';
import { Provider } from 'react-redux';
import {
  Package,
  Users,
  ShoppingCart,
  ClipboardList,
  FileText,
  BarChart3
} from 'lucide-react';
import { ResponsiveLayout } from './components/responsive/ResponsiveLayout';
import { NavItem } from './components/responsive/ResponsiveSidebar';
import { SupplyChainManagementModule } from './pages/modules/SupplyChainManagement';
import { GlobalFilterProvider } from './contexts/GlobalFilterContext';
import { store } from './store/store';

// Navigation items with icons
const navigationItems: NavItem[] = [
  {
    id: 'supply-chain',
    label: 'Supply Chain Management',
    icon: <Package className="w-5 h-5" />,
    path: '/supply-chain',
    children: [
      {
        id: 'vendors',
        label: 'Vendors',
        icon: <Users className="w-5 h-5" />,
        path: '/supply-chain/vendors',
      },
      {
        id: 'products',
        label: 'Products / Supplies',
        icon: <Package className="w-5 h-5" />,
        path: '/supply-chain/products',
      },
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        icon: <ShoppingCart className="w-5 h-5" />,
        path: '/supply-chain/purchase-orders',
      },
      {
        id: 'goods-receipt',
        label: 'Goods Receipt',
        icon: <ClipboardList className="w-5 h-5" />,
        path: '/supply-chain/goods-receipt',
      },
      {
        id: 'invoices',
        label: 'Invoices',
        icon: <FileText className="w-5 h-5" />,
        path: '/supply-chain/invoices',
      },
      {
        id: 'supply-reports',
        label: 'Reports',
        icon: <BarChart3 className="w-5 h-5" />,
        path: '/supply-chain/reports',
      },
    ],
  },
];

function App() {
  const [currentRoute, setCurrentRoute] = useState('/supply-chain/vendors');

  // Listen for custom navigate events
  React.useEffect(() => {
    const handleNavigateEvent = (event: any) => {
      if (event.detail && event.detail.path) {
        handleNavigate(event.detail.path);
      }
    };

    window.addEventListener('navigate', handleNavigateEvent);
    return () => window.removeEventListener('navigate', handleNavigateEvent);
  }, []);

  // Route to component mapping
  const renderModule = () => {
    if (currentRoute === '/login' || currentRoute === '/onboarding' || currentRoute === '/onboarding/add-facility') {
      // Since Login, OrganizationOnboarding, AddFirstFacility are removed from imports, 
      // they need specialized handling or removal if not needed.
      // For now, I'll redirect to supply-chain if they are not available.
      return <SupplyChainManagementModule currentRoute="/supply-chain/vendors" />;
    }

    if (currentRoute.startsWith('/supply-chain')) {
      return <SupplyChainManagementModule currentRoute={currentRoute} />;
    }

    return <SupplyChainManagementModule currentRoute="/supply-chain/vendors" />;
  };

  const handleNavigate = (path: string) => {
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current route is an auth route (should not show layout)
  const isAuthRoute = currentRoute === '/login' || currentRoute === '/onboarding' || currentRoute === '/onboarding/add-facility';

  // If auth route, render without layout
  if (isAuthRoute) {
    return <>{renderModule()}</>;
  }

  // Otherwise, render with layout
  return (
    <Provider store={store}>
      <GlobalFilterProvider>
        <ResponsiveLayout
          navItems={navigationItems}
          activeNav={currentRoute}
          onNavigate={handleNavigate}
        >
          {renderModule()}
        </ResponsiveLayout>
      </GlobalFilterProvider>
    </Provider>
  );
}

export default App;