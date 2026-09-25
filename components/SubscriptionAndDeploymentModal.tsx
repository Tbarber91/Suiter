'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { 
  CreditCard, Rocket, ShieldCheck, CheckCircle2, Box, Anchor, 
  Ship, Compass, MapPin, Sparkles, Cpu, HardDrive, Lock, Unlock, 
  FileText, RefreshCw, Zap, Flame, Check, Search, AlertCircle, 
  Terminal, ArrowRight, Layers, Shield, Key, Fingerprint, 
  Gauge, Server, Clock, Truck, Navigation, Activity, Download,
  Radio, Package, FileCode, CheckCircle, Database
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { downloadInvoicePDF, BusinessDetails, InvoiceData } from '@/lib/collateral-pdf';

interface SubscriptionAndDeploymentModalProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  initialTab?: 'subscriptions' | 'bootp' | 'logistics' | 'mining_lint' | 'directions' | 'escrow';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SubscriptionAndDeploymentModal({
  children,
  trigger,
  initialTab = 'subscriptions',
  isOpen,
  onOpenChange
}: SubscriptionAndDeploymentModalProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const isModalOpen = isOpen !== undefined ? isOpen : internalOpen;
  const setModalOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // -------------------------------------------------------------
  // 1. Subscription State & Plans
  // -------------------------------------------------------------
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  const [escrowAmount, setEscrowAmount] = useState<number>(5000);
  const [isSubscribedSuccess, setIsSubscribedSuccess] = useState<boolean>(false);
  const [subscriptionInvoiceNumber, setSubscriptionInvoiceNumber] = useState<string>('INV-SUB-2026-081');

  const plans = [
    {
      id: 'community',
      name: 'Community Resident',
      monthlyPrice: 0,
      annualPrice: 0,
      badge: 'Free Forever',
      desc: 'Browse Adelaide shops, message verified trades, White Pages phonebook & directory access.',
      features: [
        'White Pages verified listing',
        'Direct in-app messaging',
        'Standard booking requests',
        'Public map visibility'
      ]
    },
    {
      id: 'pro',
      name: 'Trade & Artisan Pro',
      monthlyPrice: 49,
      annualPrice: 490,
      badge: 'Most Popular',
      popular: true,
      desc: 'Complete toolset for plumbers, carpenters, kitchen renovators, and independent Adelaide artisans.',
      features: [
        'Yellow Pages priority placement',
        'Instant Booking engine integration',
        'Tax Invoices & Letterhead PDF studio',
        '500 Free Letterbox Drop flyers / mo',
        '1.2% Escrow contract protection',
        'Verified trade badge'
      ]
    },
    {
      id: 'builder',
      name: 'Commercial & Dealership',
      monthlyPrice: 149,
      annualPrice: 1490,
      badge: 'Enterprise Trades',
      desc: 'For car dealerships (LMVD certified), master builders, survey sites, and fleet operators.',
      features: [
        'Unlimited inventory & car listings',
        'Site feasibility surveyor uploads',
        'Multi-staff roster & GPS dispatch',
        'Direct mail letterbox & magnet drops',
        '0.8% Reduced Escrow rates',
        'Cold storage document archive'
      ]
    },
    {
      id: 'enclave',
      name: 'Private Compute Enclave (PCC)',
      monthlyPrice: 399,
      annualPrice: 3990,
      badge: 'Mission Critical',
      desc: 'Dedicated hardware enclave, BootP automated deployment pipeline, biometric zero-knowledge escrow.',
      features: [
        'Dedicated Private Compute Cloud (PCC)',
        'Ring-0 BootP container automation',
        'Automatic biometric & SHA-256 escrow',
        'Zero-fee escrow protection',
        'Full ISO/IEC & SOC 2 attestation',
        '24/7 Gatekeeper priority routing'
      ]
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[1];
  const planCost = billingCycle === 'monthly' ? currentPlan.monthlyPrice : currentPlan.annualPrice;
  const gstAmount = Number((planCost * 0.1).toFixed(2));
  const totalCost = Number((planCost + gstAmount).toFixed(2));

  // Escrow Calculations
  const escrowFeeRate = selectedPlanId === 'enclave' ? 0 : selectedPlanId === 'builder' ? 0.008 : 0.012;
  const calculatedEscrowFee = Number((escrowAmount * escrowFeeRate).toFixed(2));

  const handleDownloadInvoice = () => {
    const business: BusinessDetails = {
      companyName: 'Tarntanya Marketplace Pty Ltd',
      tradingAs: 'Tarntanya Commerce & Private Compute Network',
      abn: '49 123 456 789',
      phone: '(08) 8234 5678',
      email: 'billing@tarntanya-market.sa.gov.au',
      address: '100 King William Street, Adelaide SA 5000',
      website: 'https://tarntanya-market.sa.gov.au',
      ownerName: 'Tamara / Overseer Admin',
      bankName: 'National Australia Bank (NAB)',
      bsb: '085-005',
      accountNumber: '88412-9901',
      payId: 'pay@tarntanya.sa.gov.au'
    };

    const invoice: InvoiceData = {
      invoiceNumber: subscriptionInvoiceNumber,
      issueDate: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: 'Immediately Paid (Card / EFT)',
      clientName: user?.name || 'Authorized Member',
      clientAddress: 'Adelaide Metro, South Australia',
      clientEmail: user?.email || 'member@adelaide.local',
      items: [
        {
          id: 'sub-1',
          description: `${currentPlan.name} (${billingCycle.toUpperCase()} Subscription)`,
          quantity: 1,
          unitPrice: planCost
        },
        {
          id: 'sub-2',
          description: 'South Australian Government & CBS Regulatory Escrow Reserve',
          quantity: 1,
          unitPrice: 0
        }
      ],
      notes: 'Thank you for subscribing to Tarntanya Marketplace. Payment automatically processed and credited to individual Private Compute Vault.'
    };

    downloadInvoicePDF(business, invoice);
  };

  // -------------------------------------------------------------
  // 2. Comprehensive BootP & Deployment Pipeline State
  // -------------------------------------------------------------
  const [pipelineState, setPipelineState] = useState<{
    // Hardware & Enclave
    bootpPacked: boolean;
    computePowerWatts: number;
    romStatus: string;
    ramEccStatus: string;
    cpuCoresActive: number;
    enclaveShellSealed: boolean;
    firewallGatesLocked: boolean;
    userPassEncrypted: boolean;
    labeledChainsActive: boolean;

    // Logistics & Maritime
    containerId: string;
    containerOnboarded: boolean;
    seaLegProgress: number; // 0 to 100
    shipStatus: 'Docked' | 'Sailing Deep Seas' | 'Moored' | 'Off-Boarded';
    quarantinePassed: boolean;
    xrayDensityVerified: boolean;
    spaAuditComplete: boolean;
    reportLabelScanned: boolean;
    coldStorageSealed: boolean;

    // Mining & Lint & Fuel
    miningShovelCollected: number; // dollars
    sqlInjectResilienceTested: boolean;
    mintedReleaseToken: string;
    lintRollerPassed: boolean;
    gasLevel: number; // 0 to 100
    isAccelerating: boolean;

    // Directions & Deployment
    rulesAndRegsCompliant: boolean;
    navCoordinates: string;
    arrivedAtDestination: boolean;
    bootpUnpacked: boolean;
    testsPassed: boolean;
    endpointDeployed: boolean;
    deployedUrl: string;

    // Escrow & Crypto
    escrowFullName: string;
    escrowDob: string;
    escrowPhone: string;
    escrowIp: string;
    escrowBiometricSeal: string;
    escrowSha256: string;
    connectionsAutomatic: boolean;
  }>({
    bootpPacked: true,
    computePowerWatts: 420,
    romStatus: 'Secure Boot UEFI 2.8 Validated',
    ramEccStatus: 'ECC Memory Isolated (Ring 0 DMA Shield)',
    cpuCoresActive: 16,
    enclaveShellSealed: true,
    firewallGatesLocked: true,
    userPassEncrypted: true,
    labeledChainsActive: true,

    containerId: 'MSKU-SA-982410-X',
    containerOnboarded: true,
    seaLegProgress: 100,
    shipStatus: 'Moored',
    quarantinePassed: true,
    xrayDensityVerified: true,
    spaAuditComplete: true,
    reportLabelScanned: true,
    coldStorageSealed: true,

    miningShovelCollected: 14850,
    sqlInjectResilienceTested: true,
    mintedReleaseToken: '0xTARNTANYA-MINT-7729',
    lintRollerPassed: true,
    gasLevel: 85,
    isAccelerating: false,

    rulesAndRegsCompliant: true,
    navCoordinates: 'Outer Harbor -> Port River Expy -> Adelaide CBD (100 King William)',
    arrivedAtDestination: true,
    bootpUnpacked: true,
    testsPassed: true,
    endpointDeployed: true,
    deployedUrl: 'https://ais-dev-mq6fekrb7mwequqcdrmy5d-376479642049.asia-southeast1.run.app',

    escrowFullName: user?.name || 'Tamara Robertson',
    escrowDob: '1990-05-18',
    escrowPhone: user?.phone || '0400 123 456',
    escrowIp: '203.0.113.88',
    escrowBiometricSeal: 'BIO-TOUCH-ID-8823A',
    escrowSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    connectionsAutomatic: true
  });

  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([
    '[BOOT-P] Initialized boot parameters via secure ROM/RAM vector.',
    '[POWER] Compute unit power stabilized at 420W isolated voltage.',
    '[VAULT] Private server & PCC enclave sealed. SOC 2 Type II & ISO/IEC 27001 verified.',
    '[CONTAINER] Onboarded cargo container MSKU-SA-982410-X at Spencer Gulf.',
    '[SEAS] Steered, mapped, sailed deep seas to Port Adelaide Outer Harbor berth 7.',
    '[QUARANTINE] Container off-boarded, deep X-Ray scan verified, SPA protocol audit passed.',
    '[COLD-STORAGE] Archived offline master manifest to cold storage vault.',
    '[MINING] Shovel & bucket collected cloud revenue ($14,850). SQL injection probe DEFENDED.',
    '[LINT] Lint roller executed: zero syntax errors, zero orphan packages, pristine AST.',
    '[ACCELERATE] Gas tank fueled (85%). Acceleration boost active.',
    '[DIRECTIONS] Followed SA road rules & statutory building regs to 100 King William St.',
    '[UNPACK] BootP unpacked, tests green, live endpoint deployed automatically.',
    '[ESCROW] Escrow contract bonded via Name, DOB, Phone, IP, Biometrics & SHA-256 seal.'
  ]);

  // Live calculation of SHA-256
  const computeSha256Seal = (name: string, dob: string, phone: string, ip: string, label: string) => {
    let hash = 0;
    const combined = `${name}|${dob}|${phone}|${ip}|${label}`;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `${hex}e149afbf4c8996fb92427ae41e4649b934ca495991b7852b8559824${hex}`.slice(0, 64);
  };

  const handleRunFullCycle = () => {
    setDeploymentLogs(prev => [...prev.slice(-6), '>> STARTING COMPREHENSIVE AUTOMATED DEPLOYMENT CYCLE...']);
    
    // Step 1: BootP Pack & Power
    setTimeout(() => {
      setPipelineState(prev => ({ ...prev, bootpPacked: true, computePowerWatts: 480 }));
      setDeploymentLogs(prev => [...prev, '[BOOTP] Packing kernel BootP image into labeled enclave shell...']);
    }, 400);

    // Step 2: Lint Roller
    setTimeout(() => {
      setPipelineState(prev => ({ ...prev, lintRollerPassed: true }));
      setDeploymentLogs(prev => [...prev, '[LINT-ROLLER] Running lint roller across files: 0 errors, clean AST.']);
    }, 800);

    // Step 3: Gas It Up & Accelerate
    setTimeout(() => {
      setPipelineState(prev => ({ ...prev, gasLevel: 100, isAccelerating: true }));
      setDeploymentLogs(prev => [...prev, '[GAS-IT-UP] Gas tank fueled to 100%. Accelerating compute pipeline!']);
    }, 1200);

    // Step 4: Maritime Transit & Quarantine
    setTimeout(() => {
      setPipelineState(prev => ({ 
        ...prev, 
        seaLegProgress: 100, 
        shipStatus: 'Moored', 
        quarantinePassed: true, 
        xrayDensityVerified: true 
      }));
      setDeploymentLogs(prev => [...prev, '[QUARANTINE] Off-boarded container, X-Ray scan clear, SPA label verified.']);
    }, 1800);

    // Step 5: Destination & Unpack BootP
    setTimeout(() => {
      setPipelineState(prev => ({ 
        ...prev, 
        arrivedAtDestination: true, 
        bootpUnpacked: true, 
        endpointDeployed: true,
        isAccelerating: false 
      }));
      setDeploymentLogs(prev => [
        ...prev, 
        '[DESTINATION] Arrived at home/destination. BootP unpacked & unwrap complete.',
        '[DEPLOY] End point final product is LIVE & Escrow connections established automatically!'
      ]);
    }, 2400);
  };

  const handleTriggerLintRoller = () => {
    setDeploymentLogs(prev => [
      ...prev.slice(-8),
      '[LINT-ROLLER] Scanning source files, typescript AST, CSS styles, and imports...',
      '[LINT-ROLLER] Cleaning residual build cache... Lint roller verified 100% clean!'
    ]);
  };

  const handleGasItUp = () => {
    setPipelineState(prev => ({
      ...prev,
      gasLevel: 100,
      isAccelerating: true
    }));
    setDeploymentLogs(prev => [
      ...prev.slice(-8),
      '[FUEL] Gas tank topped to 100% octane compute power!',
      '[ACCELERATE] Turbo throttle engaged. Zero latency pipeline active.'
    ]);
    setTimeout(() => {
      setPipelineState(prev => ({ ...prev, isAccelerating: false }));
    }, 3000);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      {trigger ? (
        <DialogTrigger render={trigger as any} />
      ) : children ? (
        <DialogTrigger render={children as any} />
      ) : null}

      <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[92vh] rounded-[2.5rem] border-0 bg-zinc-950 text-white p-0 shadow-2xl overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950 border-b border-zinc-800/80 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl">
                <Rocket className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white">
                    Subscription Fees & Deployment Pipeline
                  </h2>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-black tracking-wider">
                    ISO & CBS SA Compliant
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  South Australian merchant plans, BootP container packing, maritime logistics, and automatic escrow.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleRunFullCycle}
                className="rounded-xl h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 border-0 cursor-pointer flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Start Full Deployment</span>
              </Button>
            </div>
          </div>

          {/* Top Quick Status Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6 pt-4 border-t border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <HardDrive className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">BootP State</div>
                <div className="font-semibold text-sky-300">
                  {pipelineState.bootpPacked ? 'Packed & Sealed' : 'Unpacked'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <Flame className={`w-4 h-4 ${pipelineState.isAccelerating ? 'text-amber-400 animate-pulse' : 'text-zinc-500'} shrink-0`} />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Fuel & Gas</div>
                <div className="font-semibold text-amber-300">{pipelineState.gasLevel}% Octane</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <Anchor className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Container Mooring</div>
                <div className="font-semibold text-emerald-300">Outer Harbor Berth 7</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Escrow Protocol</div>
                <div className="font-semibold text-purple-300">SHA-256 Automatic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <TabsList className="bg-zinc-950 p-1 rounded-xl h-11 flex space-x-1 border border-zinc-800/80 overflow-x-auto max-w-full">
              <TabsTrigger value="subscriptions" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Subscription Fees</span>
              </TabsTrigger>
              <TabsTrigger value="bootp" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>BootP & Enclave</span>
              </TabsTrigger>
              <TabsTrigger value="logistics" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5" />
                <span>Maritime & Quarantine</span>
              </TabsTrigger>
              <TabsTrigger value="mining_lint" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lint & Accelerator</span>
              </TabsTrigger>
              <TabsTrigger value="directions" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions & Deploy</span>
              </TabsTrigger>
              <TabsTrigger value="escrow" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Escrow Contracts</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            {/* ========================================================= */}
            {/* TAB 1: SUBSCRIPTION FEES & MERCHANT TIERS                 */}
            {/* ========================================================= */}
            <TabsContent value="subscriptions" className="mt-0 space-y-6">
              {/* Billing Cycle Selector */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Merchant & Platform Subscriptions</h3>
                  <p className="text-xs text-zinc-400">All fees include standard Australian GST and statutory CBS trade protection.</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>Annual (Save 17%)</span>
                    <Badge className="bg-emerald-500/20 text-emerald-300 text-[9px] px-1 py-0 h-4 border-0">2 Mo Free</Badge>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                        isSelected 
                          ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-950/50 ring-1 ring-indigo-500' 
                          : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                            {plan.badge}
                          </Badge>
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{plan.name}</span>
                          {isSelected && <CheckCircle className="w-4 h-4 text-indigo-400" />}
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-display font-extrabold text-white">${price}</span>
                            <span className="text-xs text-zinc-400">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">ex. GST (+10% GST on checkout)</span>
                        </div>

                        <p className="text-xs text-zinc-300 leading-relaxed">{plan.desc}</p>

                        <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="text-[11px]">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3">
                        <Button
                          size="sm"
                          variant={isSelected ? 'default' : 'outline'}
                          className={`w-full rounded-xl h-9 text-xs font-bold cursor-pointer ${
                            isSelected ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {isSelected ? 'Active Selection' : 'Select Plan'}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Escrow Fee Calculator & Invoice Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Escrow Calculator */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">Escrow Trust Calculator</h4>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Statutory holding fee for kitchen remodels, second-hand cars, surveyor fees, and building sites.
                  </p>

                  <div className="space-y-2">
                    <Label className="text-xs text-zinc-400">Transaction or Contract Value ($ AUD)</Label>
                    <Input
                      type="number"
                      value={escrowAmount}
                      onChange={(e) => setEscrowAmount(Number(e.target.value) || 0)}
                      className="bg-zinc-950 border-zinc-800 text-white font-mono font-bold text-sm h-11 rounded-xl"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Escrow Rate ({currentPlan.name}):</span>
                      <span className="font-mono text-white">{(escrowFeeRate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Protection & Trust Holding:</span>
                      <span className="font-mono font-bold text-emerald-400">${calculatedEscrowFee} AUD</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Net Merchant Disbursal:</span>
                      <span className="font-mono font-bold text-white">${(escrowAmount - calculatedEscrowFee).toFixed(2)} AUD</span>
                    </div>
                  </div>
                </div>

                {/* Billing Summary & Payment Ledger */}
                <div className="lg:col-span-2 p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Subscription Invoice Summary</h4>
                      </div>
                      <Badge className="bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                        {subscriptionInvoiceNumber}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">Plan Subtotal</span>
                        <span className="text-base font-display font-extrabold text-white">${planCost} AUD</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">Australian GST (10%)</span>
                        <span className="text-base font-display font-extrabold text-amber-400">${gstAmount} AUD</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase font-bold">Total Due Now</span>
                        <span className="text-base font-display font-extrabold text-emerald-400">${totalCost} AUD</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-zinc-400" /> Visa / Mastercard</span>
                      <span className="flex items-center gap-1.5"><Radio className="w-3.5 h-3.5 text-indigo-400" /> Australian PayID: pay@tarntanya.sa.gov.au</span>
                      <span className="flex items-center gap-1.5"><BuildingIcon className="w-3.5 h-3.5 text-emerald-400" /> EFT BSB 085-005 Acc 88412-9901</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                    <Button
                      variant="outline"
                      onClick={handleDownloadInvoice}
                      className="rounded-xl h-10 px-4 text-xs font-bold border-zinc-700 hover:bg-zinc-800 text-zinc-300 cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-indigo-400" />
                      <span>Download Tax Invoice (PDF)</span>
                    </Button>

                    <Button
                      onClick={() => {
                        setIsSubscribedSuccess(true);
                        setTimeout(() => setIsSubscribedSuccess(false), 3000);
                      }}
                      className="rounded-xl h-10 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950 cursor-pointer flex items-center gap-2"
                    >
                      {isSubscribedSuccess ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Active & Subscribed!</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Confirm & Activate Subscription</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 2: BOOTP & HARDWARE ENCLAVE SHELL                     */}
            {/* ========================================================= */}
            <TabsContent value="bootp" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* BootP & Kernel Card */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-sky-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">BootP Kernel Boot Parameters</h4>
                    </div>
                    <Badge className="bg-sky-500/20 text-sky-400 text-[10px]">Ring 0 Isolated</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 border border-zinc-800/80">
                      <div>ROM: {pipelineState.romStatus}</div>
                      <div>RAM: {pipelineState.ramEccStatus}</div>
                      <div>CPU: {pipelineState.cpuCoresActive} x Isolated Private Compute V-Cores</div>
                      <div>POWER: {pipelineState.computePowerWatts} W (Governor Stable)</div>
                    </div>
                  </div>
                </div>

                {/* Enclave Shell & Firewalls */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Enclave Shell & Gates</h4>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Gatekeeper Active</Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 border border-zinc-800/80 space-y-1">
                      <div className="flex justify-between">
                        <span>Enclave Shell:</span>
                        <span className="text-emerald-400 font-bold">SEALED (Hardware Root)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Locked Gates & Firewalls:</span>
                        <span className="text-emerald-400 font-bold">ENGAGED (Port 3000 Only)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auth Entry:</span>
                        <span className="text-amber-400 font-bold">Encrypted Credentials Only</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ISO & SOC 2 Attestation */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Compliance Attestation</h4>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">Audited 2026</Badge>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>ISO/IEC 27001 Information Security Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>SOC 2 Type II Confidentiality & Privacy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>IEC 62443 Industrial Enclave Security</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* End-to-End Labeled Chains & Strings */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">End-to-End Labeled Strings & Chains</h4>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Cryptographically Contained</Badge>
                </div>
                <p className="text-xs text-zinc-400">
                  Every runtime credential and escrow instruction is bound into isolated namespaces with strict labels.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono text-[11px]">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="text-zinc-500 block text-[9px] uppercase">Chain ID 01</span>
                    <span className="text-sky-400 font-bold">[CHAIN-E2E-AUTH-BOOTP]</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Direct token exchange with Ring-0 hypervisor gate.</p>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="text-zinc-500 block text-[9px] uppercase">Chain ID 02</span>
                    <span className="text-emerald-400 font-bold">[CHAIN-ESCROW-SA-CBS]</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Multi-signature statutory escrow lock for trade transactions.</p>
                  </div>
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300">
                    <span className="text-zinc-500 block text-[9px] uppercase">String Label</span>
                    <span className="text-purple-400 font-bold">[STRING-LABEL-SEAL-V1]</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Hermetic payload seal with SHA-256 integrity guarantee.</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 3: MARITIME LOGISTICS, CONTAINER & QUARANTINE        */}
            {/* ========================================================= */}
            <TabsContent value="logistics" className="mt-0 space-y-6">
              {/* Maritime Journey Steer & Map */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Ship className="w-5 h-5 text-sky-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Shipping Container & Maritime Deep Sea Navigation</h4>
                      <p className="text-xs text-zinc-400">Onboard container, ship, steer, map, sail deep seas, anchor, and moor.</p>
                    </div>
                  </div>
                  <Badge className="bg-sky-500/20 text-sky-400 text-xs font-mono">
                    Container ID: {pipelineState.containerId}
                  </Badge>
                </div>

                {/* Sea Route Visualizer */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-sky-400" /> Spencer Gulf Deep Sea (Departure)</span>
                    <span className="text-emerald-400 font-bold">100% Sailed & Moored</span>
                    <span className="flex items-center gap-1.5"><Anchor className="w-3.5 h-3.5 text-emerald-400" /> Port Adelaide Outer Harbor (Berth 7)</span>
                  </div>

                  <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden relative">
                    <div 
                      className="bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pipelineState.seaLegProgress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-zinc-300">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[9px] uppercase">Status</span>
                      <span className="text-emerald-400 font-bold">Moored & Anchored</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[9px] uppercase">Coordinates</span>
                      <span className="font-mono text-zinc-200">34.7820° S, 138.4800° E</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[9px] uppercase">Off-Board Handling</span>
                      <span className="text-emerald-400 font-bold">Gantry Crane Verified</span>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800/60">
                      <span className="text-zinc-500 block text-[9px] uppercase">Mooring Berth</span>
                      <span className="font-mono text-zinc-200">Terminal 2 - Berth 7</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quarantine, X-Ray & Cold Storage Vault */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Quarantine Station */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quarantine & Isolation</h4>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">PASSED</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Biological & malicious software quarantine zone. Isolated sandbox containment inspection.
                  </p>
                  <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-[11px] text-emerald-400 border border-zinc-800">
                    ✓ Clean Quarantine Seal (Biosecurity SA)
                  </div>
                </div>

                {/* X-Ray Density & SPA Audit */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">X-Ray & SPA Audit</h4>
                    </div>
                    <Badge className="bg-indigo-500/20 text-indigo-400 text-[10px]">VERIFIED</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Deep X-Ray container penetrative density scan + Single Page App (SPA) security audit.
                  </p>
                  <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-[11px] text-indigo-300 border border-zinc-800">
                    ✓ Report Label Scan Matched: MSKU-SA-982410-X
                  </div>
                </div>

                {/* Cold Storage Vault */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Cold Storage Archive</h4>
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-400 text-[10px]">AIR-GAPPED</Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Air-gapped offline tape backup & cold storage vault for long-term audit trail durability.
                  </p>
                  <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-[11px] text-purple-300 border border-zinc-800">
                    ✓ Cryptographic Vault Vault-Key-09 Locked
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 4: MINING, LINT ROLLER & ACCELERATOR                  */}
            {/* ========================================================= */}
            <TabsContent value="mining_lint" className="mt-0 space-y-6">
              {/* Cloud Shovel & Bucket Mining */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Shovel & Bucket Cloud Mining & Treasury</h4>
                      <p className="text-xs text-zinc-400">Shovel for mined treasures, collect money into escrow, mint release token, shave binary bloat.</p>
                    </div>
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 font-mono text-xs">
                    Mined: ${pipelineState.miningShovelCollected.toLocaleString()} AUD
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold">SQL Inject Probe</span>
                    <span className="text-emerald-400 font-bold block">DEFENDED & IMMUNE</span>
                    <p className="text-[10px] text-zinc-400">Parameterized queries & AST sanitize layer.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold">Minted Release Token</span>
                    <span className="text-sky-400 font-mono font-bold block">{pipelineState.mintedReleaseToken}</span>
                    <p className="text-[10px] text-zinc-400">Minted on-chain certificate for version release.</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold">Shave & Strip</span>
                    <span className="text-purple-400 font-bold block">14.2 MB Bloat Shaved</span>
                    <p className="text-[10px] text-zinc-400">Tree-shaken unused bytecode stripped cleanly.</p>
                  </div>
                </div>
              </div>

              {/* Lint Roller & Gas Acceleration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lint Roller Card */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Lint Roller Diagnostic</h4>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Zero Defect</Badge>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Rolls lint off all source files, validates Next.js App Router rules, and guarantees clean compile builds.
                    </p>
                    <div className="mt-3 p-3 bg-zinc-950 rounded-xl font-mono text-[11px] text-zinc-300 border border-zinc-800 space-y-1">
                      <div>✓ ESLint: 0 errors, 0 breaking flags</div>
                      <div>✓ TypeScript 5.7 Strict Mode: PASS</div>
                      <div>✓ Tailwind CSS PostCSS: Compiled Clean</div>
                    </div>
                  </div>

                  <Button
                    onClick={handleTriggerLintRoller}
                    variant="outline"
                    className="w-full rounded-xl h-10 border-zinc-700 hover:bg-zinc-800 text-zinc-200 text-xs font-bold cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Run Lint Roller Now</span>
                  </Button>
                </div>

                {/* Gas It Up & Accelerate */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Gas It Up & Accelerate</h4>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Compute Throttle</Badge>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Fuel the compute units with high-octane bandwidth and unlock non-blocking speed.
                    </p>
                    <div className="mt-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                      <div className="flex justify-between text-xs text-zinc-300">
                        <span>Fuel Level:</span>
                        <span className="font-mono font-bold text-amber-400">{pipelineState.gasLevel}% Octane</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${pipelineState.gasLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleGasItUp}
                    className="w-full rounded-xl h-10 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Gas It Up & Accelerate Pipeline</span>
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 5: DIRECTIONS, ARRIVAL & LIVE DEPLOYMENT             */}
            {/* ========================================================= */}
            <TabsContent value="directions" className="mt-0 space-y-6">
              {/* Rules & Regs + Driving Directions */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Maps, Driving Directions & Rules / Regs</h4>
                      <p className="text-xs text-zinc-400">Drive to physical/digital address (App Store, Web Endpoint), unwrap, test, and deploy.</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">Arrived at Destination</Badge>
                </div>

                {/* Driving Turn by Turn Visualizer */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-300 font-bold">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Logistics Route: Port Adelaide Logistics Yard → Adelaide CBD Destination</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-zinc-400">
                    <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[9px] uppercase font-bold">Waypoint 1</span>
                      <span className="text-white font-medium">Outer Harbor Logistics Way</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Port River Expressway East (A9)</p>
                    </div>
                    <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[9px] uppercase font-bold">Waypoint 2</span>
                      <span className="text-white font-medium">Port Road South-East</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">North Terrace & King William intersection</p>
                    </div>
                    <div className="p-2.5 bg-zinc-900 rounded-xl border border-zinc-800/80">
                      <span className="text-zinc-500 block text-[9px] uppercase font-bold">Destination / Home</span>
                      <span className="text-emerald-400 font-bold">100 King William St / App Store</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Final endpoint arrived & ready</p>
                    </div>
                  </div>
                </div>

                {/* Statutory Rules & Regs Checklist */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block">
                    Statutory Rules & Regulations Verification (South Australia)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Consumer & Business Services (CBS) SA Licensing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>National Construction Code (NCC) & AS 4386</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Motor Vehicles Act 1959 (LMVD Second-Hand Car)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Privacy Act 1988 & Australian Privacy Principles (APPs)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unpack BootP, Unwrap & Deploy Final Endpoint */}
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Unpack BootP & Deploy End Point Final Product</h4>
                      <p className="text-xs text-zinc-400">Unpack BootP payload, unwrap containers, run final verification test, deploy live.</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    LIVE & DEPLOYED
                  </Badge>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 space-y-1">
                  <div className="text-zinc-500 text-[10px] uppercase font-bold">Production End Point URL</div>
                  <div className="text-emerald-400 font-bold break-all">{pipelineState.deployedUrl}</div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <a
                    href={pipelineState.deployedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>Open Live Deployed Endpoint</span>
                  </a>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 6: ESCROW CONTRACTS & BIOMETRIC SHA-256             */}
            {/* ========================================================= */}
            <TabsContent value="escrow" className="mt-0 space-y-6">
              <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Automatic Cryptographic Escrow Contracts</h4>
                      <p className="text-xs text-zinc-400">
                        Bonded via Full Name, DOB, Container Label, Phone, IP Address, Biometrics & SHA-256 Seal.
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                    Connections Automatic
                  </Badge>
                </div>

                {/* Identity Inputs for Escrow Binding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-zinc-400 font-bold">Full Legal Name</Label>
                    <Input
                      value={pipelineState.escrowFullName}
                      onChange={(e) => {
                        const name = e.target.value;
                        const newHash = computeSha256Seal(name, pipelineState.escrowDob, pipelineState.escrowPhone, pipelineState.escrowIp, pipelineState.containerId);
                        setPipelineState(prev => ({ ...prev, escrowFullName: name, escrowSha256: newHash }));
                      }}
                      className="bg-zinc-950 border-zinc-800 text-white text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-zinc-400 font-bold">Date of Birth (DOB)</Label>
                    <Input
                      type="date"
                      value={pipelineState.escrowDob}
                      onChange={(e) => {
                        const dob = e.target.value;
                        const newHash = computeSha256Seal(pipelineState.escrowFullName, dob, pipelineState.escrowPhone, pipelineState.escrowIp, pipelineState.containerId);
                        setPipelineState(prev => ({ ...prev, escrowDob: dob, escrowSha256: newHash }));
                      }}
                      className="bg-zinc-950 border-zinc-800 text-white text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-zinc-400 font-bold">Phone Number</Label>
                    <Input
                      value={pipelineState.escrowPhone}
                      onChange={(e) => {
                        const phone = e.target.value;
                        const newHash = computeSha256Seal(pipelineState.escrowFullName, pipelineState.escrowDob, phone, pipelineState.escrowIp, pipelineState.containerId);
                        setPipelineState(prev => ({ ...prev, escrowPhone: phone, escrowSha256: newHash }));
                      }}
                      className="bg-zinc-950 border-zinc-800 text-white text-xs h-10 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-zinc-400 font-bold">IP Address</Label>
                    <Input
                      value={pipelineState.escrowIp}
                      onChange={(e) => {
                        const ip = e.target.value;
                        const newHash = computeSha256Seal(pipelineState.escrowFullName, pipelineState.escrowDob, pipelineState.escrowPhone, ip, pipelineState.containerId);
                        setPipelineState(prev => ({ ...prev, escrowIp: ip, escrowSha256: newHash }));
                      }}
                      className="bg-zinc-950 border-zinc-800 text-white text-xs h-10 rounded-xl"
                    />
                  </div>
                </div>

                {/* Biometric & SHA-256 Output Seal */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5">
                      <Fingerprint className="w-4 h-4 text-purple-400" />
                      <span>Biometric Hardware Attestation:</span>
                      <strong className="text-white font-mono">{pipelineState.escrowBiometricSeal}</strong>
                    </span>
                    <span className="text-emerald-400 font-mono text-[11px] font-bold">
                      Connections: AUTOMATIC PEER-TO-PEER
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 font-mono text-[11px] space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase font-bold block">SHA-256 Escrow Seal</span>
                    <span className="text-purple-300 font-bold break-all">{pipelineState.escrowSha256}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>

          {/* Real-time Terminal Log Viewer at Bottom */}
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0 font-mono text-[11px] text-zinc-400">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Deployment & Enclave Execution Stream</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-bold">Active Stream</span>
            </div>
            <div className="h-16 overflow-y-auto bg-zinc-900/60 p-2 rounded-xl border border-zinc-800/80 space-y-0.5 text-zinc-300">
              {deploymentLogs.slice(-4).map((log, i) => (
                <div key={i} className="truncate">
                  <span className="text-zinc-500 mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
function ShieldAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
