import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'outline' | 'ghost' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({ variant = 'primary', size = 'md', loading = false, children, disabled, style, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 600,
    borderRadius: 10,
    border: '2px solid transparent',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 14px', fontSize: 12 },
    md: { padding: '10px 20px', fontSize: 14 },
    lg: { padding: '13px 28px', fontSize: 15 },
  }

  const variants: Record<string, React.CSSProperties> = {
    primary:   { background: '#0033A0', color: '#fff', borderColor: '#0033A0' },
    danger:    { background: '#F4313F', color: '#fff', borderColor: '#F4313F' },
    outline:   { background: 'transparent', color: '#0033A0', borderColor: '#0033A0' },
    ghost:     { background: 'transparent', color: '#515D73', borderColor: 'transparent' },
    secondary: { background: '#DCEAF7', color: '#0033A0', borderColor: '#DCEAF7' },
  }

  const opacityStyle: React.CSSProperties = disabled || loading ? { opacity: 0.6 } : {}

  return (
    <button
      disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...opacityStyle, ...style }}
      {...props}
    >
      {loading && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }}
        >
          <path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  )
}
