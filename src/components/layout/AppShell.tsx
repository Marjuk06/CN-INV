import React, { useState } from 'react'
import { Sidebar, NavTab } from './Sidebar'
import { Topbar } from './Topbar'

interface AppShellProps {
  currentTab: NavTab
  onNavigate: (tab: NavTab) => void
  onCreateInvoice: () => void
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onNavigate,
  onCreateInvoice,
  children,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200 print:!bg-white print:!bg-none print:!text-black">
      {/* Sidebar */}
      <div className="print:hidden"><Sidebar
        currentTab={currentTab}
        onNavigate={onNavigate}
        onCreateInvoice={onCreateInvoice}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      /></div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:h-auto print:overflow-visible">
        <div className="print:hidden shrink-0">
          <Topbar
            currentTab={currentTab}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onCreateInvoice={onCreateInvoice}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto print:overflow-visible print:p-0 print:max-w-none print:w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
