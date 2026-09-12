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
    <div className="bg-white text-slate-900 p-8 sm:p-12 print:p-0 w-full max-w-[794px] mx-auto min-h-[1123px] print:min-h-0 print:h-auto flex flex-col justify-between print:block text-xs sm:text-sm font-serif border border-slate-300 print:border-none">
      <div>
        {/* Header */}
        <div className="border-b-2 border-slate-800 pb-6 print:pb-2.5">
          <div className="flex justify-between items-start">
            <div>
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-11 w-auto max-w-[190px] object-contain mb-2 print:h-8 print:mb-1"
                />
              ) : (
                <h1 className="font-bold text-2xl tracking-tight text-slate-950 font-serif print:text-lg">
                  {company.name}
                </h1>
              )}
              <div className="text-xs font-sans text-slate-600 leading-normal print:text-[10px] print:leading-tight">
                <p className="font-semibold text-slate-800">{company.tagline}</p>
                <p>{company.address}, {company.city}</p>
                <p>{company.phone} | {company.email}</p>
                {company.binVat && <p>VAT Reg: {company.binVat} {company.tin && `| TIN: ${company.tin}`}</p>}
              </div>
            </div>

            <div className="text-right font-sans">
              <div className="inline-block border-2 border-slate-900 px-4 py-1.5 font-bold uppercase tracking-wider text-sm mb-2 print:px-2.5 print:py-0.5 print:text-xs print:mb-1">
                {company.documentTitle || 'INVOICE'}
              </div>
              <div className="text-xs space-y-1 print:text-[10px] print:space-y-0.5">
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
                <div className="pt-1 print:pt-0">
                  <StatusBadge status={invoice.status} size="sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200 font-sans print:py-2.5 print:gap-4">
          <div className="border-l-4 border-slate-800 pl-4 print:pl-2.5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1 print:text-[9.5px] print:mb-0.5">
              Customer Details
            </h3>
            <div className="font-bold text-sm text-slate-900 print:text-xs">{customer.name}</div>
            {customer.companyName && <div className="text-xs text-slate-700 print:text-[10.5px]">{customer.companyName}</div>}
            <div className="text-xs text-slate-600 mt-1 leading-relaxed print:text-[10px] print:leading-tight print:mt-0.5">
              {customer.address && <div>{customer.address}</div>}
              {customer.city && <div>{customer.city}, {customer.country}</div>}
              {customer.email && <div>Email: {customer.email}</div>}
              {customer.phone && <div>Tel: {customer.phone}</div>}
              {customer.taxId && <div>Tax ID: {customer.taxId}</div>}
            </div>
          </div>

          <div className="bg-slate-100 p-4 border border-slate-200 text-xs space-y-1.5 print:p-2.5 print:text-[10px] print:space-y-0.5">
            <h3 className="font-bold uppercase tracking-wider text-slate-700 print:text-[9.5px]">Billing Notice</h3>
            <p className="text-slate-600">
              Payment Terms: <strong>{invoice.paymentTerms || 'Standard'}</strong>
            </p>
            <p className="text-slate-600">
              Currency: <strong>{invoice.currency}</strong>
            </p>
            <div className="pt-2 border-t border-slate-200 print:pt-1">
              <span className="text-slate-500 block print:text-[9px]">Total Due:</span>
              <span className="text-xl font-bold font-mono text-slate-900 print:text-base">
                {formatCurrency(invoice.remainingBalance > 0 ? invoice.remainingBalance : invoice.grandTotal, invoice.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="py-6 font-sans print:py-2">
          <table className="w-full text-left border border-slate-300">
            <thead className="bg-slate-100 border-b border-slate-300 text-xs font-bold uppercase text-slate-700 print:text-[10px]">
              <tr>
                <th className="p-3 border-r border-slate-300 print:py-1 print:px-2">Item Description</th>
                <th className="p-3 text-center w-16 border-r border-slate-300 print:py-1 print:px-2 print:w-12">Qty</th>
                <th className="p-3 text-right w-24 border-r border-slate-300 print:py-1 print:px-2 print:w-20">Rate</th>
                <th className="p-3 text-right w-20 border-r border-slate-300 print:py-1 print:px-2 print:w-16">Discount</th>
                <th className="p-3 text-right w-28 print:py-1 print:px-2 print:w-24">Amount</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-200 print:text-[10.5px]">
              {invoice.items.map((item) => (
                <tr key={item.id} className="print:break-inside-avoid">
                  <td className="p-3 border-r border-slate-200 print:py-1.5 print:px-2">
                    <span className="font-semibold text-slate-900">{item.description}</span>
                  </td>
                  <td className="p-3 text-center border-r border-slate-200 font-mono print:py-1.5 print:px-2">
                    {item.quantity}
                  </td>
                  <td className="p-3 text-right border-r border-slate-200 font-mono print:py-1.5 print:px-2">
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </td>
                  <td className="p-3 text-right border-r border-slate-200 font-mono print:py-1.5 print:px-2">
                    {item.discountValue > 0
                      ? item.discountType === 'percentage'
                        ? `${item.discountValue}%`
                        : formatCurrency(item.discountValue, invoice.currency)
                      : '-'}
                  </td>
                  <td className="p-3 text-right font-bold font-mono text-slate-900 print:py-1.5 print:px-2">
                    {formatCurrency(item.amount, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total & Amount in words */}
        <div className="grid grid-cols-2 gap-6 pt-2 font-sans print:pt-1 print:gap-4 print:break-inside-avoid">
          <div className="space-y-2 print:space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 print:text-[9.5px]">
              Amount in Words:
            </span>
            <p className="text-xs italic p-3 border border-slate-200 bg-slate-50 font-serif print:p-2 print:text-[10px]">
              "{invoice.amountInWords}"
            </p>
          </div>

          <div className="space-y-2 border border-slate-300 p-4 bg-slate-50 text-xs print:p-2.5 print:space-y-0.5 print:text-[10.5px]">
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
            <div className="flex justify-between text-sm font-bold pt-2 border-t-2 border-slate-800 text-slate-900 print:pt-1 print:text-xs">
              <span>Grand Total:</span>
              <span className="font-mono">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <>
                <div className="flex justify-between text-emerald-700 pt-1 print:pt-0.5">
                  <span>Paid Amount:</span>
                  <span className="font-mono">-{formatCurrency(invoice.paidAmount, invoice.currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-rose-700 pt-1 border-t border-slate-200 print:pt-0.5">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatCurrency(invoice.remainingBalance, invoice.currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment and Terms */}
        <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t border-slate-200 text-xs font-sans print:mt-2.5 print:pt-2 print:gap-4 print:break-inside-avoid print:text-[10px]">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1 print:text-[9.5px] print:mb-0.5">
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
                <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-1 print:text-[9.5px] print:mb-0.5">
                  Terms & Conditions
                </h4>
                <p className="text-[11px] text-slate-600 whitespace-pre-line print:text-[9.5px] print:leading-tight">{invoice.terms}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-10 pt-6 border-t border-slate-300 font-sans flex justify-between items-end print:mt-3 print:pt-2 print:break-inside-avoid">
        <div className="text-[11px] text-slate-500 print:text-[9px]">
          Official billing document issued by {company.name}.
        </div>
        <div className="text-center w-48 print:w-36">
          {invoice.signatureUrl ? (
            <img src={invoice.signatureUrl} alt="Signature" className="h-10 mx-auto mb-1 object-contain print:h-7 print:mb-0.5" />
          ) : (
            <div className="font-serif italic text-base mb-1 print:text-sm print:mb-0.5">{invoice.authorizedBy}</div>
          )}
          <div className="border-t border-slate-400 pt-1 print:pt-0.5">
            <p className="font-bold text-xs print:text-[10px]">{invoice.authorizedBy}</p>
            <p className="text-[10px] text-slate-500 print:text-[9px]">{invoice.designation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
