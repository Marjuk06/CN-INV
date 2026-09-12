import React, { useState, useEffect } from 'react'
import { Service } from '../../types/invoice'
import { Modal } from '../common/Modal'

interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  service?: Service | null
  onSave: (serviceData: Omit<Service, 'id'>) => void
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
}) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [defaultPrice, setDefaultPrice] = useState<number>(50000)
  const [defaultTax, setDefaultTax] = useState<number>(5)
  const [unit, setUnit] = useState<Service['unit']>('project')

  useEffect(() => {
    if (service) {
      setName(service.name)
      setDescription(service.description)
      setDefaultPrice(service.defaultPrice)
      setDefaultTax(service.defaultTax)
      setUnit(service.unit)
    } else {
      setName('')
      setDescription('')
      setDefaultPrice(50000)
      setDefaultTax(5)
      setUnit('project')
    }
  }, [service, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      description: description.trim(),
      defaultPrice: Number(defaultPrice) || 0,
      defaultTax: Number(defaultTax) || 0,
      unit,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={service ? 'Edit Service' : 'Add New Service'}
      subtitle="Configure reusable software offerings for fast invoice population"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Service Title *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Development"
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
            Description &amp; Deliverables Scope
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. High-performance corporate website with Next.js, headless CMS, and SEO..."
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Price (৳)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={defaultPrice || ''}
              onChange={(e) => setDefaultPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Default Tax %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              value={defaultTax || ''}
              onChange={(e) => setDefaultTax(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
              Billing Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as Service['unit'])}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500"
            >
              <option value="project">Per Project</option>
              <option value="hour">Per Hour</option>
              <option value="month">Per Month</option>
              <option value="fixed">Fixed Rate</option>
              <option value="page">Per Page</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-sm transition-colors"
          >
            {service ? 'Update Service' : 'Save Service'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
