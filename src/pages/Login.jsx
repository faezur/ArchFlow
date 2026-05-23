import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../api/config'

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
    <div className="flex min-h-screen items-center justify-center px-4 py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[0.9fr_1fr]">
        <div className="hidden bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.44),transparent_22rem)] p-8 lg:block">
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/4.svg" alt="ArchFlow" className="h-8 w-8" />
              <span className="text-xl font-black">Arch<span className="accent-text">Flow</span></span>
            </Link>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-pink-200">Welcome back</p>
              <h1 className="mt-4 text-4xl font-black leading-tight">Resume your rendering workspace.</h1>
              <p className="mt-4 text-sm leading-6 text-zinc-300">Access saved outputs, generate new 3D visuals, and keep your architectural concepts moving.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="flex items-center gap-2">
              <img src="/4.svg" alt="ArchFlow" className="h-8 w-8" />
              <span className="text-xl font-black">Arch<span className="accent-text">Flow</span></span>
            </Link>
          </div>
          <h2 className="text-3xl font-black tracking-tight">Login</h2>
          <p className="mt-2 text-sm text-zinc-400">Enter your details to continue.</p>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-300">
              Email
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-pink-300" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-300">
              Password
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-pink-300" />
            </label>

            <button type="submit" disabled={loading} className="mt-2 rounded-full px-5 py-3 text-sm font-black text-white glow-button disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={() => window.location.href = `${API_BASE_URL}/auth/google`} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
              Continue with Google
            </button>
            <p className="text-center text-sm text-zinc-500">
              Do not have an account? <Link to="/signup" className="font-bold text-pink-300 hover:text-pink-200">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
