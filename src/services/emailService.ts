import emailjs from '@emailjs/browser';
import { collection, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || '';

export const sendVolunteerEmail = async (formData: any) => {
  try {
    // Create an enhanced email message with more details and formatting
    const emailMessage = `
Bonjour ${formData.name},

Merci beaucoup pour votre demande de bénévolat auprès de Nous'Rire ! 

Votre générosité et votre désir d'aider notre communauté sont précieux. Nous avons bien enregistré votre candidature et un membre de notre équipe vous contactera dans les prochains jours pour discuter des possibilités de bénévolat.

Voici un résumé de vos informations :
• Nom : ${formData.name}
• Email : ${formData.email}
• Téléphone : ${formData.phone}
${formData.message ? `• Votre message : "${formData.message}"` : ''}

En attendant, n'hésitez pas à visiter notre site web pour découvrir nos actions en cours et suivre notre actualité.

Nous vous remercions sincèrement pour votre engagement solidaire et sommes impatients de vous accueillir dans notre équipe.

Chaleureusement,

L'équipe Nous'Rire
https://nousrire.org
Suivez-nous sur les réseaux sociaux :
Instagram: @nousrire.asso
Snapchat: @maraude92
Pour toute question, vous pouvez nous contacter à l'adresse suivante :
nousrire.contact@gmail.com
`;

    // First handle email sending which doesn't require authentication
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: formData.email,
        to_name: formData.name,
        message: emailMessage,
        reply_to: formData.email
      },
      PUBLIC_KEY
    );

    // Record this email submission to prevent spam (used by Firestore rules)
    await setDoc(doc(db, 'volunteers_submissions', formData.email), {
      timestamp: Timestamp.now(),
      // Set expiration to 24 hours from now
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    // Now handle Firestore storage
    try {
      await addDoc(collection(db, 'volunteers'), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        distribution: formData.distribution,
        createdAt: Timestamp.now()
      });
      console.log('Volunteer data successfully stored in Firestore');
    } catch (firestoreError) {
      console.error('Error storing volunteer data in Firestore:', firestoreError);
      // If volunteer data storage fails, try to remove the submission record
      try {
        // This is for cleanup in case the main submission fails
        // But we don't want to fail the entire operation if this cleanup fails
        const submissionRef = doc(db, 'volunteers_submissions', formData.email);
        await setDoc(submissionRef, { removed: true }, { merge: true });
      } catch (cleanupError) {
        console.error('Failed to clean up submission record:', cleanupError);
      }
    }

    // Return true since at least the email was sent successfully
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
};