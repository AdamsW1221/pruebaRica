import React from 'react'

type BadgeVariant = 'superadmin' | 'admin' | 'user' | 'active' | 'inactive' | 'deleted'

interface BadgeProps {
  variant: BadgeVariant
  children?: React.ReactNode
}

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  superadmin: {
    background: 'linear-gradient(135deg, #F4313F, #ff6b6b)',
    color: '#fff',
    border: '1px solid #F4313F',
  },
  admin: {
    background: '#0033A0',
    color: '#fff',
  },
  user: {
    background: '#DCEAF7',
    color: '#0033A0',
  },
  active: {
    background: '#f0fdf4',
    color: '#166534',
    border: '1px solid #86efac',
  },
  inactive: {
    background: '#fffbeb',
    color: '#92400e',
    border: '1px solid #fcd34d',
  },
  deleted: {
    background: '#fff1f2',
    color: '#9f1239',
    border: '1px solid #fca5a5',
  },
}

const badgeLabels: Record<BadgeVariant, string> = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  user: 'Usuario',
  active: 'Activo',
  inactive: 'Inactivo',
  deleted: 'Eliminado',
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'Poppins, sans-serif',
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...badgeStyles[variant],
      }}
    >
      {children ?? badgeLabels[variant]}
    </span>
  )
}
