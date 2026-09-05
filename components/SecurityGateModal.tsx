'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Lock, Unlock, Shield, KeyRound, CheckCircle2, 
  Crown, Briefcase, TrendingUp, UserCheck, ShieldAlert, Terminal, Eye, LockKeyhole
} from 'lucide-react';
import { useAuth } from './AuthProvider';

interface SecurityGateModalProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SecurityGateModal({ children, isOpen, onOpenChange }: SecurityGateModalProps) {
  const { user, switchRole, toggleGateLock, unlockGateWithKey } = useAuth();
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [isUnlockedSuccess, setIsUnlockedSuccess] = useState(false);

  const handleAuthorizeKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockGateWithKey(passkey)) {
      setPasskeyError(false);
      setIsUnlockedSuccess(true);
      setPasskey('');
      setTimeout(() => setIsUnlockedSuccess(false), 2500);
    } else {
      setPasskeyError(true);
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'management':
        return <Briefcase className="w-4 h-4 text-indigo-400" />;
      case 'investor':
        return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      default:
        return <UserCheck className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getRoleTitle = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Top Level Management, Admin & Overseer';
      case 'management':
        return 'Management Profile';
      case 'investor':
        return 'Investor Profile';
      default:
        return 'General User';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {children && <DialogTrigger render={children as any} />}
      <DialogContent className="sm:max-w-[560px] rounded-[2.5rem] border-0 bg-zinc-950 text-white p-8 shadow-2xl overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">AES-256 Auth Security Gate</span>
            </div>
            <Badge className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              user?.isGateLocked ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {user?.isGateLocked ? 'Gate Locked' : 'Authenticated & Authorized'}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-display font-bold tracking-tight text-white">
            Encrypted Gate Control Panel
          </DialogTitle>
          <p className="text-xs text-zinc-400 font-medium">
            Authorized entry gate management for Overseer Admin, Management, Investors, and Users.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Overseer Profile & Token Card */}
          <div className="p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  {getRoleIcon(user?.role)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    {user?.name || 'Overseer Admin'}
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {user?.role?.toUpperCase()}
                    </span>
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-medium">{user?.email}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={toggleGateLock}
                className={`rounded-2xl h-10 px-4 font-bold text-xs border transition-all cursor-pointer ${
                  user?.isGateLocked 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {user?.isGateLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                    Unlock Gate
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Lock Gate
                  </>
                )}
              </Button>
            </div>

            {/* Token display */}
            <div className="p-3 bg-black/60 rounded-2xl border border-zinc-800/80 flex items-center justify-between font-mono text-[10px]">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[280px]">{user?.encryptedAuthToken || 'ENC-RSA4096-AUTHORISED-SESSION'}</span>
              </div>
              <span className="text-emerald-400 font-bold shrink-0">VALID</span>
            </div>
          </div>

          {/* Key Passcode Gate Form */}
          {user?.isGateLocked && (
            <form onSubmit={handleAuthorizeKey} className="p-5 rounded-3xl bg-rose-950/20 border border-rose-900/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <LockKeyhole className="w-4 h-4" />
                <span>Security Passcode Gate Active</span>
              </div>
              <p className="text-[11px] text-zinc-400">Enter authorized encrypted security key or passkey to disarm locked gate.</p>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter Passkey (e.g. 2026-OVERSEER)..."
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white rounded-2xl h-11 text-xs font-mono"
                />
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl h-11 px-5 font-bold text-xs shrink-0 cursor-pointer">
                  <KeyRound className="w-3.5 h-3.5 mr-1.5" /> Authorize
                </Button>
              </div>
              {passkeyError && <p className="text-[10px] text-rose-400 font-medium">Invalid passkey. Please enter 4+ characters key.</p>}
            </form>
          )}

          {isUnlockedSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Gate successfully unlocked! Full Overseer permissions active.</span>
            </div>
          )}

          {/* Role Switcher & Profile View Perspective */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">
              Authorized Role Switcher (Live Test Views)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  user?.role === 'admin' 
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-lg' 
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs">Top Level Overseer</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Full System Admin & Root Management</p>
              </button>

              <button
                type="button"
                onClick={() => switchRole('management')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  user?.role === 'management' 
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300 shadow-lg' 
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-xs">Management Profile</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Operations, Approvals & Compliance</p>
              </button>

              <button
                type="button"
                onClick={() => switchRole('investor')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  user?.role === 'investor' 
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-lg' 
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs">Investor Profile</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Portfolio Metrics & Syndicate ROI</p>
              </button>

              <button
                type="button"
                onClick={() => switchRole('user')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  user?.role === 'user' 
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-lg' 
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-zinc-400" />
                  <span className="font-bold text-xs">General User</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-medium">Standard Marketplace Browsing & Messaging</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
