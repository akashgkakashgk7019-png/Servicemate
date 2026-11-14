import React from 'react';
import { Booking } from '../../types';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const subtotal = Math.round((booking.amount / 1.18) * 100) / 100;
  const gstAmount = Math.round((booking.amount - subtotal) * 100) / 100;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 text-slate-800">
        {/* Actions Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base">Official Service Tax Invoice</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Paper Document */}
        <div className="p-6 sm:p-8 space-y-6 bg-white text-xs sm:text-sm">
          {/* Company & Invoice meta */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                SERVICE <span className="text-blue-600">MATES</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">All-in-One On-Demand Services Marketplace</p>
              <p className="text-[11px] text-slate-400 mt-1">
                GSTIN: <b>29AABCS1429B1Z2</b> • CIN: U72900KA2026PTC01234
              </p>
              <p className="text-[11px] text-slate-400">Bellandur Tech Zone, Bengaluru, Karnataka - 560103</p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs uppercase tracking-wider">
                {booking.payment_status === 'PAID' ? 'Tax Invoice (Paid)' : 'Invoice (Due)'}
              </span>
              <p className="font-mono font-bold text-slate-900 text-base mt-2">
                INV-{booking.booking_id}
              </p>
              <p className="text-xs text-slate-500">Date: {new Date(booking.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Billed To & Service Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Billed To (Customer)
              </p>
              <p className="font-bold text-slate-900">{booking.user?.name || 'Customer'}</p>
              <p className="text-xs text-slate-600 mt-0.5">{booking.address}</p>
              <p className="text-xs text-slate-600">{booking.city}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Phone: {booking.user?.phone || '+91 98765 43210'}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Service Fulfilled By
              </p>
              <p className="font-bold text-slate-900">{booking.provider?.name || 'Assigned Technician'}</p>
              <p className="text-xs text-slate-600">{booking.provider?.location || 'Bengaluru'}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Vehicle: {booking.provider?.vehicle_type} ({booking.provider?.vehicle_number})
              </p>
              <p className="text-xs text-slate-500">Verified Start OTP: <b>{booking.start_otp}</b></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Schedule</th>
                  <th className="p-3 text-right">Base Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{booking.service?.service_name || 'Home Service'}</p>
                    <p className="text-[11px] text-slate-500">{booking.service?.description || 'Doorstep service'}</p>
                  </td>
                  <td className="p-3.5 text-center text-slate-600">
                    {booking.booking_date} <br />
                    <span className="font-mono text-[11px] text-slate-400">{booking.booking_time}</span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900">
                    ₹{subtotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-between items-start pt-2">
            <div className="space-y-1 text-xs text-slate-500 max-w-xs">
              <p className="font-bold text-slate-700">Payment Information:</p>
              <p>Method: <b className="text-slate-800">{booking.payment_method}</b></p>
              <p className="font-mono text-[11px]">Txn ID: {booking.transaction_id || 'TXN-DIRECT'}</p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Digitally signed computer invoice. No signature required.</p>
            </div>

            <div className="w-48 space-y-1.5 text-right text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-mono font-semibold text-slate-800">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CGST (9%):</span>
                <span className="font-mono font-semibold text-slate-800">₹{(gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SGST (9%):</span>
                <span className="font-mono font-semibold text-slate-800">₹{(gstAmount / 2).toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-300 pt-1.5 flex justify-between font-black text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-base text-blue-600">₹{booking.amount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
