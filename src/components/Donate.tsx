import { motion } from 'framer-motion';
import { GiftIcon } from '@heroicons/react/24/outline';

const Donate = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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

  return (
    <section className="relative py-24 bg-transparent overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 relative"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-6xl font-bayon text-transparent bg-clip-text bg-gradient-to-r from-brand-pink-700 to-brand-pink-500 mb-6 uppercase tracking-tight">
            Faire un Don
          </h2>
          <p className="text-xl text-brand-pink-900/60 max-w-2xl mx-auto font-medium leading-relaxed">
            Votre générosité est le moteur de nos actions. Chaque don, petit ou grand, nous aide à semer la joie.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="max-w-2xl mx-auto premium-card-soft p-12 text-center group border-none"
        >
          <div className="inline-flex p-6 rounded-full bg-brand-pink-50 mb-8 transform group-hover:scale-110 transition-transform duration-500">
            <GiftIcon className="h-20 w-20 text-brand-pink-500" />
          </div>
          <h3 className="text-3xl font-bayon text-brand-pink-700 mb-6 uppercase tracking-wide">
            Don Sécurisé via HelloAsso
          </h3>
          <p className="text-lg text-brand-pink-900/60 mb-10 font-medium leading-relaxed">
            Soutenez Nous'Rire en effectuant un don simple, rapide et entièrement sécurisé sur la plateforme de référence HelloAsso.
          </p>
          <div className="flex justify-center">
            <a
              href="https://www.helloasso.com/associations/nous-rire"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-10 py-4 text-xl tracking-wide uppercase font-bayon"
            >
              Je fais un don
            </a>
          </div>
          <p className="mt-8 text-sm text-brand-pink-400 font-bold uppercase tracking-widest">
            Don déductible de vos impôts
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Donate;