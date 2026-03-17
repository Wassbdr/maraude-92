import { useState, useEffect } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { getEvents } from '../services/firestoreService';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
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
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-pink-700 sm:text-4xl">
            Prochains événements
          </h2>
          <p className="mt-4 text-lg text-brand-pink-600">
            Découvrez nos prochains événements et rejoignez-nous !
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-brand-cream-50 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-brand-pink-700 mb-4">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-brand-pink-600">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-brand-pink-600">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-brand-pink-600">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;