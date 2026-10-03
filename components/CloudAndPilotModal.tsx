'use client';

import React, { useState } from 'react';
import {
  Compass,
  Cloud,
  Cpu,
  ShieldCheck,
  Server,
  Zap,
  Activity,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Radio,
  Sliders,
  Plane,
  Terminal,
  RefreshCw,
  Power,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CloudAndPilotModal({
  trigger,
  children,
}: {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pilot' | 'cloud' | 'fencing'>('pilot');

  // Pilot Autonomous states
  const [autopilotPricing, setAutopilotPricing] = useState(true);
  const [autopilotEscrow, setAutopilotEscrow] = useState(true);
  const [autopilotSafetyScreening, setAutopilotSafetyScreening] = useState(true);
  const [droneSiteSurveys, setDroneSiteSurveys] = useState(true);

  // Cloud Services state
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [cloudSyncedTime, setCloudSyncedTime] = useState('Just now');
  const [gateLocked, setGateLocked] = useState(true);

  const handleSyncCloud = () => {
    setIsCloudSyncing(true);
    setTimeout(() => {
      setIsCloudSyncing(false);
      setCloudSyncedTime(new Date().toLocaleTimeString());
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <span onClick={() => setIsOpen(true)} className="inline-flex cursor-pointer">
          {trigger}
        </span>
      ) : children ? (
        <span onClick={() => setIsOpen(true)} className="inline-flex cursor-pointer">
          {children}
        </span>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="rounded-2xl h-10 border-cyan-200 bg-cyan-50/60 hover:bg-cyan-100/70 text-cyan-950 transition-all items-center gap-1.5 cursor-pointer text-xs font-bold shadow-sm"
        >
          <Compass className="w-4 h-4 text-cyan-600" />
          <span>Pilot & Cloud</span>
        </Button>
      )}

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-0 border-0 shadow-2xl">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-zinc-950 via-slate-900 to-cyan-950 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-display font-bold">
                    Autonomous Pilot & Cloud Services
                  </DialogTitle>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-[10px] font-mono">
                    ONLINE • 99.99% SLA
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-zinc-300 mt-0.5">
                  Autonomous marketplace operations, Private Cloud Compute, and telemetry gatekeepers.
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncCloud}
              disabled={isCloudSyncing}
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-xl text-xs font-semibold gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
              {isCloudSyncing ? 'Syncing...' : 'Sync Cloud'}
            </Button>
          </div>
        </div>

        {/* Tabs navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="px-6 pt-4 border-b border-zinc-100">
            <TabsList className="grid grid-cols-3 bg-zinc-100 p-1 rounded-2xl">
              <TabsTrigger value="pilot" className="rounded-xl text-xs font-bold">
                <Compass className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
                Autopilot Orchestrator
              </TabsTrigger>
              <TabsTrigger value="cloud" className="rounded-xl text-xs font-bold">
                <Cloud className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Private Cloud Services
              </TabsTrigger>
              <TabsTrigger value="fencing" className="rounded-xl text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Automated Gatekeeper
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: AUTOPILOT ORCHESTRATOR */}
          <TabsContent value="pilot" className="p-6 space-y-4 m-0">
            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-600 text-white mt-0.5">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-cyan-950">Active Autonomous Commercial Pilot</h4>
                <p className="text-[11px] text-cyan-900 leading-relaxed mt-0.5">
                  Suiter Autopilot manages micro-pricing adjustments, automated escrow release upon courier sign-off, and real-time ad bidding across Apple Maps and Google Ads.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">Dynamic Pricing Estimator</span>
                  <input
                    type="checkbox"
                    checked={autopilotPricing}
                    onChange={(e) => setAutopilotPricing(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Automatically benchmarks listing prices against recent Adelaide trade and vehicle sales.
                </p>
                <Badge variant="outline" className="text-[9px] bg-white font-mono text-emerald-600 border-emerald-200">
                  Active • Re-evaluates Hourly
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">Instant Escrow Release Pilot</span>
                  <input
                    type="checkbox"
                    checked={autopilotEscrow}
                    onChange={(e) => setAutopilotEscrow(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Disburses settlement funds directly to Visa/Mastercard the moment driver confirms physical handover.
                </p>
                <Badge variant="outline" className="text-[9px] bg-white font-mono text-emerald-600 border-emerald-200">
                  Instant • Zero Chargebacks
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">Zero-Alcohol & Safety Fencing</span>
                  <input
                    type="checkbox"
                    checked={autopilotSafetyScreening}
                    onChange={(e) => setAutopilotSafetyScreening(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Pre-screens and blocks alcohol, tobacco, unverified medical, and counterfeit listings before indexing.
                </p>
                <Badge variant="outline" className="text-[9px] bg-white font-mono text-emerald-600 border-emerald-200">
                  100% Policy Compliance
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">Aerial Survey & CAD Pilot</span>
                  <input
                    type="checkbox"
                    checked={droneSiteSurveys}
                    onChange={(e) => setDroneSiteSurveys(e.target.checked)}
                    className="w-4 h-4 accent-cyan-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  Automates site contour feeds, CAD blueprint overlays, and soil report sync for building sites.
                </p>
                <Badge variant="outline" className="text-[9px] bg-white font-mono text-emerald-600 border-emerald-200">
                  Synced with Unley & Tarntanya
                </Badge>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: PRIVATE CLOUD SERVICES */}
          <TabsContent value="cloud" className="p-6 space-y-4 m-0">
            <div className="p-5 rounded-2xl bg-zinc-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm">GCP & Private Cloud Compute Cluster</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">HEALTHY (24ms)</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Compute Node</span>
                  <span className="font-bold text-white text-[11px]">Cloud Run asia-se1</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Database State</span>
                  <span className="font-bold text-white text-[11px]">Firestore Active</span>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Cloud Sync</span>
                  <span className="font-bold text-cyan-300 text-[11px]">{cloudSyncedTime}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-800">Managed Cloud Services</span>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Firestore Persistent Vault</span>
                      <span className="text-[10px] text-zinc-500 font-mono">ai-studio-6af02fc1-cf84-449c-9a75-286145932ae3</span>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px]">Connected</Badge>
                </div>

                <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Cloud className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Apple Private Cloud Compute (PCC)</span>
                      <span className="text-[10px] text-zinc-500 font-mono">End-to-end cryptographic isolation</span>
                    </div>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 text-[10px]">Hardware Enclave</Badge>
                </div>

                <div className="p-3 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-cyan-600" />
                    <div>
                      <span className="font-bold text-zinc-900 block">Edge CDN & Apple Maps Ingestion</span>
                      <span className="text-[10px] text-zinc-500 font-mono">Real-time local proxy & routing</span>
                    </div>
                  </div>
                  <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-100 text-[10px]">Zero-Cold-Start</Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: AUTOMATED GATEKEEPER & NETWORK FENCING */}
          <TabsContent value="fencing" className="p-6 space-y-4 m-0">
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-xs font-bold text-zinc-900">Automated Network Gatekeeper & Firewall</h4>
                </div>
                <Badge className="bg-zinc-900 text-white font-mono text-[10px]">
                  {gateLocked ? 'GATES SHUT & ARMED' : 'OPEN'}
                </Badge>
              </div>

              <p className="text-[11px] text-zinc-600 leading-relaxed">
                As required by enterprise telecommunications fencing: whenever you exit the application or stop builds, all peripheral gates, ports, and external tunnels automatically shut behind you even while stationary.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase block">SQL Injection Shield</span>
                  <span className="font-bold text-emerald-600 text-xs">Parameterized & Active</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase block">Auto-Gate Closure</span>
                  <span className="font-bold text-emerald-600 text-xs">Triggered On Inactivity</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  onClick={() => setGateLocked(!gateLocked)}
                  className={`flex-1 rounded-xl text-xs font-bold ${
                    gateLocked
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5 mr-1.5" />
                  {gateLocked ? 'Automated Security Gates Locked' : 'Unlock Access Gate'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
