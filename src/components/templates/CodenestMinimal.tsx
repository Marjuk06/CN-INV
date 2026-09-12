import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'

interface TemplateProps {
  invoice: Invoice
}

export const CodenestMinimal: React.FC<TemplateProps> = ({ invoice }) => {
  const company = invoice.companySnapshot
  const customer = invoice.customerSnapshot
  const payment = invoice.paymentSnapshot

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-14 w-full max-w-[794px] mx-auto min-h-[1123px] flex flex-col justify-between text-xs sm:text-sm font-sans">
      <div>
        {/* Minimal Header */}
        <div className="flex justify-between items-start pb-10">
          <div>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-10 w-auto max-w-[180px] object-contain mb-3"
              />
            ) : (
              <div className="text-xl font-bold tracking-tight text-slate-900 mb-2">
                {company.name}
              </div>
            )}
            <div className="text-[11px] text-slate-500 space-y-0.5">
              <p className="text-slate-700 font-medium">{company.tagline}</p>
              <p>{company.address}, {company.city}</p>
              <p>{company.email} • {company.phone}</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              {company.documentTitle || 'INVOICE'}
            </span>
            <div className="text-xl font-bold font-mono text-slate-900">
              {invoice.invoiceNumber}
            </div>
            <div className="pt-1">
              <StatusBadge status={invoice.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Minimal 4-column Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Issued</span>
            <span className="font-medium text-slate-800">{invoice.date}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Due Date</span>
            <span className="font-medium text-slate-800">{invoice.dueDate}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Client</span>
            <span className="font-medium text-slate-800">{customer.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Total Due</span>
            <span className="font-bold font-mono text-slate-900">
              {formatCurrency(invoice.remainingBalance > 0 ? invoice.remainingBalance : invoice.grandTotal, invoice.currency)}
            </span>
          </div>
        </div>

        {/* Customer Address */}
        <div className="py-6 text-xs text-slate-600">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1">
            Billed To
          </span>
          <div className="font-semibold text-slate-900">{customer.companyName || customer.name}</div>
          {customer.companyName && <div className="text-slate-600">Attn: {customer.name}</div>}
          <div>{customer.address}</div>
          <div>{customer.city}, {customer.country}</div>
          {customer.taxId && <div className="text-[11px] text-slate-400 pt-0.5">Tax ID: {customer.taxId}</div>}
        </div>

        {/* Minimal Items Table */}
        <div className="py-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-2.5">Item</th>
                <th className="py-2.5 text-center w-14">Qty</th>
                <th className="py-2.5 text-right w-24">Rate</th>
                <th className="py-2.5 text-right w-20">Disc</th>
                <th className="py-2.5 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium text-slate-900">{item.description}</td>
                  <td className="py-3 text-center text-slate-600 font-mono">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600 font-mono">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-3 text-right text-slate-400 font-mono">
                    {item.discountValue > 0
                      ? item.discountType === 'percentage'
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, invoice.currency)
                      : '0'}
                  </td>
                  <td className="py-3 text-right font-medium font-mono text-slate-900">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <div className="w-64 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountTotal > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxTotal > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>{invoice.taxLabel}</span>
                <span className="font-mono">{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div className="mt-8 text-[11px] text-slate-500">
          <span className="uppercase text-[10px] tracking-wider text-slate-400 block mb-0.5">In Words</span>
          <p className="italic font-medium text-slate-700">{invoice.amountInWords}</p>
        </div>

        {/* Simple Payment Info */}
        <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-[11px] text-slate-500">
          <div>
            <span className="uppercase text-[10px] font-semibold text-slate-700 block mb-1">Pay To:</span>
            <p className="text-slate-800 font-medium">{payment.bankName}</p>
            <p>A/C: <span className="font-mono text-slate-900">{payment.accountNumber}</span></p>
            <p>Routing: {payment.routingNumber} • Branch: {payment.branch}</p>
            {payment.bkashNumber && <p className="pt-0.5">bKash: {payment.bkashNumber}</p>}
          </div>
          <div>
            {invoice.notes && (
              <>
                <span className="uppercase text-[10px] font-semibold text-slate-700 block mb-1">Notes:</span>
                <p>{invoice.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-end">
        <div className="text-[10px] text-slate-400">
          {company.name} • {company.website}
        </div>
        <div className="text-right">
          {invoice.signatureUrl ? (
            <img src={invoice.signatureUrl} alt="Signature" className="h-8 ml-auto mb-1 object-contain" />
          ) : (
            <p className="font-serif italic text-sm text-slate-800 mb-1">{invoice.authorizedBy}</p>
          )}
          <p className="font-bold text-xs text-slate-900">{invoice.authorizedBy}</p>
          <p className="text-[10px] text-slate-500">{invoice.designation}</p>
        </div>
      </div>
    </div>
  )
}
