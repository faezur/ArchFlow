import { Link, useNavigate } from "react-router-dom"
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/generate')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-amber-400 rounded-sm rotate-12"></div>
            <span className="text-white font-bold text-xl tracking-tight">
              Arch<span className="text-amber-400">Flow</span>
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-zinc-400 text-sm">Login to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col gap-4">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-xs uppercase tracking-wider">Email</label>
            <input
              type="email"
              autoComplete="new-password"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder-zinc-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-xs uppercase tracking-wider">Password</label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-400 text-zinc-950 font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : 'Login'}
          </button>
          <button onClick={() => window.location.href = 'https://archflow-backend.onrender.com/api/auth/google'}>
            Countinue with Google Account...
          </button>

          <p className="text-center text-zinc-500 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-amber-400 hover:text-amber-300 transition-colors">
              Sign up
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login