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

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const sent = navigator.sendBeacon(GOOGLE_SHEETS_WEBHOOK_URL, payloadString);
    if (sent) {
      return;
    }
  }

  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: payloadString
  });
};
