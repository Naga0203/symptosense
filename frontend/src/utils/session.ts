import { auth } from '../services/firebase';

const SESSION_KEY = 'symptosense_user_id';

export const getSessionUserId = (): string => {
  // 1. Try to get UID from current Firebase user
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }

  // 2. Fallback to Guest ID in LocalStorage
  try {
    let userId = localStorage.getItem(SESSION_KEY);
    
    if (!userId) {
      // Generate a simple unique ID for the guest session
      userId = 'guest_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(SESSION_KEY, userId);
    }
    
    return userId;
  } catch (err) {
    return 'temp_guest_' + Date.now();
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
};
