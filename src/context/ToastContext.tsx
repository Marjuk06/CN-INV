import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string, duration?: number) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string, duration: number = 4000) => {
      const id = Math.random().toString(36).substring(2, 9)
      const newToast: ToastMessage = { id, message, type, title, duration }

      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback((message: string, title?: string) => addToast(message, 'success', title), [addToast])
  const error = useCallback((message: string, title?: string) => addToast(message, 'error', title), [addToast])
  const info = useCallback((message: string, title?: string) => addToast(message, 'info', title), [addToast])
  const warning = useCallback((message: string, title?: string) => addToast(message, 'warning', title), [addToast])

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      {/* Toast Render Portal */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full no-print"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
            error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
            info: <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />,
          }

          const borders = {
            success: 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/90 dark:bg-emerald-950/80',
            error: 'border-rose-200 dark:border-rose-800/50 bg-rose-50/90 dark:bg-rose-950/80',
            warning: 'border-amber-200 dark:border-amber-800/50 bg-amber-50/90 dark:bg-amber-950/80',
            info: 'border-sky-200 dark:border-sky-800/50 bg-sky-50/90 dark:bg-sky-950/80',
          }

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all transform translate-y-0 text-slate-800 dark:text-slate-100 ${borders[t.type]}`}
            >
              {icons[t.type]}
              <div className="flex-1 min-w-0 text-xs">
                {t.title && <div className="font-semibold text-sm mb-0.5">{t.title}</div>}
                <div className="leading-relaxed font-normal">{t.message}</div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
