import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuLock, LuUser, LuArrowLeft, LuCircleAlert, LuEye, LuEyeOff } from 'react-icons/lu';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SEO from '../../components/common/SEO';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ username, password });
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.message || 'Username atau password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada sistem saat proses masuk.', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Login Administrator - Portofolio" description="Halaman masuk khusus administrator untuk mengelola sistem manajemen konten portofolio." />
      <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center p-4 sm:p-6 relative font-sans text-gray-100">
        
        {/* Latar Belakang Aksen Glow */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-goldPrimary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="w-full max-w-md space-y-6">
          
          {/* Tombol Kembali ke Beranda */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-goldPrimary transition-colors"
          >
            <LuArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          {/* Kartu Formulir Login */}
          <Card className="p-8 bg-bgSurface/60 border-borderMuted shadow-2xl backdrop-blur-md space-y-6">
            
            <div className="text-center space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-gray-100">
                Admin <span className="text-gradient">Login</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Silakan masuk menggunakan kredensial backend environment Anda.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-400"
              >
                <LuCircleAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Input Username */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <LuUser className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Masukkan username admin..."
                    className="w-full pl-10 pr-4 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold font-poppins uppercase tracking-wider text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                    <LuLock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-bgMain border border-borderMuted rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-goldPrimary transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tombol Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full py-3"
                >
                  Masuk ke Dashboard
                </Button>
              </div>

            </form>
          </Card>

          <p className="text-center text-xs text-gray-500">
            Terhubung ke Backend: <a href="https://be-portfolio-shinta.vercel.app/" target="_blank" rel="noreferrer" className="text-goldPrimary hover:underline">be-portfolio-shinta.vercel.app</a>
          </p>

        </div>
      </div>
    </>
  );
};

export default Login;