import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/useAuthStore'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
