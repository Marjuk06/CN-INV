import React from 'react'
import { Invoice } from '../../types/invoice'
import { formatCurrency } from '../../services/currency'
import { StatusBadge } from '../common/StatusBadge'

interface TemplateProps {
  invoice: Invoice
}

export const CodenestClassic: React.FC<TemplateProps> = ({ invoice }) => {
  const company = invoice.companySnapshot
  const customer = invoice.customerSnapshot
  const payment = invoice.paymentSnapshot

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-12 w-full max-w-[794px] mx-auto min-h-[1123px] flex flex-col justify-between text-xs sm:text-sm font-serif border border-slate-300">
      <div>
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-6">
          <div className="flex justify-between items-start">
            <div>
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-11 w-auto max-w-[190px] object-contain mb-2"
                />
              ) : (
                <h1 className="font-bold text-2xl tracking-tight text-slate-950 font-serif">
                  {company.name}
                </h1>
              )}
              <div className="text-xs font-sans text-slate-600 leading-normal">
                <p className="font-semibold text-slate-800">{company.tagline}</p>
                <p>{company.address}, {company.city}</p>
                <p>{company.phone} | {company.email}</p>
                {company.binVat && <p>VAT Reg: {company.binVat} {company.tin && `| TIN: ${company.tin}`}</p>}
              </div>
            </div>

            <div className="text-right font-sans">
              <div className="inline-block border-2 border-slate-900 px-4 py-1.5 font-bold uppercase tracking-wider text-sm mb-2">
                {company.documentTitle || 'INVOICE'}
              </div>
              <div className="text-xs space-y-1">
                <p>
                  <span className="text-slate-500">Invoice No:</span>{' '}
                  <strong className="font-mono text-slate-900">{invoice.invoiceNumber}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Date:</span> <strong>{invoice.date}</strong>
                </p>
                <p>
                  <span className="text-slate-500">Due Date:</span> <strong>{invoice.dueDate}</strong>
                </p>
                <div className="pt-1">
                  <StatusBadge status={invoice.status} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 font-sans">
          <div className="border-l-4 border-slate-800 pl-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
              Customer Details
            </h3>
            <div className="font-bold text-sm text-slate-900">{customer.name}</div>
            {customer.companyName && <div className="text-xs text-slate-700">{customer.companyName}</div>}
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              {customer.address && <div>{customer.address}</div>}
              {customer.city && <div>{customer.city}, {customer.country}</div>}
              {customer.email && <div>Email: {customer.email}</div>}
              {customer.phone && <div>Tel: {customer.phone}</div>}
              {customer.taxId && <div>Tax ID: {customer.taxId}</div>}
            </div>
          </div>

          <div className="bg-slate-100 p-4 border border-slate-200 text-xs space-y-1.5">
            <h3 className="font-bold uppercase tracking-wider text-slate-700">Billing Notice</h3>
            <p className="text-slate-600">
              Payment Terms: <strong>{invoice.paymentTerms || 'Standard'}</strong>
            </p>
            <p className="text-slate-600">
              Currency: <strong>{invoice.currency}</strong>
            </p>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block">Total Due:</span>
              <span className="text-xl font-bold font-mono text-slate-900">
                {formatCurrency(invoice.remainingBalance > 0 ? invoice.remainingBalance : invoice.grandTotal, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 font-sans">
          <table className="w-full text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 text-xs font-bold uppercase text-slate-700">
              <tr>
                <th className="p-3 border-r border-slate-300">Item Description</th>
                <th className="p-3 text-center w-16 border-r border-slate-300">Qty</th>
                <th className="p-3 text-right w-24 border-r border-slate-300">Rate</th>
                <th className="p-3 text-right w-20 border-r border-slate-300">Discount</th>
                <th className="p-3 text-right w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-200">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="p-3 border-r border-slate-200">
                    <span className="font-semibold text-slate-900">{item.description}</span>
                  </td>
                  <td className="p-3 text-center border-r border-slate-200 font-mono">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right border-r border-slate-200 font-mono">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="p-3 text-right border-r border-slate-200 font-mono">
                    {item.discountValue > 0
                      ? item.discountType === 'percentage'
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, invoice.currency)
                      : '-'}
                  </td>
                  <td className="p-3 text-right font-bold font-mono text-slate-900">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Amount in words */}
        <div className="grid grid-cols-2 gap-6 pt-2 font-sans">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Amount in Words:
            </span>
            <p className="text-xs italic p-3 border border-slate-200 bg-slate-50 font-serif">
              "{invoice.amountInWords}"
            </p>
          </div>

          <div className="space-y-2 border border-slate-300 p-4 bg-slate-50 text-xs">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono font-bold">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
            </div>
            {invoice.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-mono">-{formatCurrency(invoice.discountTotal, invoice.currency)}</span>
              </div>
            )}
            {invoice.taxTotal > 0 && (
              <div className="flex justify-between">
                <span>{invoice.taxLabel || 'Tax'}:</span>
                <span className="font-mono font-bold">{formatCurrency(invoice.taxTotal, invoice.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-2 border-t-2 border-slate-800 text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-emerald-700 pt-1">
                  <span>Paid Amount:</span>
                  <span className="font-mono">-{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700 pt-1 border-t border-slate-200">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(invoice.remainingBalance, invoice.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment and Terms */}
        <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t border-slate-200 text-xs font-sans">
          <div>
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
              Payment Instructions
            </h4>
            <p>Bank: <strong>{payment.bankName}</strong></p>
            <p>A/C Name: {payment.accountName}</p>
            <p>A/C No: <strong className="font-mono">{payment.accountNumber}</strong></p>
            <p>Branch: {payment.branch} | Routing: {payment.routingNumber}</p>
            {payment.bkashNumber && <p>bKash: {payment.bkashNumber}</p>}
          </div>
          <div>
            {invoice.terms && (
              <>
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Terms & Conditions
                </h4>
                <p className="text-[11px] text-slate-600 whitespace-pre-line">{invoice.terms}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-10 pt-6 border-t border-slate-300 font-sans flex justify-between items-end">
        <div className="text-[11px] text-slate-500">
          Official billing document issued by {company.name}.
        </div>
        <div className="text-center w-48">
          {invoice.signatureUrl ? (
            <img src={invoice.signatureUrl} alt="Signature" className="h-10 mx-auto mb-1 object-contain" />
          ) : (
            <div className="font-serif italic text-base mb-1">{invoice.authorizedBy}</div>
          )}
          <div className="border-t border-slate-400 pt-1">
            <p className="font-bold text-xs">{invoice.authorizedBy}</p>
            <p className="text-[10px] text-slate-500">{invoice.designation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
