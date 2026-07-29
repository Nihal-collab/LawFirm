import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { CreditCard, QrCode, Search, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const Payment = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Inputs
  const [bookingId, setBookingId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('100.00');
  const [currency, setCurrency] = useState('USD');
  const [upiQrCode, setUpiQrCode] = useState('/upi-qr.svg');
  const [supportEmail, setSupportEmail] = useState('support@rootsip.com');
  const [supportPhone, setSupportPhone] = useState('+1 (555) 012-3456');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');
  const [upiInstructions, setUpiInstructions] = useState('After completing your UPI payment, please share your Transaction ID or payment screenshot with our office. Once your payment is verified, your consultation will be processed accordingly.');

  // UI States
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [bookingVerified, setBookingVerified] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [initiatingPaypal, setInitiatingPaypal] = useState(false);

  // Fetch settings for default amount
  useEffect(() => {
    API.get('payment/settings')
      .then((res) => {
        setAmount(res.data.amount.toFixed(2));
        setCurrency(res.data.currency || 'USD');
        if (res.data.upiQrCode) setUpiQrCode(res.data.upiQrCode);
        if (res.data.supportEmail) setSupportEmail(res.data.supportEmail);
        if (res.data.supportPhone) setSupportPhone(res.data.supportPhone);
        if (res.data.supportWhatsapp) setSupportWhatsapp(res.data.supportWhatsapp);
        if (res.data.upiInstructions) setUpiInstructions(res.data.upiInstructions);
      })
      .catch((err) => {
        console.error('Failed to load payment settings', err);
      });

    // Check if bookingId is in query param
    const bId = searchParams.get('bookingId');
    if (bId) {
      setBookingId(bId);
      verifyBooking(bId);
    }
  }, [searchParams]);

  // Method to check Booking Reference ID
  const verifyBooking = async (idToVerify) => {
    const id = idToVerify || bookingId;
    if (!id) return;
    
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      setBookingError('Invalid Reference ID format. Must be 24 hex characters.');
      setBookingVerified(false);
      return;
    }

    setLoadingBooking(true);
    setBookingError('');
    try {
      const res = await API.get(`payment/booking/${id}`);
      setName(res.data.name);
      setEmail(res.data.email);
      setAmount(res.data.amount.toFixed(2));
      setCurrency(res.data.currency);
      setBookingVerified(true);
      showToast('Booking details verified and loaded!', 'success');
    } catch (err) {
      console.error(err);
      setBookingError(err.response?.data?.detail || 'Booking Reference ID not found.');
      setBookingVerified(false);
    } finally {
      setLoadingBooking(false);
    }
  };

  const handleBookingIdBlur = () => {
    if (bookingId) {
      verifyBooking(bookingId);
    } else {
      setBookingVerified(false);
      setBookingError('');
    }
  };

  const handlePayWithPaypal = async () => {
    setInitiatingPaypal(true);
    try {
      const res = await API.post('payment/create', {
        bookingId: bookingId || null,
        amount: parseFloat(amount),
      });

      if (res.data.approveUrl) {
        window.location.href = res.data.approveUrl;
      } else {
        showToast('Initiating payment failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to connect to PayPal. Please try again.', 'error');
    } finally {
      setInitiatingPaypal(false);
    }
  };

  return (
    <div className="page-enter py-12 sm:py-16 bg-[#09111F] text-[#C8D3E2] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Secure Gateway</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-white">Secure Payment</h1>
          <p className="text-[#C8D3E2] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Complete your consultation payment securely using PayPal for international cards or scan the UPI QR Code for Indian domestic payments.
          </p>
        </div>

        {/* Booking Lookup & Details Card */}
        <div className="bg-[#111827] border border-white/8 rounded-xl p-5 sm:p-6 shadow-2xl space-y-4 max-w-3xl mx-auto">
          <h2 className="text-lg font-serif font-medium text-white flex items-center gap-2">
            <ShieldCheck className="text-[#0A4DFF]" size={20} />
            Payment Information
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Booking Reference ID */}
            <div className="space-y-1 relative">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Booking Reference ID (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  onBlur={handleBookingIdBlur}
                  placeholder="e.g. 64b1f4..."
                  className="w-full pl-4 pr-10 py-2.5 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
                />
                <button
                  type="button"
                  onClick={() => verifyBooking(bookingId)}
                  className="absolute right-2.5 top-2.5 text-[#94A3B8] hover:text-white cursor-pointer"
                  title="Verify Booking ID"
                >
                  <Search size={16} />
                </button>
              </div>
              {loadingBooking && (
                <span className="text-[10px] text-[#0A4DFF] block mt-1">Verifying booking ID...</span>
              )}
              {bookingVerified && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                  <CheckCircle2 size={12} /> Reference ID verified. Customer details pre-filled.
                </span>
              )}
              {bookingError && (
                <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1 font-semibold">
                  <AlertCircle size={12} /> {bookingError}
                </span>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Payment Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full px-4 py-2.5 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payer Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-4 py-2.5 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
              />
            </div>

            {/* Payer Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Card 1: PayPal International */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-6 shadow-2xl flex flex-col justify-between hover:border-[#0A4DFF] transition-all transform hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0A4DFF]/10 text-[#0A4DFF] rounded-lg">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white leading-tight">Option 1: PayPal</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-semibold">International Customers</span>
                </div>
              </div>
              
              <p className="text-xs text-[#C8D3E2] leading-relaxed">
                Pay using your Credit/Debit Card or PayPal account balance. Transactions are processed securely in USD/USD equivalents.
              </p>

              {/* Supported payment mock representations */}
              <div className="flex gap-2.5 pt-2">
                <span className="px-2.5 py-1 bg-[#0B132B] border border-white/5 rounded text-[10px] font-medium text-[#A7B2C3]">Visa</span>
                <span className="px-2.5 py-1 bg-[#0B132B] border border-white/5 rounded text-[10px] font-medium text-[#A7B2C3]">Mastercard</span>
                <span className="px-2.5 py-1 bg-[#0B132B] border border-white/5 rounded text-[10px] font-medium text-[#A7B2C3]">Amex</span>
                <span className="px-2.5 py-1 bg-[#0B132B] border border-white/5 rounded text-[10px] font-medium text-[#A7B2C3]">PayPal</span>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={handlePayWithPaypal}
                disabled={initiatingPaypal || !name || !email}
                className="w-full py-3.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {initiatingPaypal ? 'Redirecting to PayPal...' : `Pay $${parseFloat(amount).toFixed(2)} with PayPal`}
              </button>
              {(!name || !email) && (
                <p className="text-[10px] text-rose-400 text-center mt-2 font-medium">
                  Please fill in your name and email to proceed.
                </p>
              )}
            </div>
          </div>

          {/* Card 2: UPI Indian Customers */}
          <div className="bg-[#111827] border border-white/8 rounded-xl p-6 shadow-2xl flex flex-col justify-between hover:border-[#0A4DFF] transition-all transform hover:-translate-y-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0A4DFF]/10 text-[#0A4DFF] rounded-lg">
                  <QrCode size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-white leading-tight">Option 2: Scan QR Code</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-semibold">Indian Customers</span>
                </div>
              </div>

              <p className="text-xs text-[#C8D3E2] leading-relaxed">
                Scan the official QR code below using Google Pay, PhonePe, Paytm, BHIM UPI, or any UPI-enabled application.
              </p>

              {/* QR Image Area */}
              <div className="flex justify-center py-3 bg-[#0B132B] rounded-lg border border-white/5 max-w-[200px] mx-auto overflow-hidden">
                <img
                  src={upiQrCode}
                  alt="UPI QR Code"
                  className="w-40 h-40 object-contain rounded-md"
                />
              </div>

              {/* UPI Logos */}
              <div className="flex justify-center gap-3 text-[9px] font-bold text-[#A7B2C3] uppercase tracking-wider">
                <span>GPay</span>
                <span>•</span>
                <span>PhonePe</span>
                <span>•</span>
                <span>Paytm</span>
                <span>•</span>
                <span>BHIM</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="text-[11px] text-[#C8D3E2] leading-relaxed bg-[#0B132B] p-3 rounded-lg border border-[#0A4DFF]/25 font-light">
                <strong>UPI Instructions:</strong> {upiInstructions}
              </div>
            </div>
          </div>

        </div>

        {/* Support Section */}
        <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-5 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-semibold text-white">Need Assistance?</h4>
            <p className="text-[#94A3B8] font-light">Contact our billing team for payment issues or wire instructions.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-[#A7B2C3] font-medium font-sans items-center">
            <a href={`mailto:${supportEmail}`} className="flex items-center gap-1.5 hover:text-[#0A4DFF]">
              <Mail size={14} /> {supportEmail}
            </a>
            <a href={`tel:${supportPhone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-[#0A4DFF]">
              <Phone size={14} /> {supportPhone}
            </a>
            {supportWhatsapp && (
              <a
                href={`https://wa.me/${supportWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-emerald-400 font-semibold transition-colors"
              >
                WhatsApp
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;
