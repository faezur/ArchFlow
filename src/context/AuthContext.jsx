import { createContext, useState, useContext } from 'react'
import API from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  const [token, setToken] = useState(localStorage.getItem('token'))

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
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}