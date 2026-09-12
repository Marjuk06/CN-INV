import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'

interface TemplateProps {
  invoice: Invoice
}

export const CodenestCorporate: React.FC<TemplateProps> = ({ invoice }) => {
  const company = invoice.companySnapshot
  const customer = invoice.customerSnapshot
  const payment = invoice.paymentSnapshot

  return (
    <div className="bg-white text-slate-800 w-full max-w-[794px] mx-auto min-h-[1123px] flex flex-col justify-between text-xs sm:text-sm font-sans shadow-none">
      <div>
        {/* Top Corporate Accent Bar */}
        <div className="bg-slate-900 text-white px-8 sm:px-12 py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-10 w-auto brightness-0 invert object-contain"
              />
            ) : (
              <div className="text-2xl font-bold tracking-tight">{company.name}</div>
            )}
            <p className="text-xs text-slate-300 font-medium">{company.tagline}</p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-primary block mb-1">
              {company.documentTitle || 'OFFICIAL INVOICE'}
            </span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {invoice.invoiceNumber}
            </div>
            <div className="mt-1">
              <StatusBadge status={invoice.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Corporate Sub-Header Grid */}
        <div className="px-8 sm:px-12 py-8 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              From
            </span>
            <div className="font-bold text-slate-900 text-sm">{company.name}</div>
            <p className="text-slate-600 mt-1">{company.address}</p>
            <p className="text-slate-600">{company.city}, {company.country}</p>
            <p className="text-slate-500 pt-1">Tel: {company.phone}</p>
            <p className="text-slate-500">Email: {company.email}</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Billed To
            </span>
            <div className="font-bold text-slate-900 text-sm">{customer.name}</div>
            {customer.companyName && (
              <p className="font-semibold text-slate-700">{customer.companyName}</p>
            )}
            <p className="text-slate-600 mt-1">{customer.address}</p>
            <p className="text-slate-600">{customer.city}, {customer.country}</p>
            {customer.email && <p className="text-slate-500 pt-1">Email: {customer.email}</p>}
            {customer.phone && <p className="text-slate-500">Tel: {customer.phone}</p>}
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Invoice Meta
            </span>
            <div className="flex justify-between text-slate-600">
              <span>Date:</span>
              <span className="font-semibold text-slate-900">{invoice.date}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Due:</span>
              <span className="font-semibold text-slate-900">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Terms:</span>
              <span className="text-slate-800">{invoice.paymentTerms || 'Net 7'}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-900">Total:</span>
              <span className="text-base font-bold font-mono text-brand-primary">
                {formatCurrency(invoice.grandTotal, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Corporate Table */}
        <div className="px-8 sm:px-12 py-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-[11px] font-bold uppercase border-y border-slate-200">
                <th className="py-3 px-3">Service Description</th>
                <th className="py-3 px-2 text-center w-14">Qty</th>
                <th className="py-3 px-3 text-right w-24">Unit Rate</th>
                <th className="py-3 px-3 text-right w-20">Discount</th>
                <th className="py-3 px-3 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-3 font-semibold text-slate-900">{item.description}</td>
                  <td className="py-3.5 px-2 text-center text-slate-600 font-mono">{item.quantity}</td>
                  <td className="py-3.5 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-3.5 px-3 text-right text-slate-500 font-mono">
                    {item.discountValue > 0
                      ? item.discountType === 'percentage'
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, invoice.currency)
                      : '-'}
                  </td>
                  <td className="py-3.5 px-3 text-right font-bold text-slate-900 font-mono">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Breakdown */}
        <div className="px-8 sm:px-12 py-4 flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-slate-200">
          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Amount in Words
            </span>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs italic font-medium text-slate-700">
              "{invoice.amountInWords}"
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxTotal > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>{invoice.taxLabel}:</span>
                <span className="font-mono">{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-300">
              <span>Grand Total:</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-emerald-600 pt-1">
                  <span>Paid:</span>
                  <span className="font-mono">-{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600 pt-1 border-t border-slate-200">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(invoice.remainingBalance, invoice.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Corporate Payment Details */}
        <div className="px-8 sm:px-12 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 border-t border-slate-200">
          <div>
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block mb-1">
              Bank Remittance Instructions
            </span>
            <p>Beneficiary Bank: <strong className="text-slate-800">{payment.bankName}</strong></p>
            <p>Account Name: {payment.accountName}</p>
            <p>Account Number: <strong className="font-mono text-slate-900">{payment.accountNumber}</strong></p>
            <p>Branch &amp; Routing: {payment.branch} (Routing: {payment.routingNumber})</p>
          </div>
          <div>
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block mb-1">
              Digital Payment Methods
            </span>
            {payment.bkashNumber && <p>bKash: <span className="font-mono">{payment.bkashNumber}</span></p>}
            {payment.nagadNumber && <p>Nagad: <span className="font-mono">{payment.nagadNumber}</span></p>}
            {payment.additionalInstructions && (
              <p className="text-[11px] text-slate-500 pt-1 italic">{payment.additionalInstructions}</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer & Signature */}
      <div className="px-8 sm:px-12 py-8 mt-8 border-t border-slate-200 flex justify-between items-end">
        <div className="text-[11px] text-slate-400">
          <p className="font-bold text-slate-700">{company.name} Corporate Billing</p>
          <p>{company.website} | {company.email}</p>
        </div>

        <div className="text-right">
          {invoice.signatureUrl ? (
            <img src={invoice.signatureUrl} alt="Signature" className="h-10 ml-auto mb-1 object-contain" />
          ) : (
            <p className="font-serif italic text-base mb-1">{invoice.authorizedBy}</p>
          )}
          <div className="border-t border-slate-300 pt-1 w-36 ml-auto">
            <p className="font-bold text-xs text-slate-900">{invoice.authorizedBy}</p>
            <p className="text-[10px] text-slate-500">{invoice.designation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
