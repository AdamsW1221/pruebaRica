import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/products': { title: 'Productos', subtitle: 'Gestión de inventario de productos' },
  '/users': { title: 'Usuarios', subtitle: 'Gestión de usuarios y asignación de roles' },
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const page = pageTitles[location.pathname] ?? { title: 'Panel', subtitle: 'Bienvenido al sistema' }

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


    </header>
  )
}
