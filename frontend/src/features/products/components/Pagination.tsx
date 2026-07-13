interface PaginationProps {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, totalCount, pageSize, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 10,
    border: '1.5px solid #DCEAF7',
    background: '#ffffff',
    color: '#515D73',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    fontFamily: 'Poppins, sans-serif',
  }

  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: '#0033A0',
    border: '1.5px solid #0033A0',
    color: '#fff',
    cursor: 'default',
  }

  const btnDisabled: React.CSSProperties = {
    ...btnBase,
    opacity: 0.35,
    cursor: 'not-allowed',
  }

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderTop: '1px solid #DCEAF7',
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 13, color: '#515D73' }}>
        Mostrando{' '}
        <strong style={{ color: '#0033A0' }}>{to}</strong>
        {' '}de{' '}
        <strong style={{ color: '#0033A0' }}>{totalCount}</strong>
        {' '}productos
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          style={page <= 1 ? btnDisabled : btnBase}
          title="Página anterior"
          onMouseEnter={(e) => { if (page > 1) { e.currentTarget.style.background = '#f4f6fb'; e.currentTarget.style.color = '#0033A0' } }}
          onMouseLeave={(e) => { if (page > 1) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#515D73' } }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`dots-${idx}`} style={{ color: '#515D73', fontSize: 14, padding: '0 4px' }}>…</span>
          ) : (
            <button
              key={p}
              onClick={() => p !== page && onPageChange(p as number)}
              style={p === page ? btnActive : btnBase}
              onMouseEnter={(e) => { if (p !== page) { e.currentTarget.style.background = '#f4f6fb'; e.currentTarget.style.color = '#0033A0' } }}
              onMouseLeave={(e) => { if (p !== page) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#515D73' } }}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={page >= totalPages ? btnDisabled : btnBase}
          title="Página siguiente"
          onMouseEnter={(e) => { if (page < totalPages) { e.currentTarget.style.background = '#f4f6fb'; e.currentTarget.style.color = '#0033A0' } }}
          onMouseLeave={(e) => { if (page < totalPages) { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#515D73' } }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
