import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/Button'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  productName: string
  loading?: boolean
}

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName, loading }: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Producto" maxWidth={420}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#fff1f2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#F4313F" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>

        <div>
          <p style={{ fontSize: 15, color: '#1a1a2e', fontWeight: 600, marginBottom: 6 }}>
            ¿Estás seguro de que deseas eliminar este producto?
          </p>
          <p style={{ fontSize: 14, color: '#515D73' }}>
            El producto <strong style={{ color: '#0033A0' }}>"{productName}"</strong> será eliminado permanentemente y no podrá recuperarse.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <Button id="delete-cancel" variant="outline" onClick={onClose} style={{ flex: 1 }}>
            Cancelar
          </Button>
          <Button id="delete-confirm" variant="danger" onClick={onConfirm} loading={loading} style={{ flex: 1 }}>
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
