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
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <img src="/4.svg" alt="logo" className="w-7 h-7 object-contain"/>
          <span className="text-white font-bold text-xl tracking-tight">
            Arch<span className="text-amber-400">Flow</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNav('home')}
            className={`text-sm transition-colors ${isActive('/') ? 'text-amber-400' : 'text-zinc-400 hover:text-white'}`}
          >
            Home
          </button>
          <button onClick={() => handleNav('samples')} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Samples
          </button>
          <button onClick={() => handleNav('pricing')} className="text-sm text-zinc-400 hover:text-white transition-colors">
            Pricing
          </button>
          {user && (
            <Link to="/history" className={`text-sm transition-colors ${isActive('/history') ? 'text-amber-400' : 'text-zinc-400 hover:text-white'}`}>
              History
            </Link>
          )}
          {user && (
            <Link to="/generate" className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${isActive('/generate') ? 'bg-amber-400 text-zinc-950 border-amber-400' : 'border-zinc-600 text-zinc-300 hover:border-amber-400 hover:text-amber-400'}`}>
              Generate
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 w-[100px] justify-end">
          {user ? (
            <>
              <span className="text-zinc-400 text-sm">Hi, <span className="text-white">{user.name}</span></span>
              <button onClick={handleLogout} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                Logout
              </button>
            </>
          ) : (
            location.pathname !== "/login" && location.pathname !== "/signup" && (
            <Link to="/login" className="text-sm px-4 py-1.5 bg-amber-400 text-zinc-950 font-semibold rounded-full hover:bg-amber-300 transition-colors">
              Login
            </Link>
            )
          )}
        </div>

        {/* Mobile — Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-zinc-400 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-zinc-400 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-zinc-400 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 border-t border-zinc-800' : 'max-h-0'}`}>
        <div className="px-6 py-4 flex flex-col gap-4 bg-zinc-950">

          <button onClick={() => handleNav('home')} className="text-sm text-zinc-400 hover:text-white text-left transition-colors">
            Home
          </button>
          <button onClick={() => handleNav('samples')} className="text-sm text-zinc-400 hover:text-white text-left transition-colors">
            Samples
          </button>
          <button onClick={() => handleNav('pricing')} className="text-sm text-zinc-400 hover:text-white text-left transition-colors">
            Pricing
          </button>

          {user && (
            <Link to="/history" onClick={() => setMenuOpen(false)} className={`text-sm transition-colors ${isActive('/history') ? 'text-amber-400' : 'text-zinc-400 hover:text-white'}`}>
              History
            </Link>
          )}

          {user && (
            <Link to="/generate" onClick={() => setMenuOpen(false)} className="text-sm px-4 py-2 bg-amber-400 text-zinc-950 font-semibold rounded-xl text-center hover:bg-amber-300 transition-colors">
              Generate
            </Link>
          )}

          <div className="border-t border-zinc-800 pt-4">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Hi, <span className="text-white">{user.name}</span></span>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm px-4 py-2 bg-amber-400 text-zinc-950 font-semibold rounded-xl text-center hover:bg-amber-300 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}