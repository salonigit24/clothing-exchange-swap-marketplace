import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Shirt, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import ErrorMessage from '../components/common/ErrorMessage';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await login(email, password);
      if (data.user?.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/dashboard' : from);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Helper quick login fill for testing
  const setDemoCredentials = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 text-white flex items-center justify-center shadow-md">
            <Shirt className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-earth-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-earth-500">
          Sign in to your ClothSwap account to continue swapping
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-earth-200/90 shadow-sm space-y-6">
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-earth-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-earth-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-earth-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-earth-400 hover:text-earth-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-forest-600 hover:bg-forest-700 text-white text-sm font-bold rounded-xl transition shadow-sm hover:shadow disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins for Examiner/Evaluator */}
          <div className="pt-4 border-t border-earth-100">
            <span className="text-[11px] font-bold text-earth-400 uppercase tracking-wider block mb-2 text-center">
              Quick One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDemoCredentials('admin@swapwear.com', 'Admin@123')}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold border border-amber-200 transition text-left flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <span className="block font-bold">Admin Demo</span>
                  <span className="text-[10px] text-amber-600 font-normal">admin@swapwear.com</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('aarav.sharma@example.com', 'User@123')}
                className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 font-semibold border border-forest-200 transition text-left flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <span className="block font-bold">User: Aarav</span>
                  <span className="text-[10px] text-forest-600 font-normal">Mumbai • User@123</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('priya.patel@example.com', 'User@123')}
                className="p-2 rounded-xl bg-earth-50 hover:bg-earth-100 text-earth-800 font-semibold border border-earth-200 transition text-left flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <span className="block font-bold">User: Priya</span>
                  <span className="text-[10px] text-earth-500 font-normal">Pune • User@123</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDemoCredentials('rohan.mehta@example.com', 'User@123')}
                className="p-2 rounded-xl bg-earth-50 hover:bg-earth-100 text-earth-800 font-semibold border border-earth-200 transition text-left flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <span className="block font-bold">User: Rohan</span>
                  <span className="text-[10px] text-earth-500 font-normal">Nagpur • User@123</span>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-earth-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-forest-700 hover:text-forest-800 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
