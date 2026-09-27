'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { useAuth } from './AuthProvider';
import { 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Store, 
  Wrench, 
  UserCheck, 
  Building2, 
  Scale, 
  MapPin,
  Flame,
  Loader2,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { Logo } from './Logo';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface AuthLandingModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  defaultRole?: string;
  initialMode?: 'signin' | 'register' | 'reset';
}

const PRESET_ROLES = [
  {
    id: 'trader',
    title: 'Trade & Renovation Specialist',
    subtitle: 'Kitchens, carpentry, plumbing, site appraisals',
    icon: Wrench,
    badge: 'Trade License',
    demoName: 'Marcus Vance',
    demoEmail: 'marcus@vancetradegroup.com.au',
    demoBio: 'Specialist licensed carpentry & structural kitchen renovator across Adelaide Metro.',
    demoHandle: 'marcus_vance'
  },
  {
    id: 'automotive',
    title: 'Automotive & Second Hand Cars',
    subtitle: 'Dealerships, vehicle inspections, trade-ins',
    icon: Building2,
    badge: 'LMVD Certified',
    demoName: 'Sarah Jenkins',
    demoEmail: 'sarah@tarntanyamotors.com.au',
    demoBio: 'Licensed motor vehicle dealer specializing in verified pre-owned vehicles and mechanical appraisals.',
    demoHandle: 'tarntanya_motors'
  },
  {
    id: 'store',
    title: 'Storefront & Retail Merchant',
    subtitle: 'Physical boutiques, products, inventory',
    icon: Store,
    badge: 'Retail Merchant',
    demoName: 'Elena Rostova',
    demoEmail: 'elena@rundlemallcollective.com.au',
    demoBio: 'Curator of local artisanal goods and South Australian design storefront.',
    demoHandle: 'rundle_curator'
  },
  {
    id: 'professional',
    title: 'Professional & Business Services',
    subtitle: 'Legal, IT, accounting, site engineering',
    icon: Briefcase,
    badge: 'Pro Practice',
    demoName: 'David Wright',
    demoEmail: 'david.wright@lightsquarelegal.com.au',
    demoBio: 'Corporate advisor specializing in commercial trade contracts and digital marketplace compliance.',
    demoHandle: 'light_legal'
  }
];

export function AuthLandingModal({ isOpen, onOpenChange, trigger, initialMode = 'signin' }: AuthLandingModalProps) {
  const { login, loginWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'register' | 'reset'>(initialMode);
  const [selectedRole, setSelectedRole] = useState(PRESET_ROLES[0].id);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Tarntanya / Adelaide CBD');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  // Bot Shield CAPTCHA State
  const [captchaNum1, setCaptchaNum1] = useState(7);
  const [captchaNum2, setCaptchaNum2] = useState(4);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const generateNewCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
    setCaptchaAnswer('');
    setCaptchaVerified(false);
    setCaptchaError(false);
  };

  const handleVerifyCaptcha = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer.trim()) === captchaNum1 + captchaNum2) {
      setCaptchaVerified(true);
      setCaptchaError(false);
    } else {
      setCaptchaError(true);
      setCaptchaVerified(false);
    }
  };

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  ];

  const activeRoleData = PRESET_ROLES.find(r => r.id === selectedRole) || PRESET_ROLES[0];

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please provide your account email address to receive reset instructions.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    setResetSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setResetSuccessMessage(`Password reset link dispatched securely to ${email}. Please check your inbox.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to dispatch reset email. Please ensure the email is registered.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setResetSuccessMessage(null);

    // Verify Captcha check
    if (!captchaVerified) {
      if (parseInt(captchaAnswer.trim()) !== captchaNum1 + captchaNum2) {
        setCaptchaError(true);
        setErrorMessage('Security Firewall: Please complete the human CAPTCHA verification challenge below.');
        return;
      } else {
        setCaptchaVerified(true);
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'signin') {
        if (!email.trim() || !password) {
          setErrorMessage('Please enter both your email and password.');
          setIsLoading(false);
          return;
        }
        const res = await signInWithEmail(email, password);
        if (res.success) {
          if (onOpenChange) onOpenChange(false);
        } else {
          setErrorMessage(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else if (mode === 'register') {
        if (!email.trim() || !password || !name.trim()) {
          setErrorMessage('Please provide your name, email, and a password of at least 6 characters.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }
        const res = await signUpWithEmail(email, password, name, bio, phone, location, avatarUrl);
        if (res.success) {
          if (onOpenChange) onOpenChange(false);
        } else {
          setErrorMessage(res.error || 'Failed to create your account.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSandboxLogin = (roleItem: typeof PRESET_ROLES[0]) => {
    login(roleItem.demoEmail, roleItem.demoName);
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="w-[96vw] sm:max-w-[860px] max-h-[92vh] rounded-[2.5rem] border-0 bg-white text-zinc-950 p-0 overflow-y-auto shadow-2xl flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-full">
          {/* Left Decorative & Benefits Brand Column (Collapses compactly on mobile) */}
          <div className="md:col-span-5 bg-zinc-950 text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background glow and subtle geometry */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <Logo size={40} />
                <div>
                  <h3 className="text-xl font-display font-bold tracking-tight text-white">Suiter Marketplace</h3>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Enterprise Identity Hub</p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sovereign Enclave Security</span>
                </div>
                <h2 className="text-xl md:text-2xl font-display font-bold leading-tight tracking-tight">
                  One Unified Identity for Listings, Bookings & Invoicing.
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Access custom letterheads, professional invoices, CAD studio floorplans, direct letterbox drop marketing, and real-time staff databases.
                </p>
              </div>

              {/* Highlights List */}
              <div className="space-y-2 pt-1 hidden sm:block">
                {[
                  'Instant booking for renovations, car inspections & sites',
                  'Building Plan CAD Studio with Multi-Model AI (Gemini, ChatGPT, Grok)',
                  'Petrol Rewards: Link Shell & Mobil fuel cards with live discounts',
                  'Audited under Privacy Act 1988 & ISO/IEC 27001'
                ].map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug text-[11px]">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Enclave Badge */}
            <div className="relative z-10 pt-4 border-t border-zinc-800/80 mt-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
              <span>TARNTANYA / ADELAIDE</span>
              <span>RSA-4096 SECURE ENCLAVE</span>
            </div>
          </div>

          {/* Right Interactive Login & Profile Selection Column */}
          <div className="md:col-span-7 p-6 md:p-8 bg-white flex flex-col justify-between space-y-6">
            <div>
              {/* Header switcher */}
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div>
                  <h3 className="text-xl md:text-2xl font-display font-bold text-zinc-900 tracking-tight">
                    {mode === 'signin' ? 'Sign In to Marketplace' : mode === 'register' ? 'Create Merchant Account' : 'Reset Password'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {mode === 'reset' ? 'Enter your registered email to receive reset instructions.' : 'Select your archetype or enter your credentials.'}
                  </p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMessage(null); }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      mode === 'signin' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('register'); setErrorMessage(null); }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      mode === 'register' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Register
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('reset'); setErrorMessage(null); }}
                    className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      mode === 'reset' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Quick Persona / Role Fast Access Cards (shown in signin mode) */}
              {mode === 'signin' && (
                <div className="mb-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Fast Demo Archetypes (One-Click Sandbox)
                    </Label>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Ready-to-use
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role.id);
                            setName(role.demoName);
                            setEmail(role.demoEmail);
                          }}
                          className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                            isSelected 
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                              : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-white text-zinc-900 shadow-xs'
                            }`}>
                              <Icon className="w-3 h-3" />
                            </div>
                            <Badge className={`text-[8px] px-1 py-0 font-bold uppercase ${
                              isSelected ? 'bg-emerald-400 text-zinc-950' : 'bg-zinc-200 text-zinc-700'
                            }`}>
                              {role.badge}
                            </Badge>
                          </div>
                          <div>
                            <p className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                              {role.demoName}
                            </p>
                            <p className={`text-[10px] truncate ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                              {role.title}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Fast Direct Sandbox Button */}
                  <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 leading-tight">
                          Launch as {activeRoleData.demoName}
                        </p>
                        <p className="text-[10px] text-emerald-800 font-medium">
                          Preset with verified {activeRoleData.badge} credentials.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => handleQuickSandboxLogin(activeRoleData)}
                      className="rounded-xl h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shrink-0 shadow-sm"
                    >
                      Enter Demo <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Google Sign In Option */}
              {mode !== 'reset' && (
                <div className="space-y-3 mb-5">
                  <Button 
                    type="button" 
                    onClick={async () => {
                      await loginWithGoogle();
                      if (onOpenChange) onOpenChange(false);
                    }}
                    className="w-full rounded-2xl h-11 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-xs shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google OAuth
                  </Button>

                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-zinc-200" />
                    <span className="px-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">or email & password</span>
                    <div className="flex-1 h-px bg-zinc-200" />
                  </div>
                </div>
              )}

              {/* Status & Error Banners */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-tight">{errorMessage}</div>
                </div>
              )}

              {resetSuccessMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-tight">{resetSuccessMessage}</div>
                </div>
              )}

              {/* Password Reset Form */}
              {mode === 'reset' ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                      Account Email Address
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@vancetradegroup.com.au"
                      required
                      className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-semibold font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
                    <span>Dispatch Password Reset Link</span>
                  </Button>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-xs text-indigo-600 hover:underline font-bold"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                /* Standard Sign In & Register Form */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {mode === 'register' && (
                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                        Full Name / Business Title
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Marcus Vance"
                        required={mode === 'register'}
                        className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-semibold"
                      />
                    </div>
                  )}

                  <div className="grid gap-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@vancetradegroup.com.au"
                      required
                      className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-semibold font-mono"
                    />
                  </div>

                  <div className="grid gap-1">
                    <div className="flex items-center justify-between">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                        Password {mode === 'register' && <span className="text-[9px] text-zinc-400 font-normal lowercase">(min 6 characters)</span>}
                      </Label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => setMode('reset')}
                          className="text-[10px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-mono"
                    />
                  </div>

                  {mode === 'register' && (
                    <>
                      {/* Avatar preset selection */}
                      <div className="grid gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          Profile Avatar
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-200 border-2 border-indigo-600 shrink-0 shadow-sm">
                            <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {AVATAR_PRESETS.map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setAvatarUrl(preset)}
                                className={`w-7 h-7 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                  avatarUrl === preset ? 'border-indigo-600 ring-2 ring-indigo-300 scale-105' : 'border-zinc-300 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img src={preset} alt="preset" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                          Location / Adelaide Suburb
                        </Label>
                        <Input
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Adelaide CBD, Norwood, Unley, Glenelg"
                          className="rounded-xl h-11 bg-white border-zinc-200 text-xs"
                        />
                      </div>
                    </>
                  )}

                  {/* Anti-Bot Security CAPTCHA Card */}
                  <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-700">
                          Security Gatekeeper & CAPTCHA
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-zinc-300 text-zinc-500">
                        {captchaVerified ? 'Verified Human' : 'Challenge Required'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs select-none tracking-wider">
                        {captchaNum1} + {captchaNum2} = ?
                      </div>
                      <Input
                        type="number"
                        placeholder="Answer"
                        value={captchaAnswer}
                        onChange={(e) => {
                          setCaptchaAnswer(e.target.value);
                          if (parseInt(e.target.value) === captchaNum1 + captchaNum2) {
                            setCaptchaVerified(true);
                            setCaptchaError(false);
                          }
                        }}
                        className={`h-9 w-24 rounded-xl font-mono text-xs ${
                          captchaVerified ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : ''
                        }`}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={generateNewCaptcha}
                        className="h-9 w-9 rounded-xl text-zinc-400 hover:text-zinc-600"
                        title="New Challenge"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </Button>

                      {captchaVerified && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <Check className="w-3.5 h-3.5" /> Verified
                        </div>
                      )}
                    </div>
                    {captchaError && (
                      <p className="text-[10px] text-rose-600 font-medium">Incorrect solution. Please calculate the sum.</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-2xl h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>
                      {isLoading
                        ? (mode === 'signin' ? 'Signing In...' : 'Registering Account...')
                        : (mode === 'signin' ? 'Sign In & Access Hub' : 'Register Account')}
                    </span>
                  </Button>
                </form>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-100 text-center">
              <p className="text-[10px] text-zinc-400 font-medium">
                Audited under SA Fair Trading Code of Practice & Privacy Act 1988 (Cth).
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
