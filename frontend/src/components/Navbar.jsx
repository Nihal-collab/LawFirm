import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import API from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('dark_mode') === 'true';
    setDark(isDark);
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !dark;
    setDark(nextDark);
    localStorage.setItem('dark_mode', String(nextDark));
    if (nextDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

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

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled 
        ? 'bg-[#F8F5F0]/90 dark:bg-[#121110]/95 backdrop-blur-md shadow-xs border-b border-[#DDD5C8]/80 dark:border-slate-800/40' 
        : 'bg-transparent border-b border-transparent'
    } text-[#171717] dark:text-[#F8F5F0]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding (left aligned) */}
          <div className="w-1/4 flex justify-start flex-shrink-0">
            <Link to="/" className="flex flex-col justify-center group">
              <span className="font-serif text-xl 2xl:text-2xl font-bold tracking-wider gradient-gold whitespace-nowrap transition-transform duration-300 group-hover:scale-[1.01]">SR4IPR Partners</span>
              <span className="text-[8px] tracking-[0.25em] text-[#6D6258] dark:text-[#C9C1B5] font-sans uppercase whitespace-nowrap">Intellectual Property Counsel</span>
            </Link>
          </div>

          {/* Desktop Nav Links (centered) */}
          <div className="hidden xl:flex w-2/4 justify-center items-center xl:space-x-3.5 2xl:space-x-6 text-[10px] 2xl:text-xs font-sans tracking-widest uppercase flex-shrink-0">
            <Link to="/" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Home</Link>
            <Link to="/about" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/about' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>About</Link>
            <Link to="/services" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname.startsWith('/services') ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Services</Link>
            <Link to="/team" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/team' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Team</Link>
            <Link to="/blog" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname.startsWith('/blog') ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Blogs</Link>
            <Link to="/gallery" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/gallery' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Gallery</Link>
            <Link to="/client-success" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/client-success' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Outcomes</Link>
            <Link to="/faqs" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/faqs' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>FAQs</Link>
            <Link to="/calculator" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/calculator' ? 'text-[#8B6B57]' : 'text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]'}`}>Calculator</Link>
          </div>

          {/* Action Area (right aligned) */}
          <div className="hidden xl:flex w-1/4 justify-end items-center xl:space-x-3 2xl:space-x-5 flex-shrink-0">
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-[#EFE8DD] dark:hover:bg-slate-800/60 rounded-full transition-all text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57] flex-shrink-0 cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] hover:bg-[#8B6B57] dark:hover:bg-[#8B6B57] hover:text-white dark:hover:text-white rounded-full font-sans font-semibold tracking-wider text-[10px] uppercase transition-all duration-300 transform hover:-translate-y-0.5"
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
              <div className="flex items-center gap-3.5">
                <Link
                  to="/login"
                  className="px-4 py-2 border border-[#DDD5C8] dark:border-slate-800 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 hover:border-[#8B6B57] text-[#171717] dark:text-[#F8F5F0]"
                >
                  Login
                </Link>
                <Link
                  to="/book-consultation"
                  className="px-5 py-2 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] hover:bg-[#8B6B57] dark:hover:bg-[#8B6B57] hover:text-white dark:hover:text-white font-sans text-[10px] font-semibold tracking-widest uppercase rounded-full shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] whitespace-nowrap"
                >
                  Book Consultation
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex xl:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57] cursor-pointer"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#171717] dark:hover:text-white cursor-pointer"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="xl:hidden bg-[#F8F5F0] dark:bg-[#1C1A19] border-t border-[#DDD5C8] dark:border-slate-850 py-4 px-6 space-y-3 font-sans shadow-lg text-xs uppercase tracking-widest">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">About Us</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Services</Link>
          <Link to="/team" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Our Team</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Blogs</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Gallery</Link>
          <Link to="/client-success" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Client Success</Link>
          <Link to="/faqs" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">FAQs</Link>
          <Link to="/calculator" onClick={() => setMenuOpen(false)} className="block py-2 text-[#6D6258] dark:text-[#C9C1B5] hover:text-[#8B6B57]">Cost Estimator</Link>
          <div className="border-t border-[#DDD5C8] dark:border-slate-800 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] rounded-full text-xs font-semibold"
                >
                  <User size={14} /> Portal Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="py-2.5 bg-rose-500/10 text-rose-500 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 border border-[#DDD5C8] dark:border-slate-800 text-[#171717] dark:text-[#F8F5F0] rounded-full text-xs font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/book-consultation"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 bg-[#171717] dark:bg-[#F8F5F0] text-white dark:text-[#171717] rounded-full text-xs font-semibold"
                >
                  Book Consultation
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
