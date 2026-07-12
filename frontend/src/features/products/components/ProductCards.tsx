import { useState } from 'react'
import type { Product } from '../services/productService'
import { parseImageUrl } from '../../../utils/image'

interface ProductCardsProps {
  products: Product[]
}

const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%234066B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E"

export function ProductCards({ products }: ProductCardsProps) {
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
        <p style={{ fontWeight: 600, fontSize: 16 }}>No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20,
        padding: '8px 4px',
      }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid #DCEAF7',
            padding: 16,
            display: 'flex',
            gap: 16,
            boxShadow: '0 4px 12px rgba(0,51,160,0.04)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,51,160,0.08)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,51,160,0.04)'
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 12,
              overflow: 'hidden',
              background: '#f4f6fb',
              border: '1px solid #e8f0fb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img
              src={imgErrors.has(product.id) ? placeholder : parseImageUrl(product.imageUrl)}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgErrors((s) => new Set(s).add(product.id))}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, justifyContent: 'space-between' }}>
            <div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#0033A0',
                  margin: '0 0 4px 0',
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {product.name}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: '#515D73',
                  margin: 0,
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {product.description || <em style={{ opacity: 0.5 }}>Sin descripción</em>}
              </p>
            </div>

            <div style={{ marginTop: 8, fontSize: 13, fontWeight: 700, color: '#0033A0' }}>
              Cantidad: <span style={{ color: '#1a1a2e' }}>{product.quantity.toLocaleString('es-DO')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
