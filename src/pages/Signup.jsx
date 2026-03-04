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

   function handleSignUp() {
      if(name === '' || email === '' || password === '') {
      setError('Please Enter Valid Name, Email And Password!')
      return
    }
    const fakeUser = { name: 'faiz', email: email }
    const fakeToken = 'fake-token-123'

    login(fakeUser, fakeToken)
    navigate('/dashboard')
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

