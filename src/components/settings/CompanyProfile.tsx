import React, { useRef, useState, useEffect } from 'react'
import { Company } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { useToast } from '../../context/ToastContext'
import { Upload, Trash2, Building, Globe, Mail, Phone, MapPin, Save } from 'lucide-react'

export const CompanyProfile: React.FC = () => {
  const { company, updateCompany, settings, updateSettings } = useInvoice()
  const { success, error } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [localCompany, setLocalCompany] = useState<Company>(company)
  const [localSettings, setLocalSettings] = useState(settings)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setLocalCompany(company)
    setLocalSettings(settings)
    setIsDirty(false)
  }, [company, settings])

  const handleFieldChange = (field: keyof Company, value: string) => {
    setLocalCompany(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 3 * 1024 * 1024) {
      error('Logo image must be under 3MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setLocalCompany(prev => ({ ...prev, logoUrl: base64 }))
      setIsDirty(true)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    setLocalCompany(prev => ({ ...prev, logoUrl: undefined }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (isDirty) {
      updateCompany(localCompany)
      updateSettings(localSettings)
      setIsDirty(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Company Profile &amp; Branding
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          This corporate identity is stamped onto all newly created invoices
        </p>
      </div>

      {/* Logo Upload Section */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Official Company Logo
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-48 h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden shadow-xs">
            {localCompany.logoUrl ? (
              <img
                src={localCompany.logoUrl}
                alt={localCompany.name}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-xs font-bold text-slate-400">No Logo Uploaded</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{localCompany.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
            </button>

            {localCompany.logoUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 hover:text-rose-600 text-xs font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Supported formats: PNG, JPG, SVG, WebP (Max 3MB). Aspect ratio is always preserved.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Company Name *
          </label>
          <input
            type="text"
            value={localCompany.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Tagline / Subtitle
          </label>
          <input
            type="text"
            value={localCompany.tagline}
            onChange={(e) => handleFieldChange('tagline', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={localCompany.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            City &amp; Postal Code
          </label>
          <input
            type="text"
            value={localCompany.city}
            onChange={(e) => handleFieldChange('city', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Country
          </label>
          <input
            type="text"
            value={localCompany.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Billing Email
          </label>
          <input
            type="email"
            value={localCompany.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={localCompany.phone}
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Website URL
          </label>
          <input
            type="text"
            value={localCompany.website}
            onChange={(e) => handleFieldChange('website', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Trade License / Reg Number
          </label>
          <input
            type="text"
            value={localCompany.businessRegNo || ''}
            onChange={(e) => handleFieldChange('businessRegNo', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Taxpayer Identification (TIN)
          </label>
          <input
            type="text"
            value={localCompany.tin || ''}
            onChange={(e) => handleFieldChange('tin', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            BIN / VAT Number
          </label>
          <input
            type="text"
            value={localCompany.binVat || ''}
            onChange={(e) => handleFieldChange('binVat', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
          />
        </div>
      </div>

      {/* Branding Setup */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Brand Identity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Customize the core accent color used across the app and on your PDF invoices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={localSettings.primaryColor || '#0284c7'}
                onChange={(e) => { setLocalSettings(prev => ({ ...prev, primaryColor: e.target.value })); setIsDirty(true); }}
                className="w-10 h-10 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={localSettings.primaryColor || '#0284c7'}
                onChange={(e) => { setLocalSettings(prev => ({ ...prev, primaryColor: e.target.value })); setIsDirty(true); }}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono uppercase focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Document Title Label
            </label>
            <input
              type="text"
              placeholder="e.g. INVOICE, TAX INVOICE"
              value={localSettings.documentTitle || 'INVOICE'}
              onChange={(e) => { setLocalSettings(prev => ({ ...prev, documentTitle: e.target.value })); setIsDirty(true); }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 uppercase tracking-widest"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}

