import React from 'react';
import { VendorsListing } from '../supplyChain/VendorsListing';
import { VendorForm } from '../supplyChain/VendorForm';
import { VendorDetail } from '../supplyChain/VendorDetail';
import { ProductsListing } from '../supplyChain/ProductsListing';
import { ProductForm } from '../supplyChain/ProductForm';
import { ProductDetail } from '../supplyChain/ProductDetail';
import { PurchaseOrdersListing } from '../supplyChain/PurchaseOrdersListing';
import { PurchaseOrderForm } from '../supplyChain/PurchaseOrderForm';
import { PurchaseOrderDetail } from '../supplyChain/PurchaseOrderDetail';
import { GoodsReceiptListing } from '../supplyChain/GoodsReceiptListing';
import { GoodsReceiptDetail } from '../supplyChain/GoodsReceiptDetail';
import { InvoicesListing } from '../supplyChain/InvoicesListing';
import { InvoiceForm } from '../supplyChain/InvoiceForm';
import { InvoiceDetail } from '../supplyChain/InvoiceDetail';
import { SupplyChainReports } from '../supplyChain/SupplyChainReports';

interface SupplyChainManagementModuleProps {
  currentRoute: string;
}

export function SupplyChainManagementModule({ currentRoute }: SupplyChainManagementModuleProps) {
  const extractId = (route: string) => {
    const match = route.match(/\/([^\/]+)$/);
    return match ? match[1] : '';
  };

  // Route to component mapping
  switch (currentRoute) {
    // Vendors Routes
    case '/supply-chain/vendors':
      return <VendorsListing />;
    
    case '/supply-chain/vendors/add':
      return <VendorForm />;
    
    // Products Routes
    case '/supply-chain/products':
      return <ProductsListing />;
    
    case '/supply-chain/products/add':
      return <ProductForm />;
    
    // Purchase Orders Routes
    case '/supply-chain/purchase-orders':
      return <PurchaseOrdersListing />;
    
    case '/supply-chain/purchase-orders/add':
      return <PurchaseOrderForm />;
    
    // Goods Receipt Routes
    case '/supply-chain/goods-receipt':
      return <GoodsReceiptListing />;
    
    // Invoices Routes
    case '/supply-chain/invoices':
      return <InvoicesListing />;
    
    case '/supply-chain/invoices/add':
      return <InvoiceForm />;
    
    // Reports Route
    case '/supply-chain/reports':
      return <SupplyChainReports />;
    
    default:
      // Handle detail and edit pages
      if (currentRoute.startsWith('/supply-chain/vendors/edit/')) {
        const vendorId = extractId(currentRoute);
        return <VendorForm vendorId={vendorId} isEdit={true} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/vendors/')) {
        const vendorId = extractId(currentRoute);
        return <VendorDetail vendorId={vendorId} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/products/edit/')) {
        const productId = extractId(currentRoute);
        return <ProductForm productId={productId} isEdit={true} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/products/')) {
        const productId = extractId(currentRoute);
        return <ProductDetail productId={productId} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/purchase-orders/edit/')) {
        const poId = extractId(currentRoute);
        return <PurchaseOrderForm poId={poId} isEdit={true} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/purchase-orders/')) {
        const poId = extractId(currentRoute);
        return <PurchaseOrderDetail poId={poId} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/goods-receipt/')) {
        const grnId = extractId(currentRoute);
        return <GoodsReceiptDetail grnId={grnId} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/invoices/edit/')) {
        const invoiceId = extractId(currentRoute);
        return <InvoiceForm invoiceId={invoiceId} isEdit={true} />;
      }
      
      if (currentRoute.startsWith('/supply-chain/invoices/')) {
        const invoiceId = extractId(currentRoute);
        return <InvoiceDetail invoiceId={invoiceId} />;
      }
      
      // Default to vendors listing
      return <VendorsListing />;
  }
}
