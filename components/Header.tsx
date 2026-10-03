'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Search, MapPin, Plus, Sparkles, Mic, Video, Shield, Lock, Unlock, Crown, Briefcase, TrendingUp, KeyRound, MessageSquare, Scale, User as UserIcon, Settings, ShieldCheck, Download, CheckCircle2, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Logo } from './Logo';

import { CreatePostModal } from './CreatePostModal';
import { SecurityGateModal } from './SecurityGateModal';
import { MessagesModal } from './MessagesModal';
import { ChatModal } from './ChatModal';
import { GovernanceSection } from './GovernanceSection';
import { GovernanceModal } from './GovernanceModal';
import { DirectoryModal } from './DirectoryModal';
import { InstantBookingModal } from './InstantBookingModal';
import { BusinessCollateralModal } from './BusinessCollateralModal';
import { AuthLandingModal } from './AuthLandingModal';
import { StaffManagementModal } from './StaffManagementModal';
import { AdvertisingDirectMailModal } from './AdvertisingDirectMailModal';
import { BusinessProfileModal } from './BusinessProfileModal';
import { SubscriptionAndDeploymentModal } from './SubscriptionAndDeploymentModal';
import { UserProfileModal } from './UserProfileModal';
import { GoogleAdsModal } from './GoogleAdsModal';
import { AppleMapsAdModal } from './AppleMapsAdModal';
import { AppleAdvertisingBudgetModal } from './AppleAdvertisingBudgetModal';
import { PaymentConnectorsModal } from './PaymentConnectorsModal';
import { VoiceSearchButton } from './VoiceSearchButton';
import { BuildingPlanCADStudioModal } from './BuildingPlanCADStudioModal';
import { PetrolRewardsModal } from './PetrolRewardsModal';
import { DriverOperationsModal } from './DriverOperationsModal';
import { CloudAndPilotModal } from './CloudAndPilotModal';
import { BookOpen, Calendar, Printer, Mail, Users, CreditCard, Rocket, X, Menu, Compass, Fuel, Car, Plane } from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Header({ searchQuery = '', onSearchChange }: HeaderProps = {}) {
  const { user, login, loginWithGoogle, logout, updateProfile, isAuthReady } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'governance' | 'settings'>('profile');
  const [isGovernanceOpen, setIsGovernanceOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<{ name: string; handle: string; listingTitle?: string } | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editHandle, setEditHandle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  // Privacy & Settings toggles
  const [sovereignHosting, setSovereignHosting] = useState(true);
  const [strictZeroTracking, setStrictZeroTracking] = useState(true);
  const [complianceAlerts, setComplianceAlerts] = useState(true);
  const [isExportingData, setIsExportingData] = useState(false);

  const handleExportUserData = () => {
    setIsExportingData(true);
    try {
      const exportPayload = {
        exportDate: new Date().toISOString(),
        jurisdictionStandard: 'Privacy Act 1988 (Cth) APP 12 & GDPR Article 20',
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          handle: user?.handle,
          bio: user?.bio,
          phone: user?.phone,
          role: user?.role,
          isCertified: user?.isCertified,
          isRegulatoryCompliant: user?.isRegulatoryCompliant,
          isVerifiedExperience: user?.isVerifiedExperience,
          encryptedAuthToken: user?.encryptedAuthToken,
        },
        settings: {
          sovereignHosting,
          strictZeroTracking,
          complianceAlerts,
        }
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Suiter_Profile_Data_Export_${user?.name?.replace(/\s+/g, '_') || 'User'}.json`;
      document.body.appendChild(a);
      a.click();
      if (a.parentNode) {
        a.parentNode.removeChild(a);
      }
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export data:', e);
    } finally {
      setTimeout(() => setIsExportingData(false), 800);
    }
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      name: editName,
      handle: editHandle,
      bio: editBio,
      phone: editPhone,
      avatarUrl: editAvatarUrl || user?.avatarUrl,
      isCertified: true,
      isRegulatoryCompliant: true,
      isVerifiedExperience: true,
    });
    setIsProfileOpen(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      login(email, name);
      setIsLoginOpen(false);
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    setIsLoginOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Logo size={48} />
          <div className="flex flex-col">
            <span className="text-2xl font-display font-bold tracking-tight gradient-text leading-none">Suiter</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Enterprise</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-8">
          <div className="relative w-full max-w-xl hidden md:flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search shops, products, and services..."
              className="w-full h-11 rounded-2xl bg-zinc-100/50 border-0 pl-11 pr-28 focus-visible:bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-300 transition-all text-xs font-semibold"
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              {searchQuery && onSearchChange && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="w-6 h-6 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {onSearchChange && (
                <VoiceSearchButton
                  onSearchChange={onSearchChange}
                  currentValue={searchQuery}
                  size="sm"
                  variant="header"
                />
              )}
              <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-[10px] h-7 border-zinc-200 font-mono hidden xl:flex">⌘ K</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Access Tools */}
          <DirectoryModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Yellow & White Pages Directory"
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Directory</span>
              </Button>
            }
          />

          <InstantBookingModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden xl:flex rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Instant Bookings for Kitchens, Cars, Sites & Apps"
              >
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Bookings</span>
              </Button>
            }
          />

          <BusinessCollateralModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden xl:flex rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Business Collateral: Letterheads, Invoices, Business Cards"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                <span>Invoices & Cards</span>
              </Button>
            }
          />

          <SubscriptionAndDeploymentModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex rounded-2xl h-10 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-sm"
                title="Subscription Fees, BootP Enclave, Maritime Logistics & Deployment"
              >
                <Rocket className="w-4 h-4 text-indigo-600" />
                <span>Deploy & Enclave</span>
              </Button>
            }
          />

          <PaymentConnectorsModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex rounded-2xl h-10 border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-sm"
                title="Payout Connectors: Bank Account, Visa Direct, Mastercard Send, Apple Wallet, Google Wallet"
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Wallets & Payouts</span>
                <span className="bg-emerald-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider">
                  BSB / Cards
                </span>
              </Button>
            }
          />

          <GoogleAdsModal />

          <AppleAdvertisingBudgetModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="flex rounded-2xl h-10 border-indigo-500/50 bg-zinc-950 text-white hover:bg-zinc-900 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-md shadow-indigo-950/20"
                title="Apple Advertising, Total Media Budget, Invoicing & Instant Payout"
              >
                <span className="text-white font-bold text-sm leading-none"></span>
                <span className="hidden sm:inline">Apple Ads & Budget</span>
                <span className="sm:hidden"> Ads</span>
                <span className="bg-emerald-500 text-zinc-950 font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider ml-0.5">
                  Instant Payout
                </span>
              </Button>
            }
          />

          <AppleMapsAdModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex rounded-2xl h-10 border-indigo-200 bg-zinc-950 text-white hover:bg-zinc-900 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-sm"
                title="Direct Apple Maps Advertising & Location Pinning"
              >
                <span className="text-indigo-400 font-bold text-sm leading-none"></span>
                <span>Apple Maps</span>
              </Button>
            }
          />

          {/* Building Plan CAD Studio (Desktop Quick Tool) */}
          <BuildingPlanCADStudioModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex rounded-2xl h-10 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-xs"
                title="Building Plan CAD Studio (2D Room Sketcher & Multi-Model AI Advisor)"
              >
                <Compass className="w-4 h-4 text-indigo-600" />
                <span>CAD Studio</span>
              </Button>
            }
          />

          {/* Petrol Rewards (Desktop Quick Tool) */}
          <PetrolRewardsModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex rounded-2xl h-10 border-amber-300 bg-amber-50/60 hover:bg-amber-100/70 text-amber-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-xs"
                title="Shell & Mobil Petrol Rewards, Pump Discounts & Adelaide Fuel Prices"
              >
                <Fuel className="w-4 h-4 text-amber-600" />
                <span>Petrol Rewards</span>
                <span className="bg-amber-500 text-zinc-950 font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider">
                  Shell/Mobil
                </span>
              </Button>
            }
          />

          {/* Driver OS: Service SA & PPSR Check */}
          <DriverOperationsModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden xl:flex rounded-2xl h-10 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-xs"
                title="Driver OS: Courier Dispatch, Service SA Rego & PPSR Stolen Vehicle Policing"
              >
                <Car className="w-4 h-4 text-indigo-600" />
                <span>Driver OS</span>
                <span className="bg-indigo-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider">
                  Service SA
                </span>
              </Button>
            }
          />

          {/* Pilot & Private Cloud Services */}
          <CloudAndPilotModal
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex rounded-2xl h-10 border-cyan-300 bg-cyan-50/60 hover:bg-cyan-100/70 text-cyan-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-xs"
                title="Autonomous Marketplace Pilot, Google Cloud Run & Apple Private Cloud Compute"
              >
                <Compass className="w-4 h-4 text-cyan-600" />
                <span>Pilot & Cloud</span>
              </Button>
            }
          />

          {!isAuthReady ? (
            <div className="h-10 w-20 animate-pulse bg-muted rounded-2xl" />
          ) : user ? (
            <>
              <CreatePostModal>
                <Button variant="outline" size="sm" className="hidden md:flex rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Listing
                </Button>
              </CreatePostModal>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsGovernanceOpen(true)}
                className="rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors hidden md:flex items-center gap-1.5 cursor-pointer"
                title="Searchable library of privacy laws, code of practice, and regulations"
              >
                <Scale className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-xs">Governance</span>
                <Badge variant="outline" className="text-[9px] px-1 py-0 border-emerald-300 text-emerald-700 bg-emerald-50 hidden xl:inline-flex">
                  Verified
                </Badge>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMessagesOpen(true)}
                className="relative rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors hidden sm:flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Messages</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </Button>
              <Link
                href="/profile"
                className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition-colors"
                title="Open Dedicated Full-Screen Profile & Posted Ads Management"
              >
                <UserIcon className="w-4 h-4 text-indigo-600" />
                <span>/profile</span>
              </Link>
              <UserProfileModal
                isOpen={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                trigger={
                  <div className="flex items-center gap-2 pl-2 border-l border-zinc-100 cursor-pointer hover:opacity-85 transition-opacity">
                    <div className="flex flex-col items-end hidden lg:flex">
                      <span className="text-sm font-bold leading-none tracking-tight">{user.name}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{user.handle || '@user'}</span>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-zinc-100 transition-transform hover:scale-105">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-zinc-900 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                }
              />
            </>
          ) : (
            <AuthLandingModal
              trigger={
                <Button className="rounded-2xl h-10 px-4 md:px-6 font-bold bg-zinc-900 shadow-xl shadow-zinc-200 hover:bg-zinc-800 hover:-translate-y-0.5 transition-all cursor-pointer text-xs">
                  Sign In & Log In
                </Button>
              }
            />
          )}

          {/* Mobile Hamburger & Action Drawer Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-2xl h-10 w-10 p-0 border-zinc-200 hover:bg-zinc-50 flex items-center justify-center cursor-pointer shadow-xs"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-zinc-900" /> : <Menu className="w-5 h-5 text-zinc-900" />}
          </Button>
        </div>
      </div>

      {/* Expandable Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 bg-white/95 backdrop-blur-2xl px-5 py-6 space-y-5 animate-in slide-in-from-top-4 duration-300 shadow-2xl max-h-[82vh] overflow-y-auto">
          {/* User Status Bar */}
          {user ? (
            <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-zinc-900 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-bold text-zinc-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{user.handle || '@user'}</p>
                </div>
              </div>
              <UserProfileModal
                isOpen={isProfileOpen}
                onOpenChange={setIsProfileOpen}
                trigger={
                  <Button size="sm" variant="outline" className="h-8 rounded-xl text-xs font-bold border-zinc-300">
                    Profile
                  </Button>
                }
              />
            </div>
          ) : (
            <div className="p-4 bg-zinc-950 text-white rounded-2xl space-y-2">
              <p className="text-xs font-bold">Welcome to Suiter Marketplace</p>
              <p className="text-[11px] text-zinc-400">Sign in to manage listings, CAD floorplans, and petrol fuel rewards.</p>
              <AuthLandingModal
                trigger={
                  <Button className="w-full h-10 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-100 cursor-pointer shadow-md mt-1">
                    Sign In & Register (Expand Menu)
                  </Button>
                }
              />
            </div>
          )}

          {/* Quick Tools Grid for Mobile */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Core Modules & Architectural Tools
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* CAD Studio */}
              <BuildingPlanCADStudioModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-left hover:bg-indigo-100/70 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-950">CAD Studio</p>
                      <p className="text-[10px] text-indigo-700">2D Room Sketcher & AI</p>
                    </div>
                  </button>
                }
              />

              {/* Petrol Rewards */}
              <PetrolRewardsModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left hover:bg-amber-100/70 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center mb-1.5 shadow-xs">
                      <Fuel className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-950">Petrol Rewards</p>
                      <p className="text-[10px] text-amber-800">Shell & Mobil Cards</p>
                    </div>
                  </button>
                }
              />

              {/* Driver OS Mobile */}
              <DriverOperationsModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-left hover:bg-indigo-100 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-indigo-950">Driver OS</p>
                      <p className="text-[10px] text-indigo-700">Courier & Service SA</p>
                    </div>
                  </button>
                }
              />

              {/* Pilot & Cloud Mobile */}
              <CloudAndPilotModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-left hover:bg-cyan-100 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-cyan-600 text-white flex items-center justify-center mb-1.5 shadow-xs">
                      <Compass className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-cyan-950">Pilot & Cloud</p>
                      <p className="text-[10px] text-cyan-700">Autopilot & SLA</p>
                    </div>
                  </button>
                }
              />

              {/* Directory */}
              <DirectoryModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-left hover:bg-zinc-100 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-zinc-800 text-white flex items-center justify-center mb-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Yellow Directory</p>
                      <p className="text-[10px] text-zinc-500">Adelaide verified</p>
                    </div>
                  </button>
                }
              />

              {/* Instant Bookings */}
              <InstantBookingModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-left hover:bg-zinc-100 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Instant Bookings</p>
                      <p className="text-[10px] text-zinc-500">Kitchens, sites, cars</p>
                    </div>
                  </button>
                }
              />

              {/* Invoices & Collateral */}
              <BusinessCollateralModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-left hover:bg-zinc-100 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-zinc-800 text-white flex items-center justify-center mb-1.5">
                      <Printer className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Invoices & Cards</p>
                      <p className="text-[10px] text-zinc-500">Professional branding</p>
                    </div>
                  </button>
                }
              />

              {/* Payouts & Wallets */}
              <PaymentConnectorsModal
                trigger={
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-left hover:bg-zinc-100 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center mb-1.5">
                      <CreditCard className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">Wallets & BSB</p>
                      <p className="text-[10px] text-zinc-500">Instant direct payouts</p>
                    </div>
                  </button>
                }
              />
            </div>
          </div>

          {/* Post Listing & Governance Actions */}
          <div className="pt-2 space-y-2">
            <CreatePostModal>
              <Button className="w-full h-11 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer shadow-md flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Post New Listing
              </Button>
            </CreatePostModal>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsGovernanceOpen(true);
                }}
                className="flex-1 rounded-2xl h-10 text-xs font-bold border-zinc-200 hover:bg-zinc-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-4 h-4 text-emerald-600" /> Governance
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsMessagesOpen(true);
                }}
                className="flex-1 rounded-2xl h-10 text-xs font-bold border-zinc-200 hover:bg-zinc-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Messages
              </Button>
            </div>
          </div>
        </div>
      )}

      <MessagesModal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        onOpenChat={(name, handle, title) => {
          setActiveChatRecipient({ name, handle, listingTitle: title });
        }}
      />
      <ChatModal
        isOpen={activeChatRecipient !== null}
        onClose={() => setActiveChatRecipient(null)}
        recipientName={activeChatRecipient?.name}
        recipientHandle={activeChatRecipient?.handle}
      />
      <GovernanceModal
        isOpen={isGovernanceOpen}
        onOpenChange={setIsGovernanceOpen}
      />
    </header>
  );
}
