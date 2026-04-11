/**
 * Utility to manage a persistent user session for a Guest Mode.
 * This ensures that history and profile data persist across refreshes.
 */

const SESSION_KEY = 'symptosense_user_id';

export const getSessionUserId = (): string => {
  try {
    let userId = localStorage.getItem(SESSION_KEY);
    
    if (!userId) {
      // Generate a simple unique ID for the guest session
      userId = 'guest_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(SESSION_KEY, userId);
      console.log('Generated new guest session ID:', userId);
    }
    
    return userId;
  } catch (err) {
    console.error('LocalStorage access failed, using temporary ID', err);
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
