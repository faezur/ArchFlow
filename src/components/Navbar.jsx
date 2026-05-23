import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const handleNav = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 250)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isActive = (path) => location.pathname === path
  const linkClass = 'text-sm text-zinc-300 hover:text-white transition-colors'

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 py-3">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/50 px-4 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/10">
            <img src="/4.svg" alt="ArchFlow" className="h-6 w-6 object-contain" />
          </span>
          <span className="text-lg font-black tracking-tight text-white">
            Arch<span className="accent-text">Flow</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <button onClick={() => handleNav('home')} className={`${linkClass} ${isActive('/') ? 'text-pink-300' : ''}`}>
            Home
          </button>
          <button onClick={() => handleNav('samples')} className={linkClass}>
            Samples
          </button>
          <button onClick={() => handleNav('pricing')} className={linkClass}>
            Pricing
          </button>
          {user && (
            <Link to="/history" className={`${linkClass} ${isActive('/history') ? 'text-pink-300' : ''}`}>
              History
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <span className="max-w-[150px] truncate text-sm text-zinc-400">
                Hi, <span className="text-white">{user.name}</span>
              </span>
              <Link to="/generate" className="rounded-full px-4 py-2 text-sm font-bold text-white glow-button">
                Generate
              </Link>
              <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-red-300">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="rounded-full px-5 py-2 text-sm font-bold text-white glow-button">
              Login
            </Link>
          )}
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-white transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      <div className={`mx-auto max-w-7xl overflow-hidden px-3 transition-all duration-300 md:hidden ${menuOpen ? 'max-h-96 pt-3' : 'max-h-0'}`}>
        <div className="glass-panel rounded-3xl p-4">
          <div className="flex flex-col gap-3">
            <button onClick={() => handleNav('home')} className="text-left text-sm text-zinc-300">Home</button>
            <button onClick={() => handleNav('samples')} className="text-left text-sm text-zinc-300">Samples</button>
            <button onClick={() => handleNav('pricing')} className="text-left text-sm text-zinc-300">Pricing</button>
            {user && <Link to="/history" onClick={() => setMenuOpen(false)} className="text-sm text-zinc-300">History</Link>}
            {user && <Link to="/generate" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-center text-sm font-bold text-white glow-button">Generate</Link>}
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm text-red-300">Logout</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-2xl px-4 py-3 text-center text-sm font-bold text-white glow-button">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
