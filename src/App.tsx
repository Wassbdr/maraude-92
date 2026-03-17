import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Donate from './components/Donate';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Events from './components/Events';
import Volunteer from './components/Volunteer';

const News = lazy(() => import('./components/News'));

const IntroLoader = ({ visible }: { visible: boolean }) => (
  <motion.div
    initial={{ opacity: 1 }}
    animate={{ opacity: visible ? 1 : 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={`fixed inset-0 z-[80] flex items-center justify-center bg-[#0f0f17] ${visible ? 'pointer-events-auto' : 'pointer-events-none'}`}
  >
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0.4, letterSpacing: '0.2em' }}
        animate={{ opacity: 1, letterSpacing: '0.34em' }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="text-xs uppercase text-rose-200/80 mb-3"
      >
        Nous'Rire Experience
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-white"
      >
        Solidarité en mouvement
      </motion.h1>
    </div>
  </motion.div>
);

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const savedTheme = localStorage.getItem('nr-theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false;
    return isHomePage && sessionStorage.getItem('nr-intro-seen') !== '1';
  });

  useEffect(() => {
    document.body.classList.toggle('theme-dark', isDarkMode);
    localStorage.setItem('nr-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (!isHomePage) {
      setShowIntro(false);
      return;
    }

    if (sessionStorage.getItem('nr-intro-seen') === '1') {
      setShowIntro(false);
      return;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem('nr-intro-seen', '1');
      setShowIntro(false);
    }, 1550);

    return () => window.clearTimeout(timer);
  }, [isHomePage]);

  return (
    <div className="app-shell min-h-screen bg-gradient-to-b from-brand-cream-50 via-white to-brand-cream-50 relative">
      <div className="noise-overlay" aria-hidden="true" />
      <IntroLoader visible={showIntro} />
      {isHomePage && <Navbar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route
            path="/"
            element={
              <main className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-cream-50 via-white to-brand-cream-50" />
                <div className="relative">
                  <motion.section
                    id="accueil"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Hero />
                  </motion.section>
                  <motion.section
                    id="mission"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <About />
                  </motion.section>
                  <motion.section
                    id="actions"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Suspense fallback={<div>Loading...</div>}>
                      <News />
                    </Suspense>
                  </motion.section>
                  <motion.section
                    id="calendrier"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Events />
                  </motion.section>
                  <motion.section
                    id="benevole"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.95, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Volunteer />
                  </motion.section>
                  <motion.section
                    id="don"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.95, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Donate />
                  </motion.section>
                  <motion.section
                    id="contact"
                    className="seamless-section"
                    initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-120px' }}
                    transition={{ duration: 0.95, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Contact />
                  </motion.section>
                </div>
              </main>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
        </Routes>
      </motion.div>
      {isHomePage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;