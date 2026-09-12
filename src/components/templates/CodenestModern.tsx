import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'

interface TemplateProps {
  invoice: Invoice
}

export const CodenestModern: React.FC<TemplateProps> = ({ invoice }) => {
  const company = invoice.companySnapshot
  const customer = invoice.customerSnapshot
  const payment = invoice.paymentSnapshot

  return (
    <div className="bg-white text-slate-800 p-8 sm:p-12 w-full max-w-[794px] mx-auto min-h-[1123px] flex flex-col justify-between text-xs sm:text-sm font-sans selection:bg-brand-light">
      <div>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-slate-200">
          <div className="space-y-3">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.name}
                className="h-12 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <div className="font-extrabold text-2xl tracking-tight text-slate-900">
                {company.name}
              </div>
            )}
            <div className="text-xs text-slate-500 leading-relaxed max-w-xs">
              <p className="font-medium text-slate-700">{company.tagline}</p>
              <p>{company.address}</p>
              <p>{company.city}, {company.country}</p>
              <p className="pt-1">
                <span className="font-medium text-slate-600">Email:</span> {company.email}
              </p>
              <p>
                <span className="font-medium text-slate-600">Phone:</span> {company.phone}
              </p>
              {company.website && (
                <p>
                  <span className="font-medium text-slate-600">Web:</span> {company.website}
                </p>
              )}
              {company.binVat && (
                <p className="pt-1 text-[11px] text-slate-400">
                  BIN/VAT: <span className="font-mono text-slate-600">{company.binVat}</span>
                  {company.tin && <> • TIN: <span className="font-mono text-slate-600">{company.tin}</span></>}
                </p>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">{company.documentTitle || 'Invoice'}</span>
              <StatusBadge status={invoice.status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
              {invoice.invoiceNumber}
            </h1>
            <div className="text-xs text-slate-500 space-y-1 pt-1">
              <p>
                <span className="text-slate-400">Invoice Date:</span>{' '}
                <span className="font-medium text-slate-700">{invoice.date}</span>
              </p>
              <p>
                <span className="text-slate-400">Due Date:</span>{' '}
                <span className="font-medium text-slate-700">{invoice.dueDate}</span>
              </p>
              {invoice.paymentTerms && (
                <p>
                  <span className="text-slate-400">Terms:</span>{' '}
                  <span className="font-medium text-slate-700">{invoice.paymentTerms}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="py-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block mb-1.5">
              Billed To
            </span>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {customer.name}
            </h2>
            {customer.companyName && (
              <p className="text-xs font-semibold text-slate-700 mt-0.5">{customer.companyName}</p>
            )}
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">
              {customer.address && <p>{customer.address}</p>}
              {(customer.city || customer.country) && (
                <p>{[customer.city, customer.country].filter(Boolean).join(', ')}</p>
              )}
              {customer.email && <p className="pt-0.5">{customer.email}</p>}
              {customer.phone && <p>{customer.phone}</p>}
              {customer.taxId && (
                <p className="text-[11px] text-slate-400 pt-0.5">
                  Tax/VAT ID: <span className="font-mono text-slate-600">{customer.taxId}</span>
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
            <div className="text-xs text-slate-500 mb-1">Total Due Amount</div>
            <div className="text-2xl font-bold font-mono text-slate-900 tracking-tight">
              {formatCurrency(invoice.remainingBalance > 0 ? invoice.remainingBalance : invoice.grandTotal, invoice.currency)}
            </div>
            {invoice.paidAmount > 0 && (
              <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1.5">
                <span>Paid: {formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                <span>•</span>
                <span>Due: {formatCurrency(invoice.remainingBalance, invoice.currency)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="py-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                <th className="py-2.5 pr-2">Description</th>
                <th className="py-2.5 px-2 text-center w-14">Qty</th>
                <th className="py-2.5 px-2 text-right w-24">Price</th>
                <th className="py-2.5 px-2 text-right w-20">Disc</th>
                <th className="py-2.5 pl-2 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {invoice.items.map((item) => {
                const discText =
                  item.discountValue > 0
                    ? item.discountType === 'percentage'
                      ? `${item.discountValue}%`
                      : formatCurrency(item.discountValue, invoice.currency)
                    : '-'
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 pr-2 font-medium text-slate-900">
                      <div>{item.description}</div>
                      {item.taxPercentage > 0 && (
                        <span className="text-[10px] text-slate-400 font-normal">
                          Includes {item.taxPercentage}% tax
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-center text-slate-600 font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-2 text-right text-slate-600 font-mono">
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </td>
                    <td className="py-3.5 px-2 text-right text-slate-500 font-mono">
                      {discText}
                    </td>
                    <td className="py-3.5 pl-2 text-right font-semibold text-slate-900 font-mono">
                      {formatCurrency(item.amount, invoice.currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200">
          <div className="w-full sm:max-w-xs space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Amount in Words
            </div>
            <p className="text-xs font-medium text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
              "{invoice.amountInWords}"
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
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
                <span>{invoice.taxLabel || 'VAT'}:</span>
                <span className="font-mono text-slate-800">{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 border-slate-900 text-sm sm:text-base font-bold text-slate-900">
              <span>Total:</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-xs text-emerald-600 pt-1">
                  <span>Amount Paid:</span>
                  <span className="font-mono">-{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-rose-600 pt-1 border-t border-slate-100">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(invoice.remainingBalance, invoice.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="space-y-1.5">
            <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-900">
              Bank Payment Details
            </h3>
            <p><span className="text-slate-400">Bank:</span> <strong className="text-slate-800">{payment.bankName}</strong></p>
            <p><span className="text-slate-400">Account Name:</span> {payment.accountName}</p>
            <p><span className="text-slate-400">Account No:</span> <span className="font-mono font-bold text-slate-800">{payment.accountNumber}</span></p>
            <p><span className="text-slate-400">Branch:</span> {payment.branch}</p>
            {payment.routingNumber && <p><span className="text-slate-400">Routing No:</span> <span className="font-mono">{payment.routingNumber}</span></p>}
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-[11px] uppercase tracking-wider text-slate-900">
              Mobile Banking (MFS)
            </h3>
            {payment.bkashNumber && (
              <p><span className="text-slate-400">bKash:</span> <span className="font-mono font-semibold text-slate-800">{payment.bkashNumber}</span></p>
            )}
            {payment.nagadNumber && (
              <p><span className="text-slate-400">Nagad:</span> <span className="font-mono font-semibold text-slate-800">{payment.nagadNumber}</span></p>
            )}
            {payment.additionalInstructions && (
              <p className="text-[11px] text-slate-500 pt-1 leading-normal italic">{payment.additionalInstructions}</p>
            )}
          </div>
        </div>

        {/* Notes & Terms */}
        {(invoice.notes || invoice.terms) && (
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-slate-500 leading-relaxed">
            {invoice.notes && (
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Notes</h4>
                <p>{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">Terms & Conditions</h4>
                <p className="whitespace-pre-line">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signature & Bottom Brand Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200">
        <div className="flex justify-between items-end">
          <div className="text-[11px] text-slate-400">
            <p className="font-semibold text-slate-700">{company.name} — {company.tagline}</p>
            <p>{company.website} • {company.email} • {company.phone}</p>
          </div>

          <div className="text-right">
            {invoice.signatureUrl ? (
              <img
                src={invoice.signatureUrl}
                alt="Signature"
                className="h-10 w-auto ml-auto mb-1 object-contain"
              />
            ) : (
              <div className="font-serif italic text-lg text-slate-800 mb-1">
                {invoice.authorizedBy}
              </div>
            )}
            <div className="w-40 border-t border-slate-300 pt-1 ml-auto">
              <p className="font-bold text-xs text-slate-900">{invoice.authorizedBy}</p>
              <p className="text-[10px] text-slate-500">{invoice.designation}</p>
              <p className="text-[9px] uppercase tracking-wider font-semibold text-brand-primary">{company.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
