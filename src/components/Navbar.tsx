import { useState, useEffect, useRef } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

// Clear navigation component that handles scrolling to page sections
const Navbar = ({ isDarkMode, onToggleTheme }: NavbarProps) => {
  // State management for mobile menu, scroll position and active section
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionsRef = useRef<Array<{ id: string; top: number; height: number }>>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const measureSections = () => {
      sectionsRef.current = Array.from(document.querySelectorAll('section[id]')).map(section => {
        const element = section as HTMLElement;
        return {
          id: section.getAttribute('id') || 'accueil',
          top: element.offsetTop,
          height: element.offsetHeight,
        };
      });
    };

    const updateFromScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = documentHeight > 0 ? Math.min(scrollY / documentHeight, 1) : 0;

      setScrolled(prev => (prev !== (scrollY > 20) ? scrollY > 20 : prev));
      setScrollProgress(prev => (Math.abs(prev - nextProgress) > 0.002 ? nextProgress : prev));

      let nextActive = 'accueil';
      for (const section of sectionsRef.current) {
        const sectionTop = section.top - 100;
        if (scrollY > sectionTop && scrollY <= sectionTop + section.height) {
          nextActive = section.id;
          break;
        }
      }
      setActiveSection(prev => (prev !== nextActive ? nextActive : prev));

      rafRef.current = null;
    };

    const handleScroll = () => {
      if (rafRef.current === null) {
        rafRef.current = window.requestAnimationFrame(updateFromScroll);
      }
    };

    measureSections();
    updateFromScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', measureSections);
    window.addEventListener('orientationchange', measureSections);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', measureSections);
      window.removeEventListener('orientationchange', measureSections);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Smooth scroll to section and close mobile menu
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const navLinks = [
    { id: 'accueil', label: 'Accueil' },
    { id: 'mission', label: 'Mission' },
    { id: 'actions', label: 'Actions' },
    { id: 'calendrier', label: 'Calendrier' },
    { id: 'benevole', label: 'Bénévole' },
    { id: 'don', label: 'Don' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/85 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src="/images/nousrire_logo.svg"
              alt="Nous'Rire Logo"
              className="h-12 w-auto transform hover:scale-105 transition-transform duration-300"
            />
            {/* Title with gradient*/}
            <span className="ml-3 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-cream-500 to-brand-pink-500">
              NOUS'RIRE
            </span>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex flex-grow justify-center items-center">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`relative py-2 text-base font-medium transition-colors whitespace-nowrap
                    ${activeSection === link.id
                      ? 'text-brand-pink-500'
                      : 'text-brand-pink-700 hover:text-brand-pink-500'
                    }
                    after:content-[''] after:absolute after:bottom-0 after:left-0 
                    after:w-full after:h-0.5 after:bg-brand-pink-500
                    after:transform after:scale-x-0 after:transition-transform
                    hover:after:scale-x-100
                    ${activeSection === link.id ? 'after:scale-x-100' : ''}
                  `}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center ml-4">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition-colors ${
                isDarkMode
                  ? 'border-white/20 bg-slate-900/70 hover:bg-slate-800/80'
                  : 'border-brand-pink-200 bg-white/70 hover:bg-white'
              }`}
              aria-label={isDarkMode ? 'Activer le thème clair' : 'Activer le thème sombre'}
              title={isDarkMode ? 'Thème clair' : 'Thème sombre'}
            >
              {isDarkMode ? (
                <SunIcon className="h-5 w-5 text-brand-pink-600" />
              ) : (
                <MoonIcon className="h-5 w-5 text-brand-pink-700" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-pink-700 hover:text-brand-pink-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden bg-white shadow-lg rounded-b-lg`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={onToggleTheme}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-brand-pink-700 hover:bg-brand-pink-50"
            >
              {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              {isDarkMode ? 'Thème clair' : 'Thème sombre'}
            </button>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium
                  ${activeSection === link.id
                    ? 'bg-brand-pink-50 text-brand-pink-500'
                    : 'text-brand-pink-700 hover:bg-brand-pink-50 hover:text-brand-pink-500'
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="h-[2px] w-full bg-transparent origin-left overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-pink-400 via-brand-pink-500 to-brand-pink-700"
          style={{ transform: `translateZ(0) scaleX(${scrollProgress})`, transformOrigin: 'left', willChange: 'transform' }}
        />
      </div>
    </nav>
  );
};

export default Navbar;