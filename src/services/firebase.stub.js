/**
 * Firebase (Firestore) — stub when the "firebase" package is not installed.
 * Bookings and other features are no-ops until you run: npm install firebase
 * and the real implementation (firebase.real.js) is used.
 */
export const db = null;

export const COLLECTIONS = {
  BOOKINGS: 'bookings',
  EVENTS: 'events',
  CONFIG: 'config',
  CONTACTS: 'contacts',
};

const notInstalled =
  'Bookings cannot be saved until Firebase is connected. Run: npm install firebase, then restart the app.';

export async function createBooking() {
  throw new Error(notInstalled);
}

export async function getBookings() {
  return [];
}

export async function updateBooking() {
  throw new Error(notInstalled);
}

export async function getLiveStreamConfig() {
  return { youtubeUrl: null, facebookUrl: null, updatedAt: null };
}

export async function setLiveStreamConfig() {
  throw new Error(notInstalled);
}

export async function getEvents() {
  return [];
}

export async function addEvent() {
  throw new Error(notInstalled);
}

export async function isAdmin() {
  return false;
}

export async function submitContactForm() {
  throw new Error(notInstalled);
}
