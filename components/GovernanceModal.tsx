'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { GovernanceSection } from './GovernanceSection';
import { Scale, ShieldCheck } from 'lucide-react';
import { Badge } from './ui/badge';

interface GovernanceModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

export function GovernanceModal({ isOpen, onOpenChange, trigger }: GovernanceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[920px] rounded-[2.5rem] border-0 glass p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 text-white flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl md:text-3xl font-display font-bold tracking-tight">
                  Governance & Compliance Library
                </DialogTitle>
                <p className="text-xs text-muted-foreground font-medium">
                  Statutory privacy frameworks, codes of practice, and regulations for Suiter Marketplace.
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px] font-bold hidden sm:inline-flex">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active Compliance
            </Badge>
          </div>
        </DialogHeader>

        <div className="pt-2">
          <GovernanceSection embedded={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
