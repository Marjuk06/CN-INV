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
    <div className="bg-white text-slate-900 p-8 sm:p-14 print:p-0 w-full max-w-[794px] mx-auto min-h-[1123px] print:min-h-0 print:h-auto flex flex-col justify-between print:block text-xs sm:text-sm font-sans">
      <div>
        {/* Minimal Header */}
        <div className="flex justify-between items-start pb-10 print:pb-3">
          <div>
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-10 w-auto max-w-[180px] object-contain mb-3 print:h-7 print:mb-1"
              />
            ) : (
              <div className="text-xl font-bold tracking-tight text-slate-900 mb-2 print:text-lg print:mb-1">
                {company.name}
              </div>
            )}
            <div className="text-[11px] text-slate-500 space-y-0.5 print:text-[10px]">
              <p className="text-slate-700 font-medium">{company.tagline}</p>
              <p>{company.address}, {company.city}</p>
              <p>{company.email} • {company.phone}</p>
            </div>
          </div>

          <div className="text-right space-y-1 print:space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              {company.documentTitle || 'INVOICE'}
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 print:text-lg">
              {invoice.invoiceNumber}
            </div>
            <div className="pt-1 print:pt-0">
              <StatusBadge status={invoice.status} size="sm" />
            </div>
          </div>
        </div>

        {/* Minimal 4-column Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-100 text-xs print:py-2 print:gap-2 print:text-[10.5px]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-[9px]">Issued</span>
            <span className="font-medium text-slate-800">{invoice.date}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-[9px]">Due Date</span>
            <span className="font-medium text-slate-800">{invoice.dueDate}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-[9px]">Client</span>
            <span className="font-medium text-slate-800">{customer.name}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block print:text-[9px]">Total Due</span>
            <span className="font-bold font-mono text-slate-900">
              {formatCurrency(invoice.remainingBalance > 0 ? invoice.remainingBalance : invoice.grandTotal, invoice.currency)}
            </span>
          </div>
        </div>

        {/* Customer Address */}
        <div className="py-6 text-xs text-slate-600 print:py-2.5 print:text-[10.5px]">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1 print:text-[9px] print:mb-0.5">
            Billed To
          </span>
          <div className="font-semibold text-slate-900">{customer.companyName || customer.name}</div>
          {customer.companyName && <div className="text-slate-600">Attn: {customer.name}</div>}
          <div>{customer.address}</div>
          <div>{customer.city}, {customer.country}</div>
          {customer.taxId && <div className="text-[11px] text-slate-400 pt-0.5 print:text-[9.5px]">Tax ID: {customer.taxId}</div>}
        </div>

        {/* Minimal Items Table */}
        <div className="py-4 print:py-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-400 print:text-[9.5px]">
                <th className="py-2.5 print:py-1">Item</th>
                <th className="py-2.5 text-center w-14 print:py-1 print:w-12">Qty</th>
                <th className="py-2.5 text-right w-24 print:py-1 print:w-20">Rate</th>
                <th className="py-2.5 text-right w-20 print:py-1 print:w-16">Disc</th>
                <th className="py-2.5 text-right w-28 print:py-1 print:w-24">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id} className="print:break-inside-avoid">
                  <td className="py-3 font-medium text-slate-900 print:py-1.5 print:text-[10.5px]">{item.description}</td>
                  <td className="py-3 text-center text-slate-600 font-mono print:py-1.5 print:text-[10.5px]">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600 font-mono print:py-1.5 print:text-[10.5px]">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-3 text-right text-slate-400 font-mono print:py-1.5 print:text-[10.5px]">
                    {item.discountValue > 0
                      ? item.discountType === 'percentage'
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, invoice.currency)
                      : '0'}
                  </td>
                  <td className="py-3 text-right font-medium font-mono text-slate-900 print:py-1.5 print:text-[10.5px]">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="pt-6 border-t border-slate-200 flex justify-end print:pt-2 print:break-inside-avoid">
          <div className="w-64 space-y-1.5 text-xs print:w-56 print:space-y-0.5 print:text-[10.5px]">
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
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200 print:pt-1 print:text-sm">
              <span>Total</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div className="mt-8 text-[11px] text-slate-500 print:mt-2.5 print:text-[10px] print:break-inside-avoid">
          <span className="uppercase text-[10px] tracking-wider text-slate-400 block mb-0.5 print:text-[9px]">In Words</span>
          <p className="italic font-medium text-slate-700">{invoice.amountInWords}</p>
        </div>

        {/* Simple Payment Info */}
        <div className="mt-8 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-[11px] text-slate-500 print:mt-2.5 print:pt-2 print:gap-3 print:break-inside-avoid print:text-[10px]">
          <div>
            <span className="uppercase text-[10px] font-semibold text-slate-700 block mb-1 print:text-[9px] print:mb-0.5">Pay To:</span>
            <p className="text-slate-800 font-medium">{payment.bankName}</p>
            <p>A/C: <span className="font-mono text-slate-900">{payment.accountNumber}</span></p>
            <p>Routing: {payment.routingNumber} • Branch: {payment.branch}</p>
            {payment.bkashNumber && <p className="pt-0.5 print:pt-0">bKash: {payment.bkashNumber}</p>}
          </div>
          <div>
            {invoice.notes && (
              <>
                <span className="uppercase text-[10px] font-semibold text-slate-700 block mb-1 print:text-[9px] print:mb-0.5">Notes:</span>
                <p>{invoice.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-end print:mt-3 print:pt-2 print:break-inside-avoid">
        <div className="text-[10px] text-slate-400 print:text-[9px]">
          {company.name} • {company.website}
        </div>
        <div className="text-right">
          {invoice.signatureUrl ? (
            <img src={invoice.signatureUrl} alt="Signature" className="h-8 ml-auto mb-1 object-contain print:h-7 print:mb-0.5" />
          ) : (
            <p className="font-serif italic text-sm text-slate-800 mb-1 print:mb-0.5">{invoice.authorizedBy}</p>
          )}
          <p className="font-bold text-xs text-slate-900 print:text-[10px]">{invoice.authorizedBy}</p>
          <p className="text-[10px] text-slate-500 print:text-[9px]">{invoice.designation}</p>
        </div>
      </div>
    </div>
  )
}
