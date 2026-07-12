import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { getAllUsers, updateUserRole, deleteUser, type UserItem } from '../services/userService'
import { useAuthStore } from '../../auth/store/useAuthStore'
import { useToast } from '../../../components/ui/useToast'
import { Badge } from '../../../components/ui/Badge'

export default function UsersPage() {
  const { user: currentUser } = useAuthStore()
  const currentRole = currentUser?.role?.toLowerCase()

  if (currentRole !== 'superadmin') {
    return <Navigate to="/products" replace />
  }

  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch {
      toast.error('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId: number, username: string, newRole: 'SuperAdmin' | 'Admin' | 'User') => {
    try {
      await updateUserRole(userId, newRole)
      toast.success(`Rol de "${username}" actualizado a "${newRole}" correctamente.`)
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
    } catch {
      toast.error('No se pudo actualizar el rol del usuario.')
    }
  }

  const handleDeleteUser = async (userId: number, username: string) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario "${username}"?`)
    if (!confirm) return

    try {
      await deleteUser(userId)
      toast.success(`Usuario "${username}" eliminado correctamente.`)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch {
      toast.error('No se pudo eliminar al usuario.')
    }
  }

  const getBadgeVariant = (role: string) => {
    const r = role?.toLowerCase()
    if (r === 'superadmin') return 'superadmin'
    if (r === 'admin') return 'admin'
    return 'user'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn 0.4s ease' }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0033A0', marginBottom: 4 }}>Administración de Usuarios</h1>
        <p style={{ color: '#515D73', fontSize: 14 }}>
          Gestiona los accesos y cambia los roles de los usuarios del sistema (Admin, Super Admin, Usuario)
        </p>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 20px rgba(0,51,160,0.07)', border: '1px solid #DCEAF7', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12, color: '#4066B8' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 28, height: 28, animation: 'spin 0.8s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round" />
            </svg>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Cargando usuarios...</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #DCEAF7' }}>
                  {['Usuario', 'Fecha de Registro', 'Rol Actual', 'Cambiar Rol', 'Acciones'].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        color: '#0033A0',
                        fontWeight: 700,
                        fontSize: 12,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((item, idx) => {
                  const isSelf = currentUser?.username === item.username
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #f0f4fa',
                        background: idx % 2 === 0 ? '#fff' : '#fafbff',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: '#1a1a2e' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: isSelf ? 'linear-gradient(135deg, #F4313F, #ff6b6b)' : '#E8EDF7',
                              color: isSelf ? '#fff' : '#0033A0',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 13,
                            }}
                          >
                            {item.username[0].toUpperCase()}
                          </div>
                          <div>
                            {item.username} {isSelf && <span style={{ fontSize: 11, color: '#F4313F', fontWeight: 500 }}>(Tú)</span>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#515D73' }}>
                        {new Date(item.createdAt).toLocaleDateString('es-DO', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <Badge variant={getBadgeVariant(item.role)} />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          id={`select-role-${item.id}`}
                          value={item.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(item.id, item.username, e.target.value as any)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 10,
                            border: '1.5px solid #DCEAF7',
                            background: isSelf ? '#f4f6fb' : '#fff',
                            color: '#1a1a2e',
                            fontSize: 13,
                            fontFamily: 'Poppins, sans-serif',
                            outline: 'none',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            transition: 'border-color 0.2s',
                          }}
                        >
                          <option value="User">Usuario</option>
                          <option value="Admin">Admin</option>
                          <option value="SuperAdmin">Super Admin</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button
                          id={`delete-user-${item.id}`}
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(item.id, item.username)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            color: isSelf ? '#b9c1d0' : '#F4313F',
                            padding: '4px 8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 6,
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelf) e.currentTarget.style.backgroundColor = '#fff1f2'
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelf) e.currentTarget.style.backgroundColor = 'transparent'
                          }}
                          title="Eliminar usuario"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f4fa', fontSize: 13, color: '#515D73' }}>
            Total de usuarios registrados: <strong style={{ color: '#0033A0' }}>{users.length}</strong>
          </div>
        )}
      </div>
    </div>
  )
}
