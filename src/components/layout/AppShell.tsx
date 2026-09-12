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
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={onNavigate}
        onCreateInvoice={onCreateInvoice}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentTab={currentTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onCreateInvoice={onCreateInvoice}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
