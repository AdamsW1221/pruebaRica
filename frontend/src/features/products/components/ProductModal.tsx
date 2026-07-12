import { useState, useEffect } from 'react'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import type { Product, ProductCreateData, ProductUpdateData } from '../services/productService'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProductCreateData | ProductUpdateData) => Promise<void>
  editingProduct?: Product | null
}

interface FormState {
  name: string
  description: string
  quantity: string
  imageUrl: string
}

interface FormErrors {
  name: string
  quantity: string
}

export function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
  const [form, setForm] = useState<FormState>({ name: '', description: '', quantity: '0', imageUrl: '' })
  const [errors, setErrors] = useState<FormErrors>({ name: '', quantity: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description,
        quantity: String(editingProduct.quantity),
        imageUrl: editingProduct.imageUrl ?? '',
      })
    } else {
      setForm({ name: '', description: '', quantity: '0', imageUrl: '' })
    }
    setErrors({ name: '', quantity: '' })
  }, [editingProduct, isOpen])

  const validate = () => {
    const e: FormErrors = { name: '', quantity: '' }
    let valid = true
    if (!form.name.trim()) { e.name = 'El nombre del producto es obligatorio.'; valid = false }
    if (form.name.trim().length > 100) { e.name = 'El nombre no puede exceder 100 caracteres.'; valid = false }
    const qty = Number(form.quantity)
    if (isNaN(qty) || qty < 0) { e.quantity = 'La cantidad debe ser un número mayor o igual a 0.'; valid = false }
    setErrors(e)
    return valid
  }

  const handleSave = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        quantity: Number(form.quantity),
        imageUrl: form.imageUrl.trim() || null,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen seleccionada excede el límite de 2MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setForm((prev) => ({ ...prev, imageUrl: base64 }))
    }
    reader.readAsDataURL(file)
  }

  const isEditing = !!editingProduct

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Producto' : 'Agregar Producto'} maxWidth={560}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              id="product-name"
              label="Nombre del producto *"
              placeholder="Ej. Harina Rica 500g"
              value={form.name}
              onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: '' })) }}
              error={errors.name}
              maxLength={100}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <Input
              id="product-quantity"
              label="Cantidad *"
              type="number"
              placeholder="0"
              min={0}
              value={form.quantity}
              onChange={(e) => { setForm((p) => ({ ...p, quantity: e.target.value })); setErrors((p) => ({ ...p, quantity: '' })) }}
              error={errors.quantity}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#515D73' }}>Imagen del producto</span>
          <div
            style={{
              border: '2px dashed #DCEAF7',
              borderRadius: 12,
              padding: '24px 16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0033A0'
              e.currentTarget.style.background = '#f0f4fa'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#DCEAF7'
              e.currentTarget.style.background = '#f8fafc'
            }}
            onClick={() => document.getElementById('product-file-input')?.click()}
          >
            <input
              type="file"
              id="product-file-input"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="#4066B8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28, marginBottom: 8 }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontSize: 12, color: '#0033A0', fontWeight: 600 }}>Seleccionar imagen desde tu equipo</span>
            <span style={{ fontSize: 11, color: '#515D73', marginTop: 2 }}>Soporta PNG, JPG, WEBP (Máx. 2MB)</span>
          </div>
        </div>

        {form.imageUrl && (
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1.5px solid #DCEAF7', height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb' }}>
            <img
              src={form.imageUrl}
              alt="Vista previa"
              style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain' }}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setForm((p) => ({ ...p, imageUrl: '' }))
              }}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#F4313F',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 24,
                height: 24,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
              title="Remover imagen"
            >
              ✕
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="product-description" style={{ fontSize: 13, fontWeight: 600, color: '#515D73' }}>
            Descripción
          </label>
          <textarea
            id="product-description"
            placeholder="Breve descripción del producto..."
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            maxLength={500}
            rows={3}
            style={{
              padding: '11px 14px',
              borderRadius: 10,
              border: '1.5px solid #DCEAF7',
              fontSize: 14,
              fontFamily: 'Poppins, sans-serif',
              color: '#1a1a2e',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#0033A0' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#DCEAF7' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
          <Button variant="ghost" onClick={onClose} id="product-modal-cancel">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading} id="product-modal-save">
            {isEditing ? 'Guardar cambios' : 'Agregar producto'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
