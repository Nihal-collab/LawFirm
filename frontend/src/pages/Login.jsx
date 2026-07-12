import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Key, Mail, Shield, Eye, EyeOff } from 'lucide-react';

const Login = ({ adminOnly = false }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const isAdmin = res.user.role === 'ADMIN' || res.user.role === 'SUPERADMIN';

      if (adminOnly && !isAdmin) {
        showToast('This portal is for admins only.', 'error');
        return;
      }

      showToast(`Welcome back, ${res.user.firstName || res.user.first_name || 'User'}!`, 'success');
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      showToast(res.error, 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121110] px-6 font-sans">
      <div className="max-w-md w-full card-premium space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-[#4BB8E8]/10 text-[#4BB8E8] rounded-full border border-[#4BB8E8]/10">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Admin Portal Sign In</h2>
          <p className="text-xs text-[#444444] dark:text-[#C9C1B5] font-light leading-relaxed">Enter admin credentials to access the dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-[#444444]/70" size={16} strokeWidth={1.5} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@rootsip.com"
                className="w-full pl-11 pr-4 py-3 bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 text-[#444444]/70" size={16} strokeWidth={1.5} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#444444] hover:text-[#000000] dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#4BB8E8] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
