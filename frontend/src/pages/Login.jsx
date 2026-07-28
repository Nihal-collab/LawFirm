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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#09111F] px-6 font-sans">
      <div className="max-w-md w-full bg-[#111827] border border-white/8 rounded-xl p-8 shadow-2xl space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-[#0A4DFF]/10 text-[#0A4DFF] rounded-full border border-[#0A4DFF]/10 shadow-[0_0_10px_rgba(10,77,255,0.2)]">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-white">Admin Portal Sign In</h2>
          <p className="text-xs text-[#C8D3E2] font-light leading-relaxed">Enter admin credentials to access the dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-[#94A3B8]" size={16} strokeWidth={1.5} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@rootsip.com"
                className="w-full pl-11 pr-4 py-3 bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all text-sm placeholder-[#94A3B8]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 text-[#94A3B8]" size={16} strokeWidth={1.5} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all text-sm placeholder-[#94A3B8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#0A4DFF] hover:text-[#0057D9] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 uppercase bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
