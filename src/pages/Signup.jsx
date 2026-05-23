import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE_URL } from '../api/config'

function Signup() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/generate')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
        <div className="p-6 sm:p-10">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <img src="/4.svg" alt="ArchFlow" className="h-8 w-8" />
            <span className="text-xl font-black">Arch<span className="accent-text">Flow</span></span>
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-zinc-400">Start generating polished architectural renders today.</p>

          <form onSubmit={handleSignUp} className="mt-8 flex flex-col gap-4">
            {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>}

            <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-300">
              Name
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-pink-300" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-300">
              Email
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-pink-300" />
            </label>
            <label className="flex flex-col gap-2 text-sm font-semibold text-zinc-300">
              Password
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-pink-300" />
            </label>

            <button type="submit" disabled={loading} className="mt-2 rounded-full px-5 py-3 text-sm font-black text-white glow-button disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
            <button type="button" onClick={() => window.location.href = `${API_BASE_URL}/auth/google`} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:bg-white/10">
              Continue with Google
            </button>
            <p className="text-center text-sm text-zinc-500">
              Already have an account? <Link to="/login" className="font-bold text-pink-300 hover:text-pink-200">Login</Link>
            </p>
          </form>
        </div>

        <div className="hidden bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,0.28),transparent_21rem)] p-8 lg:block">
          <div className="flex h-full flex-col justify-end rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-cyan-200">New studio</p>
            <h2 className="mt-4 text-4xl font-black leading-tight">Your first visual takes less than a minute.</h2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {['Upload', 'Analyze', 'Render'].map((step) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-black/25 p-3 text-center text-xs text-zinc-300">{step}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
