import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  collection, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  uid: string;
  email: string | null;
  fullName: string;
  username: string;
  age: number;
  gender: string;
  bp?: string;
  sugar?: string;
  createdAt: string;
}

/**
 * Check if a username is already taken in Firestore
 */
export const isUsernameAvailable = async (username: string): Promise<boolean> => {
  if (!username) return true;
  const q = query(collection(db, 'users'), where('username', '==', username.toLowerCase()));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

/**
 * Register a new user with Email and Password
 */
export const registerWithEmail = async (
  email: string, 
  password: string, 
  profileData: Omit<UserProfile, 'uid' | 'email' | 'createdAt'>
) => {
  // 1. Check username availability one last time
  const available = await isUsernameAvailable(profileData.username);
  if (!available) {
    throw new Error('Username is already taken.');
  }

  // 2. Create Auth User
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // 3. Create Firestore Profile
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email,
    ...profileData,
    username: profileData.username.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);
  return userProfile;
};

/**
 * Login with Email and Password
 */
export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Check if profile exists, if not create a basic one
  const docRef = doc(db, 'users', user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // Generate a default username from email
    const defaultUsername = user.email ? user.email.split('@')[0] + Math.floor(Math.random() * 1000) : `user_${user.uid.slice(0, 5)}`;
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      fullName: user.displayName || 'Anonymous User',
      username: defaultUsername.toLowerCase(),
      age: 0, // Placeholder
      gender: 'Other', // Placeholder
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', user.uid), userProfile);
    return { user, isNewUser: true, profile: userProfile };
  }

  return { user, isNewUser: false, profile: docSnap.data() as UserProfile };
};

/**
 * Logout
 */
export const logout = () => signOut(auth);
