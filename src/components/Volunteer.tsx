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
    age: '',
    city: '',
    availability: [] as string[],
    skills: [] as string[],
    motivation: '',
    distribution: selectedDistribution?.id || '',
    company: ''
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

  const stepProgress = useMemo(() => (step / 2) * 100, [step]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setStep(prev => Math.min(prev + 1, 2));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      city: '',
      availability: [],
      skills: [],
      motivation: '',
      distribution: selectedDistribution?.id || '',
      company: ''
    });
    setStep(1);
    setSubmitStatus('idle');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 2) {
      nextStep();
      return;
    }

    if (formData.company.trim()) {
      return;
    }

    if (Date.now() - formStartedAt < 3000) {
      setSubmitStatus('error');
      setError('Veuillez patienter quelques secondes avant l’envoi.');
      return;
    }

    const ageValue = Number(formData.age);
    if (!formData.age || Number.isNaN(ageValue) || ageValue < 16 || ageValue > 100) {
      setSubmitStatus('error');
      setError('Veuillez indiquer un âge valide (entre 16 et 100 ans).');
      return;
    }

    const lastSubmitTime = localStorage.getItem('lastVolunteerSubmitTime');
    const cooldownPeriod = 24 * 60 * 60 * 1000;
    if (lastSubmitTime && Date.now() - Number.parseInt(lastSubmitTime, 10) < cooldownPeriod) {
      setSubmitStatus('error');
      setError('Vous avez déjà envoyé une candidature récemment. Réessayez dans 24h.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: DOMPurify.sanitize(formData.name.trim()),
      email: DOMPurify.sanitize(formData.email.trim().toLowerCase()),
      phone: DOMPurify.sanitize(formData.phone.trim()),
      age: ageValue,
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
                placeholder="Ex: Fatima Benali"
                className="input bg-white/90"
                required
              />
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
                placeholder="votre.email@exemple.com"
                className="input bg-white/90"
                required
              />
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
                placeholder="06 12 34 56 78"
                className="input bg-white/90"
                required
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-brand-pink-700 font-medium mb-2 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" /> Âge
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={16}
                max={100}
                value={formData.age}
                onChange={handleChange}
                placeholder="Ex: 25"
                className="input bg-white/90"
                required
              />
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
                placeholder="Ex: Nanterre"
                className="input bg-white/90"
                required
              />
            </div>
          </div>
        </motion.div>
      );
    }

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
                className={`px-4 py-2 rounded-full border transition-all duration-300 ${formData.availability.includes(option)
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
                className={`px-4 py-2 rounded-full border transition-all duration-300 ${formData.skills.includes(option)
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
            rows={4}
            className="input bg-white/90"
            placeholder="Expliquez en quelques mots pourquoi vous souhaitez rejoindre Nous'Rire..."
            required
          />
        </div>
      </motion.div>
    );
  };

  return (
    <section id="benevole" className="relative py-24 bg-transparent">

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        variants={containerVariants}
        className="container mx-auto px-4 relative"
      >
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex p-4 rounded-3xl bg-brand-pink-50 mb-6">
            <HeartIcon className="h-10 w-10 text-brand-pink-500" />
          </div>
          <h2 className="text-6xl font-bayon text-transparent bg-clip-text bg-gradient-to-r from-brand-pink-700 to-brand-pink-500 mb-6 uppercase tracking-tight">
            Devenir Bénévole
          </h2>
          <p className="text-xl text-brand-pink-900/60 font-medium leading-relaxed">
            Rejoignez notre aventure solidaire. Un processus simple et rapide pour commencer à agir à nos côtés.
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
                <li>• Processus en 2 étapes en moins de 2 minutes</li>
                <li>• Vos informations sont protégées et utilisées uniquement pour vous recontacter</li>
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

            <div className="mb-10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-brand-pink-500 mb-3">
                <span>Étape {step} sur 2</span>
                <span>{Math.round(stepProgress)}% complété</span>
              </div>
              <div className="h-2.5 w-full bg-brand-pink-50 rounded-full overflow-hidden border border-brand-pink-100/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-brand-pink-400 to-brand-pink-600 shadow-[0_0_10px_rgba(254,171,163,0.5)]"
                  animate={{ width: `${stepProgress}%` }}
                  transition={{ duration: 0.6, ease: "circOut" }}
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
                  className="btn-secondary"
                >
                  <ArrowLongLeftIcon className="h-5 w-5 mr-2" /> Retour
                </button>
              )}

              {step < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="btn-primary ml-auto"
                >
                  Continuer <ArrowLongRightIcon className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseMove={handleMagneticMove}
                  onMouseLeave={handleMagneticLeave}
                  className="btn-primary ml-auto disabled:opacity-70 disabled:cursor-not-allowed"
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