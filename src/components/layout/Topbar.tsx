import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { NavTab } from './Sidebar'
import { Menu, Sun, Moon, Plus } from 'lucide-react'

interface TopbarProps {
  currentTab: NavTab
  onOpenMobileMenu: () => void
  onCreateInvoice: () => void
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTab,
  onOpenMobileMenu,
  onCreateInvoice,
}) => {
  const { theme, toggleTheme } = useTheme()

  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview & metrics' },
    invoices: { title: 'Invoices', subtitle: 'Invoice management' },
    customers: { title: 'Customers', subtitle: 'Client profiles' },
    services: { title: 'Services Catalog', subtitle: 'Development offerings' },
    templates: { title: 'Invoice Templates', subtitle: 'A4 design gallery' },
    settings: { title: 'Settings', subtitle: 'System preferences' },
  }

  const { title, subtitle } = titles[currentTab] || { title: 'Workspace', subtitle: '' }

  return (
    <header className="no-print h-16 bg-white/75 dark:bg-slate-900/75 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h2>
          <p className="text-[11px] text-slate-400 hidden sm:block leading-none mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-brand-primary" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        <button
          type="button"
          onClick={onCreateInvoice}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-sm shadow-brand-glow transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Invoice</span>
        </button>
      </div>
    </header>
  )
}
