import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Core layout components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIWidget from './components/AIWidget';
import ProtectedRoute from './components/ProtectedRoute';
import SEOManager from './components/SEOManager';

// Core statically loaded pages (immediately needed for homepage or primary nav)
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Team from './pages/Team';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import FaqList from './pages/FaqList';

// Lazy-loaded pages (loaded on-demand to optimize bundle size and speed)
const BookConsultation = lazy(() => import('./pages/BookConsultation'));
const BookConsultationSuccess = lazy(() => import('./pages/BookConsultationSuccess'));
const BookConsultationCancel = lazy(() => import('./pages/BookConsultationCancel'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ClientSuccess = lazy(() => import('./pages/ClientSuccess'));
const Forgot = lazy(() => import('./pages/Forgot'));
const Reset = lazy(() => import('./pages/Reset'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));

// Brand-themed fallback loading spinner for suspended routes
function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white dark:bg-black">
      <div className="w-10 h-10 border-4 border-[#4BB8E8] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Scroll to top helper component on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <SEOManager />
      <AuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-navy-dark text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Header Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="flex-grow">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:slug" element={<ServiceDetail />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/blog" element={<BlogList />} />
                  <Route path="/blog/:slug" element={<BlogDetail />} />
                  <Route path="/faqs" element={<FaqList />} />
                  <Route path="/book-consultation" element={<BookConsultation />} />
                  <Route path="/book-consultation/success" element={<BookConsultationSuccess />} />
                  <Route path="/book-consultation/cancel" element={<BookConsultationCancel />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Navigate to="/admin/login" replace />} />
                  <Route path="/admin/login" element={<Login adminOnly />} />
                  <Route path="/forgot-password" element={<Forgot adminOnly />} />
                  <Route path="/reset-password/:token" element={<Reset adminOnly />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/client-success" element={<ClientSuccess />} />

                  {/* Admin CMS Panel */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Suspense>
            </main>

            {/* Footer layout */}
            <Footer />

            {/* AI Assistant widget */}
            <AIWidget />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
