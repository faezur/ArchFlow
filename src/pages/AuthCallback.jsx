import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AuthCallback = () => {
  const { loginWithGoogle } = useAuth()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token')
      const error = searchParams.get('error')

      if (error) {
        navigate('/login?error=google_failed')
        return
      }

      if (token) {
        await loginWithGoogle(token)
        navigate('/generate')
      } else {
        navigate('/login')
      }
    }

    handleCallback()
  }, [loginWithGoogle, navigate, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-pink-300 border-t-transparent" />
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-zinc-400">Signing you in</p>
      </div>
    </div>
  )
}

export default AuthCallback
