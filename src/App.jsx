import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Generate from './pages/Generate'
import History from './pages/History'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
          <div className="min-h-screen bg-zinc-950 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          </Routes>
          </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App