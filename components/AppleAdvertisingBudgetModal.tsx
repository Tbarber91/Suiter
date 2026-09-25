'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  FileText, 
  Download, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  Layers, 
  PieChart, 
  BarChart3, 
  Search, 
  Sparkles, 
  AlertCircle, 
  ShieldCheck, 
  Radio, 
  Send, 
  Play, 
  Pause, 
  Clock, 
  SlidersHorizontal, 
  Zap, 
  Building2, 
  Receipt,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
  Wallet,
  ArrowDownToLine,
  Landmark,
  Eye,
  MousePointerClick,
  Target
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { downloadInvoicePDF, BusinessDetails, InvoiceData, InvoiceItem } from '@/lib/collateral-pdf';

interface AppleAdvertisingBudgetModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  initialTab?: 'budget' | 'campaigns' | 'invoicing' | 'payout';
}

interface MediaChannel {
  id: string;
  name: string;
  allocatedBudget: number;
  spent: number;
  roas: number;
  cpt: number;
  impressions: number;
  taps: number;
  conversions: number;
  color: string;
  icon: string;
}

interface AppleCampaign {
  id: string;
  title: string;
  channel: string;
  dailyBudget: number;
  totalSpend: number;
  status: 'active' | 'paused' | 'scheduled';
  impressions: number;
  taps: number;
  conversions: number;
  cpa: number;
  roas: number;
  targetArea: string;
}

interface AdInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  campaignTitle: string;
  channel: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'instant_settled';
  items: InvoiceItem[];
}

interface PayoutRecord {
  id: string;
  payoutNumber: string;
  amount: number;
  recipientName: string;
  bsb: string;
  accountNumber: string;
  rail: string;
  reference: string;
  timestamp: string;
  status: 'settled' | 'processing';
  receiptUrl?: string;
}

const INITIAL_CHANNELS: MediaChannel[] = [
  {
    id: 'search_ads',
    name: 'Apple Search Ads (App Store)',
    allocatedBudget: 55000,
    spent: 34200,
    roas: 5.2,
    cpt: 1.25,
    impressions: 480000,
    taps: 27360,
    conversions: 3280,
    color: 'bg-indigo-500',
    icon: ''
  },
  {
    id: 'maps_ads',
    name: 'Apple Maps Sponsored Pins & Waypoints',
    allocatedBudget: 35000,
    spent: 19400,
    roas: 4.8,
    cpt: 0.95,
    impressions: 520000,
    taps: 20420,
    conversions: 2150,
    color: 'bg-emerald-500',
    icon: '📍'
  },
  {
    id: 'news_ads',
    name: 'Apple News & Stocks Native Media',
    allocatedBudget: 25000,
    spent: 15100,
    roas: 4.1,
    cpt: 1.45,
    impressions: 310000,
    taps: 10410,
    conversions: 890,
    color: 'bg-rose-500',
    icon: '📰'
  },
  {
    id: 'podcasts_ads',
    name: 'Apple Podcasts Audio Sponsoring',
    allocatedBudget: 20000,
    spent: 11250,
    roas: 4.6,
    cpt: 1.80,
    impressions: 195000,
    taps: 6250,
    conversions: 620,
    color: 'bg-purple-500',
    icon: '🎙️'
  },
  {
    id: 'tv_media',
    name: 'Apple TV+ Video Spot Allocations',
    allocatedBudget: 15000,
    spent: 5300,
    roas: 3.9,
    cpt: 2.10,
    impressions: 115000,
    taps: 2520,
    conversions: 240,
    color: 'bg-amber-500',
    icon: '📺'
  }
];

const INITIAL_CAMPAIGNS: AppleCampaign[] = [
  {
    id: 'camp-1',
    title: 'Norwood Prestige Kitchens - Apple Maps Top Placement',
    channel: 'Apple Maps Sponsored Pins',
    dailyBudget: 150,
    totalSpend: 7850,
    status: 'active',
    impressions: 185000,
    taps: 8260,
    conversions: 940,
    cpa: 8.35,
    roas: 5.4,
    targetArea: 'Adelaide Eastern Suburbs & The Parade'
  },
  {
    id: 'camp-2',
    title: 'Toyota Hybrid Cruiser - App Store Search Ad',
    channel: 'Apple Search Ads (App Store)',
    dailyBudget: 220,
    totalSpend: 14200,
    status: 'active',
    impressions: 290000,
    taps: 11360,
    conversions: 1450,
    cpa: 9.79,
    roas: 5.8,
    targetArea: 'Adelaide Metro & South Australia'
  },
  {
    id: 'camp-3',
    title: 'Vance Joinery & Stone - Apple News Prime Adelaide',
    channel: 'Apple News & Stocks Native Media',
    dailyBudget: 90,
    totalSpend: 5400,
    status: 'active',
    impressions: 140000,
    taps: 3720,
    conversions: 380,
    cpa: 14.21,
    roas: 4.2,
    targetArea: 'Adelaide CBD & North Adelaide'
  },
  {
    id: 'camp-4',
    title: 'Unley Architectural Feasibility - Apple Podcasts Spotlight',
    channel: 'Apple Podcasts Audio Sponsoring',
    dailyBudget: 65,
    totalSpend: 3120,
    status: 'paused',
    impressions: 65000,
    taps: 1730,
    conversions: 190,
    cpa: 16.42,
    roas: 3.8,
    targetArea: 'South Australia Statewide'
  }
];

const INITIAL_INVOICES: AdInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'AAPL-INV-2026-081',
    clientName: 'Norwood Architectural Joinery',
    campaignTitle: 'Apple Maps Top Placement & Waypoint Promotion',
    channel: 'Apple Maps Sponsored Pins',
    amount: 3450.00,
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'paid',
    items: [
      { id: '1', description: 'Apple Maps Sponsored Pin & Top-of-Search Placement (Adelaide Metro)', quantity: 1, unitPrice: 2800.00 },
      { id: '2', description: 'Media Management & Turn-by-Turn Waypoint Optimization', quantity: 1, unitPrice: 650.00 }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'AAPL-INV-2026-082',
    clientName: 'City West Toyota Certified LMVD',
    campaignTitle: 'Toyota Hybrid Cruiser - App Store Search Ads',
    channel: 'Apple Search Ads (App Store)',
    amount: 5850.00,
    issueDate: '2026-09-05',
    dueDate: '2026-09-19',
    status: 'instant_settled',
    items: [
      { id: '1', description: 'Apple Search Ads Keyword Allocation & Direct Bid Campaign', quantity: 1, unitPrice: 4600.00 },
      { id: '2', description: 'Creative Media Production & Audience Retargeting Management', quantity: 1, unitPrice: 1250.00 }
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'AAPL-INV-2026-083',
    clientName: 'Vance Joinery & Stone Studio',
    campaignTitle: 'Apple News & Stocks Native Media Campaign',
    channel: 'Apple News & Stocks Native Media',
    amount: 2200.00,
    issueDate: '2026-09-10',
    dueDate: '2026-09-24',
    status: 'pending',
    items: [
      { id: '1', description: 'Apple News Prime Placement - South Australia Regional Feed', quantity: 1, unitPrice: 1750.00 },
      { id: '2', description: 'Analytics Reporting & Cross-Device Attribution Audit', quantity: 1, unitPrice: 450.00 }
    ]
  }
];

const INITIAL_PAYOUTS: PayoutRecord[] = [
  {
    id: 'pay-1',
    payoutNumber: 'NPP-PAY-984210',
    amount: 5850.00,
    recipientName: 'Tamara Alana Barber',
    bsb: '062-948',
    accountNumber: '2383 7561',
    rail: 'NPP Osko Instant (National Australia Bank)',
    reference: 'AAPL-COMM-SEPT-01',
    timestamp: '12 Sep 2026, 03:45 PM',
    status: 'settled'
  },
  {
    id: 'pay-2',
    payoutNumber: 'NPP-PAY-981044',
    amount: 3450.00,
    recipientName: 'Tamara Alana Barber',
    bsb: '062-948',
    accountNumber: '2383 7561',
    rail: 'NPP Osko Instant (National Australia Bank)',
    reference: 'AAPL-MAPS-AD-SETTLE',
    timestamp: '08 Sep 2026, 11:20 AM',
    status: 'settled'
  },
  {
    id: 'pay-3',
    payoutNumber: 'NPP-PAY-978120',
    amount: 4200.00,
    recipientName: 'Tamara Alana Barber',
    bsb: '062-948',
    accountNumber: '2383 7561',
    rail: 'NPP Osko Instant (National Australia Bank)',
    reference: 'AAPL-MEDIA-MGMT-AUG',
    timestamp: '29 Aug 2026, 02:15 PM',
    status: 'settled'
  }
];

export function AppleAdvertisingBudgetModal({
  isOpen,
  onOpenChange,
  trigger,
  initialTab = 'budget'
}: AppleAdvertisingBudgetModalProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const showModal = isOpen !== undefined ? isOpen : internalOpen;
  const setShowModal = onOpenChange || setInternalOpen;

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Budget & Channels State
  const [totalBudget, setTotalBudget] = useState<number>(150000);
  const [channels, setChannels] = useState<MediaChannel[]>(INITIAL_CHANNELS);
  const [pacingMode, setPacingMode] = useState<'standard' | 'accelerated'>('standard');
  const [autoReallocate, setAutoReallocate] = useState<boolean>(true);
  const [circuitBreakerThreshold, setCircuitBreakerThreshold] = useState<number>(95);

  // Campaigns State
  const [campaigns, setCampaigns] = useState<AppleCampaign[]>(INITIAL_CAMPAIGNS);
  const [campaignFilter, setCampaignFilter] = useState<string>('all');
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState<string>('');
  const [newCampaignChannel, setNewCampaignChannel] = useState<string>('Apple Search Ads (App Store)');
  const [newCampaignBudget, setNewCampaignBudget] = useState<number>(100);
  const [newCampaignArea, setNewCampaignArea] = useState<string>('Adelaide Metro');

  // Invoicing State
  const [invoices, setInvoices] = useState<AdInvoice[]>(INITIAL_INVOICES);
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all');
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<AdInvoice | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState<boolean>(false);
  const [newInvoiceClient, setNewInvoiceClient] = useState<string>('');
  const [newInvoiceCampaign, setNewInvoiceCampaign] = useState<string>('');
  const [newInvoiceChannel, setNewInvoiceChannel] = useState<string>('Apple Search Ads (App Store)');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState<number>(1500);

  // Instant Payout State
  const [availablePayoutBalance, setAvailablePayoutBalance] = useState<number>(24850.00);
  const [payoutAmountInput, setPayoutAmountInput] = useState<string>('5000');
  const [payoutRail, setPayoutRail] = useState<'bsb' | 'apple_pay' | 'card'>('bsb');
  const [recipientName, setRecipientName] = useState<string>('Tamara Alana Barber');
  const [recipientBsb, setRecipientBsb] = useState<string>('062-948');
  const [recipientAcc, setRecipientAcc] = useState<string>('2383 7561');
  const [payoutsHistory, setPayoutsHistory] = useState<PayoutRecord[]>(INITIAL_PAYOUTS);
  const [isProcessingPayout, setIsProcessingPayout] = useState<boolean>(false);
  const [payoutSuccessMessage, setPayoutSuccessMessage] = useState<string | null>(null);

  // Aggregated Media Metrics
  const totalSpentAcrossChannels = channels.reduce((acc, c) => acc + c.spent, 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpentAcrossChannels);
  const totalImpressions = channels.reduce((acc, c) => acc + c.impressions, 0);
  const totalTaps = channels.reduce((acc, c) => acc + c.taps, 0);
  const totalConversions = channels.reduce((acc, c) => acc + c.conversions, 0);
  const blendedRoas = (channels.reduce((acc, c) => acc + (c.roas * c.spent), 0) / (totalSpentAcrossChannels || 1)).toFixed(2);
  const avgCpt = (totalSpentAcrossChannels / (totalTaps || 1)).toFixed(2);

  // Toggle Campaign Status
  const handleToggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'paused' : 'active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Add New Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignTitle.trim()) return;

    const newCamp: AppleCampaign = {
      id: `camp-${Date.now()}`,
      title: newCampaignTitle.trim(),
      channel: newCampaignChannel,
      dailyBudget: Number(newCampaignBudget) || 100,
      totalSpend: 0,
      status: 'active',
      impressions: 0,
      taps: 0,
      conversions: 0,
      cpa: 0,
      roas: 4.5,
      targetArea: newCampaignArea.trim() || 'Adelaide Metro'
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setIsCreatingCampaign(false);
    setNewCampaignTitle('');
  };

  // Download PDF Tax Invoice
  const handleDownloadInvoice = (inv: AdInvoice) => {
    const business: BusinessDetails = {
      companyName: 'Apple Advertising & Media Management',
      tradingAs: 'Apple Media Network SA (Suiter Enterprise)',
      abn: '49 123 456 789',
      phone: '(08) 8234 5678',
      email: 'ads-billing@apple-media.sa.gov.au',
      address: '100 King William Street, Adelaide SA 5000',
      website: 'https://searchads.apple.com',
      ownerName: 'Tamara Alana Barber',
      bankName: 'National Australia Bank (NAB) / NPP Osko Rail',
      bsb: '062-948',
      accountNumber: '2383 7561',
      payId: 'tamara.alana.barber@npp.nab.com.au'
    };

    const invoicePayload: InvoiceData = {
      invoiceNumber: inv.invoiceNumber,
      issueDate: inv.issueDate,
      dueDate: inv.dueDate,
      clientName: inv.clientName,
      clientAddress: 'South Australia Commercial Registry',
      clientEmail: `${inv.clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@client.com.au`,
      items: inv.items.length > 0 ? inv.items : [
        { id: '1', description: `${inv.campaignTitle} (${inv.channel})`, quantity: 1, unitPrice: inv.amount }
      ],
      notes: `Apple Advertising & Media Management Services. Direct disbursement to verified NPP account (BSB: 062-948, Acc: 2383 7561, Tamara Alana Barber).`
    };

    downloadInvoicePDF(business, invoicePayload);
  };

  // Add New Custom Invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceClient.trim()) return;

    const newInv: AdInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `AAPL-INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: newInvoiceClient.trim(),
      campaignTitle: newInvoiceCampaign.trim() || `${newInvoiceChannel} Campaign`,
      channel: newInvoiceChannel,
      amount: Number(newInvoiceAmount) || 1500,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      items: [
        { id: '1', description: `${newInvoiceChannel} Placement & Bid Optimization`, quantity: 1, unitPrice: Number(newInvoiceAmount) * 0.8 },
        { id: '2', description: 'Creative Media Production & Cross-Platform Management', quantity: 1, unitPrice: Number(newInvoiceAmount) * 0.2 }
      ]
    };

    setInvoices(prev => [newInv, ...prev]);
    setIsCreatingInvoice(false);
    setNewInvoiceClient('');
    setNewInvoiceCampaign('');
  };

  // Execute Instant Payout
  const handleExecuteInstantPayout = () => {
    const amountToTransfer = Number(payoutAmountInput);
    if (isNaN(amountToTransfer) || amountToTransfer <= 0) {
      alert('Please enter a valid payout amount.');
      return;
    }
    if (amountToTransfer > availablePayoutBalance) {
      alert(`Requested amount exceeds available balance of $${availablePayoutBalance.toLocaleString()} AUD.`);
      return;
    }

    setIsProcessingPayout(true);
    setPayoutSuccessMessage(null);

    setTimeout(() => {
      const generatedRef = `NPP-TX-062948-${Math.floor(100000 + Math.random() * 900000)}`;
      const newPayoutRecord: PayoutRecord = {
        id: `pay-${Date.now()}`,
        payoutNumber: `NPP-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: amountToTransfer,
        recipientName: recipientName.trim(),
        bsb: recipientBsb.trim(),
        accountNumber: recipientAcc.trim(),
        rail: payoutRail === 'bsb' ? 'NPP Osko Instant (NAB)' : payoutRail === 'apple_pay' ? ' Apple Pay Cash Direct' : 'Visa / Mastercard Direct',
        reference: generatedRef,
        timestamp: new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'settled'
      };

      setAvailablePayoutBalance(prev => Math.max(0, prev - amountToTransfer));
      setPayoutsHistory(prev => [newPayoutRecord, ...prev]);
      setIsProcessingPayout(false);
      setPayoutSuccessMessage(`Instant payout of $${amountToTransfer.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD successfully disbursed to ${recipientName} (BSB: ${recipientBsb}, Acc: ${recipientAcc}) via NPP Osko. Funds available in under 60 seconds.`);
    }, 1200);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      {trigger ? (
        <DialogTrigger render={trigger as any} />
      ) : null}

      <DialogContent className="sm:max-w-[960px] w-[96vw] max-h-[94vh] rounded-[2.5rem] border-0 bg-zinc-950 text-white p-0 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Apple Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950 border-b border-zinc-800/80 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 text-2xl font-bold">
                
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white">
                    Apple Advertising & Media Management
                  </h2>
                  <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/40 text-[10px] uppercase font-black tracking-wider">
                    Total Budget & Payouts
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Complete media management across Apple Search Ads, Maps, News & Podcasts with instant payouts and automated tax invoicing.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 font-mono">
                Available Payout: ${availablePayoutBalance.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
              </Badge>
            </div>
          </div>

          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <PieChart className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Ad Budget</div>
                <div className="font-display font-bold text-white text-sm">
                  ${totalBudget.toLocaleString()} <span className="text-[10px] text-zinc-500 font-normal">AUD</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Spent to Date</div>
                <div className="font-display font-bold text-emerald-400 text-sm">
                  ${totalSpentAcrossChannels.toLocaleString()} <span className="text-[10px] text-zinc-500 font-normal">({((totalSpentAcrossChannels/totalBudget)*100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Blended ROAS</div>
                <div className="font-display font-bold text-amber-300 text-sm">
                  {blendedRoas}x Return
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <Landmark className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Instant NPP Payout</div>
                <div className="font-display font-bold text-purple-300 text-sm truncate">
                  BSB 062-948 <span className="text-[10px] text-zinc-500 font-normal">Osko</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <TabsList className="bg-zinc-950 p-1 rounded-xl h-11 flex space-x-1 border border-zinc-800/80 overflow-x-auto max-w-full">
              <TabsTrigger value="budget" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5" />
                <span>Total Budget & Media</span>
              </TabsTrigger>
              <TabsTrigger value="campaigns" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Apple Campaigns ({campaigns.length})</span>
              </TabsTrigger>
              <TabsTrigger value="invoicing" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Invoicing Functionality</span>
              </TabsTrigger>
              <TabsTrigger value="payout" className="rounded-lg text-xs font-bold data-[state=active]:bg-indigo-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5" />
                <span>Instant Payout (NPP)</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            {/* ========================================================= */}
            {/* TAB 1: TOTAL BUDGET & MEDIA MANAGEMENT                    */}
            {/* ========================================================= */}
            <TabsContent value="budget" className="mt-0 space-y-6">
              {/* Total Budget Master Slider Card */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                      <span>Total Apple Media Budget Pool</span>
                      <Badge className="bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                        FY 2026/2027
                      </Badge>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Master allocated advertising capital distributed dynamically across all Apple surfaces.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Total Budget ($ AUD):</span>
                    <Input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value) || 0)}
                      className="w-36 h-10 bg-zinc-950 border-zinc-800 text-white font-mono font-bold text-sm text-right rounded-xl"
                    />
                  </div>
                </div>

                {/* Overall Allocation Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-zinc-400">
                      Spent: <strong className="text-emerald-400">${totalSpentAcrossChannels.toLocaleString()} AUD</strong>
                    </span>
                    <span className="text-zinc-400">
                      Remaining Pool: <strong className="text-indigo-400">${remainingBudget.toLocaleString()} AUD</strong>
                    </span>
                  </div>

                  <div className="w-full bg-zinc-950 h-3.5 rounded-full overflow-hidden flex border border-zinc-800/80 p-0.5">
                    {channels.map((channel) => {
                      const widthPercent = (channel.spent / (totalBudget || 1)) * 100;
                      return (
                        <div
                          key={channel.id}
                          className={`${channel.color} h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
                          style={{ width: `${widthPercent}%` }}
                          title={`${channel.name}: $${channel.spent.toLocaleString()} (${widthPercent.toFixed(1)}%)`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 pt-1">
                    {channels.map((c) => (
                      <div key={c.id} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                        <span className="truncate">{c.name.split('(')[0].trim()}:</span>
                        <span className="font-bold text-zinc-200">${c.spent.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automation & Pacing Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-800 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Pacing Engine</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPacingMode('standard')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          pacingMode === 'standard' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Standard (Smooth)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPacingMode('accelerated')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          pacingMode === 'accelerated' ? 'bg-amber-600 text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Accelerated
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Auto-Reallocate High ROAS</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300 font-medium">{autoReallocate ? 'Enabled (AI Pacing)' : 'Disabled'}</span>
                      <button
                        type="button"
                        onClick={() => setAutoReallocate(!autoReallocate)}
                        className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                          autoReallocate ? 'bg-emerald-600' : 'bg-zinc-800'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                          autoReallocate ? 'right-0.75' : 'left-0.75'
                        }`} />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Circuit Breaker Spend Cap</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">Pause at {circuitBreakerThreshold}%</span>
                      <select
                        value={circuitBreakerThreshold}
                        onChange={(e) => setCircuitBreakerThreshold(Number(e.target.value))}
                        className="h-7 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-[11px] px-2"
                      >
                        <option value={80}>80% Cap</option>
                        <option value={90}>90% Cap</option>
                        <option value={95}>95% Cap</option>
                        <option value={100}>100% Strict</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Channels Individual Breakdown Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
                    Channel Media Management & Spend Allocation
                  </h3>
                  <span className="text-xs text-zinc-500">5 Active Apple Media Networks</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {channels.map((channel) => {
                    const pctSpent = Math.round((channel.spent / (channel.allocatedBudget || 1)) * 100);

                    return (
                      <div
                        key={channel.id}
                        className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>{channel.icon}</span>
                              <span className="truncate max-w-[180px]">{channel.name}</span>
                            </span>
                            <Badge className="bg-zinc-800 text-zinc-300 font-mono text-[10px]">
                              {channel.roas}x ROAS
                            </Badge>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-zinc-500">Spent / Allocated</span>
                              <span className="font-mono font-bold text-zinc-200">
                                ${channel.spent.toLocaleString()} / ${channel.allocatedBudget.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                              <div
                                className={`${channel.color} h-full rounded-full`}
                                style={{ width: `${Math.min(100, pctSpent)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">Avg CPT</span>
                            <span className="text-zinc-200 font-bold">${channel.cpt}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">Taps</span>
                            <span className="text-zinc-200 font-bold">{channel.taps.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">Conv.</span>
                            <span className="text-emerald-400 font-bold">{channel.conversions.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 2: ACTIVE APPLE CAMPAIGNS                             */}
            {/* ========================================================= */}
            <TabsContent value="campaigns" className="mt-0 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Channel Filter:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {['all', 'Apple Search Ads', 'Apple Maps', 'Apple News', 'Apple Podcasts'].map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setCampaignFilter(filter)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          campaignFilter === filter ? 'bg-indigo-600 text-white' : 'bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {filter === 'all' ? 'All Channels' : filter}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
                  className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingCampaign ? 'Close Builder' : 'New Apple Campaign'}</span>
                </Button>
              </div>

              {/* Create Campaign Drawer */}
              {isCreatingCampaign && (
                <form onSubmit={handleCreateCampaign} className="p-5 rounded-3xl bg-zinc-900 border border-indigo-500/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Launch New Apple Advertising Campaign</span>
                    </h4>
                    <span className="text-[11px] text-zinc-400">Directly synchronized with Apple Search Ads & Maps API</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Campaign Title *</Label>
                      <Input
                        value={newCampaignTitle}
                        onChange={(e) => setNewCampaignTitle(e.target.value)}
                        placeholder="e.g. Master Builder Kitchen Remodel - Apple Maps Promo"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Apple Media Channel</Label>
                      <select
                        value={newCampaignChannel}
                        onChange={(e) => setNewCampaignChannel(e.target.value)}
                        className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Apple Search Ads (App Store)">Apple Search Ads (App Store)</option>
                        <option value="Apple Maps Sponsored Pins">Apple Maps Sponsored Pins & Waypoints</option>
                        <option value="Apple News & Stocks Native Media">Apple News & Stocks Native Media</option>
                        <option value="Apple Podcasts Audio Sponsoring">Apple Podcasts Audio Sponsoring</option>
                        <option value="Apple TV+ Video Spot Allocations">Apple TV+ Video Spot Allocations</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Daily Ad Budget ($ AUD)</Label>
                      <Input
                        type="number"
                        value={newCampaignBudget}
                        onChange={(e) => setNewCampaignBudget(Number(e.target.value) || 0)}
                        placeholder="100"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Targeting Region / Coordinates</Label>
                      <Input
                        value={newCampaignArea}
                        onChange={(e) => setNewCampaignArea(e.target.value)}
                        placeholder="e.g. Adelaide Eastern Suburbs & Norwood"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCreatingCampaign(false)}
                      className="rounded-xl h-9 text-xs text-zinc-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 shadow-md shadow-indigo-900/30"
                    >
                      Deploy Apple Campaign
                    </Button>
                  </div>
                </form>
              )}

              {/* Campaigns List */}
              <div className="space-y-3">
                {campaigns
                  .filter(c => campaignFilter === 'all' || c.channel.toLowerCase().includes(campaignFilter.toLowerCase()))
                  .map((camp) => (
                    <div
                      key={camp.id}
                      className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            camp.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]' 
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]'
                          }>
                            {camp.status === 'active' ? '● Live Running' : '❚❚ Paused'}
                          </Badge>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{camp.channel}</span>
                          <span className="text-[10px] text-zinc-500">• {camp.targetArea}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white leading-tight">{camp.title}</h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                          <span>Daily: <strong className="text-zinc-200">${camp.dailyBudget}/day</strong></span>
                          <span>Spent: <strong className="text-zinc-200">${camp.totalSpend.toLocaleString()}</strong></span>
                          <span>Taps: <strong className="text-zinc-200">{camp.taps.toLocaleString()}</strong></span>
                          <span>Conv: <strong className="text-emerald-400">{camp.conversions.toLocaleString()}</strong></span>
                          <span>CPA: <strong className="text-zinc-200">${camp.cpa}</strong></span>
                          <span>ROAS: <strong className="text-indigo-400">{camp.roas}x</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleCampaign(camp.id)}
                          className="rounded-xl h-9 border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
                        >
                          {camp.status === 'active' ? (
                            <>
                              <Pause className="w-3.5 h-3.5 mr-1 text-amber-400" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                              <span>Resume</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 3: INVOICING FUNCTIONALITY                            */}
            {/* ========================================================= */}
            <TabsContent value="invoicing" className="mt-0 space-y-6">
              {/* Invoicing Summary Banner */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-400" />
                    <span>Apple Advertising Invoicing System</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Official Australian GST Tax Invoices for Apple Search Ads, Promoted Pins, and media agency management.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsCreatingInvoice(!isCreatingInvoice)}
                    className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCreatingInvoice ? 'Close Form' : 'Generate Tax Invoice'}</span>
                  </Button>
                </div>
              </div>

              {/* Invoicing Quick Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Total Invoiced</span>
                  <div className="text-xl font-display font-bold text-white mt-1">
                    ${invoices.reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Settled / Paid (inc. Instant)</span>
                  <div className="text-xl font-display font-bold text-emerald-400 mt-1">
                    ${invoices.filter(i => i.status !== 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">Pending Accounts Receivable</span>
                  <div className="text-xl font-display font-bold text-amber-400 mt-1">
                    ${invoices.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.amount, 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                  </div>
                </div>
              </div>

              {/* Create Invoice Form */}
              {isCreatingInvoice && (
                <form onSubmit={handleCreateInvoice} className="p-5 rounded-3xl bg-zinc-900 border border-indigo-500/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span>Issue New Apple Advertising Tax Invoice</span>
                    </h4>
                    <span className="text-[11px] text-zinc-400">Generates instant PDF with Australian GST & BSB details</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Client / Advertiser Business Name *</Label>
                      <Input
                        value={newInvoiceClient}
                        onChange={(e) => setNewInvoiceClient(e.target.value)}
                        placeholder="e.g. Norwood Architectural Joinery"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Campaign / Scope Headline</Label>
                      <Input
                        value={newInvoiceCampaign}
                        onChange={(e) => setNewInvoiceCampaign(e.target.value)}
                        placeholder="e.g. Apple Maps Promoted Pin & Top Placement (Q4)"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Apple Advertising Channel</Label>
                      <select
                        value={newInvoiceChannel}
                        onChange={(e) => setNewInvoiceChannel(e.target.value)}
                        className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs px-3 focus:outline-none"
                      >
                        <option value="Apple Search Ads (App Store)">Apple Search Ads (App Store)</option>
                        <option value="Apple Maps Sponsored Pins">Apple Maps Sponsored Pins</option>
                        <option value="Apple News & Stocks Native Media">Apple News & Stocks Native Media</option>
                        <option value="Apple Podcasts Audio Sponsoring">Apple Podcasts Audio Sponsoring</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Invoice Amount ($ AUD ex. GST)</Label>
                      <Input
                        type="number"
                        value={newInvoiceAmount}
                        onChange={(e) => setNewInvoiceAmount(Number(e.target.value) || 0)}
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCreatingInvoice(false)}
                      className="rounded-xl h-9 text-xs text-zinc-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl h-9 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5"
                    >
                      Issue Invoice & Add to Ledger
                    </Button>
                  </div>
                </form>
              )}

              {/* Invoices Table / Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Advertising & Media Invoices
                  </h4>
                  <div className="flex items-center gap-1.5">
                    {['all', 'paid', 'pending', 'instant_settled'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setInvoiceFilter(st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                          invoiceFilter === st ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {invoices
                    .filter(inv => invoiceFilter === 'all' || inv.status === invoiceFilter)
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-zinc-700 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-400">{inv.invoiceNumber}</span>
                            <Badge className={
                              inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]' :
                              inv.status === 'instant_settled' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px]' :
                              'bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]'
                            }>
                              {inv.status === 'instant_settled' ? '⚡ Instant Settled' : inv.status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                            </Badge>
                            <span className="text-[11px] text-zinc-500">Issued: {inv.issueDate}</span>
                          </div>

                          <div className="text-sm font-bold text-white">{inv.clientName}</div>
                          <div className="text-xs text-zinc-400">{inv.campaignTitle} • <span className="text-zinc-500">{inv.channel}</span></div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-500 block uppercase font-bold">Total (inc. GST)</span>
                            <span className="text-base font-display font-extrabold text-white">
                              ${(inv.amount * 1.1).toFixed(2)} AUD
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadInvoice(inv)}
                            className="rounded-xl h-9 px-3 border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                            title="Download official PDF Tax Invoice"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-400" />
                            <span>PDF Invoice</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 4: INSTANT PAYOUT FUNCTIONALITY (NPP OSKO)           */}
            {/* ========================================================= */}
            <TabsContent value="payout" className="mt-0 space-y-6">
              {payoutSuccessMessage && (
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold block text-sm">Instant Disbursement Approved!</strong>
                    <span>{payoutSuccessMessage}</span>
                  </div>
                </div>
              )}

              {/* Main Instant Payout Console */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Balance & Instant Transfer Trigger Card */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-indigo-950/50 border border-zinc-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl">
                        <Zap className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-display font-bold text-white">Instant Payout Disbursement</h3>
                        <p className="text-xs text-zinc-400">Disburse earned ad revenues, campaign balances, and client prepayments.</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      NPP Osko Ready
                    </Badge>
                  </div>

                  {/* Available Balance Display */}
                  <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total Available for Instant Payout</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-extrabold text-white">
                        ${availablePayoutBalance.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm font-bold text-emerald-400">AUD (Zero Hold)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Funds can be withdrawn 24/7/365 with immediate clearance via New Payments Platform (NPP) Osko.
                    </p>
                  </div>

                  {/* Payment Details / Destination */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                      Disbursement Destination & Rail
                    </Label>

                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPayoutRail('bsb')}
                        className={`p-3 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                          payoutRail === 'bsb'
                            ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <Landmark className="w-4 h-4 text-indigo-400 mb-1" />
                        <div>BSB & Account</div>
                        <div className="text-[10px] font-normal text-zinc-500">NPP Osko &lt;60s</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayoutRail('apple_pay')}
                        className={`p-3 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                          payoutRail === 'apple_pay'
                            ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <span className="text-base text-white block mb-1"></span>
                        <div>Apple Pay Cash</div>
                        <div className="text-[10px] font-normal text-zinc-500">Biometric Direct</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayoutRail('card')}
                        className={`p-3 rounded-xl border text-left font-bold text-xs transition-all cursor-pointer ${
                          payoutRail === 'card'
                            ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                            : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-400 mb-1" />
                        <div>Visa / Mastercard</div>
                        <div className="text-[10px] font-normal text-zinc-500">Real-time credit</div>
                      </button>
                    </div>

                    {/* Account Particulars */}
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Account Holder:</span>
                        <strong className="text-white font-mono">{recipientName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">BSB (Bank State Branch):</span>
                        <strong className="text-indigo-400 font-mono text-sm">{recipientBsb}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Account Number:</span>
                        <strong className="text-indigo-400 font-mono text-sm">{recipientAcc}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Clearing Institution:</span>
                        <span className="text-zinc-300">National Australia Bank (NAB) / NPP Osko Fast Rail</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2">
                        <span className="text-zinc-500">Instant Partner Fee:</span>
                        <span className="text-emerald-400 font-bold">0.00% (Apple Enterprise Fee Waiver)</span>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Amount & Action Button */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-zinc-300">Payout Amount ($ AUD)</Label>
                      <button
                        type="button"
                        onClick={() => setPayoutAmountInput(availablePayoutBalance.toString())}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer"
                      >
                        Payout All (${availablePayoutBalance.toLocaleString()} AUD)
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">$</span>
                        <Input
                          type="number"
                          value={payoutAmountInput}
                          onChange={(e) => setPayoutAmountInput(e.target.value)}
                          placeholder="5000"
                          className="pl-8 h-12 rounded-2xl bg-zinc-950 border-zinc-800 text-white font-mono text-lg font-bold"
                        />
                      </div>
                      <Button
                        onClick={handleExecuteInstantPayout}
                        disabled={isProcessingPayout || availablePayoutBalance <= 0}
                        className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-900/30 cursor-pointer shrink-0 flex items-center gap-2"
                      >
                        {isProcessingPayout ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing Osko...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            <span>Transfer Now (Instant)</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {[1000, 2500, 5000, 10000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPayoutAmountInput(preset.toString())}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          +${preset.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* NPP Osko Security & Settlement Specs */}
                <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">NPP Rail Verification</h4>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Instant payouts are settled via Australia&apos;s New Payments Platform (NPP) with zero counterparty hold.
                    </p>

                    <div className="space-y-2 text-xs text-zinc-300">
                      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Payee Attestation</span>
                        <div className="font-bold text-white">{recipientName}</div>
                        <div className="font-mono text-xs text-zinc-400">BSB: {recipientBsb} | ACC: {recipientAcc}</div>
                      </div>

                      <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase font-bold">Transit Time Guarantee</span>
                        <div className="text-emerald-400 font-bold">&lt; 60 Seconds Clearance</div>
                        <div className="text-[11px] text-zinc-400">Operating 24/7/365 including weekends and public holidays.</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-[11px] text-indigo-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>
                      Transactions are cryptographically signed with end-to-end audit trails and compliant with Reserve Bank of Australia (RBA) regulations.
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Payout History / Ledger */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Instant Payout Disbursements Ledger
                  </h4>
                  <span className="text-xs text-zinc-500">{payoutsHistory.length} Settled Transactions</span>
                </div>

                <div className="space-y-2.5">
                  {payoutsHistory.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-purple-400">{p.payoutNumber}</span>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                            ✓ Instant Settled
                          </Badge>
                          <span className="text-[11px] text-zinc-500">{p.timestamp}</span>
                        </div>

                        <div className="text-xs text-zinc-300">
                          Disbursed to <strong className="text-white">{p.recipientName}</strong> ({p.rail})
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500">
                          BSB: {p.bsb} • ACC: {p.accountNumber} • Ref: {p.reference}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Disbursed Net</span>
                        <span className="text-lg font-display font-bold text-emerald-400">
                          +${p.amount.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Modal Footer */}
        <div className="p-4 md:p-6 bg-zinc-900 border-t border-zinc-800 shrink-0 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-bold"> Apple Media Partner</span>
            <span>•</span>
            <span>NPP Direct Clearing</span>
            <span>•</span>
            <span>BSB: 062-948 | Acc: 2383 7561 (Tamara Alana Barber)</span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowModal(false)}
            className="rounded-xl h-9 px-4 border-zinc-700 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold cursor-pointer"
          >
            Close Dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
