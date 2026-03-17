import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc,
  updateDoc,
  setDoc,
  Timestamp, 
  query, 
  orderBy,
  where,
  getDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { NewsItem, NewsFormData, Event, EventFormData, Volunteer, VolunteerApplicationData } from '../types';
import { compressImage } from './imageCompression';

// News functions with limit
export const getNews = async (): Promise<NewsItem[]> => {
  try {
    const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(newsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        image: data.image || null,
        date: data.date.toDate().toISOString(),
      };
    });
  } catch (error) {
    console.error('Error getting news: ', error);
    throw error;
  }
};

export const addNews = async (newsData: NewsFormData): Promise<NewsItem> => {
  try {
    // First, check how many news items we already have
    const newsQuery = query(collection(db, 'news'), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(newsQuery);
    
    // If we already have 3 or more news items, delete the oldest one
    if (querySnapshot.size >= 3) {
      // Get the oldest news item (first in ascending order)
      const oldestNews = querySnapshot.docs[0];
      
      // Delete the oldest news item
      await deleteDoc(doc(db, 'news', oldestNews.id));
      
      // If the oldest news had an image, delete it from storage
      const oldestData = oldestNews.data();
      if (oldestData.image) {
        try {
          // Extract the image path from the URL
          const imageUrl = new URL(oldestData.image);
          const imagePath = decodeURIComponent(imageUrl.pathname.split('/o/')[1].split('?')[0]);
          await deleteObject(ref(storage, imagePath));
          console.log('Old image deleted from storage');
        } catch (err) {
          console.error('Error deleting old image:', err);
          // Continue with adding new news even if image deletion fails
        }
      }
    }
    
    // Upload new image if provided
    let imageUrl = null;
    if (newsData.image) {
      try {
        const compressedImage = await compressImage(newsData.image);
        const storageRef = ref(storage, `images/${compressedImage.name}`);
        const metadata = {
          contentType: compressedImage.type,
          cacheControl: 'public, max-age=31536000',
        };
        await uploadBytes(storageRef, compressedImage, metadata);
        imageUrl = await getDownloadURL(storageRef);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        // Continue without image if upload fails
      }
    }
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'news'), {
      title: newsData.title,
      content: newsData.content,
      image: imageUrl,
      date: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      title: newsData.title,
      content: newsData.content,
      image: imageUrl,
      date: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding news: ', error);
    throw error;
  }
};

// Events functions with date validation
export const getEvents = async (): Promise<Event[]> => {
  try {
    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Query only future events (or events happening today)
    const eventsQuery = query(
      collection(db, 'events'), 
      where('date', '>=', today.toISOString().split('T')[0]),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(eventsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        date: data.date,
        time: data.time,
        location: data.location
      };
    });
  } catch (error) {
    console.error('Error getting events: ', error);
    throw error;
  }
};

export const addEvent = async (eventData: EventFormData): Promise<Event> => {
  try {
    // Validate that event date is not in the past
    const eventDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    
    if (eventDate < today) {
      throw new Error("La date de l'événement doit être aujourd'hui ou dans le futur.");
    }
    
    const docRef = await addDoc(collection(db, 'events'), {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      createdAt: Timestamp.now()
    });
    
    return {
      id: docRef.id,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location
    };
  } catch (error) {
    console.error('Error adding event: ', error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  try {
    // Validate that event date is not in the past
    const eventDate = new Date(eventData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight
    
    if (eventDate < today) {
      throw new Error("La date de l'événement doit être aujourd'hui ou dans le futur.");
    }
    
    const eventRef = doc(db, 'events', id);
    
    await updateDoc(eventRef, {
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      updatedAt: Timestamp.now()
    });
    
    return {
      id,
      title: eventData.title,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location
    };
  } catch (error) {
    console.error('Error updating event: ', error);
    throw error;
  }
};

export const deleteNews = async (id: string): Promise<void> => {
  try {
    // Retrieve the news document to get the image URL
    const newsDoc = await getDoc(doc(db, 'news', id));
    const newsData = newsDoc.data();
    
    // Delete the news document
    await deleteDoc(doc(db, 'news', id));
    
    // If the news had an image, delete it from storage
    if (newsData && newsData.image) {
      try {
        // Extract the image path from the URL
        const imageUrl = newsData.image;
        const storageRef = ref(storage, imageUrl);
        await deleteObject(storageRef);
        console.log("Image supprimée:", imageUrl);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'image:", error);
      }
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'actualité:", error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'events', id);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event: ', error);
    throw error;
  }
};

export const getVolunteers = async (): Promise<Volunteer[]> => {
  try {
    const volunteersSnapshot = await getDocs(
      query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'))
    );
    
    return volunteersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
        city: data.city || '',
        availability: Array.isArray(data.availability) ? data.availability : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        motivation: data.motivation || '',
        status: data.status || 'new',
        distribution: data.distribution || '',
        createdAt: data.createdAt
      };
    }) as Volunteer[];
  } catch (error) {
    console.error('Error getting volunteers:', error);
    // Add more specific error handling
    if (error instanceof Error && error.toString().includes('Missing or insufficient permissions')) {
      throw new Error('Erreur d\'accès: Assurez-vous d\'être correctement connecté avec un compte autorisé.');
    }
    throw error;
  }
};

export const addVolunteerApplication = async (applicationData: VolunteerApplicationData): Promise<void> => {
  try {
    const normalizedEmail = applicationData.email.trim().toLowerCase();
    const submissionRef = doc(db, 'volunteers_submissions', normalizedEmail);

    await addDoc(collection(db, 'volunteers'), {
      name: applicationData.name.trim(),
      email: normalizedEmail,
      phone: applicationData.phone.trim(),
      city: applicationData.city.trim(),
      availability: applicationData.availability,
      skills: applicationData.skills,
      motivation: applicationData.motivation.trim(),
      message: applicationData.motivation.trim(),
      distribution: applicationData.distribution || '',
      status: 'new',
      createdAt: Timestamp.now()
    });

    await setDoc(submissionRef, {
      timestamp: Timestamp.now(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
    });
  } catch (error) {
    console.error('Error adding volunteer application:', error);
    if (error instanceof Error && error.message.toLowerCase().includes('missing or insufficient permissions')) {
      throw new Error('Envoi impossible pour le moment. Vérifiez les règles Firestore (collection volunteers / volunteers_submissions).');
    }
    throw error;
  }
};

export const deleteVolunteer = async (id: string): Promise<void> => {
  try {
    // Get the volunteer data before deletion to handle cleanup
    const volunteerRef = doc(db, 'volunteers', id);
    const volunteerDoc = await getDoc(volunteerRef);
    const volunteerData = volunteerDoc.data();
    
    // Delete the volunteer document
    await deleteDoc(volunteerRef);
    
    // If possible, clean up the corresponding entry in volunteers_submissions
    if (volunteerData && volunteerData.email) {
      try {
        const submissionRef = doc(db, 'volunteers_submissions', volunteerData.email);
        const submissionDoc = await getDoc(submissionRef);
        
        // Only delete if the document exists
        if (submissionDoc.exists()) {
          await deleteDoc(submissionRef);
        }
      } catch (cleanupError) {
        // Log but don't throw, since the main deletion succeeded
        console.error('Error cleaning up volunteer submission record:', cleanupError);
      }
    }
    
    console.log('Volunteer deleted successfully');
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    throw error;
  }
};

