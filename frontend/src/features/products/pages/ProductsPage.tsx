import { useEffect, useState, useMemo } from 'react'
import { useProductStore } from '../store/useProductStore'
import { useAuthStore } from '../../auth/store/useAuthStore'
import { useToast } from '../../../components/ui/useToast'
import { Button } from '../../../components/ui/Button'
import { ProductTable } from '../components/ProductTable'
import { ProductCards } from '../components/ProductCards'
import { ProductModal } from '../components/ProductModal'
import { DeleteConfirmModal } from '../components/DeleteConfirmModal'
import type { Product } from '../services/productService'

type FilterType = 'todos' | 'inactivos'

export default function ProductsPage() {
  const { products, loading, fetchProducts, addProduct, editProduct, deactivateProduct, removeProduct, toggleActive } = useProductStore()
  const { user } = useAuthStore()
  const toast = useToast()
  const role = user?.role?.toLowerCase()
  const isAdmin = role === 'admin' || role === 'superadmin'

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('todos')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const filtered = useMemo(() => {
    let list = [...products]
    if (!isAdmin) {

      list = list.filter((p) => p.active && !p.isDesactivate)
    } else {
      if (filter === 'inactivos') list = list.filter((p) => p.isDesactivate)
      if (filter === 'todos') list = list.filter((p) => !p.isDesactivate)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }
    return list
  }, [products, filter, search, isAdmin])

  const handleOpenAdd = () => {
    setEditingProduct(null)
    setShowModal(true)
  }

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleSave = async (data: Parameters<typeof addProduct>[0]) => {
    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, data)
        toast.success('Producto actualizado correctamente.')
      } else {
        await addProduct(data)
        toast.success('Producto agregado exitosamente.')
      }
    } catch {
      toast.error('Ocurrió un error al guardar el producto.')
      throw new Error()
    }
  }

  const handleDeactivate = async (product: Product) => {
    try {
      await deactivateProduct(product.id)
      toast.success('Producto desactivado correctamente. Se movió a la sección Inactivos.')
    } catch {
      toast.error('No se pudo desactivar el producto.')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteTarget(null)
    setDeleteLoading(true)
    try {
      await removeProduct(deleteTarget.id)
      toast.success('Producto eliminado permanentemente de la base de datos.')
    } catch {
      toast.error('No se pudo eliminar permanentemente el producto.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await toggleActive(product.id, true)
      toast.success('Producto restaurado e ingresado al inventario activo.')
    } catch {
      toast.error('No se pudo restaurar el producto.')
    }
  }

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'inactivos', label: 'Inactivos' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0033A0', marginBottom: 4 }}>Productos</h1>
          <p style={{ color: '#515D73', fontSize: 14 }}>
            {isAdmin
              ? 'Administra el inventario de Grupo Rica — agrega, edita, desactiva o elimina productos'
              : 'Catálogo de productos disponibles en el inventario'}
          </p>
        </div>
        {isAdmin && (
          <Button id="add-product-btn" variant="primary" size="md" onClick={handleOpenAdd}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar Producto
          </Button>
        )}
      </div>

      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total Productos', value: products.filter((p) => !p.isDesactivate).length, color: '#0033A0', bg: '#DCEAF7' },
            { label: 'Inactivos', value: products.filter((p) => p.isDesactivate).length, color: '#92400e', bg: '#fffbeb' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: stat.bg,
                borderRadius: 16,
                padding: '20px 24px',
                border: `1px solid ${stat.bg}`,
                boxShadow: '0 2px 8px rgba(0,51,160,0.06)',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value.toLocaleString('es-DO')}</div>
              <div style={{ fontSize: 13, color: stat.color, opacity: 0.75, fontWeight: 500, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,51,160,0.07)', border: '1px solid #DCEAF7', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '18px 20px',
            borderBottom: '1px solid #f0f4fa',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4066B8', display: 'flex' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              id="product-search"
              type="text"
              placeholder="Buscar productos por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 40px',
                borderRadius: 10,
                border: '1.5px solid #DCEAF7',
                fontSize: 14,
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                background: '#f4f6fb',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#0033A0' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#DCEAF7' }}
            />
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', gap: 6 }}>
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  id={`filter-${opt.key}`}
                  onClick={() => setFilter(opt.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: filter === opt.key ? '2px solid #0033A0' : '2px solid transparent',
                    background: filter === opt.key ? '#0033A0' : '#f4f6fb',
                    color: filter === opt.key ? '#fff' : '#515D73',
                    fontWeight: 600,
                    fontSize: 13,
                    fontFamily: 'Poppins, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12, color: '#4066B8' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 28, height: 28, animation: 'spin 0.8s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Cargando productos...</span>
          </div>
        ) : (
          <div style={{ padding: isAdmin ? 0 : 20 }}>
            {isAdmin ? (
              <ProductTable
                products={filtered}
                isAdmin={isAdmin}
                onEdit={handleOpenEdit}
                onDeactivate={handleDeactivate}
                onDelete={setDeleteTarget}
                onToggleActive={handleToggleActive}
              />
            ) : (
              <ProductCards products={filtered} />
            )}
          </div>
        )}

        {!loading && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid #f0f4fa', fontSize: 13, color: '#515D73' }}>
            Mostrando <strong style={{ color: '#0033A0' }}>{filtered.length}</strong> productos
          </div>
        )}
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        editingProduct={editingProduct}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        productName={deleteTarget?.name ?? ''}
        loading={deleteLoading}
      />
    </div>
  )
}
