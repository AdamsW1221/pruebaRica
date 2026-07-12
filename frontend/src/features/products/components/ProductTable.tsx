import { useState } from 'react'
import { Badge } from '../../../components/ui/Badge'
import { Button } from '../../../components/ui/Button'
import type { Product } from '../services/productService'
import { parseImageUrl } from '../../../utils/image'

interface ProductTableProps {
  products: Product[]
  isAdmin: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onDeactivate: (product: Product) => void
  onToggleActive: (product: Product) => void
}

const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%234066B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E"

export function ProductTable({ products, isAdmin, onEdit, onDelete, onDeactivate, onToggleActive }: ProductTableProps) {
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())

  if (products.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#515D73',
          gap: 12,
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="#DCEAF7" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 64, height: 64 }}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <p style={{ fontWeight: 600, fontSize: 16 }}>No se encontraron productos</p>
        <p style={{ fontSize: 13 }}>Intenta ajustar el filtro o agrega un nuevo producto</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="product-table-responsive" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #DCEAF7' }}>
            {['Producto', 'Descripción', 'Cantidad', 'Estado', ...(isAdmin ? ['Acciones'] : [])].map((col) => (
              <th
                key={col}
                style={{
                  padding: '12px 16px',
                  textAlign: col === 'Acciones' ? 'center' : 'left',
                  color: '#0033A0',
                  fontWeight: 700,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  whiteSpace: 'nowrap',
                  ...(col === 'Acciones' ? { minWidth: 220 } : {}),
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr
              key={product.id}
              style={{
                borderBottom: '1px solid #f0f4fa',
                background: idx % 2 === 0 ? '#fff' : '#fafbff',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#DCEAF7' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = idx % 2 === 0 ? '#fff' : '#fafbff' }}
            >
              <td data-label="Producto" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                     style={{
                      width: 52,
                      height: 52,
                      borderRadius: 10,
                      overflow: 'hidden',
                      background: '#DCEAF7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: '1px solid #e8f0fb',
                    }}
                  >
                    <img
                      src={imgErrors.has(product.id) ? placeholder : parseImageUrl(product.imageUrl)}
                      alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setImgErrors((s) => new Set(s).add(product.id))}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: 14 }}>{product.name}</div>
                  </div>
                </div>
              </td>
              <td data-label="Descripción" style={{ padding: '14px 16px', color: '#515D73', maxWidth: 240 }}>
                <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description || <em style={{ opacity: 0.5 }}>Sin descripción</em>}
                </span>
              </td>
              <td data-label="Cantidad" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: product.quantity === 0 ? '#F4313F' : '#0033A0',
                  }}
                >
                  {product.quantity.toLocaleString('es-DO')}
                </span>
              </td>
              <td data-label="Estado" style={{ padding: '14px 16px' }}>
                {product.isDesactivate
                  ? <Badge variant="inactive" />
                  : product.active
                    ? <Badge variant="active" />
                    : <Badge variant="inactive" />}
              </td>
              {isAdmin && (
                <td data-label="Acciones" style={{ padding: '14px 16px', whiteSpace: 'nowrap', minWidth: 220, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap' }}>
                    {!product.isDesactivate ? (
                      <>
                        <Button
                          id={`edit-product-${product.id}`}
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(product)}
                          title="Editar producto"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Editar
                        </Button>
                        <Button
                          id={`deactivate-product-${product.id}`}
                          variant="danger"
                          size="sm"
                          onClick={() => onDeactivate(product)}
                          title="Desactivar producto"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          </svg>
                          Desactivar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          id={`activate-product-${product.id}`}
                          variant="primary"
                          size="sm"
                          onClick={() => onToggleActive(product)}
                          title="Restaurar producto"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                          </svg>
                          Restaurar
                        </Button>
                        <Button
                          id={`delete-product-${product.id}`}
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(product)}
                          title="Eliminar permanentemente"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
