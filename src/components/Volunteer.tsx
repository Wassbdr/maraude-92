import { motion } from 'framer-motion';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOffice2Icon,
  SparklesIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { addVolunteerApplication } from '../services/firestoreService';
import { sendVolunteerToGoogleSheets } from '../services/sheetsService';

interface Distribution {
  id: string;
  date: string;
  time: string;
  location: string;
}

const availabilityOptions = ['Semaine', 'Week-end', 'Soirée'];
const skillOptions = ['Terrain', 'Logistique', 'Communication', 'Réseaux sociaux', 'Cuisine', 'Organisation'];

const Volunteer = () => {
  const location = useLocation();
  const selectedDistribution = location.state?.distribution as Distribution;

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [formStartedAt] = useState(() => Date.now());

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    availability: [] as string[],
    skills: [] as string[],
    motivation: '',
    distribution: selectedDistribution?.id || '',
    company: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    city: false,
    motivation: false
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const stepProgress = useMemo(() => (step / 3) * 100, [step]);

  const handleMagneticMove = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    element.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px) scale(1.03)`;
  }, []);

  const handleMagneticLeave = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.transform = 'translate(0px, 0px) scale(1)';
  }, []);

  const getFieldError = (field: 'name' | 'email' | 'phone' | 'city' | 'motivation') => {
    if (!touched[field]) return null;

    switch (field) {
      case 'name':
        return formData.name.trim().length < 3 ? 'Le nom doit contenir au moins 3 caractères.' : null;
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? 'Adresse email invalide.' : null;
      case 'phone':
        return !/^(\+\d{1,3})?[\s\d]{9,14}$/.test(formData.phone.trim()) ? 'Numéro de téléphone invalide.' : null;
      case 'city':
        return formData.city.trim().length < 2 ? 'Ville invalide.' : null;
      case 'motivation':
        return formData.motivation.trim().length < 15 ? 'Ajoutez au moins 15 caractères de motivation.' : null;
      default:
        return null;
    }
  };

  const canGoToStep2 = () => {
    const nameOk = formData.name.trim().length >= 3;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
    const phoneOk = /^(\+\d{1,3})?[\s\d]{9,14}$/.test(formData.phone.trim());
    const cityOk = formData.city.trim().length >= 2;
    return nameOk && emailOk && phoneOk && cityOk;
  };

  const canGoToStep3 = () => formData.availability.length > 0 && formData.motivation.trim().length >= 15;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: 'name' | 'email' | 'phone' | 'city' | 'motivation') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const toggleArrayValue = (field: 'availability' | 'skills', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      setTouched(prev => ({ ...prev, name: true, email: true, phone: true, city: true }));
      if (!canGoToStep2()) return;
    }

    if (step === 2) {
      setTouched(prev => ({ ...prev, motivation: true }));
      if (!canGoToStep3()) return;
    }

    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      availability: [],
      skills: [],
      motivation: '',
      distribution: selectedDistribution?.id || '',
      company: ''
    });
    setTouched({ name: false, email: false, phone: false, city: false, motivation: false });
    setStep(1);
    setSubmitStatus('idle');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.company.trim()) {
      return;
    }

    if (Date.now() - formStartedAt < 3000) {
      setSubmitStatus('error');
      setError('Veuillez patienter quelques secondes avant l’envoi.');
      return;
    }

    const lastSubmitTime = localStorage.getItem('lastVolunteerSubmitTime');
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    if (lastSubmitTime && Date.now() - Number.parseInt(lastSubmitTime, 10) < cooldownPeriod) {
      setSubmitStatus('error');
      setError('Vous avez déjà envoyé une candidature récemment. Réessayez dans 24h.');
      return;
    }

    if (!canGoToStep2() || !canGoToStep3()) {
      setSubmitStatus('error');
      setError('Veuillez compléter correctement les étapes précédentes.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: DOMPurify.sanitize(formData.name.trim()),
      email: DOMPurify.sanitize(formData.email.trim().toLowerCase()),
      phone: DOMPurify.sanitize(formData.phone.trim()),
      city: DOMPurify.sanitize(formData.city.trim()),
      availability: formData.availability.map(item => DOMPurify.sanitize(item)),
      skills: formData.skills.map(item => DOMPurify.sanitize(item)),
      motivation: DOMPurify.sanitize(formData.motivation.trim()),
      distribution: formData.distribution
    };

    try {
      await addVolunteerApplication(payload);

      try {
        await sendVolunteerToGoogleSheets(payload);
      } catch (sheetError) {
        console.warn('Google Sheets sync failed:', sheetError);
      }

      localStorage.setItem('lastVolunteerSubmitTime', Date.now().toString());
      resetForm();
      setSubmitStatus('success');
    } catch (submissionError) {
      setSubmitStatus('error');
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Impossible d’envoyer la candidature pour le moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <motion.div key="step-1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <h3 className="text-2xl font-bold text-brand-pink-700 mb-6">Profil</h3>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" /> Nom complet
              </label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder="Ex: Fatima Benali"
                className="input bg-white/90"
                required
              />
              {getFieldError('name') && <p className="text-sm text-red-500 mt-1">{getFieldError('name')}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2" /> Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="votre.email@exemple.com"
                className="input bg-white/90"
                required
              />
              {getFieldError('email') && <p className="text-sm text-red-500 mt-1">{getFieldError('email')}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2" /> Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder="06 12 34 56 78"
                className="input bg-white/90"
                required
              />
              {getFieldError('phone') && <p className="text-sm text-red-500 mt-1">{getFieldError('phone')}</p>}
            </div>

            <div>
              <label htmlFor="city" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <BuildingOffice2Icon className="h-4 w-4 mr-2" /> Ville
              </label>
              <input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={() => handleBlur('city')}
                placeholder="Ex: Nanterre"
                className="input bg-white/90"
                required
              />
              {getFieldError('city') && <p className="text-sm text-red-500 mt-1">{getFieldError('city')}</p>}
            </div>
          </div>
        </motion.div>
      );
    }

    if (step === 2) {
      return (
        <motion.div key="step-2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
          <h3 className="text-2xl font-bold text-brand-pink-700 mb-6">Disponibilités & compétences</h3>

          <div className="mb-6">
            <p className="text-brand-pink-700 font-medium mb-3">Quand êtes-vous disponible ?</p>
            <div className="flex flex-wrap gap-2">
              {availabilityOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayValue('availability', option)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    formData.availability.includes(option)
                      ? 'bg-brand-pink-500 border-brand-pink-500 text-white'
                      : 'bg-white border-brand-pink-200 text-brand-pink-700 hover:border-brand-pink-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-brand-pink-700 font-medium mb-3">Vos points forts (optionnel)</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayValue('skills', option)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    formData.skills.includes(option)
                      ? 'bg-brand-pink-100 border-brand-pink-300 text-brand-pink-700'
                      : 'bg-white border-brand-pink-200 text-brand-pink-600 hover:border-brand-pink-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="motivation" className="block text-brand-pink-700 font-medium mb-2">
              Motivation
            </label>
            <textarea
              id="motivation"
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              onBlur={() => handleBlur('motivation')}
              rows={4}
              className="input bg-white/90"
              placeholder="Expliquez en quelques mots pourquoi vous souhaitez rejoindre Nous'Rire..."
              required
            />
            {getFieldError('motivation') && <p className="text-sm text-red-500 mt-1">{getFieldError('motivation')}</p>}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key="step-3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
        <h3 className="text-2xl font-bold text-brand-pink-700 mb-6">Vérification finale</h3>

        <div className="grid gap-4">
          <div className="premium-card-soft p-4">
            <p className="text-sm text-brand-pink-400">Identité</p>
            <p className="font-semibold text-brand-pink-700">{formData.name} · {formData.city}</p>
            <p className="text-brand-pink-600 text-sm">{formData.email} · {formData.phone}</p>
          </div>

          <div className="premium-card-soft p-4">
            <p className="text-sm text-brand-pink-400">Disponibilités</p>
            <p className="font-semibold text-brand-pink-700">{formData.availability.join(' · ') || 'Non renseigné'}</p>
          </div>

          <div className="premium-card-soft p-4">
            <p className="text-sm text-brand-pink-400">Compétences</p>
            <p className="font-semibold text-brand-pink-700">{formData.skills.join(' · ') || 'Aucune sélection'}</p>
          </div>

          <div className="premium-card-soft p-4">
            <p className="text-sm text-brand-pink-400">Motivation</p>
            <p className="text-brand-pink-700">{formData.motivation}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="benevole" className="relative overflow-hidden py-24 bg-transparent">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(253,164,175,0.16),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(192,132,252,0.14),transparent_40%)]" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={containerVariants}
        className="container mx-auto px-4 relative"
      >
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-14">
          <HeartIcon className="h-14 w-14 text-brand-pink-500 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold text-brand-pink-700 mb-5">Recrutement Bénévoles</h2>
          <p className="text-lg text-brand-pink-700/80">
            Un parcours rapide, moderne et gratuit pour rejoindre notre équipe terrain.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <motion.aside variants={itemVariants} className="lg:col-span-4 space-y-4">
            <div className="premium-panel p-6">
              <div className="flex items-center gap-3 mb-3">
                <SparklesIcon className="h-6 w-6 text-brand-pink-500" />
                <p className="text-brand-pink-700 font-semibold">Pourquoi candidater ?</p>
              </div>
              <ul className="space-y-2 text-brand-pink-700/80 text-sm">
                <li>• Processus en 3 étapes en moins de 2 minutes</li>
                <li>• Candidature stockée de façon sécurisée</li>
                <li>• Rejoignez une équipe passionnée et engagée</li>
              </ul>
            </div>

            {selectedDistribution && (
              <div className="premium-card p-6">
                <p className="text-brand-pink-400 text-sm mb-3">Distribution sélectionnée</p>
                <div className="space-y-3 text-brand-pink-700">
                  <div className="flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> {selectedDistribution.date}</div>
                  <div className="flex items-center gap-2"><ClockIcon className="h-5 w-5" /> {selectedDistribution.time}</div>
                  <div className="flex items-center gap-2"><MapPinIcon className="h-5 w-5" /> {selectedDistribution.location}</div>
                </div>
              </div>
            )}
          </motion.aside>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="lg:col-span-8 premium-panel p-6 md:p-8"
          >
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="mb-7">
              <div className="flex justify-between text-xs text-brand-pink-500 mb-2">
                <span>Étape {step}/3</span>
                <span>{Math.round(stepProgress)}%</span>
              </div>
              <div className="h-2 w-full bg-brand-pink-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-pink-400 to-brand-pink-600"
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {renderStepContent()}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="magnetic-btn inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brand-pink-200 text-brand-pink-700 hover:bg-brand-pink-50 transition-all duration-300"
                >
                  <ArrowLongLeftIcon className="h-5 w-5" /> Retour
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="magnetic-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-pink-500 text-white hover:bg-brand-pink-600 transition-all duration-300 ml-auto"
                >
                  Continuer <ArrowLongRightIcon className="h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="magnetic-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-pink-500 text-white hover:bg-brand-pink-600 transition-all duration-300 ml-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-30" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" className="opacity-80" />
                      </svg>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5" /> Envoyer la candidature
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 text-sm text-brand-pink-500 hover:text-brand-pink-700 transition-colors"
              >
                Effacer
              </button>
            </div>

            {submitStatus === 'success' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700 flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Candidature envoyée avec succès.</p>
                  <p className="text-sm">Merci pour votre engagement. Nous revenons vers vous rapidement.</p>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
                <p className="font-semibold">Envoi impossible</p>
                <p className="text-sm mt-1">{error || 'Veuillez réessayer plus tard.'}</p>
              </motion.div>
            )}
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
};

export default Volunteer;