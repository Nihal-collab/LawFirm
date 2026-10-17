import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { QrCode, Search, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const Payment = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Inputs
  const [bookingId, setBookingId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('100.00');
  const [currency, setCurrency] = useState('INR');
  const [upiQrCode, setUpiQrCode] = useState('/upi-qr.svg');
  const [supportEmail, setSupportEmail] = useState('support@rootsip.com');
  const [supportPhone, setSupportPhone] = useState('+1 (555) 012-3456');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');
  const [upiInstructions, setUpiInstructions] = useState('After completing your UPI payment, please share your Transaction ID or payment screenshot with our office. Once your payment is verified, your consultation will be processed accordingly.');

  // UI States
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [bookingVerified, setBookingVerified] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Fetch settings for default amount
  useEffect(() => {
    API.get('payment/settings')
      .then((res) => {
        setAmount(res.data.amount.toFixed(2));
        setCurrency(res.data.currency || 'INR');
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

  return (
    <div className="page-enter py-10 sm:py-14 bg-[#09111F] text-[#C8D3E2] min-h-screen font-sans">
      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-[10px] font-semibold block">Scan & Pay</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-white">Scan UPI QR Code</h1>
          <p className="text-[#C8D3E2] text-xs max-w-sm mx-auto leading-relaxed">
            Scan the official QR code below using any UPI app to complete your consultation payment.
          </p>
        </div>

        {/* Booking Lookup & Details Card */}
        <div className="bg-[#111827] border border-white/8 rounded-xl p-4 sm:p-5 shadow-2xl space-y-3.5 max-w-sm sm:max-w-md mx-auto">
          <h2 className="text-sm font-serif font-medium text-white flex items-center gap-1.5">
            <ShieldCheck className="text-[#0A4DFF]" size={16} />
            Booking & Consultation Details
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Booking Reference ID */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Booking ID (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  onBlur={handleBookingIdBlur}
                  placeholder="e.g. 64b1f4..."
                  className="w-full pl-3 pr-8 py-2 text-xs bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
                />
                <button
                  type="button"
                  onClick={() => verifyBooking(bookingId)}
                  className="absolute right-2 top-2 text-[#94A3B8] hover:text-white cursor-pointer"
                  title="Verify Booking ID"
                >
                  <Search size={14} />
                </button>
              </div>
              {loadingBooking && (
                <span className="text-[9px] text-[#0A4DFF] block mt-0.5">Verifying booking ID...</span>
              )}
              {bookingVerified && (
                <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5 font-semibold">
                  <CheckCircle2 size={11} /> Reference verified.
                </span>
              )}
              {bookingError && (
                <span className="text-[9px] text-rose-500 flex items-center gap-1 mt-0.5 font-semibold">
                  <AlertCircle size={11} /> {bookingError}
                </span>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Amount ({currency === 'USD' ? 'USD' : 'INR (₹)'})
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full px-3 py-2 text-xs bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Payer Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full px-3 py-2 text-xs bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
              />
            </div>

            {/* Payer Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 text-xs bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF]"
              />
            </div>
          </div>
        </div>

        {/* QR Code Scanner Card (Compact Small Size) */}
        <div className="bg-[#111827] border border-white/8 rounded-2xl p-4 sm:p-5 shadow-2xl text-center space-y-3.5 hover:border-[#0A4DFF]/40 transition-all max-w-sm mx-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 bg-[#0A4DFF]/10 text-[#0A4DFF] rounded-lg">
              <QrCode size={20} />
            </div>
            <h3 className="text-lg font-serif font-bold text-white leading-tight">
              Scan to Pay
            </h3>
            <p className="text-[10.5px] text-[#94A3B8] max-w-xs leading-relaxed">
              Use Google Pay, PhonePe, Paytm, BHIM, or any UPI app to scan.
            </p>
          </div>

          {/* Amount Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B132B] border border-[#0A4DFF]/30 text-white font-medium text-xs">
            <span className="text-[#94A3B8] text-[10px]">Payable:</span>
            <span className="text-emerald-400 font-bold font-mono text-xs">
              {currency === 'USD' ? '$' : '₹'}{parseFloat(amount || 0).toFixed(2)} {currency === 'USD' ? 'USD' : 'INR'}
            </span>
          </div>

          {/* QR Code Container (Small Size) */}
          <div className="flex justify-center">
            <div className="p-2 bg-[#0B132B] rounded-xl border border-[#0A4DFF]/30 shadow-[0_0_20px_rgba(10,77,255,0.12)] inline-block">
              <img
                src={upiQrCode}
                alt="UPI QR Code"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Supported Apps Pills */}
          <div className="flex flex-wrap justify-center items-center gap-1.5 text-[8.5px] font-semibold text-[#A7B2C3] uppercase tracking-wider">
            <span className="px-2 py-0.5 bg-[#0B132B] border border-white/5 rounded-full">Google Pay</span>
            <span className="px-2 py-0.5 bg-[#0B132B] border border-white/5 rounded-full">PhonePe</span>
            <span className="px-2 py-0.5 bg-[#0B132B] border border-white/5 rounded-full">Paytm</span>
            <span className="px-2 py-0.5 bg-[#0B132B] border border-white/5 rounded-full">BHIM</span>
            <span className="px-2 py-0.5 bg-[#0B132B] border border-white/5 rounded-full">Cred</span>
          </div>

          {/* Instructions box */}
          <div className="text-[10.5px] text-[#C8D3E2] leading-relaxed bg-[#0B132B] p-2.5 rounded-lg border border-[#0A4DFF]/20 text-left space-y-1">
            <div className="font-semibold text-white flex items-center gap-1.5 text-[10.5px]">
              <CheckCircle2 size={12} className="text-[#0A4DFF]" /> Verification Steps:
            </div>
            <p className="text-[9.5px] text-[#94A3B8] font-light leading-relaxed">
              {upiInstructions}
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-[#111827]/40 border border-white/5 rounded-xl p-5 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="font-semibold text-white">Need Assistance?</h4>
            <p className="text-[#94A3B8] font-light">Contact our billing team for payment verification or questions.</p>
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
