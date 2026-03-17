import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { OptimizedImage } from './OptimizedImage';

interface Stat {
  value: string;
  label: string;
}

const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

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
      src: "distribution_optimized.webp",
      alt: "Distribution alimentaire"
    },
    {
      src: "action_optimized.webp",
      alt: "Nos bénévoles en action"
    },
    {
      src: "social_optimized.webp",
      alt: "Moment social avec les bénéficiaires"
    }
  ], []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>(new Array(images.length).fill(false));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.28, 0.08]);

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
      ref={sectionRef}
      className="relative bg-transparent overflow-hidden pt-20 pb-12"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: glowOpacity }}
      >
        <div className="h-full w-full bg-[radial-gradient(circle_at_15%_30%,rgba(244,114,182,0.22),transparent_38%),radial-gradient(circle_at_80%_70%,rgba(251,146,60,0.16),transparent_42%)]" />
      </motion.div>

      {/* Background logo with reduced opacity lower*/}
      <motion.div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ y: backgroundY }}>
        <OptimizedImage
          src="/images/optimized/nousrire_bg.webp"
          imageName="nousrire_bg.webp"
          alt="Background Logo"
          width={1920}
          height={1080}
          className="w-[120%] h-[150%] object-cover hero-bg-logo"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative container mx-auto px-4 py-12 md:py-16"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-brand-pink-dark">Ensemble, luttons</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink-500 to-brand-pink-700">
                contre la précarité
              </span>
            </h1>
            <p className="text-xl text-brand-pink-900/70 mb-10 leading-relaxed max-w-xl">
              Nous'Rire est une association engagée qui transforme la solidarité en actions concrètes.
              Garantissons ensemble l'accès à une alimentation saine pour tous.
            </p>
            <div className="flex flex-wrap gap-5">
              <motion.a
                href="#benevole"
                className="btn-primary"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                Devenir Bénévole
              </motion.a>
              <motion.a
                href="#calendrier"
                className="btn-secondary"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                Voir le Calendrier
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            style={{ y: foregroundY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          >
            <div className="aspect-w-4 aspect-h-3 rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-white">
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
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-brand-pink' : 'bg-gray-300'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="premium-card-soft text-center p-8 border-none"
            >
              <div className="text-5xl font-bayon text-brand-pink-500 mb-3 tracking-wider">
                {stat.value}
              </div>
              <div className="text-sm uppercase tracking-widest text-brand-pink-900/60 font-bold">
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