import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { CheckCircle, ShieldAlert } from 'lucide-react';

export default function BookConsultationSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  
  const bookingId = searchParams.get('bookingId');
  const token = searchParams.get('token'); // PayPal Order ID
  
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (!bookingId || !token) {
      setError('Missing booking reference or payment token.');
      setLoading(false);
      return;
    }

    if (hasCaptured.current) return;
    hasCaptured.current = true;

    const verifyPayment = async () => {
      try {
        const res = await API.post('consultations/capture', {
          bookingId,
          orderId: token
        });
        
        setBooking(res.data.booking);
        showToast('Payment verified successfully!', 'success');
      } catch (err) {
        console.error('Verification error:', err);
        setError(err.response?.data?.detail || 'Failed to verify payment with PayPal.');
        showToast(err.response?.data?.detail || 'Verification failed.', 'error');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [bookingId, token, showToast]);

  if (loading) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#FFFFFF] dark:bg-[#121110] px-6 font-sans">
        <div className="max-w-md w-full card-premium text-center space-y-6">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4BB8E8]"></div>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Verifying Payment</h2>
          <p className="text-sm text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-light">
            We are securely confirming your transaction details with PayPal. Please do not close or refresh this page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121110] px-6 font-sans">
        <div className="max-w-md w-full card-premium text-center space-y-6">
          <div className="inline-flex p-3.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-full border border-rose-100 dark:border-rose-900/50">
            <ShieldAlert size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Verification Failed</h2>
          <p className="text-sm text-rose-600 dark:text-rose-450 leading-relaxed font-medium">
            {error}
          </p>
          <p className="text-xs text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-light">
            If payment was deducted from your account, please reach out to us at consult@sr4ipr.com with your transaction details.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/book-consultation')}
              className="w-full py-3.5 bg-[#4BB8E8] text-[#FFFFFF] hover:bg-[#000000] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Consultation Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currencySymbol = booking?.paymentCurrency === 'INR' ? 'INR ' : '$';

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FFFFFF] dark:bg-[#121110] px-6 font-sans py-12">
      <div className="max-w-md w-full card-premium text-center space-y-6">
        <div className="inline-flex p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-900/50">
          <CheckCircle size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Booking Confirmed</h2>
        <p className="text-sm text-[#444444] dark:text-[#C9C1B5] leading-relaxed font-light">
          Thank you, <strong>{booking?.name}</strong>. Your consultation has been booked successfully, and payment has been received.
        </p>
        
        {/* Booking Details */}
        <div className="bg-[#FFFFFF] dark:bg-[#1C1A19] p-5 rounded-[12px] text-left text-xs space-y-3 border border-[#E5E7EB] dark:border-slate-800/80 text-[#444444] dark:text-[#C9C1B5]">
          <h3 className="font-semibold text-slate-800 dark:text-white uppercase tracking-wider text-[10px] pb-1 border-b border-[#E5E7EB]/50 dark:border-slate-800">Booking Coordinates</h3>
          <div><strong className="font-medium text-[#000000] dark:text-white">Practice Area:</strong> {booking?.service}</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Confirmed Date:</strong> {booking?.date}</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Confirmed Time:</strong> {booking?.time}</div>
        </div>

        {/* Payment Details */}
        <div className="bg-[#FFFFFF] dark:bg-[#1C1A19] p-5 rounded-[12px] text-left text-xs space-y-3 border border-[#E5E7EB] dark:border-slate-800/80 text-[#444444] dark:text-[#C9C1B5]">
          <h3 className="font-semibold text-slate-800 dark:text-white uppercase tracking-wider text-[10px] pb-1 border-b border-[#E5E7EB]/50 dark:border-slate-800">Payment Invoice</h3>
          <div><strong className="font-medium text-[#000000] dark:text-white">Payment Status:</strong> Successful</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Payment Method:</strong> PayPal</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Transaction ID:</strong> {booking?.paypalTransactionId}</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Order ID:</strong> {booking?.paypalOrderId}</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Amount Paid:</strong> {currencySymbol}{booking?.paymentAmount} {booking?.paymentCurrency}</div>
          <div><strong className="font-medium text-[#000000] dark:text-white">Payer Email:</strong> {booking?.payerEmail}</div>
        </div>

        <p className="text-[10px] text-[#444444]/60 text-center font-light pt-2">
          A receipt and confirmation email have been sent to you. One of our IP specialists will verify and send the meeting link (Zoom/Google Meet) shortly.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 border border-[#E5E7EB] hover:border-[#4BB8E8] dark:border-slate-800 text-[#000000] dark:text-[#FFFFFF] hover:text-[#4BB8E8] dark:hover:text-[#4BB8E8] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Return to Homepage
        </button>
      </div>
    </div>
  );
}
