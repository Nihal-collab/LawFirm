import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { CheckCircle, ShieldAlert, FileText, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payment, setPayment] = useState(null);
  
  const bookingId = searchParams.get('bookingId');
  const token = searchParams.get('token'); // PayPal Order ID
  
  const hasCaptured = useRef(false);

  useEffect(() => {
    if (!token) {
      setError('Missing payment transaction reference token.');
      setLoading(false);
      return;
    }

    if (hasCaptured.current) return;
    hasCaptured.current = true;

    const verifyPayment = async () => {
      try {
        const res = await API.post('payment/success', {
          bookingId: bookingId || null,
          orderId: token
        });
        
        setPayment(res.data.booking);
        showToast('Payment verified successfully!', 'success');
      } catch (err) {
        console.error('Payment verification error:', err);
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
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-[#09111F] px-6 font-sans">
        <div className="max-w-md w-full card-premium text-center space-y-6">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A4DFF]"></div>
          </div>
          <h2 className="text-2xl font-serif font-medium text-white">Verifying Transaction</h2>
          <p className="text-sm text-[#C8D3E2] leading-relaxed font-light">
            We are securely confirming your transaction details with PayPal. Please do not close or refresh this page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#09111F] px-6 font-sans">
        <div className="max-w-md w-full card-premium text-center space-y-6">
          <div className="inline-flex p-3.5 bg-rose-950/20 text-rose-500 rounded-full border border-rose-900/50">
            <ShieldAlert size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-white">Payment Unverified</h2>
          <p className="text-sm text-rose-500 leading-relaxed font-medium">
            {error}
          </p>
          <p className="text-xs text-[#C8D3E2] leading-relaxed font-light">
            If payment was deducted from your account, please reach out to us at support@rootsip.com with your transaction details.
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate('/payment')}
              className="w-full py-3.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center"
            >
              Retry Payment Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currencySymbol = payment?.paymentCurrency === 'INR' ? 'INR ' : '$';

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#09111F] px-6 font-sans py-12">
      <div className="max-w-md w-full card-premium text-center space-y-6">
        <div className="inline-flex p-3.5 bg-emerald-950/20 text-emerald-500 rounded-full border border-emerald-900/50">
          <CheckCircle size={40} strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl font-serif font-medium text-white">Payment Successful</h2>
        <p className="text-sm text-[#C8D3E2] leading-relaxed font-light">
          Thank you, <strong>{payment?.name}</strong>. Your transaction has been completed successfully and logged in our system.
        </p>

        {/* Payment details invoice */}
        <div className="bg-[#0B132B] p-5 rounded-[12px] text-left text-xs space-y-3 border border-white/8 text-[#C8D3E2] shadow-premium">
          <h3 className="font-semibold text-white uppercase tracking-wider text-[10px] pb-1 border-b border-white/5 flex items-center gap-1">
            <FileText size={12} /> Transaction Details
          </h3>
          {payment?.id && bookingId && (
            <div><strong className="font-medium text-white">Booking ID:</strong> {payment.id}</div>
          )}
          <div><strong className="font-medium text-white">Payer Name:</strong> {payment?.name}</div>
          <div><strong className="font-medium text-white">Payer Email:</strong> {payment?.payerEmail || payment?.email}</div>
          <div><strong className="font-medium text-white">Amount Paid:</strong> {currencySymbol}{payment?.paymentAmount?.toFixed(2)} {payment?.paymentCurrency || 'USD'}</div>
          <div><strong className="font-medium text-white">Transaction ID:</strong> {payment?.paypalTransactionId}</div>
          <div><strong className="font-medium text-white">Order ID:</strong> {payment?.paypalOrderId}</div>
        </div>

        <p className="text-[10px] text-[#94A3B8] text-center font-light pt-2">
          A receipt and payment confirmation email have been sent to you. Our specialists will review and follow up shortly.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full py-3.5 border border-white/8 hover:border-[#0A4DFF] text-white hover:text-[#0A4DFF] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          Return to Homepage <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
