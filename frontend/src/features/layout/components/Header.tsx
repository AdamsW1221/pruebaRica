import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/useAuthStore'
import { Badge } from '../../../components/ui/Badge'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/products': { title: 'Productos', subtitle: 'Gestión de inventario de productos' },
  '/users': { title: 'Usuarios', subtitle: 'Gestión de usuarios y asignación de roles' },
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore()
  const location = useLocation()
  const page = pageTitles[location.pathname] ?? { title: 'Panel', subtitle: 'Bienvenido al sistema' }

  const getBadgeVariant = () => {
    const role = user?.role?.toLowerCase()
    if (role === 'superadmin') return 'superadmin'
    if (role === 'admin') return 'admin'
    return 'user'
  }

  const getRoleLabel = () => {
    const role = user?.role?.toLowerCase()
    if (role === 'superadmin') return 'Super Admin'
    if (role === 'admin') return 'Administrador'
    return 'Usuario'
  }

  return (
    <header
      style={{
        height: 64,
        background: '#fff',
        borderBottom: '1px solid #DCEAF7',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 12,
        boxShadow: '0 2px 12px rgba(0,51,160,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <button
        className="header-mobile-menu"
        onClick={onMenuClick}
        style={{
          display: 'none',
          background: '#DCEAF7',
          border: 'none',
          borderRadius: 8,
          width: 38,
          height: 38,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#0033A0',
          flexShrink: 0,
        }}
        aria-label="Abrir menú"
        id="header-menu-btn"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0033A0', margin: 0, lineHeight: 1.2 }}>
          {page.title}
        </h2>
        <p style={{ fontSize: 12, color: '#515D73', margin: 0 }}>{page.subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Badge variant={getBadgeVariant()} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
            borderRadius: 12,
            background: '#f4f6fb',
            border: '1px solid #DCEAF7',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0033A0, #4066B8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.2 }}>
              {user?.username}
            </div>
            <div style={{ fontSize: 11, color: '#515D73' }}>
              {getRoleLabel()}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
