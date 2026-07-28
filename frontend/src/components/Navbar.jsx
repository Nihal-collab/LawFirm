import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import API from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.add('dark');

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      await API.post('auth/logout/', { refresh: refreshToken });
    } catch (e) {
      console.error("Logout failed on server.", e);
    }
    logout();
    navigate('/');
  };

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b border-white/8 shadow-[0_8px_40px_rgba(0,0,0,0.35)] text-slate-100" style={{ background: 'rgba(5,10,25,.85)', backdropFilter: 'blur(18px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding (left aligned) */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2.5 group">
              <div className="flex flex-col justify-center">
                <div className="font-serif text-xl 2xl:text-2xl font-bold tracking-wider text-white transition-transform duration-300 group-hover:scale-[1.01] whitespace-nowrap">
                  ROOTS<span className="font-sans text-[#0A4DFF] font-bold">-ip</span>
                </div>
                <span className="text-[8px] tracking-[0.25em] text-[#A7B2C3] font-sans uppercase whitespace-nowrap">Intellectual Property Counsel</span>
              </div>
            </Link>
          </div>

          {/* Right-aligned Navigation links and Actions */}
          <div className="hidden xl:flex items-center space-x-6 xl:space-x-8 flex-grow justify-end">
            <div className="flex items-center space-x-4 2xl:space-x-6 text-[10px] 2xl:text-xs font-sans tracking-widest uppercase">
              <Link to="/" onClick={handleHomeClick} className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                Home
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/about" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname === '/about' ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                About
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname === '/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/services" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname.startsWith('/services') ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                Services
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname.startsWith('/services') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/team" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname === '/team' ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                Team
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname === '/team' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/blog" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname.startsWith('/blog') ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                Blogs
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname.startsWith('/blog') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/gallery" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname === '/gallery' ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                Gallery
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname === '/gallery' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/client-success" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname === '/client-success' ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                Outcomes
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname === '/client-success' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link to="/faqs" className={`font-medium relative py-1 transition-colors whitespace-nowrap ${location.pathname === '/faqs' ? 'text-[#0A4DFF]' : 'text-[#DCE8FF] hover:text-[#0A4DFF]'} group`}>
                FAQs
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0A4DFF] transform transition-transform duration-300 ${location.pathname === '/faqs' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            </div>

            <div className="flex items-center space-x-3.5">


              {user ? (
                <div className="flex items-center gap-3 font-sans">
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] rounded-full font-semibold tracking-wider text-[10px] uppercase transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <User size={13} strokeWidth={1.5} /> Portal
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-rose-500 hover:text-rose-700 transition-colors flex-shrink-0 cursor-pointer"
                    title="Logout"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/book-consultation"
                    className="px-5 py-2 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-[10px] font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer"
                  >
                    Book Consultation
                  </Link>
                  <Link
                    to="/payment"
                    className="px-5 py-2 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white shadow-[0_12px_35px_rgba(10,77,255,0.40)] font-sans text-[10px] font-semibold tracking-widest uppercase rounded-full transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_12px_35px_rgba(10,77,255,0.60)] whitespace-nowrap cursor-pointer"
                  >
                    Make Payment
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex xl:hidden items-center gap-3">

            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 text-[#A7B2C3] hover:text-white cursor-pointer"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-50 transition-all duration-500 ease-in-out ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Drawer Content */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-80 max-w-[85vw] p-6 max-sm:p-4 flex flex-col justify-between border-l border-white/8 shadow-2xl transition-transform duration-500 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: 'rgba(10, 18, 36, 0.95)', backdropFilter: 'blur(20px)' }}
        >
          <div className="space-y-6 max-sm:space-y-4">
            <div className="flex items-center justify-between border-b border-white/8 pb-4 max-sm:pb-2">
              <div className="font-serif text-lg font-bold tracking-wider text-white">
                ROOTS<span className="text-[#0A4DFF] font-bold">-ip</span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-[#A7B2C3] hover:text-white rounded-full bg-white/5"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-1 max-sm:gap-0.5 font-sans text-xs tracking-widest uppercase font-semibold">
              <Link to="/" onClick={() => { setMenuOpen(false); handleHomeClick(); }} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname === '/' ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>Home</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname === '/about' ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>About Us</Link>
              <Link to="/services" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname.startsWith('/services') ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>Services</Link>
              <Link to="/team" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname === '/team' ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>Our Team</Link>
              <Link to="/blog" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname.startsWith('/blog') ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>Blogs</Link>
              <Link to="/gallery" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname === '/gallery' ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>Gallery</Link>
              <Link to="/client-success" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname === '/client-success' ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>Client Success</Link>
              <Link to="/faqs" onClick={() => setMenuOpen(false)} className={`py-3 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg transition-all ${location.pathname === '/faqs' ? 'bg-[#0A4DFF]/10 text-[#0A4DFF]' : 'text-[#DCE8FF] hover:bg-white/5 hover:text-[#0A4DFF]'}`}>FAQs</Link>
            </nav>
          </div>
          
          <div className="border-t border-white/8 pt-6 max-sm:pt-4 flex flex-col gap-3 max-sm:gap-2">
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-3 max-sm:py-2.5 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white rounded-full text-xs font-semibold shadow-[0_4px_15px_rgba(10,77,255,0.3)]"
                >
                  <User size={14} /> Portal Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="py-3 max-sm:py-2.5 bg-rose-500/10 text-rose-500 rounded-full text-xs font-semibold hover:bg-rose-500/25 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 max-sm:gap-2">
                <Link
                  to="/book-consultation"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-3 max-sm:py-2 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white rounded-full text-xs font-semibold shadow-[0_12px_35px_rgba(10,77,255,0.40)]"
                >
                  Book Consultation
                </Link>
                <Link
                  to="/payment"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-3 max-sm:py-2 bg-gradient-to-r from-[#0057D9] to-[#0A4DFF] text-white rounded-full text-xs font-semibold shadow-[0_12px_35px_rgba(10,77,255,0.40)]"
                >
                  Make Payment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
