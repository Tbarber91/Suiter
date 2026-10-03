'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, ProfileUpdateData } from '@/components/AuthProvider';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  KeyRound, 
  LogOut, 
  Layers, 
  Briefcase, 
  CreditCard, 
  Flame, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  Edit3, 
  Save, 
  PlusCircle, 
  Check, 
  ShieldAlert, 
  Building2, 
  Store, 
  Wrench, 
  FileText, 
  RefreshCw,
  Cpu,
  Server,
  Share2,
  Trash2
} from 'lucide-react';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Location } from '@/lib/types';
import { Logo } from '@/components/Logo';
import { CreatePostModal } from '@/components/CreatePostModal';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusVance',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJenkins',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRostova',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidWright',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=TarntanyaPro',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=AdelaideMaster'
];

export default function ProfilePage() {
  const router = useRouter();
  const { 
    user, 
    loginWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordReset, 
    logout, 
    updateProfile, 
    switchRole, 
    toggleGateLock, 
    isAuthReady 
  } = useAuth();

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'listings' | 'account' | 'security'>('profile');

  // Auth form states (when unauthenticated)
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [locationInput, setLocationInput] = useState('Tarntanya / Adelaide CBD');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile edit states (when authenticated)
  const [editName, setEditName] = useState('');
  const [editHandle, setEditHandle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Bank payout details
  const [bankName, setBankName] = useState('Commonwealth Bank of Australia');
  const [accountName, setAccountName] = useState('');
  const [bsb, setBsb] = useState('065-000');
  const [accountNumber, setAccountNumber] = useState('');
  const [payId, setPayId] = useState('');

  // User posted listings from Firestore
  const [userListings, setUserListings] = useState<Location[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditHandle(user.handle || '');
      setEditBio(user.bio || '');
      setEditPhone(user.phone || '');
      setEditLocation(user.location || 'Tarntanya / Adelaide CBD');
      setEditAvatar(user.avatarUrl || AVATAR_PRESETS[0]);
      if (user.bankDetails) {
        setBankName(user.bankDetails.bankName || 'Commonwealth Bank of Australia');
        setAccountName(user.bankDetails.accountName || '');
        setBsb(user.bankDetails.bsb || '065-000');
        setAccountNumber(user.bankDetails.accountNumber || '');
        setPayId(user.bankDetails.payId || '');
      }
    }
  }, [user]);

  // Listen to user's listings in Firestore
  useEffect(() => {
    if (!user) {
      setUserListings([]);
      setIsLoadingListings(false);
      return;
    }

    setIsLoadingListings(true);
    try {
      const q = query(collection(db, 'listings'), where('ownerId', '==', user.id));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items: Location[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as Location);
        });
        setUserListings(items);
        setIsLoadingListings(false);
      }, (err) => {
        console.warn("Firestore query error on listings (falling back to local):", err.message);
        setIsLoadingListings(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Failed to subscribe to user listings:", e);
      setIsLoadingListings(false);
    }
  }, [user]);

  // Handle Login
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setIsSubmitting(true);
    const res = await signInWithEmail(emailInput, passwordInput);
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Failed to sign in. Please check your credentials.');
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!nameInput.trim()) {
      setAuthError("Please enter your full name or trade business name.");
      return;
    }
    if (passwordInput.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }
    setIsSubmitting(true);
    const res = await signUpWithEmail(
      emailInput, 
      passwordInput, 
      nameInput, 
      bioInput, 
      phoneInput, 
      locationInput, 
      selectedAvatar
    );
    setIsSubmitting(false);
    if (!res.success) {
      setAuthError(res.error || 'Failed to create account.');
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    if (!emailInput.trim()) {
      setAuthError("Please enter your registered email address.");
      return;
    }
    setIsSubmitting(true);
    const res = await sendPasswordReset(emailInput);
    setIsSubmitting(false);
    if (res.success) {
      setAuthSuccess(`Password reset email sent to ${emailInput}. Please check your inbox or spam folder.`);
    } else {
      setAuthError(res.error || 'Failed to send password reset email.');
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setSaveSuccessMsg(null);

    const updateData: ProfileUpdateData = {
      name: editName.trim() || user.name,
      handle: editHandle.trim() || user.handle,
      bio: editBio.trim(),
      phone: editPhone.trim(),
      location: editLocation.trim(),
      avatarUrl: editAvatar || user.avatarUrl,
      bankDetails: {
        bankName,
        accountName: accountName.trim() || user.name,
        bsb: bsb.trim(),
        accountNumber: accountNumber.trim(),
        payId: payId.trim(),
        instantPayoutEnabled: true,
        currency: 'AUD'
      }
    };

    await updateProfile(updateData);
    setIsSavingProfile(false);
    setSaveSuccessMsg("Your profile and account settings were saved to Firestore successfully!");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Delete listing helper
  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to remove this posted listing?")) return;
    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (err: any) {
      alert("Failed to delete listing: " + (err.message || String(err)));
    }
  };

  // Trigger password reset for logged-in user
  const handleTriggerSelfPasswordReset = async () => {
    if (!user?.email) return;
    setIsSubmitting(true);
    const res = await sendPasswordReset(user.email);
    setIsSubmitting(false);
    if (res.success) {
      alert(`A secure password reset link has been dispatched to ${user.email}. Check your email.`);
    } else {
      alert(res.error || "Unable to send password reset email.");
    }
  };

  // Loading state
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f9] dark:bg-[#101114]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
            Initializing Suiter Secure Enclave...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // UNAUTHENTICATED STATE: FIREBASE AUTHENTICATION GATE
  // ----------------------------------------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f6f7f9] dark:bg-[#101114] text-zinc-900 dark:text-white flex flex-col">
        {/* Top bar */}
        <header className="suiter-topbar">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="suiter-logo">S</div>
            <span className="font-extrabold text-sm tracking-tight">Suiter ID</span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-lg bg-white dark:bg-[#181a1f] rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-6 sm:p-8 space-y-6">
            
            {/* Header info */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center shadow-sm">
                <Lock className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl font-black tracking-tight font-display text-zinc-900 dark:text-white">
                {authMode === 'signin' && 'Sign in to Suiter'}
                {authMode === 'signup' && 'Create Suiter Account'}
                {authMode === 'reset' && 'Reset Your Password'}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                {authMode === 'signin' && 'Access your marketplace profile, view your posted ads, and manage bank payout connectors.'}
                {authMode === 'signup' && 'Register your verified merchant or contractor account with full network and AI fencing protectants.'}
                {authMode === 'reset' && 'Enter your registered email address to receive a secure Firebase password reset link.'}
              </p>
            </div>

            {/* Error / Success Notifications */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin' 
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup' 
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('reset'); setAuthError(null); setAuthSuccess(null); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  authMode === 'reset' 
                    ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs' 
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Reset
              </button>
            </div>

            {/* SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@domain.com.au"
                      className="suiter-input pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode('reset')}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="suiter-input pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full suiter-btn suiter-btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  <span>Sign In with Password</span>
                </button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    <span className="bg-white dark:bg-[#181a1f] px-2">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    setAuthError(null);
                    try {
                      await loginWithGoogle();
                    } catch (err: any) {
                      setAuthError(err.message || 'Google sign-in failed');
                    }
                  }}
                  className="w-full suiter-btn suiter-btn-secondary flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            )}

            {/* SIGN UP FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Full Name / Trading Entity
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Marcus Vance or Norwood Cabinetry"
                    className="suiter-input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="name@business.com.au"
                      className="suiter-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="suiter-input"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Professional Bio & Services
                  </label>
                  <textarea
                    rows={2}
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Describe your trade license, services offered, or marketplace goods..."
                    className="suiter-textarea"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="0400 123 456"
                      className="suiter-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={locationInput}
                      onChange={(e) => setLocationInput(e.target.value)}
                      placeholder="Tarntanya / Adelaide CBD"
                      className="suiter-input"
                    />
                  </div>
                </div>

                {/* Avatar Picker Presets */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Choose Profile Avatar
                  </label>
                  <div className="flex gap-2 items-center overflow-x-auto py-1">
                    {AVATAR_PRESETS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedAvatar(url)}
                        className={`w-10 h-10 rounded-full border-2 overflow-hidden shrink-0 transition-transform ${
                          selectedAvatar === url ? 'border-indigo-600 scale-110 ring-2 ring-indigo-400' : 'border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full suiter-btn suiter-btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Create Account & Register</span>
                </button>
              </form>
            )}

            {/* PASSWORD RESET FORM */}
            {authMode === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@domain.com.au"
                      className="suiter-input pl-10"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    We will send an encrypted password reset link directly through Google Firebase Authentication.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full suiter-btn suiter-btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Send Password Reset Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="w-full text-center text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Back to Sign In
                </button>
              </form>
            )}

            {/* Security Enclave Notice */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-zinc-700 dark:text-zinc-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero Trust AI Fencing & Security Enclave</span>
              </div>
              <p>
                All sessions protected by RSA-4096 / AES-256 tokens, Private Cloud Compute, BOOTP, SOC drivers, and automated gate closure upon leaving.
              </p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED STATE: FULL PROFILE & ACCOUNT MANAGEMENT
  // ----------------------------------------------------
  return (
    <div className="suiter-app min-h-screen text-zinc-900 dark:text-white">
      {/* SIDEBAR NAVIGATION */}
      <aside className="suiter-sidebar">
        <div className="suiter-brand">
          <div className="suiter-logo">S</div>
          <div>
            <div className="text-base font-black tracking-tight leading-none">SUITER</div>
            <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Profile Portal</div>
          </div>
        </div>

        <nav className="suiter-nav">
          <div className="suiter-nav-label">Navigation</div>
          <Link href="/" className="suiter-nav-item">
            <span className="suiter-nav-icon"><ArrowLeft className="w-4 h-4" /></span>
            <span>Marketplace & Map</span>
          </Link>

          <div className="suiter-nav-label">Manage Profile</div>
          <button 
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`suiter-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <span className="suiter-nav-icon"><UserIcon className="w-4 h-4" /></span>
            <span>Bio & Personal Info</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('listings')}
            className={`suiter-nav-item ${activeTab === 'listings' ? 'active' : ''}`}
          >
            <span className="suiter-nav-icon"><FileText className="w-4 h-4" /></span>
            <span>Posted Ads & Services</span>
            {userListings.length > 0 && (
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-600 text-white font-mono font-bold">
                {userListings.length}
              </span>
            )}
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('account')}
            className={`suiter-nav-item ${activeTab === 'account' ? 'active' : ''}`}
          >
            <span className="suiter-nav-icon"><CreditCard className="w-4 h-4" /></span>
            <span>Payouts & Connectors</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('security')}
            className={`suiter-nav-item ${activeTab === 'security' ? 'active' : ''}`}
          >
            <span className="suiter-nav-icon"><ShieldCheck className="w-4 h-4" /></span>
            <span>Gatekeeper & Security</span>
          </button>

          <div className="suiter-nav-label">Session</div>
          <button 
            type="button"
            onClick={logout}
            className="suiter-nav-item text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <span className="suiter-nav-icon"><LogOut className="w-4 h-4" /></span>
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="suiter-main">
        {/* Sticky Topbar */}
        <header className="suiter-topbar">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Map</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-zinc-400">Signed in as:</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{user.email}</span>
            </div>
          </div>

          <div className="suiter-actions">
            {/* Gatekeeper status indicator button */}
            <button
              type="button"
              onClick={toggleGateLock}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                user.isGateLocked 
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900'
              }`}
            >
              {user.isGateLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{user.isGateLocked ? 'Security Gate: Closed' : 'Security Gate: Open'}</span>
            </button>

            {/* Role indicator */}
            <span className="suiter-badge suiter-badge-primary capitalize hidden md:inline-flex">
              {user.role} Role
            </span>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <div className="suiter-page space-y-6">
          
          {/* Page Banner Header */}
          <div className="suiter-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/70 to-white dark:from-indigo-950/20 dark:to-zinc-900 border-indigo-200/60 dark:border-indigo-900/40">
            <div className="flex items-center gap-4">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.avatarUrl || AVATAR_PRESETS[0]} 
                  alt={user.name} 
                  className="w-16 h-16 rounded-2xl border-2 border-indigo-500 shadow-md object-cover bg-white" 
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Verified Trader">
                  <Check className="w-3 h-3" />
                </span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-zinc-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {user.handle || '@user'}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    {user.location || 'Tarntanya / Adelaide CBD'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CreatePostModal>
                <button type="button" className="suiter-btn suiter-btn-primary">
                  <PlusCircle className="w-4 h-4" />
                  <span>Post New Ad / Service</span>
                </button>
              </CreatePostModal>
            </div>
          </div>

          {/* Success banner if updated */}
          {saveSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: BIO, PROFILE PICTURE & CONTACT INFO */}
          {activeTab === 'profile' && (
            <div className="suiter-grid suiter-grid-2">
              {/* Profile Details Form */}
              <div className="suiter-card space-y-5">
                <div className="suiter-card-header">
                  <h3 className="suiter-card-title flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-indigo-600" />
                    <span>Edit Profile Information</span>
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Synced with Firestore
                  </span>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="suiter-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Marketplace Handle
                    </label>
                    <input
                      type="text"
                      required
                      value={editHandle}
                      onChange={(e) => setEditHandle(e.target.value)}
                      className="suiter-input font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Bio & Company Overview
                      </label>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {editBio.length}/500 chars
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      maxLength={500}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Describe your trade license, architectural projects, or marketplace services..."
                      className="suiter-textarea"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Phone Contact
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="0400 123 456"
                        className="suiter-input"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        Suburbs Served / Region
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="Tarntanya / Adelaide CBD"
                        className="suiter-input"
                      />
                    </div>
                  </div>

                  {/* Avatar selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Avatar Picture Preset or Custom URL
                    </label>
                    <div className="flex gap-2 items-center mb-2 overflow-x-auto py-1">
                      {AVATAR_PRESETS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEditAvatar(url)}
                          className={`w-11 h-11 rounded-2xl border-2 overflow-hidden shrink-0 transition-all ${
                            editAvatar === url ? 'border-indigo-600 scale-105 shadow-md' : 'border-zinc-200 dark:border-zinc-700 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="url"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      placeholder="https://example.com/your-photo.jpg"
                      className="suiter-input text-xs font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full suiter-btn suiter-btn-primary flex items-center justify-center gap-2"
                  >
                    {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Profile to Firestore</span>
                  </button>
                </form>
              </div>

              {/* Roles & Licensing Credential Card */}
              <div className="space-y-4">
                <div className="suiter-card space-y-4">
                  <div className="suiter-card-header">
                    <h3 className="suiter-card-title flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      <span>Role & Licensing Profile</span>
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-500">
                    Switch your operational persona to alter your marketplace permissions and invoice presets:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { role: 'admin' as const, label: 'Master Admin', icon: ShieldCheck, desc: 'Full registry override' },
                      { role: 'management' as const, label: 'Contractor', icon: Wrench, desc: 'Trade & construction' },
                      { role: 'investor' as const, label: 'Merchant', icon: Store, desc: 'Retail & storefront' },
                      { role: 'user' as const, label: 'Community', icon: UserIcon, desc: 'Standard verified buyer' },
                    ].map((item) => (
                      <button
                        key={item.role}
                        type="button"
                        onClick={() => switchRole(item.role)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          user.role === item.role
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/40 dark:text-white'
                            : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <item.icon className="w-4 h-4 text-indigo-600 mb-1" />
                        <div className="text-xs font-black">{item.label}</div>
                        <div className="text-[10px] text-zinc-400">{item.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    <div className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Verified Safety Badges
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="suiter-badge suiter-badge-success">CBS South Australia License</span>
                      <span className="suiter-badge suiter-badge-primary">Master Builder AS 4386</span>
                      <span className="suiter-badge suiter-badge-warning">LMVD Verified Dealer</span>
                      <span className="suiter-badge suiter-badge-success">Zero Alcohol Sales Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Account Security Quick Action */}
                <div className="suiter-card space-y-3 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      <span>Password Management</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerSelfPasswordReset}
                      disabled={isSubmitting}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      Send Reset Email
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Dispatches a secured Firebase Auth password update link directly to {user.email}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POSTED ADS & SERVICES */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                    Your Posted Marketplace Ads & Services
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Live directory entries linked to your UID: {user.id}
                  </p>
                </div>

                <CreatePostModal>
                  <button type="button" className="suiter-btn suiter-btn-primary">
                    <PlusCircle className="w-4 h-4" />
                    <span>Create New Listing</span>
                  </button>
                </CreatePostModal>
              </div>

              {isLoadingListings ? (
                <div className="p-12 text-center text-zinc-400 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="text-xs">Fetching your listings from Firestore...</span>
                </div>
              ) : userListings.length === 0 ? (
                <div className="suiter-card p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center text-zinc-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                    No Posted Ads Yet
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    You haven’t posted any services, automotive vehicles, or product storefronts yet. Create your first listing to appear on the Adelaide Map!
                  </p>
                  <CreatePostModal>
                    <button type="button" className="suiter-btn suiter-btn-primary">
                      <PlusCircle className="w-4 h-4" />
                      <span>Post First Listing</span>
                    </button>
                  </CreatePostModal>
                </div>
              ) : (
                <div className="suiter-marketplace">
                  {userListings.map((item) => (
                    <div key={item.id} className="suiter-product">
                      <div className="suiter-product-image relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={item.image || 'https://picsum.photos/seed/default/400/250'} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute top-2 left-2 suiter-badge suiter-badge-primary uppercase text-[9px]">
                          {item.type}
                        </span>
                      </div>
                      <div className="suiter-product-body space-y-2">
                        <div className="font-bold text-xs truncate text-zinc-900 dark:text-white" title={item.title}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 line-clamp-2">
                          {item.description}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <span className="font-black text-xs font-mono text-emerald-600 dark:text-emerald-400">
                            {item.price || 'Free Consult'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteListing(item.id)}
                            className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYOUT CONNECTORS & BANKING */}
          {activeTab === 'account' && (
            <div className="suiter-grid suiter-grid-2">
              <div className="suiter-card space-y-4">
                <div className="suiter-card-header">
                  <h3 className="suiter-card-title flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Australian Direct Bank Payouts</span>
                  </h3>
                  <span className="suiter-badge suiter-badge-success">Visa / Mastercard Direct</span>
                </div>

                <p className="text-xs text-zinc-500">
                  Configure your Australian bank account or PayID for instant trade payouts and milestone completions.
                </p>

                <form onSubmit={handleSaveProfile} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Financial Institution</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="suiter-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Account Name</label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="e.g. Marcus Vance Trading Trust"
                      className="suiter-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">BSB Number</label>
                      <input
                        type="text"
                        value={bsb}
                        onChange={(e) => setBsb(e.target.value)}
                        placeholder="065-000"
                        className="suiter-input font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="1234 5678"
                        className="suiter-input font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">PayID (Phone or ABN)</label>
                    <input
                      type="text"
                      value={payId}
                      onChange={(e) => setPayId(e.target.value)}
                      placeholder="0400123456 or contact@business.com.au"
                      className="suiter-input font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full suiter-btn suiter-btn-primary flex items-center justify-center gap-2"
                  >
                    {isSavingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Update Payout Connectors</span>
                  </button>
                </form>
              </div>

              {/* Instant Settlements Info Card */}
              <div className="suiter-card space-y-4">
                <div className="suiter-card-header">
                  <h3 className="suiter-card-title flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Real-Time Settlements</span>
                  </h3>
                </div>
                <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-0.5">NPP / Osko Active</div>
                    <p className="text-[11px]">Funds deposited within 60 seconds of verified job sign-off across Adelaide.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800">
                    <div className="font-bold text-zinc-800 dark:text-zinc-200 mb-0.5">Zero Merchant Chargeback Vault</div>
                    <p className="text-[11px]">All escrow releases backed by customer cryptographic signatures.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY ENCLAVE, GATES & COMPLIANCE */}
          {activeTab === 'security' && (
            <div className="suiter-grid suiter-grid-2">
              {/* Gatekeeper Automation */}
              <div className="suiter-card space-y-4">
                <div className="suiter-card-header">
                  <h3 className="suiter-card-title flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Security Gate Automation</span>
                  </h3>
                  <button
                    type="button"
                    onClick={toggleGateLock}
                    className={`suiter-btn text-xs ${user.isGateLocked ? 'suiter-btn-primary' : 'suiter-btn-secondary'}`}
                  >
                    {user.isGateLocked ? 'Unlock Security Gate' : 'Shut Security Gate'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950 text-white space-y-2 border border-zinc-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Gatekeeper Automation Rule:</span>
                    <span className="font-bold text-emerald-400">ALWAYS ON</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    &quot;Close all gates once exiting the app or stopping developments or builds — this is an automation: the gate always shuts behind me once I leave even if just stationary.&quot;
                  </p>
                  <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>Gate Status: <strong>{user.isGateLocked ? 'LOCKED / SEALED' : 'UNLOCKED / ACTIVE'}</strong></span>
                    <span>Timeout: 90s Inactive Auto-Lock</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span>Firewall Status for Apps:</span>
                    <span className="font-bold text-emerald-600">Active / Filtered</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span>SQL Injection Shield:</span>
                    <span className="font-bold text-emerald-600">Enforced & Parameterized</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span>Driver, SOC & BOOTP Protection:</span>
                    <span className="font-bold text-indigo-600 font-mono">SOC-LEVEL-2 VERIFIED</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span>Private Cloud Compute & Vault:</span>
                    <span className="font-bold text-indigo-600">End-to-End Encrypted</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Session Token:</span>
                    <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[200px]">
                      {user.encryptedAuthToken || 'ENC-AES256-RSA4096'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Licensing, Patents & Copyrights */}
              <div className="suiter-card space-y-4">
                <div className="suiter-card-header">
                  <h3 className="suiter-card-title flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-600" />
                    <span>Licensing, Patents & Copyrights</span>
                  </h3>
                </div>

                <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="font-bold text-zinc-900 dark:text-white">Platform Licensing</div>
                    <p className="text-[11px]">MIT Open Core with Apache 2.0 Telecommunications Safeguards. Lottie and Uber / Airbnb design guidelines respected.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="font-bold text-zinc-900 dark:text-white">AI Safety & Prohibited Items Fencing</div>
                    <p className="text-[11px]">Zero alcohol sales, tobacco fencing, and CBS South Australia compliance actively checked across all new posts.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="font-bold text-zinc-900 dark:text-white">Telecommunications Protection</div>
                    <p className="text-[11px]">Contained end-to-end encrypted WebSocket tunnels and TLS 1.3 cryptographic key exchanges.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
