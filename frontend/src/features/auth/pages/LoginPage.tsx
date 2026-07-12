import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { loginUser, registerUser } from '../services/authService'
import { useToast } from '../../../components/ui/useToast'
import { Input } from '../../../components/ui/Input'
import { Button } from '../../../components/ui/Button'
import logoRica from '../../../assets/logoRica.png'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const toast = useToast()

  const [mode, setMode] = useState<Mode>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ username: '', password: '', confirmPassword: '' })

  const switchMode = (m: Mode) => {
    setMode(m)
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setErrors({ username: '', password: '', confirmPassword: '' })
  }

  const validate = () => {
    const e = { username: '', password: '', confirmPassword: '' }
    let valid = true
    if (!username.trim()) { e.username = 'El nombre de usuario es obligatorio.'; valid = false }
    if (username.trim().length < 3) { e.username = 'El usuario debe tener al menos 3 caracteres.'; valid = false }
    if (!password.trim()) { e.password = 'La contraseña es obligatoria.'; valid = false }
    if (password.length < 6) { e.password = 'La contraseña debe tener al menos 6 caracteres.'; valid = false }
    if (mode === 'register' && password !== confirmPassword) {
      e.confirmPassword = 'Las contraseñas no coinciden.'
      valid = false
    }
    setErrors(e)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (mode === 'login') {
        const response = await loginUser({ username: username.trim(), password })
        login({ username: response.username, role: response.role })
        toast.success(`¡Bienvenido, ${response.username}!`)
        navigate('/products')
      } else {
        await registerUser({ username: username.trim(), password, role: 'User' })
        toast.success('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
        switchMode('login')
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } }
      const msg = axiosErr?.response?.data?.message ?? (
        mode === 'login' ? 'Usuario o contraseña incorrectos.' : 'No se pudo crear la cuenta. El usuario puede ya existir.'
      )
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const eyeIcon = (visible: boolean) => visible ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Poppins, sans-serif' }}>
      <div
        style={{
          flex: '0 0 55%',
          background: 'linear-gradient(145deg, #001a6e 0%, #0033A0 45%, #1a52c8 70%, #4066B8 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: 48,
        }}
        className="login-left-panel"
      >
        <div style={{ position: 'absolute', top: -80, right: -80, width: 340, height: 340, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 420, height: 420, borderRadius: '50%', background: 'rgba(244,49,63,0.08)' }} />
        <div style={{ position: 'absolute', top: '40%', left: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: 'fadeIn 0.8s ease' }}>
          <div
            style={{
              width: 120, height: 120, borderRadius: 28,
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
            }}
          >
            <img src={logoRica} alt="Logo Grupo Rica" style={{ width: 90, objectFit: 'contain' }} />
          </div>

          <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 800, marginBottom: 10, letterSpacing: -0.5 }}>
            Grupo Rica
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 400, maxWidth: 320, lineHeight: 1.6 }}>
            Sistema de Inventario Corporativo
          </p>
        </div>
      </div>

      <div
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f4f6fb', padding: '40px 24px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420, animation: 'slideInRight 0.6s ease' }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0033A0', marginBottom: 6 }}>
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p style={{ color: '#515D73', fontSize: 14 }}>
              {mode === 'login'
                ? 'Ingresa tus credenciales para acceder al sistema'
                : 'Completa el formulario para registrarte'}
            </p>
          </div>

          <div style={{ display: 'flex', background: '#e8edf7', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                id={`tab-${m}`}
                onClick={() => switchMode(m)}
                style={{
                  flex: 1, padding: '9px 0',
                  borderRadius: 9, border: 'none',
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#0033A0' : '#515D73',
                  fontWeight: 700, fontSize: 13,
                  fontFamily: 'Poppins, sans-serif', cursor: 'pointer',
                  boxShadow: mode === m ? '0 2px 8px rgba(0,51,160,0.10)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {m === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <div
            style={{
              background: '#fff', borderRadius: 20, padding: 32,
              boxShadow: '0 8px 40px rgba(0,51,160,0.10)',
              border: '1px solid #DCEAF7',
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Input
                id="auth-username"
                label="Usuario"
                type="text"
                placeholder="Ingresa tu nombre de usuario"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setErrors((p) => ({ ...p, username: '' })) }}
                error={errors.username}
                autoComplete="username"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />

              <Input
                id="auth-password"
                label="Contraseña"
                type={showPass ? 'text' : 'password'}
                placeholder={mode === 'login' ? 'Ingresa tu contraseña' : 'Mínimo 6 caracteres'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                error={errors.password}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
                rightIcon={
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#515D73', display: 'flex' }}>
                    {eyeIcon(showPass)}
                  </button>
                }
              />

              {mode === 'register' && (
                <Input
                  id="auth-confirm-password"
                  label="Confirmar Contraseña"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })) }}
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  icon={
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  }
                />
              )}

              <Button
                id="auth-submit"
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                style={{ width: '100%', marginTop: 4, borderRadius: 12 }}
              >
                {loading
                  ? (mode === 'login' ? 'Ingresando...' : 'Creando cuenta...')
                  : (mode === 'login' ? 'Ingresar al Sistema' : 'Crear Cuenta')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
