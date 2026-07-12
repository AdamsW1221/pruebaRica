import { useEffect, useState } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { ToastContainer } from './components/ui/Toast'
import { useAuthStore } from './features/auth/store/useAuthStore'

function App() {
  const { checkAuth } = useAuthStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth()
      } catch {
        // Handled silently, ProtectedRoute redirects to login if unauthenticated
      } finally {
        setChecking(false)
      }
    }
    initAuth()
  }, [checkAuth])

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f4f6fb', color: '#0033A0' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 44, height: 44, animation: 'spin 0.8s linear infinite' }}>
          <path d="M21 12a9 9 0 1 1-6.22-8.56" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  )
}

export default App
