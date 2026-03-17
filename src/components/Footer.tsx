import { motion } from 'framer-motion';
import {
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Smooth scroll function for navigation links
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
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

  const links = {
    association: [
      { label: 'Notre Mission', href: 'mission' },
      { label: 'Nos Actions', href: 'actions' },
      { label: 'Devenir Bénévole', href: 'benevole' },
      { label: 'Faire un Don', href: 'don' },
    ],
    contact: [
      { label: 'nousrire.contact@gmail.com', href: 'mailto:nousrire.contact@gmail.com', icon: EnvelopeIcon },
    ],
    social: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/nousrire.asso/',
        icon: () => (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.27.2-6.78,2.71-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.27,2.71,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.27-.2,6.78-2.71,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.27-2.71-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z" />
          </svg>
        )
      },
      {
        label: 'Snapchat',
        href: 'https://www.snapchat.com/add/maraude92?invite_id=5t305gGh&locale=fr_FR&share_id=sHVzYJxJR8aa84GuKpTVUQ&sid=9b50162676a2449c825b3ea1b79c5670',
        icon: () => (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.075-.046-.15-.046-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
          </svg>
        )
      }
    ],
  };

  return (
    <footer className="footer-surface">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 py-16"
      >
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
            <Link to="/" className="block mb-8 group">
              <img
                src="/images/nousrire_logo.svg"
                alt="Nous'Rire Logo"
                className="h-16 w-auto transform group-hover:scale-110 transition-transform duration-500"
              />
            </Link>
            <p className="text-brand-pink-900/60 font-medium leading-relaxed">
              Association de distribution alimentaire engagée. Ensemble, semons l'espoir et cultivons la solidarité.
            </p>
          </motion.div>

          {/* Association Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bayon text-brand-pink-700 mb-8 uppercase tracking-wider">
              L'Association
            </h3>
            <ul className="space-y-4">
              {links.association.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-brand-pink-600 hover:text-brand-pink-500 transition-colors bg-transparent border-none p-0 cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bayon text-brand-pink-700 mb-8 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-4">
              {links.contact.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center text-brand-pink-600 hover:text-brand-pink-500 transition-colors text-sm break-all"
                  >
                    <link.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="break-all">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xl font-bayon text-brand-pink-700 mb-8 uppercase tracking-wider">
              Suivez-nous
            </h3>
            <ul className="space-y-4">
              {links.social.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-brand-pink-600 hover:text-brand-pink-500 transition-colors"
                  >
                    <link.icon />
                    <span className="ml-2">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="border-t border-brand-pink-100 mt-20 pt-10 text-center text-brand-pink-900/40 text-sm font-medium"
        >
          <p>© {new Date().getFullYear()} NOUS'RIRE. Tous droits réservés. Design Premium par Nous'Rire.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;