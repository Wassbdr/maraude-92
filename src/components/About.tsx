import { HeartIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';
import { OptimizedImage } from './OptimizedImage';

// Define interface for CardItem props
interface CardItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const About = () => {
  return (
    <div className="relative py-24 bg-transparent">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.8,
            delay: 0.1,
            ease: "easeOut"
          }}
        >
          <h2 className="font-bayon text-6xl text-transparent bg-clip-text bg-gradient-to-r from-brand-pink-700 to-brand-pink-500 mb-6 uppercase tracking-tight">
            Notre Mission
          </h2>
          <p className="text-xl text-brand-pink-900/60 max-w-2xl mx-auto font-medium">
            Une association dédiée à la solidarité et au partage, œuvrant chaque jour pour un monde plus juste et plus humain.
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Mission Card */}
          <CardItem
            icon={<HeartIcon className="h-8 w-8" />}
            title="Notre Mission"
            description="Nous nous engageons à lutter contre la précarité alimentaire en distribuant des repas aux personnes dans le besoin, tout en créant des moments de partage et de convivialité."
          />

          {/* Vision Card */}
          <CardItem
            icon={<LightBulbIcon className="h-8 w-8" />}
            title="Notre Vision"
            description="Créer un monde où personne ne doit avoir faim, où la solidarité et le partage sont des valeurs fondamentales qui rassemblent notre communauté."
          />

          {/* Values Card */}
          <CardItem
            icon={<SparklesIcon className="h-8 w-8" />}
            title="Nos Valeurs"
            description="Solidarité, respect, engagement et partage sont les piliers de notre action quotidienne, guidant chaque initiative que nous entreprenons."
          />
        </motion.div>

        {/* Story Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.8,
            type: "tween",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className="premium-panel p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bayon text-brand-pink-700 mb-6">
                  Notre Histoire
                </h3>
                <p className="text-brand-pink-600 text-lg leading-relaxed">
                  Nous'Rire est née de la volonté de citoyens engagés de lutter contre la précarité
                  alimentaire. Depuis notre création, nous nous efforçons d'apporter une aide
                  concrète aux personnes dans le besoin, en distribuant des repas et en créant
                  des moments de partage et de convivialité.
                </p>
              </div>

              <div className="rounded-xl overflow-hidden shadow-md">
                <div className="aspect-w-4 aspect-h-3">
                  <OptimizedImage
                    src=""
                    imageName="benevoles_optimized_v2.webp"
                    alt="Description"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Card component to avoid repetition
const CardItem = ({ icon, title, description }: CardItemProps) => {
  const prefersReducedMotion = useReducedMotion();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.9, rotate: -8, opacity: 0 },
    show: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2 // Small extra delay for the icon relative to the card
      }
    }
  };

  return (
    <motion.div
      className="premium-card p-8 group shadow-sm hover:shadow-xl transition-shadow duration-300"
      variants={cardVariants}
      style={{ willChange: 'transform, opacity' }}
    >
      <motion.div
        className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-pink-500 text-white mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300"
        variants={prefersReducedMotion ? {} : iconVariants}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bayon text-brand-pink-700 text-center mb-4">
        {title}
      </h3>
      <p className="text-brand-pink-600 text-center text-lg leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default About;