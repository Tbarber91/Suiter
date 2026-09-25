'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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
  AlertCircle
} from 'lucide-react';
import { Logo } from './Logo';

interface AuthLandingModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  defaultRole?: string;
}

const PRESET_ROLES = [
  {
    id: 'trader',
    title: 'Trade & Renovation Specialist',
    subtitle: 'Kitchens, carpentry, plumbing, site appraisals',
    icon: Wrench,
    badge: 'Licensed Trade',
    demoName: 'Marcus Vance',
    demoEmail: 'marcus.vance@vancetradegroup.com.au',
    demoBio: 'Master builder & bespoke kitchen renovation specialist in Adelaide with 15+ years experience.',
    demoHandle: 'vance_kitchens'
  },
  {
    id: 'auto',
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

export function AuthLandingModal({ isOpen, onOpenChange, trigger }: AuthLandingModalProps) {
  const { login, loginWithGoogle, signInWithEmail, signUpWithEmail, user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
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

  const AVATAR_PRESETS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  ];

  const activeRoleData = PRESET_ROLES.find(r => r.id === selectedRole) || PRESET_ROLES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
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
      } else {
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
      <DialogContent className="sm:max-w-[840px] rounded-[2.5rem] border-0 glass p-0 max-h-[90vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
          {/* Left Decorative & Benefits Brand Column */}
          <div className="md:col-span-5 bg-zinc-950 text-white p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background glow and subtle geometry */}
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <Logo size={42} />
                <div>
                  <h3 className="text-xl font-display font-bold tracking-tight text-white">Suiter Marketplace</h3>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest">Enterprise Identity Hub</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sovereign Enclave Security</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-display font-bold leading-tight tracking-tight">
                  One Unified Identity for Listings, Bookings & Invoicing.
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Instantly access your custom letterheads, professional invoices, business cards, direct letterbox drop marketing, and real-time staff databases.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {[
                  'Instant booking for renovations, car inspections & sites',
                  'Individualized business cards & invoice generator',
                  'Direct mail & letterbox flyer distribution (Adelaide Metro)',
                  'Full staff roster & certified trade database',
                  'Audited under Privacy Act 1988 & ISO/IEC 27001'
                ].map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Enclave Badge */}
            <div className="relative z-10 pt-6 border-t border-zinc-800/80 mt-6 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>TARNTANYA / ADELAIDE</span>
              <span>RSA-4096 ENCLAVE</span>
            </div>
          </div>

          {/* Right Interactive Login & Profile Selection Column */}
          <div className="md:col-span-7 p-8 overflow-y-auto max-h-[90vh] bg-white flex flex-col justify-between">
            <div>
              {/* Header switcher */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-display font-bold text-zinc-900 tracking-tight">
                    {mode === 'signin' ? 'Sign In to Marketplace' : 'Create Merchant Account'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select your business archetype or enter your verified credentials.
                  </p>
                </div>
                <div className="flex bg-zinc-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mode === 'signin' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      mode === 'register' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Quick Persona / Role Fast Access Cards */}
              <div className="mb-6 space-y-2">
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
                        className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between group cursor-pointer ${
                          isSelected 
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' 
                            : 'bg-zinc-50 hover:bg-zinc-100/80 border-zinc-200 text-zinc-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white text-zinc-900 shadow-xs'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <Badge className={`text-[8px] px-1.5 py-0 font-bold uppercase ${
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
              </div>

              {/* Fast Direct Button for selected archetype */}
              <div className="mb-6 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">
                      Launch as {activeRoleData.demoName}
                    </p>
                    <p className="text-[10px] text-emerald-800 font-medium">
                      Loaded with verified {activeRoleData.badge} credentials & tool access.
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  type="button"
                  onClick={() => handleQuickSandboxLogin(activeRoleData)}
                  className="rounded-xl h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer shrink-0 shadow-sm"
                >
                  Enter Demo <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {/* Google Sign In */}
              <div className="space-y-3 mb-6">
                <Button 
                  type="button" 
                  onClick={async () => {
                    await loginWithGoogle();
                    if (onOpenChange) onOpenChange(false);
                  }}
                  className="w-full rounded-2xl h-12 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-900 font-bold text-xs shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer"
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
                  <span className="px-3 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">or custom account</span>
                  <div className="flex-1 h-px bg-zinc-200" />
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-tight">{errorMessage}</div>
                </div>
              )}

              {/* Standard Form */}
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
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                    Password {mode === 'register' && <span className="text-[9px] text-zinc-400 font-normal lowercase">(min 6 characters)</span>}
                  </Label>
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
                    {/* Profile Picture / Avatar Picker */}
                    <div className="grid gap-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Profile Picture
                      </Label>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-200 border-2 border-indigo-600 shrink-0 shadow-sm">
                          <img src={avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                            Choose an avatar preset:
                          </span>
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
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                        Location / Territory
                      </Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Adelaide CBD, Norwood, Glenelg"
                        className="rounded-xl h-11 bg-white border-zinc-200 text-xs"
                      />
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">
                        Short Bio / About Yourself
                      </Label>
                      <Input
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Specialist in bespoke local services, renovations, or trade..."
                        className="rounded-xl h-11 bg-white border-zinc-200 text-xs"
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-2xl h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>
                    {isLoading
                      ? (mode === 'signin' ? 'Signing In...' : 'Registering Account...')
                      : (mode === 'signin' ? 'Sign In & Access Hub' : 'Register Account')}
                  </span>
                </Button>
              </form>
            </div>

            <div className="pt-4 border-t border-zinc-100 text-center">
              <p className="text-[10px] text-zinc-400 font-medium">
                By entering, you attest adherence to the SA Fair Trading Code of Practice & Privacy Act 1988.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
