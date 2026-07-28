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
    <div className="min-h-[85vh] flex items-center justify-center bg-[#09111F] px-6 font-sans">
      <div className="max-w-md w-full card-premium text-center space-y-6">
        <div className="inline-flex p-3.5 bg-amber-950/20 text-amber-500 rounded-full border border-amber-900/50">
          <ShieldAlert size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-white">Payment Cancelled</h2>
        <p className="text-sm text-[#C8D3E2] leading-relaxed font-light font-sans">
          Your payment process was cancelled and your consultation has <strong>not</strong> been booked.
        </p>
        <p className="text-xs text-[#94A3B8] leading-relaxed font-light font-sans">
          No charges were made. The selected date and time slots have been released.
        </p>
        
        <div className="flex flex-col gap-3 pt-4 font-sans">
          <button
            onClick={() => navigate('/book-consultation')}
            className="w-full py-3.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center"
          >
            Retry Booking Consultation
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 border border-white/8 hover:border-[#0A4DFF] text-white hover:text-[#0A4DFF] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
