import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Key, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';

const Reset = ({ adminOnly = false }) => {
  const { token } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(`auth/reset-password/${token}`, {
        password,
        confirm_password: confirmPassword
      });
      showToast(res.data?.detail || 'Password reset successfully.', 'success');
      navigate(adminOnly ? '/admin/login' : '/admin/login');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Password reset failed. Token may be invalid or expired.', 'error');
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-serif font-medium text-white">Create New Admin Password</h2>
          <p className="text-xs text-[#C8D3E2] font-light leading-relaxed">Enter and confirm your new secure password below to finalize admin credential recovery.</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              New Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 text-[#94A3B8]" size={16} strokeWidth={1.5} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
          </div>

          {/* Confirm Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider block">
              Confirm Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 text-[#94A3B8]" size={16} strokeWidth={1.5} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-11 pr-12 py-3 bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all text-sm placeholder-[#94A3B8]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 uppercase bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Updating Credentials...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
