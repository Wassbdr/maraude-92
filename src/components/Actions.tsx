import { motion } from 'framer-motion';
import { ShoppingBagIcon, TruckIcon, HandRaisedIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const Actions = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  const actions = [
    {
      icon: <ShoppingBagIcon className="h-12 w-12" />,
      title: "Collecte Alimentaire",
      description: "Organisation de collectes auprès de nos partenaires et des grandes surfaces pour récupérer des denrées alimentaires."
    },
    {
      icon: <TruckIcon className="h-12 w-12" />,
      title: "Distribution",
      description: "Distribution régulière de colis alimentaires aux personnes dans le besoin, dans différents quartiers de la ville."
    },
    {
      icon: <HandRaisedIcon className="h-12 w-12" />,
      title: "Aide d'Urgence",
      description: "Intervention rapide pour les situations d'urgence alimentaire, en collaboration avec les services sociaux."
    },
    {
      icon: <UserGroupIcon className="h-12 w-12" />,
      title: "Accompagnement",
      description: "Soutien et orientation des bénéficiaires vers les services adaptés à leurs besoins."
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-fade from-brand-cream-100 via-brand-cream-50 to-white" />

      <div className="relative py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="container mx-auto px-4"
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-20"
          >
            <h2 className="text-6xl font-bayon text-transparent bg-clip-text bg-gradient-to-r from-brand-pink-700 to-brand-pink-500 mb-6 uppercase tracking-tight">
              Nos Actions
            </h2>
            <p className="text-xl text-brand-pink-900/60 max-w-2xl mx-auto font-medium leading-relaxed">
              Découvrez comment nous agissons concrètement chaque jour pour lutter contre la précarité alimentaire et semer l'espoir.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                variants={itemVariants}
                className="premium-card-soft group border-none"
              >
                <div className="p-10 flex items-start gap-8">
                  <div className="text-brand-pink-500 group-hover:scale-110 transition-transform duration-500 bg-brand-pink-50 p-4 rounded-3xl">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bayon text-brand-pink-700 mb-4 uppercase tracking-wide group-hover:text-brand-pink-500 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-lg text-brand-pink-900/60 font-medium leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-24 text-center"
          >
            <p className="text-3xl font-bayon text-brand-pink-700 mb-10 uppercase tracking-wide">
              Prêt à agir avec nous ?
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="#benevole"
                className="btn-primary"
              >
                Devenir Bénévole
              </a>
              <a
                href="#don"
                className="btn-secondary"
              >
                Faire un Don
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Actions; 