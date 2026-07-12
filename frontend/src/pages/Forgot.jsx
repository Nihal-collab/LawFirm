import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Shield, ArrowLeft } from 'lucide-react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';

const Forgot = ({ adminOnly = false }) => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('auth/forgot-password', { email });
      showToast(res.data?.detail || 'If that email address is registered, a password reset link has been sent.', 'success');
      navigate(adminOnly ? '/admin/login' : '/admin/login');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Something went wrong. Please try again.', 'error');
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Reset Admin Credentials</h2>
          <p className="text-xs text-[#444444] dark:text-[#C9C1B5] font-light leading-relaxed">Enter your admin email address below, and we will send you a secure link to reset your credentials.</p>
        </div>

        {/* Forgot Form */}
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

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Processing Request...' : 'Send Reset Link'}
          </button>
        </form>

        {/* Back Link */}
        <div className="border-t border-[#E5E7EB]/40 dark:border-slate-850 pt-4 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#4BB8E8] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
