import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './firebase';
import { UserProfile } from './AdminTypes';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  makeAdmin: (uid: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAILS = ['ibrargd44@gmail.com', 'najamd45@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore
  const syncProfile = async (fbUser: User) => {
    try {
      const userRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userRef);
      const isKnownAdminEmail = fbUser.email ? ADMIN_EMAILS.includes(fbUser.email.toLowerCase()) : false;

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        // If email is in admin list but role is not admin, upgrade it
        if (isKnownAdminEmail && data.role !== 'admin') {
          await updateDoc(userRef, { role: 'admin', updatedAt: new Date().toISOString() });
          setProfile({ ...data, role: 'admin' });
        } else {
          setProfile(data);
        }
      } else {
        // Create user document
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Customer',
          email: fbUser.email || '',
          role: isKnownAdminEmail ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (err) {
      console.warn('Error fetching or creating user profile in Firestore:', err);
      // Fallback in-memory profile if permissions restrict
      const isKnownAdmin = fbUser.email ? ADMIN_EMAILS.includes(fbUser.email.toLowerCase()) : false;
      setProfile({
        uid: fbUser.uid,
        name: fbUser.displayName || 'Customer',
        email: fbUser.email || '',
        role: isKnownAdmin ? 'admin' : 'customer',
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        await syncProfile(fbUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        await syncProfile(res.user);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await syncProfile(res.user);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      await syncProfile(res.user);
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  const makeAdmin = async (targetUid: string) => {
    try {
      const userRef = doc(db, 'users', targetUid);
      await updateDoc(userRef, { role: 'admin', updatedAt: new Date().toISOString() });
      if (targetUid === user?.uid && profile) {
        setProfile({ ...profile, role: 'admin' });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${targetUid}`);
    }
  };

  const isAdmin = Boolean(
    profile?.role === 'admin' ||
    (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        makeAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
