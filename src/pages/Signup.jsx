import { useState } from "react"
import { useAuth } from '../context/AuthContext'
import { useNavigate} from "react-router-dom"


function Signup () {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [name , setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

  const handleSignUp = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await register(name, email, password)
    navigate('/dashboard')
  } catch (err) {
    setError(err.response?.data?.message || 'Registration failed')
  } finally {
    setLoading(false)
  }
}

   return (
   <div>
      <h1>SignUp Here!!</h1>
      {error && <p>{error}</p>}
      <input type="text" 
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <input type="email" 
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <input type="password" 
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button onClick={handleSignUp}>SignUp</button>
   </div>
)}

export default Signup

