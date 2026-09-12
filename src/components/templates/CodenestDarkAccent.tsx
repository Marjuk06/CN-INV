import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'

interface TemplateProps {
  invoice: Invoice
}

export const CodenestDarkAccent: React.FC<TemplateProps> = ({ invoice }) => {
  const company = invoice.companySnapshot
  const customer = invoice.customerSnapshot
  const payment = invoice.paymentSnapshot

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-12 print:p-0 w-full max-w-[794px] mx-auto min-h-[1123px] print:min-h-0 print:h-auto flex flex-col justify-between print:block text-xs sm:text-sm font-sans">
      <div>
        {/* Dark Accent Header Block */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm print:p-3 print:rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-700/60 print:pb-2.5 print:gap-3 print:flex-row">
            <div className="space-y-1.5 print:space-y-0.5">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-10 w-auto brightness-0 invert object-contain print:h-7"
                />
              ) : (
                <div className="text-2xl font-bold tracking-tight print:text-lg">{company.name}</div>
              )}
              <p className="text-xs text-slate-300 font-medium print:text-[10px]">{company.tagline}</p>
            </div>

            <div className="text-left sm:text-right print:text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary block mb-1 print:mb-0">
                {company.documentTitle || 'INVOICE NUMBER'}
              </span>
              <div className="text-2xl font-bold font-mono text-white print:text-lg">
                {invoice.invoiceNumber}
              </div>
              <div className="mt-1.5 print:mt-0.5">
                <StatusBadge status={invoice.status} size="sm" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 text-xs print:pt-2 print:gap-2 print:text-[10.5px]">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block print:text-[9px]">Date</span>
              <span className="font-semibold text-slate-100">{invoice.date}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block print:text-[9px]">Due Date</span>
              <span className="font-semibold text-slate-100">{invoice.dueDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block print:text-[9px]">Terms</span>
              <span className="font-semibold text-slate-100">{invoice.paymentTerms || '7 Days'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block print:text-[9px]">Balance Due</span>
              <span className="font-bold font-mono text-brand-primary">
                {formatCurrency(invoice.remainingBalance > 0 ? invoice.remainingBalance : invoice.grandTotal, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Company Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-100 print:py-2.5 print:gap-4 print:grid-cols-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 print:text-[9px] print:mb-0.5">
              Invoice Recipient
            </span>
            <div className="text-base font-bold text-slate-900 print:text-sm">{customer.name}</div>
            {customer.companyName && (
              <div className="text-xs font-semibold text-slate-700 print:text-[10.5px]">{customer.companyName}</div>
            )}
            <div className="text-xs text-slate-500 mt-1 leading-relaxed print:text-[10px] print:leading-tight print:mt-0.5">
              <p>{customer.address}</p>
              <p>{customer.city}, {customer.country}</p>
              <p>{customer.email} • {customer.phone}</p>
              {customer.taxId && <p className="text-[11px] text-slate-400 print:text-[9px]">Tax ID: {customer.taxId}</p>}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 leading-relaxed print:text-right print:text-[10px] print:leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 print:text-[9px] print:mb-0.5">
              Issued By
            </span>
            <div className="font-bold text-slate-900 print:text-sm">{company.name}</div>
            <p>{company.address}</p>
            <p>{company.city}, {company.country}</p>
            <p>{company.email} • {company.phone}</p>
            {company.binVat && <p className="text-[11px] text-slate-400 print:text-[9px]">BIN/VAT: {company.binVat}</p>}
          </div>
        </div>

        {/* Item Table */}
        <div className="py-6 print:py-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[11px] font-bold uppercase tracking-wider text-slate-700 print:text-[10px]">
                <th className="py-3 pr-2 print:py-1">Description</th>
                <th className="py-3 px-2 text-center w-14 print:py-1 print:w-12">Qty</th>
                <th className="py-3 px-2 text-right w-24 print:py-1 print:w-20">Rate</th>
                <th className="py-3 px-2 text-right w-20 print:py-1 print:w-16">Disc</th>
                <th className="py-3 pl-2 text-right w-28 print:py-1 print:w-24">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs print:text-[10.5px]">
              {invoice.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 print:break-inside-avoid">
                  <td className="py-3.5 pr-2 font-semibold text-slate-900 print:py-1.5">{item.description}</td>
                  <td className="py-3.5 px-2 text-center text-slate-600 font-mono print:py-1.5">{item.quantity}</td>
                  <td className="py-3.5 px-2 text-right text-slate-600 font-mono print:py-1.5">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                  <td className="py-3.5 px-2 text-right text-slate-400 font-mono print:py-1.5">
                    {item.discountValue > 0
                      ? item.discountType === 'percentage'
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, invoice.currency)
                      : '-'}
                  </td>
                  <td className="py-3.5 pl-2 text-right font-bold text-slate-900 font-mono print:py-1.5">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 print:pt-2 print:gap-4 print:flex-row print:break-inside-avoid">
          <div className="max-w-xs space-y-1.5 print:space-y-0.5 print:max-w-[260px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block print:text-[9px]">
              In Words
            </span>
            <p className="text-xs italic text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 print:p-2 print:text-[10px]">
              "{invoice.amountInWords}"
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs print:w-56 print:space-y-1 print:text-[10.5px]">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-800">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxTotal > 0 && (
              <div className="flex justify-between text-slate-500">
                <span>{invoice.taxLabel}:</span>
                <span className="font-mono text-slate-800">{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 border-slate-900 text-sm font-bold text-slate-900 print:pt-1 print:text-xs">
              <span>Grand Total:</span>
              <span className="font-mono text-brand-primary">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-emerald-600 pt-1 print:pt-0.5">
                  <span>Paid:</span>
                  <span className="font-mono">-{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-600 pt-1 border-t border-slate-200 print:pt-0.5">
                  <span>Balance:</span>
                  <span className="font-mono">{formatCurrency(invoice.remainingBalance, invoice.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Banking and Notes */}
        <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 print:mt-2.5 print:pt-2 print:gap-4 print:grid-cols-2 print:text-[10px] print:break-inside-avoid">
          <div>
            <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block mb-1 print:text-[9.5px] print:mb-0.5">
              Payment Information
            </span>
            <p>Bank: <strong className="text-slate-800">{payment.bankName}</strong></p>
            <p>A/C Name: {payment.accountName}</p>
            <p>A/C Number: <strong className="font-mono text-slate-900">{payment.accountNumber}</strong></p>
            <p>Branch: {payment.branch} • Routing: {payment.routingNumber}</p>
            {payment.bkashNumber && <p className="pt-0.5 print:pt-0">bKash: {payment.bkashNumber}</p>}
          </div>
          <div>
            {invoice.notes && (
              <>
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-900 block mb-1 print:text-[9.5px] print:mb-0.5">
                  Notes
                </span>
                <p className="text-slate-500 print:leading-tight">{invoice.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer & Signature */}
      <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-end print:mt-3 print:pt-2 print:break-inside-avoid">
        <div className="text-[11px] text-slate-400 print:text-[9px]">
          <p className="font-semibold text-slate-700">{company.name}</p>
          <p>{company.website} • {company.email}</p>
        </div>

        <div className="text-right">
          {invoice.signatureUrl ? (
            <img src={invoice.signatureUrl} alt="Signature" className="h-10 ml-auto mb-1 object-contain print:h-7 print:mb-0.5" />
          ) : (
            <p className="font-serif italic text-base mb-1 print:text-sm print:mb-0.5">{invoice.authorizedBy}</p>
          )}
          <div className="border-t border-slate-300 pt-1 w-36 ml-auto print:w-32 print:pt-0.5">
            <p className="font-bold text-xs text-slate-900 print:text-[10px]">{invoice.authorizedBy}</p>
            <p className="text-[10px] text-slate-500 print:text-[9px]">{invoice.designation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
