import re

with open('src/components/settings/CompanyProfile.tsx', 'r') as f:
    content = f.read()

# 1. Update imports and setup
setup_old = """import React, { useRef } from 'react'
import { Company } from '../../types/invoice'
import { useInvoice } from '../../context/InvoiceContext'
import { useToast } from '../../context/ToastContext'
import { Upload, Trash2, Building, Globe, Mail, Phone, MapPin } from 'lucide-react'

export const CompanyProfile: React.FC = () => {
  const { company, updateCompany, settings, updateSettings } = useInvoice()
  const { success, error } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFieldChange = (field: keyof Company, value: string) => {
    updateCompany({ [field]: value })
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
      updateCompany({ logoUrl: base64 })
      success('Company logo updated successfully.')
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveLogo = () => {
    updateCompany({ logoUrl: undefined })
    success('Company logo removed.')
  }"""

setup_new = """import React, { useRef, useState, useEffect } from 'react'
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
  }"""

content = content.replace(setup_old, setup_new)

# 2. Replace company. with localCompany. and settings. with localSettings. inside the return statement
parts = content.split('return (')
jsx_part = parts[1]

jsx_part = jsx_part.replace('company.', 'localCompany.')
jsx_part = jsx_part.replace('settings.', 'localSettings.')

# 3. Fix onChange handlers for settings
jsx_part = jsx_part.replace("updateSettings({ primaryColor: e.target.value })", "setLocalSettings(prev => ({ ...prev, primaryColor: e.target.value })); setIsDirty(true)")
jsx_part = jsx_part.replace("updateSettings({ documentTitle: e.target.value })", "setLocalSettings(prev => ({ ...prev, documentTitle: e.target.value })); setIsDirty(true)")

# 4. Add Save Button at the end
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

with open('src/components/settings/CompanyProfile.tsx', 'w') as f:
    f.write(new_content)

print("Updated successfully")
