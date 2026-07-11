import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { ShieldAlert } from 'lucide-react';

export default function BookConsultationCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const bookingId = searchParams.get('bookingId');
  const hasCancelled = useRef(false);

  useEffect(() => {
    if (!bookingId) return;

    if (hasCancelled.current) return;
    hasCancelled.current = true;

    const cancelBooking = async () => {
      try {
        await API.post('consultations/cancel', { bookingId });
        showToast('Payment was cancelled. You can try booking again.', 'info');
      } catch (err) {
        console.error('Failed to notify backend of cancellation:', err);
      }
    };

    cancelBooking();
  }, [bookingId, showToast]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121110] px-6 font-sans">
      <div className="max-w-md w-full card-premium text-center space-y-6">
        <div className="inline-flex p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-full border border-amber-100 dark:border-amber-900/50">
          <ShieldAlert size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Payment Cancelled</h2>
        <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-light">
          Your payment process was cancelled and your consultation has <strong>not</strong> been booked.
        </p>
        <p className="text-xs text-[#6D6258]/60 leading-relaxed font-light">
          No charges were made. The selected date and time slots have been released.
        </p>
        
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate('/book-consultation')}
            className="w-full py-3.5 bg-[#8B6B57] text-[#F8F5F0] hover:bg-[#171717] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Retry Booking Consultation
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 border border-[#DDD5C8] hover:border-[#8B6B57] dark:border-slate-800 text-[#171717] dark:text-[#F8F5F0] hover:text-[#8B6B57] dark:hover:text-[#8B6B57] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
