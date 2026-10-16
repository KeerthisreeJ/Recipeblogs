import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('Home chef & food stylist celebrating slow dining.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        bio,
      });
      toast.success('Welcome to Kittyeats! Your culinary journey begins.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
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
          Join our global community of food lovers
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-stone-200/90 shadow-card">
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2.5 text-xs text-brand-900">
            <AlertCircle className="w-4 h-4 text-brand-700 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Full Name / Chef Alias
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Camille Laurent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="camille@kittyeats.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Password (Min. 6 Characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-[#FAF7F2] text-stone-900 pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              Short Bio
            </label>
            <input
              type="text"
              placeholder="e.g. Sourdough baker and handmade pasta enthusiast."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-[#FAF7F2] text-stone-900 px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:border-brand-800 focus:bg-white text-xs transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-800 hover:bg-brand-900 text-white font-medium text-sm py-3.5 rounded-full shadow-md hover:shadow-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98 mt-4"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-500">
            Already part of our journal?{' '}
            <Link to="/login" className="font-bold text-brand-800 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
