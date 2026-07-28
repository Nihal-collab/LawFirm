import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#09111F] px-6 font-sans">
      <div className="max-w-md w-full card-premium text-center space-y-6">
        <div className="inline-flex p-3.5 bg-amber-950/20 text-amber-500 rounded-full border border-amber-900/50">
          <ShieldAlert size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-white">Payment Cancelled</h2>
        <p className="text-sm text-[#C8D3E2] leading-relaxed font-light">
          The payment checkout process was cancelled. No charges were made to your card or account.
        </p>
        <p className="text-xs text-[#94A3B8] leading-relaxed font-light">
          If you have a Booking Reference ID, you can retry completing the payment at any time.
        </p>
        
        <div className="flex flex-col gap-3 pt-4">
          <button
            onClick={() => navigate(bookingId ? `/payment?bookingId=${bookingId}` : '/payment')}
            className="w-full py-3.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center"
          >
            Retry Payment
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 border border-white/8 hover:border-[#0A4DFF] text-white hover:text-[#0A4DFF] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={13} /> Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
