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
    <section className="py-16 donate-surface">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-brand-pink-700 mb-4">
            Faire un Don
          </h2>
          <p className="text-brand-pink-600 max-w-2xl mx-auto">
            Votre don nous permet de continuer à lutter contre la précarité alimentaire.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="max-w-md mx-auto premium-card p-8 text-center"
        >
          <GiftIcon className="h-16 w-16 text-brand-pink-500 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-brand-pink-700 mb-4">
            Faire un don via HelloAsso
          </h3>
          <p className="text-brand-pink-600 mb-8">
            Cliquez sur le bouton ci-dessous pour faire un don sécurisé via HelloAsso
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <a
              href="https://www.helloasso.com/associations/nous-rire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors duration-200"
            >
              Faire un don via HelloAsso
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Donate;