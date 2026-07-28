import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, CheckCircle, ShieldAlert, Award, FileText, ChevronDown } from 'lucide-react';

const BookConsultation = () => {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  const timeSlots = [
    '09:30 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const services = [
    'Patent Prosecution',
    'Trademark Portfolio Management',
    'Copyright Registration',
    'Industrial Design Registration',
    'Geographical Indication Registry',
    'IP Litigation & Enforcement'
  ];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30 AM');
  const [service, setService] = useState('Patent Prosecution');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [dateAvailability, setDateAvailability] = useState({});
  const [selectedDateAvailability, setSelectedDateAvailability] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookedName, setBookedName] = useState('');
  const [bookedService, setBookedService] = useState('');
  const [bookedDate, setBookedDate] = useState('');
  const [bookedTime, setBookedTime] = useState('');

  useEffect(() => {
    // Generate dates for the next 10 days (excluding Sundays)
    const dates = [];
    let current = new Date();
    current.setDate(current.getDate() + 1); // Start tomorrow
    for (let i = 0; i < 12; i++) {
      if (current.getDay() !== 0) { // Exclude Sundays
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      const yyyy = dates[0].getFullYear();
      const mm = String(dates[0].getMonth() + 1).padStart(2, '0');
      const dd = String(dates[0].getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
    }
  }, []);

  useEffect(() => {
    const loadAvailability = async () => {
      if (availableDates.length === 0) return;

      try {
        const entries = await Promise.all(
          availableDates.map(async (currentDate) => {
            const yyyy = currentDate.getFullYear();
            const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
            const dd = String(currentDate.getDate()).padStart(2, '0');
            const dateValue = `${yyyy}-${mm}-${dd}`;

            const res = await API.get(`consultations/availability/?date=${dateValue}`);
            return [dateValue, res.data];
          })
        );

        setDateAvailability(Object.fromEntries(entries));
      } catch (error) {
        console.error('Failed to load consultation availability.', error);
      }
    };

    loadAvailability();
  }, [availableDates]);

  useEffect(() => {
    if (date) {
      API.get(`consultations/availability/?date=${date}`)
        .then((res) => {
          setSelectedDateAvailability(res.data);
          setBookedSlots(res.data.bookedSlots || []);

          const nextSlot = timeSlots.find(slot => !(res.data.bookedSlots || []).includes(slot));
          if (nextSlot && res.data.isAvailable) {
            setTime(nextSlot);
          }
        })
        .catch(() => {
          setSelectedDateAvailability(null);
          setBookedSlots([]);
        });
    }
  }, [date]);

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setService(serviceParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('book-consultation/', {
        name,
        email,
        phone,
        company,
        date,
        time,
        service,
        message
      });
      if (res.status === 201) {
        showToast('Consultation request submitted successfully!', 'success');
        setBookedName(name);
        setBookedService(service);
        setBookedDate(date);
        setBookedTime(time);

        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setMessage('');
        if (availableDates.length > 0) {
          const yyyy = availableDates[0].getFullYear();
          const mm = String(availableDates[0].getMonth() + 1).padStart(2, '0');
          const dd = String(availableDates[0].getDate()).padStart(2, '0');
          setDate(`${yyyy}-${mm}-${dd}`);
        }

        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.detail || 'Failed to submit request. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#09111F] px-6 font-sans">
        <div className="max-w-md w-full card-premium text-center space-y-6">
          <div className="inline-flex p-3.5 bg-emerald-950/20 text-emerald-500 rounded-full border border-emerald-900/50">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-white">Request Received</h2>
          <p className="text-sm text-[#C8D3E2] leading-relaxed font-light">
            Thank you, <strong>{bookedName}</strong>. Your appointment request for <strong>{bookedService}</strong> has been logged in our queue.
          </p>
          
          <div className="bg-[#0B132B] p-5 rounded-[12px] text-left text-xs space-y-3 border border-white/8 text-[#C8D3E2]">
            <div><strong className="font-medium text-white">Requested Date:</strong> {bookedDate}</div>
            <div><strong className="font-medium text-white">Requested Time Slot:</strong> {bookedTime}</div>
            <div><strong className="font-medium text-white">Target Practice Area:</strong> {bookedService}</div>
            <div className="text-[10px] text-[#94A3B8] pt-2 border-t border-white/5">
              A confirmation email has been logged. An attorney will verify and send the coordinates (Zoom or Google Meet).
            </div>
          </div>
          
          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-3.5 border border-white/8 hover:border-[#0A4DFF] text-white hover:text-[#0A4DFF] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Schedule Another Strategy Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter py-12 sm:py-16 bg-[#09111F] text-[#C8D3E2] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 font-sans">
          <span className="text-[#0A4DFF] uppercase tracking-[0.25em] text-xs font-semibold block">Schedule Strategy Session</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-white">Confidential IPR Evaluation</h1>
          <p className="text-[#C8D3E2] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">Book a 30-minute introductory meeting with our managing attorneys. All details submitted are strictly protected under confidentiality protocols.</p>
        </div>

        {/* Layout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Booking Form */}
          <div className="lg:col-span-8 bg-[#111827] border border-white/8 rounded-xl p-5 sm:p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-4 py-2 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all placeholder-[#94A3B8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-4 py-2 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all placeholder-[#94A3B8]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full px-4 py-2 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all placeholder-[#94A3B8]"
                  />
                </div>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">IPR Practice Area</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-2 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s} value={s} className="bg-[#0B132B] text-white">{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {/* Custom Dropdown Date Picker */}
                <div className="space-y-1 font-sans relative">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Preferred Date</label>
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm bg-[#0B132B] text-white border border-white/8 rounded hover:border-[#0A4DFF] focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-[#0A4DFF]" />
                      <span>
                        {date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Select a date'}
                      </span>
                    </div>
                    <ChevronDown size={16} className="text-[#94A3B8] transition-transform duration-200" style={{ transform: showDatePicker ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {showDatePicker && (
                    <>
                      {/* Click outside to close backdrop overlay */}
                      <div className="fixed inset-0 z-20" onClick={() => setShowDatePicker(false)} />
                      <div className="absolute z-30 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#0B132B] border border-white/8 rounded-lg shadow-2xl p-2 space-y-1">
                        {availableDates.map((d) => {
                          const yyyy = d.getFullYear();
                          const mm = String(d.getMonth() + 1).padStart(2, '0');
                          const dd = String(d.getDate()).padStart(2, '0');
                          const dateVal = `${yyyy}-${mm}-${dd}`;
                          
                          const formattedLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                          const isSelected = date === dateVal;
                          const availability = dateAvailability[dateVal];
                          const isFullyBooked = availability && !availability.isAvailable;

                          return (
                            <button
                              key={dateVal}
                              type="button"
                              disabled={isFullyBooked}
                              onClick={() => {
                                setDate(dateVal);
                                setShowDatePicker(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0A4DFF] text-white font-semibold'
                                  : isFullyBooked
                                    ? 'opacity-40 cursor-not-allowed bg-slate-900/40 text-slate-500'
                                    : 'text-[#C8D3E2] hover:bg-white/5 hover:text-[#0A4DFF]'
                              }`}
                            >
                              <span>{formattedLabel}</span>
                              {isFullyBooked ? (
                                <span className="text-[9px] uppercase font-bold text-rose-500">Fully Booked</span>
                              ) : (
                                availability && (
                                  <span className={`text-[9px] font-medium ${isSelected ? 'text-white/85' : 'text-emerald-400'}`}>
                                    {availability.remainingSlots} slots
                                  </span>
                                )
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Pill-shaped Time Slots */}
                <div className="space-y-2 font-sans">
                  <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Preferred Time Slot</label>
                  <div className="flex flex-wrap gap-2.5 justify-start">
                    {timeSlots.map((slot) => {
                      const isSelected = time === slot;
                      const isBooked = bookedSlots.includes(slot);
                      const isDateFull = selectedDateAvailability && !selectedDateAvailability.isAvailable;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked || isDateFull}
                          onClick={() => setTime(slot)}
                          style={{ width: '115px', height: '44px' }}
                          className={`text-xs font-sans font-semibold border rounded-full transition-all text-center flex flex-col items-center justify-center cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white border-transparent shadow-[0_4px_15px_rgba(10,77,255,0.3)]'
                              : isBooked
                                ? 'opacity-40 cursor-not-allowed bg-[#081223]/30 border-white/5 text-slate-500 line-through'
                                : isDateFull
                                  ? 'opacity-40 cursor-not-allowed bg-[#081223]/30 border-white/5 text-slate-500'
                                : 'bg-[#0B132B] border border-white/8 hover:border-[#0A4DFF] text-white'
                          }`}
                        >
                          <span>{slot}</span>
                          {isBooked && <span className="text-[7.5px] font-bold uppercase tracking-tight text-rose-500 leading-none mt-0.5">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedDateAvailability && (
                  <div className={`text-[10px] uppercase tracking-wider font-semibold font-sans ${selectedDateAvailability.isAvailable ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {selectedDateAvailability.isAvailable
                      ? `${selectedDateAvailability.remainingSlots} of ${selectedDateAvailability.dailyLimit} slots available for this date`
                      : 'This date is fully booked'}
                  </div>
                )}
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide block">Technology description / briefing (Optional)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  placeholder="Outline details of patent drafts or trademarks search titles you wish to consult on..."
                  className="w-full px-4 py-2 text-sm bg-[#0B132B] text-white border border-white/8 rounded focus:outline-hidden focus:border-[#0A4DFF] focus:ring-2 focus:ring-[#0A4DFF]/20 transition-all placeholder-[#94A3B8]"
                ></textarea>
              </div>

              <div className="flex flex-col items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading || (selectedDateAvailability && !selectedDateAvailability.isAvailable)}
                  className="w-full py-4.5 uppercase bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-xs font-semibold tracking-widest rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer text-center disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  {loading ? 'Registering Booking request...' : 'Book strategy session'}
                </button>
                <p className="text-[10px] text-[#94A3B8] font-sans">
                  All details submitted are strictly protected under confidentiality protocols.
                </p>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 bg-[#111827] border border-white/8 rounded-xl p-5 sm:p-6 text-xs leading-relaxed space-y-4">
            <h3 className="text-lg font-serif font-medium text-white border-b border-white/8 pb-3 flex items-center gap-1.5">
              Booking Guidelines
            </h3>
            
            <div className="space-y-3 font-sans">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-[#0A4DFF]/10 text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.2)] rounded-[4px] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div className="text-[#C8D3E2] font-light">
                  <strong className="font-medium text-white">NDA Coverage:</strong> All consultations operate under legal privilege. Do not hesitate to discuss mechanisms or code logics.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-[#0A4DFF]/10 text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.2)] rounded-[4px] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div className="text-[#C8D3E2] font-light">
                  <strong className="font-medium text-white">Zoom coordinates:</strong> Meeting invitations containing Google Meet or Zoom coordinates are shared via email after admin approval.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-[#0A4DFF]/10 text-[#0A4DFF] shadow-[0_0_10px_rgba(10,77,255,0.2)] rounded-[4px] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div className="text-[#C8D3E2] font-light">
                  <strong className="font-medium text-white">Rescheduling:</strong> You may modify booking requests up to 12 hours prior to scheduled sessions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookConsultation;
