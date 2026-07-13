import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/useAuthStore'
import { useToast } from '../../../components/ui/useToast'
import { Badge } from '../../../components/ui/Badge'
import logoRica from '../../../assets/logoRica.png'

const navItems = [
  {
    to: '/products',
    label: 'Productos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = () => {
    logout()
    toast.info('Sesión cerrada correctamente.')
    navigate('/login')
  }

  const getBadgeVariant = () => {
    const role = user?.role?.toLowerCase()
    if (role === 'superadmin') return 'superadmin'
    if (role === 'admin') return 'admin'
    return 'user'
  }

  const items = [...navItems]
  if (user?.role?.toLowerCase() === 'superadmin') {
    items.push({
      to: '/users',
      label: 'Usuarios',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    })
  }

  return (
    <aside
      style={{
        width: 240,
        height: '100vh',
        background: 'linear-gradient(180deg, #0033A0 0%, #002080 100%)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0,33,160,0.18)',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        style={{
          padding: '24px 20px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <img src={logoRica} alt="Logo Rica" style={{ width: 34, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>Grupo Rica</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 2 }}>Inventario Corporativo</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="header-mobile-menu"
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.15)',
              border: 'none', borderRadius: 8,
              width: 32, height: 32,
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', flexShrink: 0,
            }}
            aria-label="Cerrar menú"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <nav style={{ padding: '20px 12px', flex: 1, overflowY: 'auto' }}>
        <div style={{ marginBottom: 6, paddingLeft: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1 }}>
            Menú
          </span>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                id={`nav-${item.label.toLowerCase()}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 12,
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  borderLeft: isActive ? '3px solid #F4313F' : '3px solid transparent',
                })}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (!el.classList.contains('active')) el.style.background = 'rgba(255,255,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  if (!el.classList.contains('active')) el.style.background = 'transparent'
                }}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.08)',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F4313F, #ff6b6b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {user?.username?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username}
            </div>
            <Badge variant={getBadgeVariant()} />
          </div>
        </div>

        <button
          id="sidebar-logout"
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 14px',
            borderRadius: 10,
            background: 'transparent',
            border: '1px solid rgba(244,49,63,0.4)',
            color: 'rgba(255,120,120,0.9)',
            fontWeight: 600,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'Poppins, sans-serif',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(244,49,63,0.15)'
            el.style.borderColor = '#F4313F'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'transparent'
            el.style.borderColor = 'rgba(244,49,63,0.4)'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
