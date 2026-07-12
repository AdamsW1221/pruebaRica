import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function Input({ label, error, icon, rightIcon, id, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label
          htmlFor={id}
          style={{ fontSize: 13, fontWeight: 600, color: '#515D73', fontFamily: 'Poppins, sans-serif' }}
        >
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 14,
              color: error ? '#F4313F' : '#4066B8',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          style={{
            width: '100%',
            padding: icon ? '11px 14px 11px 44px' : rightIcon ? '11px 44px 11px 14px' : '11px 14px',
            borderRadius: 10,
            border: `1.5px solid ${error ? '#F4313F' : '#DCEAF7'}`,
            background: '#fff',
            fontSize: 14,
            color: '#1a1a2e',
            fontFamily: 'Poppins, sans-serif',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? '#F4313F' : '#0033A0'
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error ? 'rgba(244,49,63,0.15)' : 'rgba(0,51,160,0.12)'}`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#F4313F' : '#DCEAF7'
            e.currentTarget.style.boxShadow = 'none'
          }}
          {...props}
        />
        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: 14,
              color: '#515D73',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <span style={{ fontSize: 12, color: '#F4313F', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  )
}
