import { createContext, useState, useContext, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

const DEMO_EMAIL = 'faizan@test.com'
const DEMO_PASSWORD = '123456'

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [showDemoToast, setShowDemoToast] = useState(false)


  useEffect(() => {
  const autoLogin = async () => {
    if (!localStorage.getItem('token')) {
      await new Promise(r => setTimeout(r, 1000));
      try {
        const res = await API.post('/auth/login', {
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD
        })
        setUser(res.data)
        setToken(res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        localStorage.setItem('token', res.data.token)
        setShowDemoToast(true)
        setTimeout(() => setShowDemoToast(false), 5000)
      } catch (err) {
        console.error('Auto-login failed:', err)
      }
    }
  }
  autoLogin()
}, [])


  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    setUser(res.data)
    setToken(res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data))
    localStorage.setItem('token', res.data.token)
    return res.data
  }
 
  const loginWithGoogle = async (token) => {
  localStorage.setItem('token', token);
  setToken(token);

  const res = await API.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  setUser(res.data);
  localStorage.setItem('user', JSON.stringify(res.data));
};

  const register = async (name, email, password) => {
    const res = await API.post('/auth/register', { name, email, password })
    setUser(res.data)
    setToken(res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data))
    localStorage.setItem('token', res.data.token)
    return res.data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loginWithGoogle }}>
      {children}

      {/* Demo Toast */}
{/* Demo Toast */}
{showDemoToast && (
  <div
    style={{
      position: 'fixed',
      top: '90px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      animation: 'fadeSlide 3s ease',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 24px',
        minWidth: '420px',
        borderRadius: '12px',
        background: 'rgba(25,25,25,0.92)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {/* Status Dot */}
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#ff3b3b',
          flexShrink: 0,
        }}
      />

      {/* Text */}
      <div
        style={{
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
          letterSpacing: '0.2px',
        }}
      >
      ArchFlow Preview Mode — Exploring as Guest
      </div>
    </div>

    <style>
      {`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}
    </style>
  </div>
)}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}
