import React, { useState, useMemo } from 'react'
import { Service } from '../../types/invoice'
import { ServiceModal } from './ServiceModal'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { EmptyState } from '../common/EmptyState'
import { formatCurrency } from '../../services/currency'
import { Search, Plus, Edit, Trash2, Layers } from 'lucide-react'

interface ServiceListProps {
  services: Service[]
  onAddService: (service: Omit<Service, 'id'>) => Service
  onUpdateService: (id: string, updates: Partial<Service>) => void
  onDeleteService: (id: string) => void
}

export const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
}) => {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    if (!search.trim()) return services
    const q = search.toLowerCase()
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    )
  }, [services, search])

  const handleEdit = (s: Service) => {
    setEditingService(s)
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleSave = (data: Omit<Service, 'id'>) => {
    if (editingService) {
      onUpdateService(editingService.id, data)
    } else {
      onAddService(data)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Services &amp; Offerings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure reusable service catalog templates with default rates and scopes
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-sky-600/20 transition-all hover:shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Service</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search software services, tech stacks, maintenance packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <EmptyState
          icon={<Layers className="w-6 h-6" />}
          title={search ? 'No matching services found' : 'No services configured'}
          description={
            search
              ? `No services match "${search}".`
              : 'Add your software development services to rapidly insert them into invoices.'
          }
          actionLabel={search ? 'Clear Search' : '+ Add Service'}
          onAction={search ? () => setSearch('') : handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {s.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(s)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(s.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-3">
                  {s.description || 'No detailed scope provided.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Default Rate
                  </span>
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {formatCurrency(s.defaultPrice, 'BDT')}
                    <span className="text-[10px] font-sans text-slate-400 font-normal ml-1">
                      /{s.unit}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Tax: {s.defaultTax}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={editingService}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) onDeleteService(deleteTargetId)
        }}
        title="Delete Service"
        message="Are you sure you want to delete this service template?"
        confirmText="Delete Service"
        variant="danger"
      />
    </div>
  )
}
