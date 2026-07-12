import React, { useState } from 'react';
import API from '../utils/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { siteSettings } from '../data/pageContent';

const Contact = () => {
  const { showToast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(siteSettings);

  React.useEffect(() => {
    setSettings(siteSettings);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Directs to consultations bookings endpoint using the message fields
      const res = await API.post('consultations/', {
        name,
        email,
        phone: 'Not Provided',
        company,
        date: new Date().toISOString().split('T')[0], // placeholder date
        time: '12:00 PM',
        service: 'General Enquiry',
        message: `[Contact Form - Subject: ${subject}] ${message}`
      });
      if (res.status === 201) {
        showToast('Enquiry message sent successfully!', 'success');
        setName('');
        setEmail('');
        setCompany('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to deliver message. Please call our hotline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter py-16 bg-[#FFFFFF] dark:bg-[#121110] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[#4BB8E8] uppercase tracking-[0.25em] text-xs font-semibold block">Contact Us</span>
          <h1 className="text-4xl sm:text-5xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF]">Connect with ROOTSIP Partners</h1>
          <p className="text-[#444444] dark:text-[#C9C1B5] text-sm max-w-xl mx-auto">Enquire about trademark protection terms or software registries. Our representatives respond within 24 business hours.</p>
        </div>

        {/* Form + Info grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Info cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="card-premium space-y-6">
              <h3 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] border-b border-[#E5E7EB]/40 pb-3">Office Contacts</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 text-sm">
                  <MapPin size={18} className="text-[#4BB8E8] mt-1 shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-serif font-medium text-[#000000] dark:text-[#FFFFFF] text-base">Corporate Headquarters</h4>
                    <p className="text-[#444444] dark:text-[#C9C1B5] text-xs mt-1 leading-relaxed font-light">{settings?.hq_address || "Level 14, Nariman Point, Mumbai - 400021, India"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm">
                  <MapPin size={18} className="text-[#4BB8E8] mt-1 shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-serif font-medium text-[#000000] dark:text-[#FFFFFF] text-base">Liaison Desk</h4>
                    <p className="text-[#444444] dark:text-[#C9C1B5] text-xs mt-1 leading-relaxed font-light">{settings?.liaison_address || "Canary Wharf, London E14, United Kingdom"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm">
                  <Phone size={18} className="text-[#4BB8E8] mt-1 shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-serif font-medium text-[#000000] dark:text-[#FFFFFF] text-base">Direct Hotlines</h4>
                    <p className="text-[#444444] dark:text-[#C9C1B5] text-xs mt-1 leading-relaxed font-light">{settings?.phone || "+91 22 5543-0980"} (Admin Desk)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-sm">
                  <Mail size={18} className="text-[#4BB8E8] mt-1 shrink-0" strokeWidth={1.5} />
                  <div>
                    <h4 className="font-serif font-medium text-[#000000] dark:text-[#FFFFFF] text-base">Email Communications</h4>
                    <p className="text-[#444444] dark:text-[#C9C1B5] text-xs mt-1 leading-relaxed font-light">{settings?.email || "consult@rootsip.com"} (IP Enquiries)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#000000] dark:bg-[#151413] text-white rounded-[20px] p-8 border border-[#4BB8E8]/30 shadow-xs space-y-4">
              <h4 className="font-serif font-medium text-[#4BB8E8] flex items-center gap-2.5 text-lg">
                <Clock size={16} strokeWidth={1.5} /> Operating Hours
              </h4>
              <p className="text-xs text-[#C9C1B5] leading-relaxed font-light">
                Monday - Friday: 09:30 AM to 06:30 PM (IST)<br />
                Saturday: By pre-booked strategy session only.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 card-premium">
            <h3 className="text-2xl font-serif font-medium text-[#000000] dark:text-[#FFFFFF] border-b border-[#E5E7EB]/40 pb-3 mb-8">Send Direct Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">Company Name (Optional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Patent search costs query"
                  className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#444444] dark:text-[#C9C1B5] uppercase tracking-wider block">Message details</label>
                <textarea
                  required
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline details you wish to discuss..."
                  className="w-full px-4 py-2.5 text-sm bg-[#FFFFFF] dark:bg-[#252220] text-[#000000] dark:text-white border border-[#E5E7EB] dark:border-slate-800 rounded focus:outline-hidden focus:border-[#4BB8E8] transition-all"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold w-full py-4 uppercase font-sans text-xs tracking-widest font-semibold cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? 'Sending message...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
