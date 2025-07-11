import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { OptimizedImage } from './OptimizedImage';

interface Stat {
  value: string;
  label: string;
}

const Hero = () => {
  // Animation variants for container elements with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const stats: Stat[] = [
    { value: "5000+", label: "Repas distribués" },
    { value: "80+", label: "Bénévoles actifs" },
    { value: "30+", label: "Partenaires" },
  ];

  // Memoized array of carousel images to prevent unnecessary re-renders
  const images = useMemo(() => [
    {
      src: "distribution.webp",
      alt: "Distribution alimentaire"
    },
    {
      src: "action.webp",
      alt: "Nos bénévoles en action"
    },
    {
      src: "social.webp",
      alt: "Moment social avec les bénéficiaires"
    }
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(images.length).fill(false));

  // Reference to track and manage the carousel interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset the carousel timer to prevent immediate image change after manual navigation
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  }, [images.length]);

  // Manual carousel navigation with timer reset
  const goToNextImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    resetTimer();
  }, [images.length, resetTimer]);

  const goToPreviousImage = useCallback(() => {
    setCurrentImageIndex(prevIndex => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    resetTimer();
  }, [images.length, resetTimer]);

  const goToSpecificImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
    resetTimer();
  }, [resetTimer]);

  const handleImageLoaded = (index: number) => {
    setImageLoaded(prev => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  // Initialize carousel timer on component mount
  useEffect(() => {
    resetTimer();

    // Cleanup interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetTimer]);

  // Preload images for smoother transitions
  useEffect(() => {
    images.forEach(image => {
      const img = new Image();
      img.src = image.src;
    });
  }, [images]);

  return (
    <section 
      id="accueil" 
      className="relative bg-gradient-to-b from-brand-cream-50 via-brand-cream-100 to-brand-cream-50 overflow-hidden pt-20 pb-12"
    >
      {/* Background logo with reduced opacity lower*/}
      <div className="absolute inset-0 glex items-center justify-center opacity-20">
        <OptimizedImage 
          src="/images/optimized/nousrire_bg.webp" 
          imageName="nousrire_bg.webp"
          alt="Background Logo" 
          width={1920}
          height={1080}
          className="w-[120%] h-[150%] object-cover"
        />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative container mx-auto px-4 py-12 md:py-16"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-pink-dark mb-6">
              Ensemble, luttons contre la précarité alimentaire
            </h1>
            <p className="text-lg text-brand-pink-dark/80 mb-8">
              Nous'Rire est une association caritative qui s'engage à distribuer des denrées alimentaires 
              aux personnes dans le besoin. Notre mission est de garantir l'accès à une alimentation 
              saine et équilibrée pour tous.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#benevole"
                className="btn-primary bg-brand-pink hover:bg-brand-pink-dark text-white px-8 py-3 rounded-full font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Devenir Bénévole
              </motion.a>
              <motion.a
                href="#calendrier"
                className="btn-secondary border-2 border-brand-pink bg-brand-cream hover:bg-brand-pink-dark hover:text-white px-8 py-3 rounded-full font-medium transition-colors text-brand-pink-dark"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir le Calendrier
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="aspect-w-3 aspect-h-3 rounded-lg overflow-hidden shadow-xl relative">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: index === currentImageIndex ? 1 : 0,
                    zIndex: index === currentImageIndex ? 1 : 0
                  }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {/* Add loading state */}
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    {imageLoaded[index] ? null : (
                      <div className="animate-pulse text-brand-pink-500">Chargement...</div>
                    )}
                    <OptimizedImage 
                      src=""
                      imageName={image.src}
                      alt={image.alt}
                      width={800} 
                      height={600}
                      className={`object-cover w-full h-full ${!imageLoaded[index] && 'opacity-0'}`}
                      onLoad={() => handleImageLoaded(index)}
                    />
                  </div>
                </motion.div>
              ))}
              
              {/* Navigation buttons for carousel */}
              <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    goToPreviousImage();
                  }}
                  className="bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-opacity focus:outline-none"
                  aria-label="Image précédente"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-brand-pink-dark" />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    goToNextImage();
                  }}
                  className="bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-90 transition-opacity focus:outline-none"
                  aria-label="Image suivante"
                >
                  <ChevronRightIcon className="h-6 w-6 text-brand-pink-dark" />
                </button>
              </div>
            </div>
            
            {/* Indicator dots for current slide */}
            <div className="flex justify-center mt-4 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSpecificImage(index)}
                  className="focus:outline-none"
                  aria-label={`Image ${index + 1}`}
                >
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-brand-pink' : 'bg-gray-300'
                    }`}
                    initial={false}
                    animate={{ 
                      scale: index === currentImageIndex ? 1.5 : 1,
                      backgroundColor: index === currentImageIndex ? '#E11D48' : '#D1D5DB'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center bg-white/40 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-brand-pink-700 mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-brand-pink-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;