import re

with open('src/components/settings/PaymentMethods.tsx', 'r') as f:
    content = f.read()

setup_old = """import React from 'react'
import { PaymentSettings } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { Landmark, Smartphone, Info } from 'lucide-react'

export const PaymentMethods: React.FC = () => {
  const { paymentSettings, updatePaymentSettings } = useInvoice()

  const handleFieldChange = (field: keyof PaymentSettings, value: string) => {
    updatePaymentSettings({ [field]: value })
  }"""

setup_new = """import React, { useState, useEffect } from 'react'
import { PaymentSettings } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { Landmark, Smartphone, Info, Save } from 'lucide-react'

export const PaymentMethods: React.FC = () => {
  const { paymentSettings, updatePaymentSettings } = useInvoice()
  const [localPaymentSettings, setLocalPaymentSettings] = useState<PaymentSettings>(paymentSettings)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setLocalPaymentSettings(paymentSettings)
    setIsDirty(false)
  }, [paymentSettings])

  const handleFieldChange = (field: keyof PaymentSettings, value: string) => {
    setLocalPaymentSettings(prev => ({ ...prev, [field]: value }))
    setIsDirty(true)
  }

  const handleSave = () => {
    if (isDirty) {
      updatePaymentSettings(localPaymentSettings)
      setIsDirty(false)
    }
  }"""

content = content.replace(setup_old, setup_new)

parts = content.split('return (')
jsx_part = parts[1]

jsx_part = jsx_part.replace('paymentSettings.', 'localPaymentSettings.')

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

with open('src/components/settings/PaymentMethods.tsx', 'w') as f:
    f.write(new_content)

print("PaymentMethods updated")
