import { getWeeklySummary, shouldSync, markSynced } from './analytics';

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxfLQPNGBCGPYaT0wmGZphej0O1Qk0S4edsxTnR1cpsKxUjey_X8-FLE3d-5uo5jZok/exec';

export const syncToSheets = async () => {
  try {
    // Check if a week has passed since last sync
    const needsSync = await shouldSync();
    if (!needsSync) {
      console.log('Sync not needed yet');
      return;
    }

    // Get weekly summary
    const summary = await getWeeklySummary();
    if (!summary) {
      console.log('No data to sync');
      return;
    }

    // Send to Google Sheets
    const response = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(summary),
    });

    const result = await response.json();

    if (result.success) {
      await markSynced();
      console.log('Sync successful!');
    } else {
      console.log('Sync failed:', result.error);
    }
  } catch (e) {
    console.log('syncToSheets error:', e);
  }
};