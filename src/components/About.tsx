import { HeartIcon, LightBulbIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { OptimizedImage } from './OptimizedImage';

// Define interface for CardItem props
interface CardItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: number;
}

const About = () => {
  return (
    <div className="relative py-24 bg-transparent">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.8, 
            delay: 0.1,
            type: "spring",
            stiffness: 100,
            damping: 20,
            ease: [0.215, 0.610, 0.355, 1.000] // Cubic bezier for smooth entrance
          }}
        >
          <h2 className="font-bayon text-4xl md:text-5xl text-brand-pink-700 mb-4">
            Notre Mission
          </h2>
          <p className="text-xl text-brand-pink-600 max-w-3xl mx-auto">
            Une association dédiée à la solidarité et au partage, œuvrant pour un monde plus juste et plus humain
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Mission Card */}
          <CardItem 
            icon={<HeartIcon className="h-8 w-8" />}
            title="Notre Mission"
            description="Nous nous engageons à lutter contre la précarité alimentaire en distribuant des repas aux personnes dans le besoin, tout en créant des moments de partage et de convivialité."
            delay={0.2}
          />

          {/* Vision Card */}
          <CardItem 
            icon={<LightBulbIcon className="h-8 w-8" />}
            title="Notre Vision"
            description="Créer un monde où personne ne doit avoir faim, où la solidarité et le partage sont des valeurs fondamentales qui rassemblent notre communauté."
            delay={0.4}
          />

          {/* Values Card */}
          <CardItem 
            icon={<SparklesIcon className="h-8 w-8" />}
            title="Nos Valeurs"
            description="Solidarité, respect, engagement et partage sont les piliers de notre action quotidienne, guidant chaque initiative que nous entreprenons."
            delay={0.6}
          />
        </div>

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
                    imageName="benevoles_optimized.webp"
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
const CardItem = ({ icon, title, description, delay }: CardItemProps) => {
  return (
    <motion.div 
      className="premium-card p-8 hover:shadow-xl transition-all duration-300"
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div 
        className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-pink-500 text-white mx-auto mb-6 transform hover:scale-110 transition-transform duration-300"
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 0.5, 
          delay: delay + 0.3,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {icon}
      </motion.div>
      <motion.h3 
        className="text-2xl font-bayon text-brand-pink-700 text-center mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
      >
        {title}
      </motion.h3>
      <motion.p 
        className="text-brand-pink-600 text-center text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
};

export default About;