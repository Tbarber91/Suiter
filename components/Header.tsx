'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Search, MapPin, Plus, Sparkles, Mic, Video, Shield, Lock, Unlock, Crown, Briefcase, TrendingUp, KeyRound, MessageSquare } from 'lucide-react';
import { Badge } from './ui/badge';
import { Logo } from './Logo';

import { CreatePostModal } from './CreatePostModal';
import { SecurityGateModal } from './SecurityGateModal';
import { MessagesModal } from './MessagesModal';
import { ChatModal } from './ChatModal';

export function Header() {
  const { user, login, loginWithGoogle, logout, updateProfile, isAuthReady } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeChatRecipient, setActiveChatRecipient] = useState<{ name: string; handle: string; listingTitle?: string } | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [editName, setEditName] = useState('');
  const [editHandle, setEditHandle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

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
              placeholder="Search shops, products, and services..."
              className="w-full h-11 rounded-2xl bg-zinc-100/50 border-0 pl-11 pr-32 focus-visible:bg-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-300 transition-all"
            />
            <div className="absolute right-2 flex gap-1">
              <Badge variant="outline" className="bg-white/50 backdrop-blur-sm text-[10px] h-7 border-zinc-200 font-mono">⌘ K</Badge>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-600 text-[10px] h-7 border-indigo-100 font-bold hidden lg:flex">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI Search
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
                onClick={() => setIsMessagesOpen(true)}
                className="relative rounded-2xl h-10 border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span className="hidden md:inline">Messages</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </Button>
              <Dialog open={isProfileOpen} onOpenChange={(open) => {
                setIsProfileOpen(open);
                if (open && user) {
                  setEditName(user.name);
                  setEditHandle(user.handle || '');
                  setEditBio(user.bio || '');
                  setEditPhone(user.phone || '');
                  setEditAvatarUrl(user.avatarUrl || '');
                }
              }}>
                <DialogTrigger render={
                  <div className="flex items-center gap-3 pl-2 border-l border-zinc-100 cursor-pointer hover:opacity-85 transition-opacity">
                    <div className="flex flex-col items-end hidden lg:flex">
                      <span className="text-sm font-bold leading-none tracking-tight">{user.name}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{user.handle || '@user'}</span>
                    </div>
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-zinc-100 transition-transform hover:scale-105">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-zinc-900 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                } />
                <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-0 glass p-8 max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-display font-bold tracking-tight text-center mb-1">User Profile</DialogTitle>
                    <p className="text-center text-muted-foreground text-xs mb-4 font-medium font-sans">Manage your identity, bio, contact details, and platform credentials.</p>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="edit-name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Display Name / Brand</Label>
                      <Input
                        id="edit-name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-2xl h-11 bg-white border-zinc-100 focus:border-zinc-300 transition-colors shadow-sm text-xs font-semibold"
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="edit-handle" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Handle</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold font-mono text-xs">@</span>
                        <Input
                          id="edit-handle"
                          value={editHandle.replace(/^@/, '')}
                          onChange={(e) => setEditHandle(e.target.value)}
                          className="rounded-2xl h-11 bg-white border-zinc-100 focus:border-zinc-300 transition-colors pl-8 shadow-sm font-semibold text-xs text-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="edit-bio" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Brief Bio</Label>
                      <Input
                        id="edit-bio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Licensed service provider & trade expert..."
                        className="rounded-2xl h-11 bg-white border-zinc-100 focus:border-zinc-300 transition-colors shadow-sm text-xs"
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="edit-phone" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Contact Phone</Label>
                      <Input
                        id="edit-phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="0400 000 000"
                        className="rounded-2xl h-11 bg-white border-zinc-100 focus:border-zinc-300 transition-colors shadow-sm text-xs font-mono"
                      />
                    </div>

                    <div className="grid gap-1.5">
                      <Label htmlFor="edit-avatar" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pl-1">Profile Picture URL</Label>
                      <Input
                        id="edit-avatar"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="rounded-2xl h-11 bg-white border-zinc-100 focus:border-zinc-300 transition-colors shadow-sm text-xs font-mono"
                      />
                    </div>

                    <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">Verified Status</span>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">Certified</Badge>
                        <Badge className="bg-indigo-500/10 text-indigo-700 border-indigo-200 text-[9px] font-black uppercase">Regulatory Compliant</Badge>
                        <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 text-[9px] font-black uppercase">Verified Experience</Badge>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={handleSaveProfile}
                        className="w-full rounded-2xl h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-xl shadow-zinc-200 transition-all cursor-pointer"
                      >
                        Save Profile Details
                      </Button>
                    </div>

                    <div className="border-t border-zinc-100 pt-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="w-full rounded-2xl h-11 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold text-xs transition-all cursor-pointer"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger render={<Button className="rounded-2xl h-10 px-6 font-bold bg-zinc-900 shadow-xl shadow-zinc-200 hover:bg-zinc-800 hover:-translate-y-0.5 transition-all">Sign In</Button>} />
              <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-0 glass p-8">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-display font-bold tracking-tight text-center mb-2">Welcome Back</DialogTitle>
                  <p className="text-center text-muted-foreground text-sm mb-6 font-medium">Connect and list your shop, stock, and services on Tarntanya (Adelaide).</p>
                </DialogHeader>

                <div className="space-y-4">
                  <Button 
                    type="button" 
                    onClick={handleGoogleLogin}
                    className="w-full rounded-2xl h-14 bg-white hover:bg-zinc-50 border border-zinc-100 text-zinc-900 font-bold text-base shadow-sm flex items-center justify-center gap-3 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign In with Google
                  </Button>

                  <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-zinc-100" />
                    <span className="px-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">or sandbox access</span>
                    <div className="flex-1 h-px bg-zinc-100" />
                  </div>
                </div>

                <form onSubmit={handleLogin} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400 pl-1">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="rounded-2xl h-12 bg-white border-zinc-100 focus:border-zinc-300 transition-colors shadow-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400 pl-1">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-2xl h-12 bg-white border-zinc-100 focus:border-zinc-300 transition-colors shadow-sm"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-2xl h-14 bg-zinc-900 font-bold text-lg shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all mt-4">
                    Get Started
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
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
    </header>
  );
}
