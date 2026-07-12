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

  const handleHomeClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-md border-b border-slate-100 dark:border-slate-800' 
        : 'bg-white dark:bg-black border-b border-transparent'
    } text-slate-800 dark:text-slate-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Branding (left aligned) */}
          <div className="flex-shrink-0">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2.5 group">
              <img src="/roots-logo.svg" alt="ROOTS-ip Logo" className="h-9 w-auto object-contain block dark:hidden" />
              <img src="/roots-logo-white.svg" alt="ROOTS-ip Logo" className="h-9 w-auto object-contain hidden dark:block" />
              <div className="flex flex-col justify-center">
                <div className="font-serif text-xl 2xl:text-2xl font-bold tracking-wider text-black dark:text-white transition-transform duration-300 group-hover:scale-[1.01] whitespace-nowrap">
                  ROOTS<span className="font-sans text-[#4BB8E8] font-bold">-ip</span>
                </div>
                <span className="text-[8px] tracking-[0.25em] text-slate-500 dark:text-[#C9C1B5] font-sans uppercase whitespace-nowrap">Intellectual Property Counsel</span>
              </div>
            </Link>
          </div>

          {/* Right-aligned Navigation links and Actions */}
          <div className="hidden xl:flex items-center space-x-6 xl:space-x-8 flex-grow justify-end">
            <div className="flex items-center space-x-4 2xl:space-x-6 text-[10px] 2xl:text-xs font-sans tracking-widest uppercase">
              <Link to="/" onClick={handleHomeClick} className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/' ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>Home</Link>
              <Link to="/about" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/about' ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>About</Link>
              <Link to="/services" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname.startsWith('/services') ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>Services</Link>
              <Link to="/team" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/team' ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>Team</Link>
              <Link to="/blog" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname.startsWith('/blog') ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>Blogs</Link>
              <Link to="/gallery" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/gallery' ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>Gallery</Link>
              <Link to="/client-success" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/client-success' ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>Outcomes</Link>
              <Link to="/faqs" className={`font-medium link-underline transition-colors whitespace-nowrap ${location.pathname === '/faqs' ? 'text-[#4BB8E8]' : 'text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]'}`}>FAQs</Link>
            </div>

            <div className="flex items-center space-x-3.5">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-full transition-all text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8] flex-shrink-0 cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 bg-black dark:bg-[#F8FAFC] text-white dark:text-black hover:bg-[#4BB8E8] dark:hover:bg-[#4BB8E8] hover:text-white dark:hover:text-white rounded-full font-sans font-semibold tracking-wider text-[10px] uppercase transition-all duration-300 transform hover:-translate-y-0.5"
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
                <Link
                  to="/book-consultation"
                  className="px-5 py-2 bg-black dark:bg-[#F8FAFC] text-white dark:text-black hover:bg-[#4BB8E8] dark:hover:bg-[#4BB8E8] hover:text-white dark:hover:text-white font-sans text-[10px] font-semibold tracking-widest uppercase rounded-full shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.01] whitespace-nowrap"
                >
                  Book Consultation
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Hamburguer Toggle */}
          <div className="flex xl:hidden items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8] cursor-pointer"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-600 dark:text-[#C9C1B5] hover:text-black dark:hover:text-white cursor-pointer"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="xl:hidden bg-white dark:bg-black border-t border-slate-100 dark:border-slate-900 py-4 px-6 space-y-3 font-sans shadow-lg text-xs uppercase tracking-widest">
          <Link to="/" onClick={() => { setMenuOpen(false); handleHomeClick(); }} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">About Us</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">Services</Link>
          <Link to="/team" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">Our Team</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">Blogs</Link>
          <Link to="/gallery" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">Gallery</Link>
          <Link to="/client-success" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">Client Success</Link>
          <Link to="/faqs" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-600 dark:text-[#C9C1B5] hover:text-[#4BB8E8]">FAQs</Link>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-black dark:bg-[#F8FAFC] text-white dark:text-black rounded-full text-xs font-semibold"
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
                  to="/book-consultation"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-2.5 bg-black dark:bg-[#F8FAFC] text-white dark:text-black rounded-full text-xs font-semibold"
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
