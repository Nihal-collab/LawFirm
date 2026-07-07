import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, CheckCircle, ShieldAlert, Award, FileText } from 'lucide-react';

const BookConsultation = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

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
      const res = await API.post('consultations/', {
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
      <div className="min-h-[85vh] flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121110] px-6 font-sans">
        <div className="max-w-md w-full card-premium text-center space-y-6">
          <div className="inline-flex p-3.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            <CheckCircle size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Request Received</h2>
          <p className="text-sm text-[#6D6258] dark:text-[#C9C1B5] leading-relaxed font-light">
            Thank you, <strong>{name}</strong>. Your appointment request for <strong>{service}</strong> has been logged in our queue.
          </p>
          
          <div className="bg-[#F8F5F0] dark:bg-[#1C1A19] p-5 rounded-[12px] text-left text-xs space-y-3 border border-[#DDD5C8] dark:border-slate-800/80 text-[#6D6258] dark:text-[#C9C1B5]">
            <div><strong className="font-medium text-[#171717] dark:text-white">Requested Date:</strong> {date}</div>
            <div><strong className="font-medium text-[#171717] dark:text-white">Requested Time Slot:</strong> {time}</div>
            <div><strong className="font-medium text-[#171717] dark:text-white">Target Practice Area:</strong> {service}</div>
            <div className="text-[10px] text-[#6D6258]/60 pt-2 border-t border-[#DDD5C8]/50 dark:border-slate-800">
              A confirmation email has been logged. An attorney will verify and send the coordinates (Zoom or Google Meet).
            </div>
          </div>
          
          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-3.5 border border-[#DDD5C8] hover:border-[#8B6B57] dark:border-slate-800 text-[#171717] dark:text-[#F8F5F0] hover:text-[#8B6B57] dark:hover:text-[#8B6B57] rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Schedule Another Strategy Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter py-16 bg-[#F8F5F0] dark:bg-[#121110] min-h-screen">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#8B6B57] uppercase tracking-[0.25em] text-xs font-semibold block">Schedule Strategy Session</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#171717] dark:text-[#F8F5F0]">Confidential IPR Evaluation</h1>
          <p className="text-[#6D6258] dark:text-[#C9C1B5] text-sm max-w-xl mx-auto">Book a 30-minute introductory meeting with our managing attorneys. All details submitted are strictly protected under confidentiality protocols.</p>
        </div>

        {/* Layout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Booking Form */}
          <div className="lg:col-span-8 card-premium">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full px-4 py-2.5 text-sm bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">IPR Practice Area</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all"
                >
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Preferred Date</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {availableDates.map((d) => {
                      const yyyy = d.getFullYear();
                      const mm = String(d.getMonth() + 1).padStart(2, '0');
                      const dd = String(d.getDate()).padStart(2, '0');
                      const dateVal = `${yyyy}-${mm}-${dd}`;
                      
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                      const isSelected = date === dateVal;
                      const availability = dateAvailability[dateVal];
                      const isFullyBooked = availability && !availability.isAvailable;

                      return (
                        <button
                          key={dateVal}
                          type="button"
                          disabled={isFullyBooked}
                          onClick={() => setDate(dateVal)}
                          className={`flex flex-col items-center justify-center p-3.5 border rounded-[12px] transition-all font-sans cursor-pointer ${
                            isSelected
                              ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent shadow-xs'
                              : isFullyBooked
                                ? 'bg-[#EFE8DD] dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                                : 'bg-white dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 hover:border-[#8B6B57] text-[#6D6258] dark:text-[#C9C1B5]'
                          }`}
                        >
                          <span className="text-[9px] uppercase font-bold tracking-wider">{dayName}</span>
                          <span className="text-base font-bold my-1">{dayNum}</span>
                          <span className="text-[9px] uppercase tracking-wide">{monthName}</span>
                          {isFullyBooked && <span className="mt-1 text-[8px] font-bold uppercase text-rose-500">Full</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Preferred Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                          className={`py-3 px-2 text-xs font-sans font-semibold border rounded-[12px] transition-all text-center cursor-pointer ${
                            isSelected
                              ? 'bg-[#171717] dark:bg-[#8B6B57] text-[#F8F5F0] dark:text-[#171717] border-transparent shadow-xs'
                              : isBooked
                                ? 'opacity-40 cursor-not-allowed bg-[#EFE8DD] dark:bg-navy-dark/10 border-[#DDD5C8] dark:border-slate-800 text-slate-400 line-through'
                                : isDateFull
                                  ? 'opacity-40 cursor-not-allowed bg-[#EFE8DD] dark:bg-navy-dark/10 border-[#DDD5C8] dark:border-slate-800 text-slate-400'
                                : 'bg-white dark:bg-[#1C1A19] border-[#DDD5C8] dark:border-slate-800 hover:border-[#8B6B57] text-[#6D6258] dark:text-[#C9C1B5]'
                          }`}
                        >
                          {slot}
                          {isBooked && <span className="block text-[8px] font-bold tracking-tight text-rose-500 font-sans uppercase mt-0.5">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {selectedDateAvailability && (
                  <div className={`text-[10px] uppercase tracking-wider font-semibold ${selectedDateAvailability.isAvailable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {selectedDateAvailability.isAvailable
                      ? `${selectedDateAvailability.remainingSlots} of ${selectedDateAvailability.dailyLimit} slots available for this date`
                      : 'This date is fully booked'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6D6258] dark:text-[#C9C1B5] uppercase tracking-wide block">Technology description / briefing</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  placeholder="Outline details of patent drafts or trademarks search titles you wish to consult on..."
                  className="w-full px-4 py-2.5 text-sm bg-[#F8F5F0] dark:bg-[#252220] text-[#171717] dark:text-white border border-[#DDD5C8] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#8B6B57] transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading || (selectedDateAvailability && !selectedDateAvailability.isAvailable)}
                className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Registering Booking request...' : 'Book strategy session'}
              </button>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 card-premium text-xs leading-relaxed space-y-6">
            <h3 className="text-lg font-serif font-medium text-[#171717] dark:text-[#F8F5F0] border-b border-[#DDD5C8]/40 pb-3 flex items-center gap-1.5">
              Booking Guidelines
            </h3>
            
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-[#8B6B57]/10 text-[#8B6B57] rounded-[4px] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div className="text-[#6D6258] dark:text-[#C9C1B5] font-light">
                  <strong className="font-medium text-[#171717] dark:text-white">NDA Coverage:</strong> All consultations operate under legal privilege. Do not hesitate to discuss mechanisms or code logics.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-[#8B6B57]/10 text-[#8B6B57] rounded-[4px] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div className="text-[#6D6258] dark:text-[#C9C1B5] font-light">
                  <strong className="font-medium text-[#171717] dark:text-white">Zoom coordinates:</strong> Meeting invitations containing Google Meet or Zoom coordinates are shared via email after admin approval.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 bg-[#8B6B57]/10 text-[#8B6B57] rounded-[4px] flex items-center justify-center shrink-0 text-[10px] font-bold">
                  ✓
                </div>
                <div className="text-[#6D6258] dark:text-[#C9C1B5] font-light">
                  <strong className="font-medium text-[#171717] dark:text-white">Rescheduling:</strong> You may modify booking requests up to 12 hours prior to scheduled sessions.
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
