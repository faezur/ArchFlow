import {Link , useNavigate} from "react-router-dom"


function Login() {
  const navigate = useNavigate()

   const handleLogin = () => {
    navigate('/dashboard')
  }

  return (
  <div>
    <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>
      <p>Create Account
        <Link to="/signup">Signup karo</Link>
      </p>
  </div>
)
}

export default Login