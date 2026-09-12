import React, { useState } from 'react'
import { CompanyProfile } from './CompanyProfile'
import { PaymentMethods } from './PaymentMethods'
import { InvoiceDefaults } from './InvoiceDefaults'
import { DataBackup } from './DataBackup'
import { Building2, CreditCard, Sliders, Database } from 'lucide-react'

type SettingsTab = 'company' | 'payment' | 'defaults' | 'data'

export const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('company')

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'company', label: 'Company Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'defaults', label: 'Invoice Defaults', icon: <Sliders className="w-4 h-4" /> },
    { id: 'data', label: 'Data & Backup', icon: <Database className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure business credentials, payment details, billing rules, and data portability
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-sky-600 text-sky-600 dark:text-sky-400 bg-sky-50/50 dark:bg-sky-950/30'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'company' && <CompanyProfile />}
        {activeTab === 'payment' && <PaymentMethods />}
        {activeTab === 'defaults' && <InvoiceDefaults />}
        {activeTab === 'data' && <DataBackup />}
      </div>
    </div>
  )
}
