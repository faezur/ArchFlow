import {Link , useNavigate} from "react-router-dom"
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

   const handleLogin = () => {
    if(email === '' || password === '') {
      setError('Please Enter Valid Email And Password!')
      return
    }
    const fakeUser = { name: 'faiz', email: email }
    const fakeToken = 'fake-token-123'

    login(fakeUser, fakeToken)
    navigate('/dashboard')
  }

  return (
  <div>
    <h1>Login Page</h1>
    {error && <p>{error}</p>}
     <input 
        type="email" 
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <p>Create Account
        <Link to="/signup">Signup</Link>
      </p>
  </div>
)
}

export default Login