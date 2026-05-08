import { createContext, useState, useContext, useEffect } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

const DEMO_EMAIL = 'faizan@test.com'
const DEMO_PASSWORD = '123456'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [showDemoToast, setShowDemoToast] = useState(false)


  useEffect(() => {
  const autoLogin = async () => {
    if (!localStorage.getItem('token')) {
      // Render cold start ke liye 3 sec wait karo
      await new Promise(r => setTimeout(r, 3000));
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
        setTimeout(() => setShowDemoToast(false), 4000)
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
      {showDemoToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1a1a',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          whiteSpace: 'nowrap'
        }}>
          🔍 Demo mode — logged in as test user
        </div>
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}