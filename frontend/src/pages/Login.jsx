import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back to Kittyeats!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('camille@kittyeats.com');
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-800 text-white flex items-center justify-center shadow-md">
            <span className="text-xl">🍓</span>
          </div>
          <span className="font-serif text-3xl font-bold tracking-tight text-stone-900">
            Kittyeats<span className="text-brand-800">.</span>
          </span>
        </Link>
        <p className="text-xs uppercase tracking-widest font-semibold text-stone-400">
          Sign In to Your Recipe Journal
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-card">
        <div className="mb-6 p-3.5 rounded-2xl bg-blush-50 border border-brand-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-800 shrink-0" />
            <span className="text-xs font-semibold text-brand-900">
              Demo Account Available
            </span>
          </div>
          <button
            type="button"
            onClick={fillDemoAccount}
            className="text-xs font-bold text-white bg-brand-800 hover:bg-brand-900 px-3 py-1.5 rounded-full transition-colors shadow-sm"
          >
            Quick Fill
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-brand-900">
            <AlertCircle className="w-4 h-4 text-brand-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="chef@kittyeats.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm py-3.5 rounded-full shadow-md hover:shadow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98 mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In to Kittyeats</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            New to our culinary table?{' '}
            <Link to="/register" className="font-bold text-brand-800 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
