import re

with open('src/components/settings/InvoiceDefaults.tsx', 'r') as f:
    content = f.read()

setup_old = """import React from 'react'
import { CurrencyCode, InvoiceSettings, InvoiceTemplateId } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { Sliders, Hash, Percent, FileText } from 'lucide-react'

export const InvoiceDefaults: React.FC = () => {
  const { settings, updateSettings } = useInvoice()

  const handleFieldChange = (field: keyof InvoiceSettings, value: unknown) => {
    updateSettings({ [field]: value })
  }"""

setup_new = """import React, { useState, useEffect } from 'react'
import { CurrencyCode, InvoiceSettings, InvoiceTemplateId } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { Sliders, Hash, Percent, FileText, Save } from 'lucide-react'

export const InvoiceDefaults: React.FC = () => {
  const { settings, updateSettings } = useInvoice()
  const [localSettings, setLocalSettings] = useState<InvoiceSettings>(settings)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
    setIsDirty(false)
  }, [settings])

  const handleFieldChange = (field: keyof InvoiceSettings, value: unknown) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (isDirty) {
      updateSettings(localSettings)
      setIsDirty(false)
    }
  }"""

content = content.replace(setup_old, setup_new)

parts = content.split('return (')
jsx_part = parts[1]

jsx_part = jsx_part.replace('settings.', 'localSettings.')

save_button_html = """
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
"""

jsx_part = jsx_part.replace("    </div>\n  )\n}", save_button_html)

new_content = parts[0] + 'return (' + jsx_part

with open('src/components/settings/InvoiceDefaults.tsx', 'w') as f:
    f.write(new_content)

print("InvoiceDefaults updated")
