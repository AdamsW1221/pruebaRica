import { useState } from 'react'
import type { Product } from '../services/productService'
import { parseImageUrl } from '../../../utils/image'

interface ProductCardsProps {
  products: Product[]
  loading?: boolean
  limit?: number
}

const placeholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%234066B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E"

function SkeletonCard() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 18px rgba(0,51,160,0.08)',
        border: '1px solid #e4ecf9',
      }}
    >
      <div
        style={{
          width: '100%',
          height: 200,
          background: 'linear-gradient(90deg, #eaf0fb 25%, #dce8f7 50%, #eaf0fb 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
        }}
      />
      <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            height: 22,
            borderRadius: 8,
            background: 'linear-gradient(90deg, #eaf0fb 25%, #dce8f7 50%, #eaf0fb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite',
            width: '75%',
          }}
        />
        <div
          style={{
            height: 13,
            borderRadius: 6,
            background: 'linear-gradient(90deg, #eaf0fb 25%, #dce8f7 50%, #eaf0fb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite 0.1s',
            width: '100%',
          }}
        />
        <div
          style={{
            height: 13,
            borderRadius: 6,
            background: 'linear-gradient(90deg, #eaf0fb 25%, #dce8f7 50%, #eaf0fb 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.4s infinite 0.2s',
            width: '80%',
          }}
        />
        <div style={{ borderTop: '1px solid #e4ecf9', paddingTop: 14 }}>
          <div
            style={{
              height: 13,
              borderRadius: 6,
              background: 'linear-gradient(90deg, #eaf0fb 25%, #dce8f7 50%, #eaf0fb 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.4s infinite 0.3s',
              width: '45%',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function ProductCards({ products, loading = false, limit = 6 }: ProductCardsProps) {
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 22,
    padding: '20px',
  }

  if (loading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: limit }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          color: '#8a9ab5',
          gap: 14,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#DCEAF7"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 64, height: 64 }}
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>No hay productos disponibles</p>
      </div>
    )
  }

  return (
    <div style={gridStyle}>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            background: '#ffffff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 18px rgba(0,51,160,0.08)',
            border: '1px solid #e4ecf9',
            transition: 'transform 0.22s ease, box-shadow 0.22s ease',
            cursor: 'default',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,51,160,0.16)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,51,160,0.08)'
          }}
        >
          <div
            style={{
              width: '100%',
              height: 200,
              background: '#f0f4ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={imgErrors.has(product.id) ? placeholder : parseImageUrl(product.imageUrl)}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                padding: '14px',
                boxSizing: 'border-box',
              }}
              onError={() => setImgErrors((s) => new Set(s).add(product.id))}
            />
          </div>

          <div style={{ padding: '18px 20px 22px' }}>
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: '#0033A0',
                margin: '0 0 8px 0',
                lineHeight: 1.3,
                letterSpacing: '-0.2px',
              }}
            >
              {product.name}
            </h3>
            <p
              style={{
                fontSize: 13,
                color: '#515D73',
                margin: '0 0 16px 0',
                lineHeight: 1.6,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {product.description || <em style={{ opacity: 0.5 }}>Sin descripción</em>}
            </p>

            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#4066B8',
                borderTop: '1px solid #e4ecf9',
                paddingTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, opacity: 0.7 }}>
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              Cantidad:{' '}
              <span style={{ color: '#0033A0', fontWeight: 800, fontSize: 15 }}>
                {product.quantity.toLocaleString('es-DO')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
