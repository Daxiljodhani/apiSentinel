import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res: any = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        login(res.data.accessToken, res.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail('admin@sentinel.io');
    setPassword('password123');
    setIsLoading(true);
    setError('');

    try {
      const res: any = await api.post('/auth/login', {
        email: 'admin@sentinel.io',
        password: 'password123',
      });
      if (res.success && res.data) {
        login(res.data.accessToken, res.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-slate-100 flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-[#101F33] border border-[#182E4B] rounded-2xl p-8 shadow-2xl shadow-black/80 space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back to API Sentinel</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access your monitoring dashboard</p>
        </div>

        {/* Quick Demo Login Button */}
        <button
          type="button"
          onClick={handleQuickDemo}
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 group"
        >
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400 group-hover:animate-bounce" />
          <span>⚡ One-Click Demo Admin Login (admin@sentinel.io)</span>
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-[#182E4B]" />
          <span className="px-3 text-[10px] uppercase text-slate-500 font-semibold">Or Sign In Manually</span>
          <div className="flex-1 border-t border-[#182E4B]" />
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1728] border border-[#182E4B] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#0B1728] border border-[#182E4B] rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
