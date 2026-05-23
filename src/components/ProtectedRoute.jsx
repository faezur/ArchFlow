import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const { token } = useAuth()

  if (!token) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
