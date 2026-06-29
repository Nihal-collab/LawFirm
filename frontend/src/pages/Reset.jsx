import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Key, Shield, Eye, EyeOff, CheckCircle } from 'lucide-react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';

const Reset = () => {
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
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Password reset failed. Token may be invalid or expired.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121110] px-6 font-sans">
      <div className="max-w-md w-full card-premium space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-[#8B6B57]/10 text-[#8B6B57] rounded-full border border-[#8B6B57]/10">
            <Shield size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Create New Password</h2>
          <p className="text-xs text-[#6D6258] dark:text-[#C9C1B5] font-light leading-relaxed">Enter and confirm your new secure password below to finalize credential recovery.</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wider block">
              New Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 text-[#6D6258]/70" size={16} strokeWidth={1.5} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-12 py-3 bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#6D6258] hover:text-[#171717] dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wider block">
              Confirm Password
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 text-[#6D6258]/70" size={16} strokeWidth={1.5} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-11 pr-12 py-3 bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3 text-[#6D6258] hover:text-[#171717] dark:hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Updating Credentials...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reset;
