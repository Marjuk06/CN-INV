import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useInvoice } from '../../context/InvoiceContext'
import {
  LayoutDashboard,
  FileText,
  Users,
  Layers,
  Palette,
  Settings,
  Plus,
  Sun,
  Moon,
  Building2,
  X,
} from 'lucide-react'

export type NavTab = 'dashboard' | 'invoices' | 'customers' | 'services' | 'templates' | 'settings'

interface SidebarProps {
  currentTab: NavTab
  onNavigate: (tab: NavTab) => void
  onCreateInvoice: () => void
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onCreateInvoice,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { theme, toggleTheme } = useTheme()
  const { company, invoices } = useInvoice()

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: 'invoices',
      label: 'Invoices',
      icon: <FileText className="w-4 h-4" />,
      badge: invoices.length,
    },
    { id: 'customers', label: 'Customers', icon: <Users className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Layers className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <Palette className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ]

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 selection:bg-brand-primary selection:text-white">
      <div className="space-y-6">
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white font-black text-base shadow-sm shadow-brand-glow">
              CN
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white leading-tight">
                {company.name}
              </div>
              <div className="text-[10px] font-semibold text-brand-primary tracking-wider uppercase">
                Invoice SaaS
              </div>
            </div>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Action Button */}
        <button
          type="button"
          onClick={() => {
            onCreateInvoice()
            onCloseMobile?.()
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-brand-primary hover:bg-brand-hover text-white text-xs font-semibold rounded-xl shadow-sm shadow-brand-glow transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id)
                  onCloseMobile?.()
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-brand-light text-brand-primary font-semibold border border-brand-primary/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-brand-primary' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-brand-primary/20 text-brand-primary'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Profile & Theme Toggle */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-brand-primary" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
            Toggle
          </span>
        </button>

        {/* Company Profile Area */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {company.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate">{company.email}</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="no-print hidden lg:block w-64 h-screen shrink-0 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-white dark:bg-slate-950 z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
