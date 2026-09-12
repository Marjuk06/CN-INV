import React, { useState, useEffect } from 'react'
import { ToastProvider, useToast } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider, useInvoice } from './context/InvoiceContext'
import { AppShell } from './components/layout/AppShell'
import { NavTab } from './components/layout/Sidebar'
import { DashboardView } from './components/dashboard/DashboardView'
import { InvoiceList } from './components/invoice/InvoiceList'
import { InvoiceEditor } from './components/invoice/InvoiceEditor'
import { CustomerList } from './components/customers/CustomerList'
import { ServiceList } from './components/services/ServiceList'
import { TemplateGallery } from './components/templates/TemplateGallery'
import { SettingsView } from './components/settings/SettingsView'
import { PublicInvoiceView } from './components/public/PublicInvoiceView'
import { ShareModal } from './components/invoice/ShareModal'
import { generateInvoicePDF } from './services/pdfGenerator'
import { Customer, Invoice } from './types/invoice'

const AppContent: React.FC = () => {
  const {
    invoices,
    customers,
    services,
    activeInvoice,
    setActiveInvoice,
    createInvoice,
    duplicateInvoice,
    deleteInvoice,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addService,
    updateService,
    deleteService,
  } = useInvoice()

  const { success, error } = useToast()

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard')
  const [publicInvoiceId, setPublicInvoiceId] = useState<string | null>(null)
  const [shareTargetInvoice, setShareTargetInvoice] = useState<Invoice | null>(null)

  // Parse URL hash for routing
  useEffect(() => {
    const handleRouting = () => {
      const hash = window.location.hash
      const pathname = window.location.pathname

      // Check if URL is public customer invoice: #/invoice/:id or /invoice/:id
      if (hash.startsWith('#/invoice/')) {
        const id = hash.replace('#/invoice/', '').split('?')[0]
        setPublicInvoiceId(id)
        return
      }

      if (pathname.startsWith('/invoice/')) {
        const id = pathname.replace('/invoice/', '').split('?')[0]
        setPublicInvoiceId(id)
        return
      }

      setPublicInvoiceId(null)

      if (hash === '#/invoices') {
        setCurrentTab('invoices')
      } else if (hash === '#/customers') {
        setCurrentTab('customers')
      } else if (hash === '#/services') {
        setCurrentTab('services')
      } else if (hash === '#/templates') {
        setCurrentTab('templates')
      } else if (hash === '#/settings') {
        setCurrentTab('settings')
      } else if (hash === '#/' || hash === '#/dashboard' || hash === '') {
        setCurrentTab('dashboard')
      }
    }

    handleRouting()
    window.addEventListener('hashchange', handleRouting)
    return () => window.removeEventListener('hashchange', handleRouting)
  }, [])

  const navigateTo = (tab: NavTab) => {
    setActiveInvoice(null)
    setCurrentTab(tab)
    window.location.hash = `#/${tab}`
  }

  const handleCreateInvoice = (initialCustomer?: Customer) => {
    const newInv = createInvoice(initialCustomer)
    setActiveInvoice(newInv)
  }

  const handleSelectInvoice = (inv: Invoice) => {
    setActiveInvoice(inv)
  }

  const handleDuplicateInvoice = (id: string) => {
    const dup = duplicateInvoice(id)
    setActiveInvoice(dup)
  }

  const handleDownloadPDF = async (inv: Invoice) => {
    // If not in editor, temporarily mount/target or load into active
    try {
      setActiveInvoice(inv)
      // Allow microtask tick for DOM mount
      setTimeout(async () => {
        try {
          await generateInvoicePDF({
            elementId: 'invoice-print-area',
            filename: `Codenest-Invoice-${inv.invoiceNumber}.pdf`,
          })
          success(`PDF exported: Codenest-Invoice-${inv.invoiceNumber}.pdf`)
        } catch (err) {
          console.error(err)
          error('Error rendering PDF. You can also print from the invoice editor.')
        }
      }, 300)
    } catch (err) {
      console.error(err)
    }
  }

  // Standalone Public Customer Invoice View
  if (publicInvoiceId) {
    const publicInv = invoices.find((i) => i.id === publicInvoiceId) || null
    return (
      <PublicInvoiceView
        invoice={publicInv}
        onBackToApp={() => {
          setPublicInvoiceId(null)
          window.location.hash = '#/'
        }}
      />
    )
  }

  // Dedicated Invoice Editor with Live Split-Screen Preview
  if (activeInvoice) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <InvoiceEditor
          invoice={activeInvoice}
          onBack={() => {
            setActiveInvoice(null)
          }}
        />
      </div>
    )
  }

  // Standard Admin Workspace
  return (
    <AppShell
      currentTab={currentTab}
      onNavigate={navigateTo}
      onCreateInvoice={() => handleCreateInvoice()}
    >
      {currentTab === 'dashboard' && (
        <DashboardView
          invoices={invoices}
          onCreateInvoice={() => handleCreateInvoice()}
          onSelectInvoice={handleSelectInvoice}
          onDuplicateInvoice={handleDuplicateInvoice}
          onShareInvoice={(inv) => setShareTargetInvoice(inv)}
          onDownloadPDF={handleDownloadPDF}
          onNavigate={(tab) => navigateTo(tab)}
        />
      )}

      {currentTab === 'invoices' && (
        <InvoiceList
          invoices={invoices}
          onSelectInvoice={handleSelectInvoice}
          onCreateInvoice={() => handleCreateInvoice()}
          onDuplicateInvoice={handleDuplicateInvoice}
          onShareInvoice={(inv) => setShareTargetInvoice(inv)}
          onDownloadPDF={handleDownloadPDF}
          onDeleteInvoice={deleteInvoice}
        />
      )}

      {currentTab === 'customers' && (
        <CustomerList
          customers={customers}
          invoices={invoices}
          onAddCustomer={addCustomer}
          onUpdateCustomer={updateCustomer}
          onDeleteCustomer={deleteCustomer}
          onCreateInvoiceForCustomer={(cust) => handleCreateInvoice(cust)}
        />
      )}

      {currentTab === 'services' && (
        <ServiceList
          services={services}
          onAddService={addService}
          onUpdateService={updateService}
          onDeleteService={deleteService}
        />
      )}

      {currentTab === 'templates' && <TemplateGallery />}

      {currentTab === 'settings' && <SettingsView />}

      {/* Share Modal for Dashboard/List triggers */}
      {shareTargetInvoice && (
        <ShareModal
          isOpen={true}
          onClose={() => setShareTargetInvoice(null)}
          invoice={shareTargetInvoice}
          onDownloadPDF={() => handleDownloadPDF(shareTargetInvoice)}
        />
      )}
    </AppShell>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <InvoiceProvider>
          <AppContent />
        </InvoiceProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
