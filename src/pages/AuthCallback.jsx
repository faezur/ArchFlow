import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const AuthCallback = () => {
    const { loginWithGoogle } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

  useEffect(() => {
  const handleCallback = async () => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=google_failed');
      return;
    }

    if (token) {
      await loginWithGoogle(token);
      navigate('/generate');
    } else {
      navigate('/login');
    }
  };

  handleCallback();
}, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;