import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { getUserProfile, setUserProfile } from '../services/db';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, requestedRole?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  makeMeAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROOT_ADMIN_EMAIL = 'ibrargd44@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = Boolean(
    (currentUser?.email && currentUser.email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) ||
    userProfile?.role === 'admin'
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          const isRoot = user.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();
          
          if (!profile) {
            // Create user profile in Firestore
            profile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
              role: isRoot ? 'admin' : 'customer',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setUserProfile(profile);
          } else if (isRoot && profile.role !== 'admin') {
            profile = { ...profile, role: 'admin' };
            await setUserProfile(profile);
          }
          setUserProfileState(profile);
        } catch (err) {
          console.error('Error fetching/setting user profile:', err);
          // Fallback minimal profile
          setUserProfileState({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Customer',
            role: user.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfileState(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      let profile = await getUserProfile(user.uid);
      const isRoot = user.email?.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Customer',
          role: isRoot ? 'admin' : 'customer',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await setUserProfile(profile);
      }
      setUserProfileState(profile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, requestedRole: UserRole = 'customer') => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      await updateProfile(user, { displayName: name });
      
      const role = email.toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase() ? 'admin' : requestedRole;
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email || email,
        displayName: name,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setUserProfile(profile);
      setUserProfileState(profile);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfileState(null);
  };

  const makeMeAdmin = async () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      uid: currentUser.uid,
      email: currentUser.email || '',
      displayName: currentUser.displayName || 'Administrator',
      role: 'admin',
      createdAt: userProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setUserProfile(updated);
    setUserProfileState(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        makeMeAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
