import { VolunteerApplicationData } from '../types';

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || '';

export const sendVolunteerToGoogleSheets = async (application: VolunteerApplicationData): Promise<void> => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn('Google Sheets webhook URL is missing. Set REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL in .env');
    return;
  }

  const payload = {
    ...application,
    submittedAt: new Date().toISOString()
  };

  const payloadString = JSON.stringify(payload);

  try {
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: payloadString
    });

    const result = await response.text();
    console.log('Google Sheets webhook result:', result);
  } catch (error) {
    console.error('Error sending volunteer to Google Sheets:', error);
  }
};
