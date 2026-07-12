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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121110] px-6 font-sans">
      <div className="max-w-md w-full card-premium text-center space-y-6">
        <div className="inline-flex p-3.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-full border border-amber-100 dark:border-amber-900/50">
          <ShieldAlert size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Payment Cancelled</h2>
        <p className="text-sm text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-light">
          Your payment process was cancelled and your consultation has <strong>not</strong> been booked.
        </p>
        <p className="text-xs text-[#444444]/60 leading-relaxed font-light">
          No charges were made. The selected date and time slots have been released.
        </p>
        
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate('/book-consultation')}
            className="w-full py-3.5 bg-[#4BB8E8] text-[#FFFFFF] hover:bg-[#000000] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Retry Booking Consultation
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 border border-[#E5E7EB] hover:border-[#4BB8E8] dark:border-slate-800 text-[#000000] dark:text-[#FFFFFF] hover:text-[#4BB8E8] dark:hover:text-[#4BB8E8] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
