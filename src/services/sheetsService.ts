import { VolunteerApplicationData } from '../types';

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || '';

export const sendVolunteerToGoogleSheets = async (application: VolunteerApplicationData): Promise<void> => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return;
  }

  const payload = {
    ...application,
    submittedAt: new Date().toISOString()
  };

  await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });
};
