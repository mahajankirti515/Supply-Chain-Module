import React, { useEffect, useState } from 'react';
import { ArrowLeft, Edit, FileText, Download, Building2, Package, CreditCard, Clock, CheckCircle2, AlertCircle, FileCheck, Calendar, User, Phone, Mail, MapPin, TrendingUp, CheckCircle } from 'lucide-react';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ResponsivePageHeader } from '../../components/responsive/ResponsiveFilters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchInvoiceById, clearCurrentInvoice, updatePaymentStatus } from '../../store/slices/invoiceSlice';
import { toast } from 'sonner';

interface InvoiceDetailProps {
  invoiceId?: string;
}

export function InvoiceDetail({ invoiceId }: InvoiceDetailProps) {
  const dispatch = useAppDispatch();
  const { currentInvoice: invoice, loading } = useAppSelector((state) => state.invoices);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceById(invoiceId));
    }
    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, invoiceId]);

  const navigateTo = (path: string) => {
    const event = new CustomEvent('navigate', { detail: { path } });
    window.dispatchEvent(event);
  };

  const handleUpdateStatus = async (newStatus: 'paid' | 'pending' | 'overdue' | 'cancelled') => {
    if (!invoice?.id) return;
    try {
      setIsUpdating(true);
      const resultAction = await dispatch(updatePaymentStatus({ id: invoice.id, paymentStatus: newStatus }));
      if (updatePaymentStatus.fulfilled.match(resultAction)) {
        toast.success(`Invoice status updated to ${newStatus}`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A6659] mx-auto mb-4"></div>
          <p className="text-[#718096]">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#262C36] mb-4">Invoice not found</p>
          <button onClick={() => navigateTo('/supply-chain/invoices')} className="text-[#0A6659] hover:underline">
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-[#d4f4dd] text-[#2d7738]';
      case 'pending':
        return 'bg-[#fff8e6] text-[#f57c00]';
      case 'overdue':
        return 'bg-[#ffe5e5] text-[#d32f2f]';
      case 'cancelled':
        return 'bg-[#f0f0f0] text-[#666666]';
      default:
        return 'bg-[#f0f0f0] text-[#666666]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Breadcrumb
        items={[
          { label: 'Supply Chain Management', path: '/supply-chain/vendors' },
          { label: 'Invoices', path: '/supply-chain/invoices' },
          { label: invoice.invoiceNumber },
        ]}
      />

      <ResponsivePageHeader title={`Invoice Details - ${invoice.invoiceNumber}`} />

      <div className="p-6 space-y-6">
        <button
          onClick={() => navigateTo('/supply-chain/invoices')}
          className="flex items-center gap-2 text-[#0A6659] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-[#262C3633] p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#262C36] mb-2">
                Invoice {invoice.invoiceNumber}
              </h2>
              <div className="flex items-center gap-3">
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getPaymentStatusColor(invoice.paymentStatus)}`}>
                  {invoice.paymentStatus?.charAt(0).toUpperCase() + invoice.paymentStatus?.slice(1)}
                </span>
                <span className="text-sm text-[#718096]">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {new Date(invoice.invoiceDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo(`/supply-chain/invoices/edit/${invoice.id}`)}
                className="h-[44px] px-6 border border-[#0A6659] text-[#0A6659] rounded-xl hover:bg-[#0A6659]/5 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Invoice
              </button>
              {invoice.paymentStatus !== 'paid' && (
                <button 
                  onClick={() => handleUpdateStatus('paid')}
                  disabled={isUpdating}
                  className="h-[44px] px-6 bg-[#48BB78] text-white rounded-xl hover:bg-[#48BB78]/90 flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Mark as Paid
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#e7f3f1] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-[#0A6659]" />
                <p className="text-xs text-[#718096]">Total Amount</p>
              </div>
              <p className="text-2xl font-bold text-[#0A6659]">₹{Number(invoice.amount).toLocaleString('en-IN')}</p>
            </div>
            <div className={`rounded-lg p-4 ${invoice.paymentStatus === 'paid' ? 'bg-[#f0fdf4]' : 'bg-[#fff8f0]'}`}>
              <div className="flex items-center gap-2 mb-2">
                {invoice.paymentStatus === 'paid' ? <CheckCircle2 className="w-5 h-5 text-[#48BB78]" /> : <Clock className="w-5 h-5 text-[#ECC94B]" />}
                <p className="text-xs text-[#718096]">Payment Status</p>
              </div>
              <p className={`text-2xl font-bold ${invoice.paymentStatus === 'paid' ? 'text-[#48BB78]' : 'text-[#ECC94B]'}`}>
                {invoice.paymentStatus?.charAt(0).toUpperCase() + invoice.paymentStatus?.slice(1)}
              </p>
            </div>
            <div className="bg-[#f7f9fc] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="w-5 h-5 text-[#718096]" />
                <p className="text-xs text-[#718096]">PO Reference</p>
              </div>
              <p className="text-lg font-semibold text-[#262C36]">{invoice.poReference || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Vendor Details */}
            <div className="bg-white rounded-xl border border-[#262C3633] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-[#0A6659]" />
                <h3 className="text-lg font-semibold text-[#262C36]">Vendor Information</h3>
              </div>
              <div className="p-4 bg-[#f7f9fc] rounded-lg border border-[#e5e7eb]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-lg font-semibold text-[#262C36] mb-1">{invoice.vendor?.vendorName || 'N/A'}</p>
                    <p className="text-sm text-[#718096]">Vendor ID: {invoice.vendorId}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-[#718096] mt-0.5" />
                    <div>
                      <p className="text-xs text-[#718096]">Email</p>
                      <p className="text-sm font-medium text-[#262C36]">{invoice.vendor?.email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-[#718096] mt-0.5" />
                    <div>
                      <p className="text-xs text-[#718096]">Phone</p>
                      <p className="text-sm font-medium text-[#262C36]">{invoice.vendor?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[#e5e7eb]">
                  <MapPin className="w-4 h-4 text-[#718096] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#718096]">Address</p>
                    <p className="text-sm font-medium text-[#262C36]">{invoice.vendor?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-xl border border-[#262C3633] overflow-hidden">
              <div className="p-6 border-b border-[#262C3633]">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#0A6659]" />
                  <h3 className="text-lg font-semibold text-[#262C36]">Item Details</h3>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#262C3633]">
                      <th className="px-6 py-4 text-sm font-semibold text-[#718096]">Product Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-[#718096]">Quantity</th>
                      <th className="px-6 py-4 text-sm font-semibold text-[#718096]">Unit Price</th>
                      <th className="px-6 py-4 text-sm font-semibold text-[#718096]">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items && invoice.items.length > 0 ? (
                      invoice.items.map((item) => (
                        <tr key={item.id} className="border-b border-[#F7F7F7] hover:bg-[#F7F7F7]/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-[#262C36] font-medium">{item.productName}</td>
                          <td className="px-6 py-4 text-sm text-[#718096]">{item.quantity}</td>
                          <td className="px-6 py-4 text-sm text-[#718096]">₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-[#0A6659]">₹{Number(item.total).toLocaleString('en-IN')}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-[#718096] italic">
                          No item details available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoices usually link to PO, showing basic summary here */}
            <div className="bg-white rounded-xl border border-[#262C3633] p-6">
              <h3 className="text-lg font-semibold text-[#262C36] mb-4">Invoice Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-[#F7F7F7]">
                  <span className="text-[#718096]">Subtotal:</span>
                  <span className="font-medium text-[#262C36]">₹{Number(invoice.amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-lg font-semibold text-[#262C36]">Total:</span>
                  <span className="text-lg font-bold text-[#0A6659]">₹{Number(invoice.amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Purchase Order Details */}
            {invoice.poReference && (
              <div className="bg-white rounded-xl border border-[#262C3633] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#0A6659]" />
                  <h3 className="text-lg font-semibold text-[#262C36]">Purchase Order</h3>
                </div>
                <div className="p-4 bg-[#e7f3f1] rounded-lg border border-[#0A6659]/20">
                  <p className="text-lg font-semibold text-[#0A6659] mb-1">{invoice.poReference}</p>
                  <p className="text-xs text-[#718096]">Referenced for payment</p>
                </div>
              </div>
            )}

            {/* Document Check */}
            <div className="bg-white rounded-xl border border-[#262C3633] p-6">
              <h3 className="text-lg font-semibold text-[#262C36] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0A6659]" />
                Invoice Document
              </h3>
              {invoice.invoiceDocument ? (
                <div className="p-4 bg-[#F7F7F7] border border-[#E5E7EB] rounded-lg">
                  <p className="text-sm font-medium text-[#262C36] mb-2">{invoice.invoiceDocument}</p>
                  <button className="w-full px-4 py-2 bg-[#0A6659] text-white rounded-lg hover:bg-[#0A6659]/90 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download File
                  </button>
                </div>
              ) : (
                <p className="text-sm text-[#718096] italic">No document uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
