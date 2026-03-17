import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { getEvents } from '../services/firestoreService';

interface NourirEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const Events = () => {
  const [events, setEvents] = useState<NourirEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Erreur lors du chargement des événements");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-brand-pink-400" />
        <p className="mt-4 text-brand-pink-600">Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="mt-4 text-red-600">{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarIcon className="mx-auto h-12 w-12 text-brand-pink-400" />
        <h3 className="mt-2 text-sm font-medium text-brand-pink-700">Aucun événement</h3>
        <p className="mt-1 text-sm text-brand-pink-500">
          Aucun événement n'est prévu pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-bayon text-6xl text-transparent bg-clip-text bg-gradient-to-r from-brand-pink-700 to-brand-pink-500 mb-6 uppercase tracking-tight">
            Prochains événements
          </h2>
          <p className="text-xl text-brand-pink-900/60 max-w-2xl mx-auto font-medium">
            Découvrez nos prochains moments de partage et rejoignez-nous pour agir ensemble.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="premium-card-soft overflow-hidden group border-none"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bayon text-brand-pink-700 mb-6 group-hover:text-brand-pink-500 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center text-brand-pink-900/60 font-medium">
                    <div className="p-2 rounded-lg bg-brand-pink-50 mr-3">
                      <CalendarIcon className="h-5 w-5 text-brand-pink-500" />
                    </div>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-brand-pink-900/60 font-medium">
                    <div className="p-2 rounded-lg bg-brand-pink-50 mr-3">
                      <svg className="h-5 w-5 text-brand-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-brand-pink-900/60 font-medium">
                    <div className="p-2 rounded-lg bg-brand-pink-50 mr-3">
                      <svg className="h-5 w-5 text-brand-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;