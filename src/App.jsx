import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import NewRender from './pages/NewRender'
import Result from './pages/Result'

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
           <Dashboard />
          </ProtectedRoute>} />
        <Route path="/new-render" element={
          <ProtectedRoute>
            <NewRender />
          </ProtectedRoute>} />
        <Route path="/result" element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App