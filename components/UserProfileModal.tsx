'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { useAuth } from './AuthProvider';
import { 
  User as UserIcon, 
  Camera, 
  Upload, 
  Trash2, 
  Plus, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  AtSign, 
  Layers, 
  ExternalLink, 
  LogOut, 
  FileText, 
  Star, 
  Clock, 
  RefreshCw,
  Loader2,
  AlertCircle,
  Award,
  Briefcase,
  Wrench,
  CheckSquare,
  History,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Location, PortfolioItem, ServiceOffered, EngagedItem } from '@/lib/types';
import { CreatePostModal } from './CreatePostModal';
import { ListingDetailModal } from './ListingDetailModal';
import { UserLoyaltyBadge } from './UserLoyaltyBadge';
import { Transaction, Review } from '@/lib/types';
import { getStoredTransactions, computeUserRatingOverview, recordTransaction } from '@/lib/transactions';
import { LeaveReviewModal } from './LeaveReviewModal';
import { RatingDisplay } from './RatingDisplay';
import { MyAssetsDashboard } from './MyAssetsDashboard';
import { Coins } from 'lucide-react';

interface UserProfileModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  initialTab?: 'profile' | 'skills' | 'services' | 'portfolio' | 'listings' | 'transactions' | 'loyalty' | 'assets' | 'security';
}

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe',
];

export function UserProfileModal({
  isOpen,
  onOpenChange,
  trigger,
  initialTab = 'profile',
}: UserProfileModalProps) {
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'listings' | 'transactions' | 'loyalty' | 'assets' | 'security'>(initialTab);

  // Form Fields
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Skills, Services, Portfolio & Engagement History
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [services, setServices] = useState<ServiceOffered[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [historyEngaged, setHistoryEngaged] = useState<EngagedItem[]>([]);
  const [listingsSubTab, setListingsSubTab] = useState<'posted' | 'engaged'>('posted');

  // New Service inputs
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Local Services');
  const [newServiceTurnaround, setNewServiceTurnaround] = useState('2-3 Days');
  const [showAddService, setShowAddService] = useState(false);

  // New Portfolio inputs
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortImage, setNewPortImage] = useState('');
  const [newPortCategory, setNewPortCategory] = useState('Project');
  const [newPortDate, setNewPortDate] = useState('2026');
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  // User's listings
  const [userListings, setUserListings] = useState<Location[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [selectedListingDetail, setSelectedListingDetail] = useState<Location | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Transactions & Reviews
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTxForReview, setSelectedTxForReview] = useState<Transaction | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [txFilter, setTxFilter] = useState<'all' | 'unreviewed' | 'reviewed'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load transactions on open
  useEffect(() => {
    setTransactions(getStoredTransactions());
  }, [isOpen]);

  const userRatingStats = computeUserRatingOverview(userListings, transactions);

  // Populate state from current user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHandle((user.handle || '').replace(/^@/, ''));
      setBio(user.bio || '');
      setPhone(user.phone || '');
      setLocation(user.location || 'Tarntanya / Adelaide CBD');
      setAvatarUrl(user.avatarUrl || '');
      setSkills(user.skills || ['Licensed Joinery', 'Building Compliance AS 4386', 'Architectural Surveying', 'Master Builder']);
      setServices(user.servicesProvided || [
        { id: 's1', title: '3D Laser Spatial Survey & Architectural Joinery', description: 'Laser measured CAD designs, 2-pack polyurethane finishes and engineered stone sign-off.', price: 'From $2,400', category: 'Kitchen Renovations', turnaround: '2-3 Weeks' },
        { id: 's2', title: 'Master Builder Statutory Compliance Review', description: 'South Australia CBS builder license review and statutory site survey.', price: '$650 Fixed', category: 'Building Sites', turnaround: '2 Business Days' }
      ]);
      setPortfolio(user.portfolio || [
        { id: 'p1', title: 'Norwood Heritage Villa Joinery', description: 'Bespoke walnut veneer cabinetry and custom kitchen island.', image: 'https://picsum.photos/seed/norwoodjoinery/800/450', category: 'Kitchen Renovations', date: 'August 2026' },
        { id: 'p2', title: 'Unley Architectural Spatial Scan', description: '3D point-cloud LiDAR scan and certified site plan.', image: 'https://picsum.photos/seed/unleyscan/800/450', category: 'Sites & Feasibility', date: 'September 2026' }
      ]);
      setHistoryEngaged(user.historyEngaged || [
        { id: 'h1', title: 'City West Toyota Certified LMVD Inspection', type: 'product', providerName: 'City West Toyota', providerHandle: '@citywest_toyota', date: '18 Sep 2026', status: 'completed', price: '$38,900' },
        { id: 'h2', title: 'Kaurna Cultural Heritage Advisory Session', type: 'service', providerName: 'Kaurna Cultural Centre', providerHandle: '@kaurna_centre', date: '21 Sep 2026', status: 'completed', price: 'Community' }
      ]);
    }
  }, [user]);

  // Query user's ads and services in Firestore
  useEffect(() => {
    if (!user?.id) return;
    setLoadingListings(true);

    const q = query(
      collection(db, 'listings'),
      where('ownerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Location[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: docSnap.id,
            lat: d.lat || -34.9285,
            lng: d.lng || 138.6007,
            title: d.title || 'Untitled Listing',
            description: d.description || '',
            type: d.type || 'service',
            price: d.price || 'Free / Contact',
            rating: d.rating || 5.0,
            category: d.category || 'General',
            image: d.image || `https://picsum.photos/seed/${docSnap.id}/800/450`,
            stock: d.stock,
            externalUrl: d.externalUrl,
            isNew: d.isNew,
            phone: d.phone || user.phone || '08 8212 3456',
            hours: d.hours || ['Mon-Fri: 9:00 AM - 5:00 PM'],
            reviews: d.reviews || [],
            source: d.source || 'User Verified'
          });
        });
        setUserListings(items);
        setLoadingListings(false);
      },
      (error) => {
        console.error('Failed to load user listings:', error);
        setLoadingListings(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id, user?.phone]);

  // Handle local image file upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 3MB for base64 storage)
    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Image file is too large. Please select an image under 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      await updateProfile({
        name: name.trim(),
        handle: handle.trim().replace(/^@/, ''),
        bio: bio.trim(),
        phone: phone.trim(),
        location: location.trim(),
        avatarUrl: avatarUrl.trim(),
        skills,
        servicesProvided: services,
        portfolio,
        historyEngaged,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = async (skillToAdd?: string) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s || skills.includes(s)) return;
    const updated = [...skills, s];
    setSkills(updated);
    setNewSkillInput('');
    await updateProfile({
      name,
      handle,
      bio,
      phone,
      location,
      avatarUrl,
      skills: updated,
      servicesProvided: services,
      portfolio,
      historyEngaged,
    });
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    await updateProfile({
      name,
      handle,
      bio,
      phone,
      location,
      avatarUrl,
      skills: updated,
      servicesProvided: services,
      portfolio,
      historyEngaged,
    });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;
    const newSrv: ServiceOffered = {
      id: 'srv-' + Date.now(),
      title: newServiceTitle.trim(),
      description: newServiceDesc.trim(),
      price: newServicePrice.trim() || 'Contact for Quote',
      category: newServiceCategory,
      turnaround: newServiceTurnaround
    };
    const updated = [newSrv, ...services];
    setServices(updated);
    setNewServiceTitle('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setShowAddService(false);
    await updateProfile({
      name,
      handle,
      bio,
      phone,
      location,
      avatarUrl,
      skills,
      servicesProvided: updated,
      portfolio,
      historyEngaged,
    });
  };

  const handleDeleteService = async (srvId: string) => {
    const updated = services.filter(s => s.id !== srvId);
    setServices(updated);
    await updateProfile({
      name,
      handle,
      bio,
      phone,
      location,
      avatarUrl,
      skills,
      servicesProvided: updated,
      portfolio,
      historyEngaged,
    });
  };

  const handleAddPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim()) return;
    const newPort: PortfolioItem = {
      id: 'port-' + Date.now(),
      title: newPortTitle.trim(),
      description: newPortDesc.trim(),
      image: newPortImage.trim() || `https://picsum.photos/seed/${Date.now()}/800/450`,
      category: newPortCategory,
      date: newPortDate
    };
    const updated = [newPort, ...portfolio];
    setPortfolio(updated);
    setNewPortTitle('');
    setNewPortDesc('');
    setNewPortImage('');
    setShowAddPortfolio(false);
    await updateProfile({
      name,
      handle,
      bio,
      phone,
      location,
      avatarUrl,
      skills,
      servicesProvided: services,
      portfolio: updated,
      historyEngaged,
    });
  };

  const handleDeletePortfolio = async (portId: string) => {
    const updated = portfolio.filter(p => p.id !== portId);
    setPortfolio(updated);
    await updateProfile({
      name,
      handle,
      bio,
      phone,
      location,
      avatarUrl,
      skills,
      servicesProvided: services,
      portfolio: updated,
      historyEngaged,
    });
  };

  const completenessChecks = [
    { label: 'Profile picture set', done: Boolean(avatarUrl) },
    { label: 'Custom handle chosen', done: Boolean(handle) },
    { label: 'Biography written', done: Boolean(bio && bio.length > 20) },
    { label: 'Phone & location provided', done: Boolean(phone && location) },
    { label: 'At least 2 skills listed', done: skills.length >= 2 },
    { label: 'At least 1 service offered', done: services.length >= 1 },
    { label: 'Portfolio work sample added', done: portfolio.length >= 1 },
  ];
  const completedCount = completenessChecks.filter(c => c.done).length;
  const completenessPercentage = Math.round((completedCount / completenessChecks.length) * 100);

  const handleDeleteListing = async (listingId: string) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    setDeletingId(listingId);
    try {
      await deleteDoc(doc(db, 'listings', listingId));
    } catch (err) {
      console.error('Failed to delete listing:', err);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger render={trigger} />}
        <DialogContent className="sm:max-w-[860px] rounded-[2.5rem] border-0 glass p-0 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
          {/* Glossy Header Banner */}
          <div className="relative bg-zinc-950 text-white p-6 pb-5 shrink-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-white/40 shadow-xl flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={name || user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-zinc-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change picture"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-zinc-900 border border-white/40 text-white flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-display font-bold text-white tracking-tight">
                      {name || user.name}
                    </h2>
                    <Badge className="bg-emerald-500 text-zinc-950 font-black text-[9px] uppercase tracking-wider">
                      Verified Member
                    </Badge>
                    <div className="scale-90 origin-left">
                      <UserLoyaltyBadge compact={true} />
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>@{handle || user.handle?.replace(/^@/, '') || 'user'}</span>
                    <span>•</span>
                    <span className="text-zinc-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {location || 'Adelaide CBD'}
                    </span>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('transactions')}
                      className="inline-flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
                      title="View verified rating and reviews breakdown"
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{userRatingStats.averageRating} Average Rating</span>
                      <span className="text-amber-200/80 font-normal">({userRatingStats.totalReviewsReceived} reviews • {userRatingStats.totalCompletedTransactions} completed)</span>
                    </button>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    logout();
                    if (onOpenChange) onOpenChange(false);
                  }}
                  className="rounded-xl h-9 text-xs font-bold border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 mt-5 border-t border-zinc-800/80 pt-4 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'profile', label: 'Bio & Identity', icon: UserIcon },
                { id: 'skills', label: `Skills (${skills.length})`, icon: Wrench },
                { id: 'services', label: `Services Provided (${services.length})`, icon: Tag },
                { id: 'portfolio', label: `Portfolio (${portfolio.length})`, icon: ImageIcon },
                { id: 'listings', label: `Marketplace Postings (${userListings.length})`, icon: Layers },
                { id: 'transactions', label: `Reviews & Orders (${transactions.length})`, icon: Star },
                { id: 'loyalty', label: 'Loyalty & Rewards', icon: Award },
                { id: 'assets', label: 'My Assets & Bitcoin', icon: Coins },
                { id: 'security', label: 'Security & Verification', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-white text-zinc-950 shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto flex-1 bg-white">
            {/* TAB: My Assets & Bitcoin */}
            {activeTab === 'assets' && <MyAssetsDashboard />}

            {/* TAB 1: Profile Information */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl mx-auto">
                {/* Guided Profile Completeness Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900 to-indigo-950 text-white border border-indigo-500/30 shadow-xl relative overflow-hidden space-y-3.5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Profile Setup Guide</span>
                        <span className="bg-emerald-500 text-zinc-950 font-black text-[9px] px-2 py-0.5 rounded-full">
                          {completenessPercentage}% Complete
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                        {completenessPercentage === 100 ? 'All Profile Criteria Complete!' : 'Complete Your Verified Provider Profile'}
                      </h3>
                      <p className="text-xs text-zinc-300">
                        {completenessPercentage === 100 
                          ? 'Your account features top-tier credibility with high search visibility and certified verification.'
                          : 'Comprehensive profiles receive up to 4.2x more client enquiries and instant bookings across Adelaide.'}
                      </p>
                    </div>
                    <div className="shrink-0 text-center">
                      <div className="w-14 h-14 rounded-full border-4 border-indigo-500/40 border-t-emerald-400 flex items-center justify-center font-display font-black text-white text-sm shadow-inner">
                        {completenessPercentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-full rounded-full transition-all duration-700" 
                      style={{ width: `${completenessPercentage}%` }} 
                    />
                  </div>

                  {/* Interactive checklist guidance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    {completenessChecks.map((chk, idx) => (
                      <div 
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                          chk.done ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${chk.done ? 'text-emerald-400' : 'text-zinc-600'}`} />
                          <span className={chk.done ? 'font-medium text-white' : 'font-normal'}>{chk.label}</span>
                        </div>
                        {!chk.done && (
                          <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* User Loyalty Progress Ring Card */}
                <UserLoyaltyBadge />

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Profile changes saved successfully!
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    {errorMessage}
                  </div>
                )}

                {/* Profile Picture Upload & Presets */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Profile Picture
                      </Label>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Upload an image from your device, choose an avatar, or enter a photo URL.
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl h-9 text-xs font-bold bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-100 flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      Upload Photo
                    </Button>
                  </div>

                  {/* Avatar URL input */}
                  <div className="grid gap-1">
                    <Input
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or data:image/..."
                      className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-mono"
                    />
                  </div>

                  {/* Quick Avatar Presets */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                      Or select a ready-to-use avatar:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(preset)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-transform hover:scale-110 cursor-pointer ${
                            avatarUrl === preset ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-zinc-200 bg-white'
                          }`}
                        >
                          <img src={preset} alt="Preset avatar" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {avatarUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAvatarUrl('')}
                          className="h-8 px-2 text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 mr-1" /> Remove Photo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Identity Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Full Name / Business Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Marcus Vance"
                      className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-semibold"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Username / Handle
                    </Label>
                    <div className="relative">
                      <AtSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
                        required
                        placeholder="vance_kitchens"
                        className="rounded-xl h-11 pl-9 bg-white border-zinc-200 text-xs font-semibold font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Email Address (Verified)
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        value={user.email}
                        disabled
                        className="rounded-xl h-11 pl-9 bg-zinc-100 border-zinc-200 text-xs font-mono text-zinc-600"
                      />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Contact Phone
                    </Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(08) 8234 5678 or 0400 000 000"
                        className="rounded-xl h-11 pl-9 bg-white border-zinc-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Location / Territory (Shown on Map)
                  </Label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Tarntanya / Adelaide CBD, Norwood, Glenelg"
                      className="rounded-xl h-11 pl-9 bg-white border-zinc-200 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="grid gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      About & Bio
                    </Label>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {bio.length} / 500 characters
                    </span>
                  </div>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 500))}
                    rows={4}
                    placeholder="Describe your trade specialty, services, product range, or experience on Kaurna Country..."
                    className="rounded-2xl p-3.5 bg-white border-zinc-200 text-xs leading-relaxed"
                  />
                </div>

                {/* Save Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl h-11 px-6 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold cursor-pointer shadow-md flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </Button>
                </div>
              </form>
            )}

            {/* TAB: Skills Offered */}
            {activeTab === 'skills' && (
              <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Skills & Trade Competencies</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Specify the capabilities and certifications you offer to marketplace clients.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-xl">
                      {skills.length} Endorsed
                    </span>
                  </div>

                  {/* Add skill input */}
                  <div className="flex items-center gap-2 pt-2">
                    <Input
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Type a skill or trade license (e.g. 'AS 4386 Joinery', 'Stone Benchtops')..."
                      className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddSkill()}
                      disabled={!newSkillInput.trim()}
                      className="rounded-xl h-10 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shrink-0 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Add Skill
                    </Button>
                  </div>
                </div>

                {/* Current Active Skills */}
                <div className="p-5 rounded-2xl bg-white border border-zinc-200/80 shadow-sm space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Your Active Skills ({skills.length})
                  </h4>
                  {skills.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">No skills listed yet. Add custom skills or pick from suggestions below.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 text-xs font-semibold transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove skill"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular suggested skills */}
                <div className="p-5 rounded-2xl bg-zinc-50/80 border border-zinc-200/60 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-700">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Quick-Add Popular Trade & Professional Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Kitchen Joinery',
                      'Building Compliance AS 4386',
                      'Architectural Surveying',
                      'Master Builder',
                      'Hybrid Diagnostics',
                      '3D Laser Scanning',
                      'Cabinet Making',
                      'Stone Benchtops',
                      'CBS Contractor License',
                      'Sustainable HVAC',
                      'Custom Millwork',
                      'Project Management'
                    ].map((sugg) => {
                      const isAlreadyAdded = skills.includes(sugg);
                      return (
                        <button
                          key={sugg}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => handleAddSkill(sugg)}
                          className={`px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                            isAlreadyAdded 
                              ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
                              : 'bg-white hover:bg-indigo-50 hover:text-indigo-700 text-zinc-700 border border-zinc-200 shadow-xs'
                          }`}
                        >
                          <Plus className="w-3 h-3 text-indigo-500" />
                          <span>{sugg}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Services Provided */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Services Provided & Pricing</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      List specific service packages, turnaround times, and rates available for clients.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAddService(!showAddService)}
                    className="rounded-xl h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{showAddService ? 'Cancel' : 'Add New Service'}</span>
                  </Button>
                </div>

                {/* Add Service Form */}
                {showAddService && (
                  <form onSubmit={handleAddService} className="p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-lg space-y-4 animate-in fade-in">
                    <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-600" />
                      <span>Create New Service Offering</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service Title</Label>
                        <Input
                          value={newServiceTitle}
                          onChange={(e) => setNewServiceTitle(e.target.value)}
                          placeholder="e.g. 3D Laser Contour Survey"
                          required
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Rate / Price</Label>
                        <Input
                          value={newServicePrice}
                          onChange={(e) => setNewServicePrice(e.target.value)}
                          placeholder="e.g. From $1,200 or $95/hr"
                          required
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service Category</Label>
                        <select
                          value={newServiceCategory}
                          onChange={(e) => setNewServiceCategory(e.target.value)}
                          className="rounded-xl h-10 bg-white border border-zinc-200 text-xs font-semibold px-3"
                        >
                          <option value="Kitchen Renovations">Kitchen Renovations</option>
                          <option value="Building Sites">Building Sites</option>
                          <option value="Second Hand Cars">Second Hand Cars</option>
                          <option value="Applications & Audits">Applications & Audits</option>
                          <option value="Local Services">Local Services</option>
                          <option value="Storefronts">Storefronts</option>
                        </select>
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Turnaround / Timeline</Label>
                        <Input
                          value={newServiceTurnaround}
                          onChange={(e) => setNewServiceTurnaround(e.target.value)}
                          placeholder="e.g. 2-3 Days or 1 Week"
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service Description & Scope</Label>
                      <Textarea
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        placeholder="Detail what is included, deliverables, certifications, and requirements..."
                        rows={3}
                        className="rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAddService(false)}
                        className="rounded-xl h-9 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                      >
                        Save Service
                      </Button>
                    </div>
                  </form>
                )}

                {/* Services List */}
                {services.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-zinc-400 text-xs">
                    No custom services configured yet. Click &ldquo;Add New Service&rdquo; above to publish your offerings.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {services.map((srv) => (
                      <div key={srv.id} className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-zinc-900">{srv.title}</h4>
                            {srv.category && (
                              <span className="text-[9px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                {srv.category}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">{srv.description}</p>
                          <div className="flex items-center gap-3 pt-1 text-[11px] font-bold text-zinc-600">
                            <span className="text-zinc-950 font-black">{srv.price}</span>
                            {srv.turnaround && (
                              <span className="text-zinc-400 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" /> {srv.turnaround}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(srv.id)}
                          className="text-zinc-400 hover:text-rose-600 h-8 w-8 rounded-lg cursor-pointer"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Portfolio / Work Examples */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Portfolio & Work Showcases</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Showcase past completed projects, photographs, and verified craftsmanship.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                    className="rounded-xl h-9 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{showAddPortfolio ? 'Cancel' : 'Add Work Sample'}</span>
                  </Button>
                </div>

                {/* Add Portfolio Form */}
                {showAddPortfolio && (
                  <form onSubmit={handleAddPortfolio} className="p-5 rounded-2xl bg-white border-2 border-indigo-100 shadow-lg space-y-4 animate-in fade-in">
                    <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-600" />
                      <span>Add Work Sample to Portfolio</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Project Title</Label>
                        <Input
                          value={newPortTitle}
                          onChange={(e) => setNewPortTitle(e.target.value)}
                          placeholder="e.g. Parade Villa Kitchen Joinery"
                          required
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Category</Label>
                        <Input
                          value={newPortCategory}
                          onChange={(e) => setNewPortCategory(e.target.value)}
                          placeholder="e.g. Kitchen Renovations, Scan"
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Image URL</Label>
                        <Input
                          value={newPortImage}
                          onChange={(e) => setNewPortImage(e.target.value)}
                          placeholder="https://images.unsplash.com/... (optional)"
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-mono"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date / Completion Year</Label>
                        <Input
                          value={newPortDate}
                          onChange={(e) => setNewPortDate(e.target.value)}
                          placeholder="e.g. August 2026"
                          className="rounded-xl h-10 bg-white border-zinc-200 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid gap-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Project Description</Label>
                      <Textarea
                        value={newPortDesc}
                        onChange={(e) => setNewPortDesc(e.target.value)}
                        placeholder="Describe the scope, materials used, challenges solved, and outcome..."
                        rows={3}
                        className="rounded-xl text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowAddPortfolio(false)}
                        className="rounded-xl h-9 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="rounded-xl h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                      >
                        Save Work Sample
                      </Button>
                    </div>
                  </form>
                )}

                {/* Portfolio Grid */}
                {portfolio.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-zinc-400 text-xs">
                    No portfolio projects uploaded yet. Add photographs of past workmanship to build client trust.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolio.map((item) => (
                      <div key={item.id} className="rounded-2xl overflow-hidden bg-white border border-zinc-200/80 shadow-xs flex flex-col justify-between group">
                        <div>
                          <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            {item.category && (
                              <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider text-zinc-900 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg">
                                {item.category}
                              </span>
                            )}
                          </div>
                          <div className="p-4 space-y-1">
                            <h4 className="font-bold text-xs text-zinc-900 line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                        <div className="p-3 pt-0 flex items-center justify-between border-t border-zinc-100 text-[10px] text-zinc-400">
                          <span>{item.date}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePortfolio(item.id)}
                            className="h-7 w-7 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: My Ads & Services & Engaged History */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                {/* Subtab navigation */}
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setListingsSubTab('posted')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        listingsSubTab === 'posted'
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      My Posted Ads & Services ({userListings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingsSubTab('engaged')}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        listingsSubTab === 'engaged'
                          ? 'bg-zinc-900 text-white shadow-xs'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      Engaged Services & Bookings ({historyEngaged.length})
                    </button>
                  </div>

                  {listingsSubTab === 'posted' && (
                    <CreatePostModal>
                      <Button
                        size="sm"
                        className="rounded-xl h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Post New Listing</span>
                      </Button>
                    </CreatePostModal>
                  )}
                </div>

                {/* Subtab 1: Posted Listings */}
                {listingsSubTab === 'posted' && (
                  <div>
                    {loadingListings ? (
                      <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                        <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mb-2" />
                        <span className="text-xs font-medium">Fetching your listings...</span>
                      </div>
                    ) : userListings.length === 0 ? (
                      <div className="text-center py-14 px-4 border-2 border-dashed border-zinc-200 rounded-3xl space-y-3 bg-zinc-50/50">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                          <Tag className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-zinc-800">No active ads or services yet</h4>
                          <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                            Post your first trade service, classified ad, or shop storefront to get pinned on the map and attract local clients across Adelaide.
                          </p>
                        </div>
                        <CreatePostModal>
                          <Button
                            size="sm"
                            className="rounded-xl h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm mt-2"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" />
                            Create Your First Post
                          </Button>
                        </CreatePostModal>
                      </div>
                    ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="p-4 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all shadow-xs flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex gap-3">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100 relative">
                            {listing.image ? (
                              <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                <Layers className="w-6 h-6" />
                              </div>
                            )}
                            <Badge className="absolute top-1 left-1 bg-zinc-900/80 backdrop-blur-xs text-white text-[8px] font-black uppercase px-1.5 py-0">
                              {listing.type}
                            </Badge>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-sm text-zinc-900 truncate leading-snug">
                                {listing.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-zinc-500 line-clamp-2 mt-1 leading-relaxed">
                              {listing.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="font-black text-xs text-zinc-900">
                                {listing.price}
                              </span>
                              <span className="text-[10px] text-zinc-400">•</span>
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-medium">
                                <MapPin className="w-2.5 h-2.5 text-emerald-500" /> Live on Map
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                          <Badge variant="outline" className="text-[9px] font-bold text-zinc-600">
                            {listing.category}
                          </Badge>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedListingDetail(listing)}
                              className="h-8 px-2.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" /> View
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingId === listing.id}
                              onClick={() => handleDeleteListing(listing.id)}
                              className="h-8 px-2.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                            >
                              {deletingId === listing.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Trash2 className="w-3 h-3 mr-1" />
                              )}
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subtab 2: Engaged Services & Bookings */}
                {listingsSubTab === 'engaged' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-500">
                      History of third-party trade services, classified ads, and marketplace bookings you have engaged with.
                    </div>

                    {historyEngaged.length === 0 ? (
                      <div className="text-center py-12 px-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 text-zinc-400 text-xs">
                        No service bookings or vendor inquiries recorded yet.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {historyEngaged.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-between gap-4"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm text-zinc-900">{item.title}</h4>
                                <Badge className="bg-zinc-100 text-zinc-700 text-[9px] uppercase tracking-wider border-zinc-200">
                                  {item.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <span className="font-medium text-zinc-700">Provider: {item.providerName}</span>
                                {item.providerHandle && (
                                  <span className="text-indigo-600 font-mono text-[11px] font-semibold">{item.providerHandle}</span>
                                )}
                                <span>•</span>
                                <span className="text-zinc-400">{item.date}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {item.price && (
                                <span className="font-black text-sm text-zinc-900">{item.price}</span>
                              )}
                              <Badge className={`text-[10px] font-bold ${
                                item.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : item.status === 'inquiry'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                {item.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Transactions & Reviews */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Rating & Reputation Overview Card */}
                <div className="p-6 rounded-3xl bg-zinc-950 text-white relative overflow-hidden shadow-xl">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                          Verified Transaction Standard
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-display font-black text-white">
                          {userRatingStats.averageRating.toFixed(1)}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${userRatingStats.averageRating >= star ? 'fill-amber-400' : 'text-zinc-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-zinc-400 font-medium">
                          ({userRatingStats.totalReviewsReceived} reviews)
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 max-w-md leading-relaxed">
                        All ratings and written reviews are cryptographically verifiable and linked to completed services and ads across South Australia.
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <span className="text-xl font-display font-black text-emerald-400">
                          {userRatingStats.satisfactionRate}%
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mt-0.5">
                          Satisfaction Rate
                        </span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                        <span className="text-xl font-display font-black text-white">
                          {userRatingStats.totalCompletedTransactions}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mt-0.5">
                          Completed Deals
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Star Breakdown */}
                  <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const count = userRatingStats.starBreakdown[s] || 0;
                      const total = userRatingStats.totalReviewsReceived || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={s} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-zinc-300 font-bold flex items-center gap-0.5">
                              {s} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            </span>
                            <span className="text-zinc-400">{pct}% ({count})</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Filter & Action Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
                    {[
                      { id: 'all', label: `All Engagements (${transactions.length})` },
                      { id: 'unreviewed', label: `Ready for Review (${transactions.filter(t => !t.rating).length})` },
                      { id: 'reviewed', label: `Reviewed (${transactions.filter(t => !!t.rating).length})` },
                    ].map(filter => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setTxFilter(filter.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          txFilter === filter.id
                            ? 'bg-zinc-900 text-white shadow-xs'
                            : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      const simulatedTx = recordTransaction({
                        listingId: 'reno-1',
                        listingTitle: 'Vance Joinery & Custom Kitchen Renovation Master Suite',
                        listingType: 'service',
                        listingImage: 'https://picsum.photos/seed/adelaidekitchenreno/800/450',
                        listingPrice: 'From $12,500',
                        sellerName: 'Vance Joinery & Stone Studio',
                        buyerId: user?.id || 'demo-user-1',
                        buyerName: user?.name || 'Tamara Barber',
                        buyerEmail: user?.email || 'tarotwithtamara@gmail.com',
                        amount: '$14,200 AUD (On-Site Completed)',
                        status: 'completed',
                        serviceCategory: 'Kitchen Renovations'
                      });
                      setTransactions(getStoredTransactions());
                      setSelectedTxForReview(simulatedTx);
                      setIsReviewModalOpen(true);
                    }}
                    className="rounded-xl h-8 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simulate Completed Service</span>
                  </Button>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                  {transactions
                    .filter(t => {
                      if (txFilter === 'unreviewed') return !t.rating;
                      if (txFilter === 'reviewed') return !!t.rating;
                      return true;
                    })
                    .map(tx => {
                      const hasReview = !!tx.rating;
                      return (
                        <div
                          key={tx.id}
                          className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all shadow-xs space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                <img
                                  src={tx.listingImage || 'https://picsum.photos/seed/tradephoto/200/200'}
                                  alt={tx.listingTitle}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                                  </Badge>
                                  <span className="text-[10px] font-mono text-zinc-400">
                                    Ref: {tx.id}
                                  </span>
                                  <span className="text-[10px] text-zinc-400">
                                    {tx.date}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-zinc-900">
                                  {tx.listingTitle}
                                </h4>
                                <p className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                                  <span>Merchant: <strong className="text-zinc-700">{tx.sellerName || 'Local Specialist'}</strong></span>
                                  <span>•</span>
                                  <span className="font-semibold text-zinc-800">{tx.amount || tx.listingPrice}</span>
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              {!hasReview ? (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTxForReview(tx);
                                    setIsReviewModalOpen(true);
                                  }}
                                  className="rounded-xl h-9 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-md flex items-center gap-1.5 animate-pulse"
                                >
                                  <Star className="w-3.5 h-3.5 fill-white" />
                                  <span>Rate & Review (1-5★)</span>
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTxForReview(tx);
                                    setIsReviewModalOpen(true);
                                  }}
                                  className="rounded-xl h-9 px-3 border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer flex items-center gap-1.5"
                                >
                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                  <span>Edit Review</span>
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* If reviewed, show review content */}
                          {hasReview && (
                            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-3.5 h-3.5 ${
                                          (tx.rating || 0) >= s
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-zinc-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs font-bold text-zinc-900">
                                    {tx.rating}.0 Star Rating
                                  </span>
                                  <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[9px] font-bold ml-1">
                                    <ShieldCheck className="w-3 h-3 mr-1 inline text-emerald-600" />
                                    Verified Feedback
                                  </Badge>
                                </div>
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {tx.reviewedAt || tx.date}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-700 leading-relaxed italic">
                                &quot;{tx.reviewComment}&quot;
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* TAB 3: Loyalty & Tier Progression */}
            {activeTab === 'loyalty' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <UserLoyaltyBadge />

                {/* Tier roadmap explanation */}
                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-500">
                    Marketplace Loyalty Progression Tiers
                  </h4>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-amber-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-900">Bronze Explorer (0 - 4 Bookings)</span>
                          <span className="text-[10px] font-mono text-zinc-400">Entry Tier</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Standard marketplace access, verified member crest, in-app customer direct messaging.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-sky-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-sky-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-900">Silver Artisan (5 - 9 Bookings)</span>
                          <span className="text-[10px] font-mono text-sky-600 font-bold">5+ Bookings</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Priority map pinning, 50% reduced platform service fees, silver shield badge.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-yellow-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-yellow-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-900">Gold Ambassador (10 - 19 Bookings)</span>
                          <span className="text-[10px] font-mono text-yellow-600 font-bold">10+ Bookings</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Zero service commission, top-row search spotlight placement, auto-confirm bookings.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-indigo-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4 text-indigo-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-zinc-900">Platinum Sovereign (20+ Bookings)</span>
                          <span className="text-[10px] font-mono text-indigo-600 font-bold">Max Tier</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Dedicated escrow concierge, perpetual top spotlight, unlimited Google Ads syndication boost.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Security & Verification */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white">Cryptographic Session Enclave</h4>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono">
                      ISO/IEC 27001
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Your authenticated session is cryptographically bound to South Australian fair trade standards, with privacy guarantees under the Privacy Act 1988.
                  </p>
                  <div className="p-3 bg-black/50 rounded-xl font-mono text-[10px] text-zinc-400 break-all select-all">
                    TOKEN: {user.encryptedAuthToken || 'ENC-AES256-RSA4096-OVERSEER-AUTHENTICATED'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-zinc-500">
                    Statutory Compliance Badges
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-zinc-900">Certified Trade</div>
                        <div className="text-[10px] text-zinc-500">Master Builder AS 4386</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-zinc-900">CBS Registered</div>
                        <div className="text-[10px] text-zinc-500">SA Fair Trading</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-zinc-200 flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-zinc-900">Verified Experience</div>
                        <div className="text-[10px] text-zinc-500">10+ Years Metro</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-rose-900">End Active Session</h4>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Sign out of your account on this device.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      logout();
                      if (onOpenChange) onOpenChange(false);
                    }}
                    className="rounded-xl h-9 text-xs font-bold border-rose-300 bg-white text-rose-700 hover:bg-rose-100 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    Sign Out Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Listing Detail Viewer */}
      {selectedListingDetail && (
        <ListingDetailModal
          location={selectedListingDetail}
          onClose={() => setSelectedListingDetail(null)}
        />
      )}

      {/* Leave Review Modal */}
      {selectedTxForReview && (
        <LeaveReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedTxForReview(null);
          }}
          transaction={selectedTxForReview}
          onReviewSubmitted={() => {
            setTransactions(getStoredTransactions());
          }}
        />
      )}
    </>
  );
}
