import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, NewspaperIcon, CalendarIcon, TrashIcon, PencilIcon, UserIcon } from '@heroicons/react/24/outline';
import AdminForm from '../components/AdminForm';
import { 
  getNews, addNews, deleteNews, 
  getEvents, addEvent, updateEvent, deleteEvent,
  getVolunteers, deleteVolunteer } from '../services/firestoreService';
import { NewsItem, NewsFormData, Event, EventFormData } from '../types';
import { Timestamp } from 'firebase/firestore';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  city?: string;
  availability?: string[];
  skills?: string[];
  motivation?: string;
  status?: string;
  distribution?: string;
  createdAt: Timestamp;
}

const Admin = () => {
  const { logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'news' | 'events' | 'volunteers'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'news') {
          const newsData = await getNews();
          setNews(newsData);
        } else if (activeTab === 'events') {
          const eventsData = await getEvents();
          setEvents(eventsData);
        } else if (activeTab === 'volunteers') {
          const volunteersData = await getVolunteers();
          setVolunteers(volunteersData);
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab}:`, err);
        setError(`Erreur lors du chargement des ${activeTab === 'news' ? 'actualités' : activeTab === 'events' ? 'événements' : 'bénévoles'}`);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, isAuthenticated]);

  const handleCreateNews = () => {
    setEditingItem(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleCreateEvent = () => {
    setEditingItem(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingItem(event);
    setIsEditing(true);
    setIsCreating(true);
  };

  const handleCloseForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleSubmitNews = async (data: NewsFormData) => {
    try {
      if (isEditing && editingItem) {
        setIsCreating(false);
        setIsEditing(false);
        setEditingItem(null);
      } else {
        if (news.length >= 3) {
          setError("Attention: l'ajout d'une nouvelle actualité remplacera la plus ancienne, car la limite est de 3 actualités.");
          setTimeout(async () => {
            const newNews = await addNews(data);
            setNews((prev) => [newNews as NewsItem, ...prev.slice(0, 2)]);
            setIsCreating(false);
            setError(null);
          }, 2000);
          return;
        }
        
        const newNews = await addNews(data);
        setNews((prev) => [newNews as NewsItem, ...prev]);
        setIsCreating(false);
      }
    } catch (err: any) {
      console.error("Error with news:", err);
      setError(err.message || "Erreur lors de l'opération sur l'actualité");
    }
  };

  const handleSubmitEvent = async (data: EventFormData) => {
    try {
      if (isEditing && editingItem) {
        const updatedEvent = await updateEvent(editingItem.id, data);
        setEvents((prev) => 
          prev.map((event) => event.id === editingItem.id ? updatedEvent : event)
        );
        setIsEditing(false);
        setEditingItem(null);
      } else {
        const newEvent = await addEvent(data);
        setEvents((prev) => [newEvent as Event, ...prev]);
      }
      setIsCreating(false);
      setError(null);
    } catch (err: any) {
      console.error("Error with event:", err);
      setError(err.message || "Erreur lors de l'opération sur l'événement");
    }
  };

  const handleSubmit = (data: NewsFormData | EventFormData) => {
    if (activeTab === 'news' && 'content' in data) {
      handleSubmitNews(data);
    } else if (activeTab === 'events' && 'date' in data) {
      handleSubmitEvent(data);
    }
  };

  const handleDeleteNews = async (id: string) => {
    try {
      await deleteNews(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting news:", err);
      setError("Erreur lors de la suppression de l'actualité");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Erreur lors de la suppression de l'événement");
    }
  };

  const handleDeleteVolunteer = async (id: string) => {
    try {
      await deleteVolunteer(id);
      setVolunteers((prev) => prev.filter((volunteer) => volunteer.id !== id));
    } catch (err) {
      console.error("Error deleting volunteer:", err);
      setError("Erreur lors de la suppression de la demande de bénévolat");
    }
  };

  const exportVolunteersToCSV = () => {
    if (volunteers.length === 0) return;

    const escapeCSV = (value: string | number | null | undefined) => {
      const stringValue = String(value ?? '');
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Nom',
      'Email',
      'Téléphone',
      'Ville',
      'Disponibilités',
      'Compétences',
      'Motivation',
      'Message',
      'Statut',
      'Distribution',
      'Date'
    ];

    const rows = volunteers.map((volunteer) => [
      volunteer.name,
      volunteer.email,
      volunteer.phone,
      volunteer.city || '',
      (volunteer.availability || []).join(' | '),
      (volunteer.skills || []).join(' | '),
      volunteer.motivation || '',
      volunteer.message || '',
      volunteer.status || 'new',
      volunteer.distribution || '',
      volunteer.createdAt?.toDate ? volunteer.createdAt.toDate().toISOString() : ''
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => escapeCSV(cell)).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `candidatures-benevoles-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const copyVolunteerEmails = async () => {
    if (volunteers.length === 0) return;
    const emailList = volunteers.map((volunteer) => volunteer.email).join('; ');
    try {
      await navigator.clipboard.writeText(emailList);
      setError('Emails copiés dans le presse-papiers ✅');
      setTimeout(() => setError(null), 2000);
    } catch (clipboardError) {
      setError('Impossible de copier les emails automatiquement.');
    }
  };

  const getFormDataFromItem = (): NewsFormData | EventFormData | undefined => {
    if (!isEditing || !editingItem) return undefined;
    
    if (activeTab === 'news' && 'content' in editingItem) {
      return {
        title: editingItem.title,
        content: editingItem.content,
        image: null,
      };
    } else if (activeTab === 'events' && 'location' in editingItem) {
      return {
        title: editingItem.title,
        date: editingItem.date,
        time: editingItem.time,
        location: editingItem.location
      };
    }
    
    return undefined;
  };

  return (
    <div className="min-h-screen bg-brand-cream-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-brand-pink-700">Administration</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-brand-pink-500 text-white rounded-lg hover:bg-brand-pink-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-2 font-bold"
            >
              ×
            </button>
          </div>
        )}
        
        <div className="border-b border-brand-pink-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('news')}
              className={`${
                activeTab === 'news'
                  ? 'border-brand-pink-500 text-brand-pink-700'
                  : 'border-transparent text-brand-pink-400 hover:text-brand-pink-500 hover:border-brand-pink-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <NewspaperIcon className="h-5 w-5 mr-2" />
              Actualités
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`${
                activeTab === 'events'
                  ? 'border-brand-pink-500 text-brand-pink-700'
                  : 'border-transparent text-brand-pink-400 hover:text-brand-pink-500 hover:border-brand-pink-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Événements
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`${
                activeTab === 'volunteers'
                  ? 'border-brand-pink-500 text-brand-pink-700'
                  : 'border-transparent text-brand-pink-400 hover:text-brand-pink-700 hover:border-brand-pink-200'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
              <UserIcon className="h-5 w-5 mr-2" />
              Bénévoles
            </button>
          </nav>
        </div>
        {activeTab !== 'volunteers' && (
          <div className="mb-6">
              <button
                onClick={activeTab === 'news' ? handleCreateNews : handleCreateEvent}
                className="inline-flex items-center px-4 py-2 bg-brand-pink-500 text-white rounded-lg hover:bg-brand-pink-600 transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                  {activeTab === 'news' ? 'Nouvelle actualité' : 'Nouvel événement'}
                
              </button>
          </div>
        )}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-pink-500 mx-auto"></div>
              <p className="mt-2 text-brand-pink-600">Chargement...</p>
            </div>
          ) : activeTab === 'news' ? (
            <div className="divide-y divide-brand-pink-200">
              {news.length === 0 ? (
                <div className="p-6 text-center text-brand-pink-500">
                  Aucune actualité publiée
                </div>
              ) : (
                news.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-brand-pink-700">{item.title}</h3>
                          <p className="mt-2 text-sm text-brand-pink-600">{item.content}</p>
                          <p className="mt-2 text-xs text-brand-pink-400">
                            {new Date(item.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'events' ? (
            <div className="divide-y divide-brand-pink-200">
              {events.length === 0 ? (
                <div className="p-6 text-center text-brand-pink-500">
                  Aucun événement planifié
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-brand-pink-700">{event.title}</h3>
                        <div className="mt-2 text-sm text-brand-pink-600">
                          <p>Date : {event.date}</p>
                          <p>Heure : {event.time}</p>
                          <p>Lieu : {event.location}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-brand-pink-700">Demandes de bénévolat</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={copyVolunteerEmails}
                    className="px-3 py-2 text-sm rounded-lg border border-brand-pink-200 text-brand-pink-700 hover:bg-brand-pink-50 transition-colors"
                  >
                    Copier emails
                  </button>
                  <button
                    onClick={exportVolunteersToCSV}
                    className="px-3 py-2 text-sm rounded-lg bg-brand-pink-500 text-white hover:bg-brand-pink-600 transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {loading ? (
                  <div className="p-6 text-center">
                    <p>Chargement des demandes...</p>
                  </div>
                ) : volunteers.length === 0 ? (
                  <div className="p-6 text-center">
                    <p>Aucune demande de bénévolat pour le moment.</p>
                  </div>
                ) : (
                  volunteers.map((volunteer) => (
                    <div key={volunteer.id} className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-brand-pink-700">{volunteer.name}</h3>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteVolunteer(volunteer.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                              title="Supprimer cette demande"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm"><span className="font-medium">Email:</span> {volunteer.email}</p>
                          <p className="text-sm"><span className="font-medium">Téléphone:</span> {volunteer.phone}</p>
                          {volunteer.message && (
                            <p className="text-sm mt-2"><span className="font-medium">Message:</span> {volunteer.message}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Reçu le {new Date(volunteer.createdAt.toDate()).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {isCreating && (
        <AdminForm
          type={activeTab}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          initialData={getFormDataFromItem()}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Admin;