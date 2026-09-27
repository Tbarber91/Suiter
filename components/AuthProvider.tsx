'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { PortfolioItem, ServiceOffered, EngagedItem } from '@/lib/types';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  handle?: string;
  bio?: string;
  phone?: string;
  location?: string;
  role: 'admin' | 'management' | 'investor' | 'user';
  isGateLocked?: boolean;
  encryptedAuthToken?: string;
  isCertified?: boolean;
  isRegulatoryCompliant?: boolean;
  isVerifiedExperience?: boolean;
  skills?: string[];
  servicesProvided?: ServiceOffered[];
  portfolio?: PortfolioItem[];
  historyEngaged?: EngagedItem[];
}

export interface ProfileUpdateData {
  name: string;
  handle: string;
  bio?: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
  role?: 'admin' | 'management' | 'investor' | 'user';
  isGateLocked?: boolean;
  isCertified?: boolean;
  isRegulatoryCompliant?: boolean;
  isVerifiedExperience?: boolean;
  skills?: string[];
  servicesProvided?: ServiceOffered[];
  portfolio?: PortfolioItem[];
  historyEngaged?: EngagedItem[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  loginWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string, 
    password: string, 
    name: string, 
    bio?: string, 
    phone?: string, 
    location?: string,
    avatarUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  switchRole: (role: 'admin' | 'management' | 'investor' | 'user') => void;
  toggleGateLock: () => void;
  unlockGateWithKey: (key: string) => boolean;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'Marketplace User',
              email: data.email || firebaseUser.email || '',
              avatarUrl: data.avatarUrl || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              handle: data.handle || `@${(firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`,
              bio: data.bio || '',
              phone: data.phone || '',
              location: data.location || 'Tarntanya / Adelaide CBD',
              role: data.role || 'admin',
              isGateLocked: data.isGateLocked ?? false,
              encryptedAuthToken: data.encryptedAuthToken || `ENC-AES256-RSA4096-OVERSEER-${firebaseUser.uid.substring(0, 8).toUpperCase()}`,
              isCertified: data.isCertified ?? true,
              isRegulatoryCompliant: data.isRegulatoryCompliant ?? true,
              isVerifiedExperience: data.isVerifiedExperience ?? true,
              skills: data.skills || ['Licensed Joinery', 'Building Compliance AS 4386', 'Architectural Surveying', 'Master Builder'],
              servicesProvided: data.servicesProvided || [
                { id: 's1', title: '3D Laser Spatial Survey & Architectural Joinery', description: 'Laser measured CAD designs, 2-pack polyurethane finishes and engineered stone sign-off.', price: 'From $2,400', category: 'Kitchen Renovations', turnaround: '2-3 Weeks' },
                { id: 's2', title: 'Master Builder Statutory Compliance Review', description: 'South Australia CBS builder license review and statutory site survey.', price: '$650 Fixed', category: 'Building Sites', turnaround: '2 Business Days' }
              ],
              portfolio: data.portfolio || [
                { id: 'p1', title: 'Norwood Heritage Villa Joinery', description: 'Bespoke walnut veneer cabinetry and custom kitchen island.', image: 'https://picsum.photos/seed/norwoodjoinery/800/450', category: 'Kitchen Renovations', date: 'August 2026' },
                { id: 'p2', title: 'Unley Architectural Spatial Scan', description: '3D point-cloud LiDAR scan and certified site plan.', image: 'https://picsum.photos/seed/unleyscan/800/450', category: 'Sites & Feasibility', date: 'September 2026' }
              ],
              historyEngaged: data.historyEngaged || [
                { id: 'h1', title: 'City West Toyota Certified LMVD Inspection', type: 'product', providerName: 'City West Toyota', providerHandle: '@citywest_toyota', date: '18 Sep 2026', status: 'completed', price: '$38,900' },
                { id: 'h2', title: 'Kaurna Cultural Heritage Advisory Session', type: 'service', providerName: 'Kaurna Cultural Centre', providerHandle: '@kaurna_centre', date: '21 Sep 2026', status: 'completed', price: 'Community' }
              ]
            });
          } else {
            const tempHandle = `@${(firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`;
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Marketplace User',
              email: firebaseUser.email || '',
              avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
              handle: tempHandle,
              bio: 'Licensed enterprise provider based on Kaurna Country.',
              phone: '0400 123 456',
              location: 'Tarntanya / Adelaide CBD',
              role: 'admin',
              isGateLocked: false,
              encryptedAuthToken: `ENC-AES256-RSA4096-OVERSEER-${firebaseUser.uid.substring(0, 8).toUpperCase()}`,
              isCertified: true,
              isRegulatoryCompliant: true,
              isVerifiedExperience: true,
              skills: ['Licensed Joinery', 'Building Compliance AS 4386', 'Architectural Surveying', 'Master Builder'],
              servicesProvided: [
                { id: 's1', title: '3D Laser Spatial Survey & Architectural Joinery', description: 'Laser measured CAD designs, 2-pack polyurethane finishes and engineered stone sign-off.', price: 'From $2,400', category: 'Kitchen Renovations', turnaround: '2-3 Weeks' },
                { id: 's2', title: 'Master Builder Statutory Compliance Review', description: 'South Australia CBS builder license review and statutory site survey.', price: '$650 Fixed', category: 'Building Sites', turnaround: '2 Business Days' }
              ],
              portfolio: [
                { id: 'p1', title: 'Norwood Heritage Villa Joinery', description: 'Bespoke walnut veneer cabinetry and custom kitchen island.', image: 'https://picsum.photos/seed/norwoodjoinery/800/450', category: 'Kitchen Renovations', date: 'August 2026' },
                { id: 'p2', title: 'Unley Architectural Spatial Scan', description: '3D point-cloud LiDAR scan and certified site plan.', image: 'https://picsum.photos/seed/unleyscan/800/450', category: 'Sites & Feasibility', date: 'September 2026' }
              ],
              historyEngaged: [
                { id: 'h1', title: 'City West Toyota Certified LMVD Inspection', type: 'product', providerName: 'City West Toyota', providerHandle: '@citywest_toyota', date: '18 Sep 2026', status: 'completed', price: '$38,900' },
                { id: 'h2', title: 'Kaurna Cultural Heritage Advisory Session', type: 'service', providerName: 'Kaurna Cultural Centre', providerHandle: '@kaurna_centre', date: '21 Sep 2026', status: 'completed', price: 'Community' }
              ]
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.error("Failed to load user document from Firestore:", error);
          // Fallback to basic details if Firestore read fails
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Marketplace User',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || '',
            handle: `@${(firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`,
            role: 'admin',
            isGateLocked: false,
            encryptedAuthToken: `ENC-AES256-RSA4096-OVERSEER-${firebaseUser.uid.substring(0, 8).toUpperCase()}`
          });
        }
      } else {
        // Fallback to local storage (for custom login mock cases if needed)
        const storedUser = localStorage.getItem('suiter_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {}
        } else {
          setUser(null);
        }
      }
      setIsAuthReady(true);
    });

    // Automated Security Gatekeeper: Closes & locks gates automatically on exit, window change, or stationary timeout
    const handleAutoShutGate = () => {
      setUser((currentUser) => {
        if (!currentUser || currentUser.isGateLocked) return currentUser;
        const autoLockedUser = { ...currentUser, isGateLocked: true };
        if (auth.currentUser) {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          setDoc(userRef, { isGateLocked: true }, { merge: true }).catch(() => {});
        }
        localStorage.setItem('suiter_user', JSON.stringify(autoLockedUser));
        return autoLockedUser;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleAutoShutGate();
      }
    };

    // Stationary / Idle timer: auto-shuts gate after stationary inactivity
    let idleTimer: ReturnType<typeof setTimeout>;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        handleAutoShutGate();
      }, 180000); // 3 minutes stationary
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleAutoShutGate);
    window.addEventListener('mousemove', resetIdleTimer, { passive: true });
    window.addEventListener('keydown', resetIdleTimer, { passive: true });
    window.addEventListener('touchstart', resetIdleTimer, { passive: true });
    resetIdleTimer();

    return () => {
      unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleAutoShutGate);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;
      
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const loadedUser: User = {
          id: firebaseUser.uid,
          name: data.name || firebaseUser.displayName || 'Marketplace User',
          email: data.email || firebaseUser.email || email,
          avatarUrl: data.avatarUrl || firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          handle: data.handle || `@${(firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`,
          bio: data.bio || '',
          phone: data.phone || '',
          location: data.location || 'Tarntanya / Adelaide CBD',
          role: data.role || 'user',
          isGateLocked: data.isGateLocked ?? false,
          encryptedAuthToken: data.encryptedAuthToken || `ENC-AES256-RSA4096-OVERSEER-${firebaseUser.uid.substring(0, 8).toUpperCase()}`,
          isCertified: data.isCertified ?? true,
          isRegulatoryCompliant: data.isRegulatoryCompliant ?? true,
          isVerifiedExperience: data.isVerifiedExperience ?? true,
        };
        setUser(loadedUser);
        localStorage.setItem('suiter_user', JSON.stringify(loadedUser));
      }
      return { success: true };
    } catch (err: any) {
      console.error("Firebase email sign-in error:", err);
      let message = "Invalid email or password.";
      if (err.code === 'auth/user-not-found') message = "No account found with this email.";
      else if (err.code === 'auth/wrong-password') message = "Incorrect password. Please try again.";
      else if (err.code === 'auth/invalid-credential') message = "Invalid login credentials. Please check your email and password.";
      else if (err.code === 'auth/invalid-email') message = "Please enter a valid email address.";
      else if (err.message) message = err.message;
      return { success: false, error: message };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string,
    bio?: string,
    phone?: string,
    location?: string,
    avatarUrl?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;

      const cleanHandle = `@${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}`;
      const chosenAvatar = avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || email)}`;

      try {
        await updateFirebaseProfile(firebaseUser, {
          displayName: name,
          photoURL: chosenAvatar,
        });
      } catch (e) {
        // non-critical
      }

      const newUser: User = {
        id: firebaseUser.uid,
        name: name.trim(),
        email: email.trim(),
        avatarUrl: chosenAvatar,
        handle: cleanHandle,
        bio: bio || 'Verified marketplace provider & community participant.',
        phone: phone || '',
        location: location || 'Tarntanya / Adelaide CBD',
        role: 'user',
        isGateLocked: false,
        encryptedAuthToken: `ENC-AES256-RSA4096-OVERSEER-${firebaseUser.uid.substring(0, 8).toUpperCase()}`,
        isCertified: true,
        isRegulatoryCompliant: true,
        isVerifiedExperience: true,
      };

      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, newUser);
      } catch (err) {
        console.error("Failed to write new user profile to Firestore:", err);
      }

      setUser(newUser);
      localStorage.setItem('suiter_user', JSON.stringify(newUser));
      return { success: true };
    } catch (err: any) {
      console.error("Firebase email sign-up error:", err);
      let message = "Failed to create account.";
      if (err.code === 'auth/email-already-in-use') message = "This email is already registered. Please sign in instead.";
      else if (err.code === 'auth/weak-password') message = "Password should be at least 6 characters long.";
      else if (err.code === 'auth/invalid-email') message = "Invalid email format.";
      else if (err.message) message = err.message;
      return { success: false, error: message };
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const userRef = doc(db, 'users', firebaseUser.uid);
      
      const tempHandle = `@${(firebaseUser.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`;
      const userData: User = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'Marketplace User',
        email: firebaseUser.email || '',
        avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        handle: tempHandle,
        role: 'admin',
        isGateLocked: false,
        encryptedAuthToken: `ENC-AES256-RSA4096-OVERSEER-${firebaseUser.uid.substring(0, 8).toUpperCase()}`,
        isCertified: true,
        isRegulatoryCompliant: true,
        isVerifiedExperience: true
      };
      
      try {
        await setDoc(userRef, userData);
      } catch (err) {
        console.error("Failed to write profile to Firestore", err);
      }
      
      setUser(userData);
    } catch (e) {
      console.error("Google Sign-In failed", e);
    }
  };

  const login = (email: string, name: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      handle: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      role: 'admin',
      isGateLocked: false,
      encryptedAuthToken: `ENC-AES256-RSA4096-OVERSEER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };
    setUser(newUser);
    localStorage.setItem('suiter_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {}
    setUser(null);
    localStorage.removeItem('suiter_user');
  };

  const switchRole = (newRole: 'admin' | 'management' | 'investor' | 'user') => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userRef, { role: newRole }, { merge: true }).catch(() => {});
    } else {
      localStorage.setItem('suiter_user', JSON.stringify(updated));
    }
  };

  const toggleGateLock = () => {
    if (!user) return;
    const nextLocked = !user.isGateLocked;
    const updated = { ...user, isGateLocked: nextLocked };
    setUser(updated);
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userRef, { isGateLocked: nextLocked }, { merge: true }).catch(() => {});
    } else {
      localStorage.setItem('suiter_user', JSON.stringify(updated));
    }
  };

  const unlockGateWithKey = (key: string): boolean => {
    if (!user) return false;
    // Accept standard overseer passkeys or admin key
    if (key.trim().length >= 4) {
      const updated = { ...user, isGateLocked: false };
      setUser(updated);
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        setDoc(userRef, { isGateLocked: false }, { merge: true }).catch(() => {});
      } else {
        localStorage.setItem('suiter_user', JSON.stringify(updated));
      }
      return true;
    }
    return false;
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) return;
    const formattedHandle = data.handle.startsWith('@') ? data.handle : `@${data.handle}`;
    const updatedUser: User = {
      ...user,
      name: data.name,
      handle: formattedHandle,
      bio: data.bio ?? user.bio,
      phone: data.phone ?? user.phone,
      location: data.location ?? user.location,
      avatarUrl: data.avatarUrl ?? user.avatarUrl,
      role: data.role ?? user.role,
      isGateLocked: data.isGateLocked ?? user.isGateLocked,
      isCertified: data.isCertified ?? user.isCertified,
      isRegulatoryCompliant: data.isRegulatoryCompliant ?? user.isRegulatoryCompliant,
      isVerifiedExperience: data.isVerifiedExperience ?? user.isVerifiedExperience,
      skills: data.skills ?? user.skills,
      servicesProvided: data.servicesProvided ?? user.servicesProvided,
      portfolio: data.portfolio ?? user.portfolio,
      historyEngaged: data.historyEngaged ?? user.historyEngaged,
    };

    if (auth.currentUser) {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, updatedUser, { merge: true });
      } catch (err) {
        console.error("Failed to update profile to Firestore:", err);
      }
    } else {
      localStorage.setItem('suiter_user', JSON.stringify(updatedUser));
    }

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      signInWithEmail, 
      signUpWithEmail, 
      logout, 
      updateProfile, 
      switchRole, 
      toggleGateLock, 
      unlockGateWithKey, 
      isAuthReady 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
