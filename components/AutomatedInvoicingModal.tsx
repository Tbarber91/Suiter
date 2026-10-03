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
  FileText, 
  Download, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Zap, 
  Receipt,
  RotateCcw,
  Check,
  ChevronRight,
  ExternalLink,
  Wallet,
  Landmark,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Copy,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  Send,
  Building2,
  Trash2,
  Sparkles,
  PieChart,
  RefreshCw,
  SlidersHorizontal,
  Mail,
  Coins
} from 'lucide-react';
import { useAuth } from './AuthProvider';
import { downloadInvoicePDF, BusinessDetails, InvoiceData, InvoiceItem } from '@/lib/collateral-pdf';

export interface AutoInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  serviceDescription: string;
  subtotal: number;
  gst: number;
  total: number;
  btcAmount: number;
  issueDate: string;
  dueDate: string;
  scheduleType: 'one-time' | 'recurring-monthly' | 'milestone' | 'automated-trigger';
  status: 'draft' | 'scheduled' | 'sent' | 'instant_settled' | 'overdue';
  autoReminderEnabled: boolean;
  paymentRail: 'bitcoin_lightning' | 'npp_osko' | 'multi_rail';
  lastReminderSent?: string;
  items: InvoiceItem[];
}

export interface TaxClaimSummary {
  financialYear: string;
  totalRevenueInvoiced: number;
  gstCollected: number;
  claimableDeductions: number;
  gstPaidOnExpenses: number;
  netGstPayableOrRefund: number;
  cryptoCapitalGainsRecognized: number;
  estimatedTaxRefund: number;
}

interface AutomatedInvoicingModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  initialTab?: 'invoices' | 'schedule' | 'bitcoin_rail' | 'tax_claims';
}

const BTC_RATE_AUD = 94500; // 1 BTC = $94,500 AUD benchmark

const DEFAULT_AUTO_INVOICES: AutoInvoice[] = [
  {
    id: 'inv-auto-1',
    invoiceNumber: 'INV-AUTO-2026-001',
    clientName: 'City West Toyota Certified LMVD',
    clientEmail: 'fleet.accounts@citywesttoyota.com.au',
    serviceDescription: 'Monthly Media Syndication & Apple Search Ads Retainer',
    subtotal: 5850.00,
    gst: 585.00,
    total: 6435.00,
    btcAmount: Number((6435 / BTC_RATE_AUD).toFixed(6)),
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    scheduleType: 'recurring-monthly',
    status: 'instant_settled',
    autoReminderEnabled: true,
    paymentRail: 'multi_rail',
    lastReminderSent: '2026-09-02 (Settled via NPP)',
    items: [
      { id: '1', description: 'Apple Search Ads Campaign Management & Keyword Optimization', quantity: 1, unitPrice: 4200.00 },
      { id: '2', description: 'Cross-Device Attribution & Automated Lead Syndication', quantity: 1, unitPrice: 1650.00 }
    ]
  },
  {
    id: 'inv-auto-2',
    invoiceNumber: 'INV-AUTO-2026-002',
    clientName: 'Norwood Architectural Joinery',
    clientEmail: 'billing@norwoodjoinery.com.au',
    serviceDescription: 'Apple Maps Sponsored Pin & Top Navigation Placement',
    subtotal: 3450.00,
    gst: 345.00,
    total: 3795.00,
    btcAmount: Number((3795 / BTC_RATE_AUD).toFixed(6)),
    issueDate: '2026-09-05',
    dueDate: '2026-09-19',
    scheduleType: 'recurring-monthly',
    status: 'sent',
    autoReminderEnabled: true,
    paymentRail: 'bitcoin_lightning',
    lastReminderSent: '2026-09-10 (Auto reminder dispatched)',
    items: [
      { id: '1', description: 'Apple Maps Local Waypoint Sponsorship (Adelaide Eastern Suburbs)', quantity: 1, unitPrice: 2800.00 },
      { id: '2', description: 'Automated Real-Time Booking & Call Routing Engine', quantity: 1, unitPrice: 650.00 }
    ]
  },
  {
    id: 'inv-auto-3',
    invoiceNumber: 'INV-AUTO-2026-003',
    clientName: 'Vance Joinery & Stone Studio',
    clientEmail: 'marcus@vancekitchens.com.au',
    serviceDescription: 'Milestone 2 Completion: Custom Joinery & Stone Benchtop',
    subtotal: 4200.00,
    gst: 420.00,
    total: 4620.00,
    btcAmount: Number((4620 / BTC_RATE_AUD).toFixed(6)),
    issueDate: '2026-09-11',
    dueDate: '2026-09-25',
    scheduleType: 'milestone',
    status: 'scheduled',
    autoReminderEnabled: true,
    paymentRail: 'npp_osko',
    items: [
      { id: '1', description: 'Stage 2 Custom Joinery Fabrication & Blum Soft-Close Fitting', quantity: 1, unitPrice: 3100.00 },
      { id: '2', description: 'Quantum Quartz Engineered Stone Allocation Deposit', quantity: 1, unitPrice: 1100.00 }
    ]
  },
  {
    id: 'inv-auto-4',
    invoiceNumber: 'INV-AUTO-2026-004',
    clientName: 'Unley Architectural Feasibility Group',
    clientEmail: 'accounts@unleyarchitects.sa.gov.au',
    serviceDescription: 'Site Feasibility, Laser Measurement & Code AS 4386 Compliance',
    subtotal: 1850.00,
    gst: 185.00,
    total: 2035.00,
    btcAmount: Number((2035 / BTC_RATE_AUD).toFixed(6)),
    issueDate: '2026-08-20',
    dueDate: '2026-09-03',
    scheduleType: 'one-time',
    status: 'instant_settled',
    autoReminderEnabled: false,
    paymentRail: 'bitcoin_lightning',
    lastReminderSent: 'Settled via Bitcoin on-chain block #861042',
    items: [
      { id: '1', description: 'Comprehensive Spatial Scanning & Laser CAD Generation', quantity: 1, unitPrice: 1400.00 },
      { id: '2', description: 'Statutory Fair Trading & Building Code Certification', quantity: 1, unitPrice: 450.00 }
    ]
  }
];

export function AutomatedInvoicingModal({
  isOpen,
  onOpenChange,
  trigger,
  initialTab = 'invoices'
}: AutomatedInvoicingModalProps) {
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const showModal = isOpen !== undefined ? isOpen : internalOpen;
  const setShowModal = onOpenChange || setInternalOpen;

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Invoicing List State
  const [invoices, setInvoices] = useState<AutoInvoice[]>(DEFAULT_AUTO_INVOICES);
  const [invoiceFilter, setInvoiceFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<AutoInvoice | null>(null);

  // New Invoice Generator State
  const [isCreating, setIsCreating] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [scheduleType, setScheduleType] = useState<AutoInvoice['scheduleType']>('recurring-monthly');
  const [paymentRail, setPaymentRail] = useState<AutoInvoice['paymentRail']>('multi_rail');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Professional Services & Marketplace Media Management', quantity: 1, unitPrice: 1500 }
  ]);
  const [reminderActive, setReminderActive] = useState(true);

  // Bitcoin & Instant Rail State
  const [btcWalletAddress] = useState('bc1q98tamara7561alana948barberbtc2026');
  const [btcBalance, setBtcBalance] = useState(0.38421); // ~36k AUD
  const [lightningInvoice, setLightningInvoice] = useState('lnbc3840u1p3...instant...barber');
  const [copiedBtc, setCopiedBtc] = useState(false);
  const [simulatedTxSuccess, setSimulatedTxSuccess] = useState<string | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);

  // Calculated Metrics
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.total, 0);
  const totalSettled = invoices.filter(i => i.status === 'instant_settled').reduce((acc, i) => acc + i.total, 0);
  const totalOutstanding = invoices.filter(i => i.status !== 'instant_settled').reduce((acc, i) => acc + i.total, 0);
  const totalGstCollected = invoices.reduce((acc, i) => acc + i.gst, 0);

  // Tax Claims Calculated Pack
  const taxSummary: TaxClaimSummary = {
    financialYear: 'FY 2026 / 2027',
    totalRevenueInvoiced: totalInvoiced,
    gstCollected: totalGstCollected,
    claimableDeductions: 8420.00,
    gstPaidOnExpenses: 842.00,
    netGstPayableOrRefund: Math.max(0, totalGstCollected - 842.00),
    cryptoCapitalGainsRecognized: 3120.00,
    estimatedTaxRefund: 4180.00
  };

  // Copy helper
  const handleCopyBtc = () => {
    navigator.clipboard.writeText(btcWalletAddress);
    setCopiedBtc(true);
    setTimeout(() => setCopiedBtc(false), 2500);
  };

  // Add Item to creation form
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: String(Date.now()),
      description: 'Additional Milestone / Ad Placement',
      quantity: 1,
      unitPrice: 500
    };
    setItems([...items, newItem]);
  };

  // Remove Item
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  // Update Item
  const handleUpdateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  // Calculate creation totals
  const currentSubtotal = items.reduce((acc, i) => acc + (Number(i.quantity) * Number(i.unitPrice)), 0);
  const currentGst = currentSubtotal * 0.10;
  const currentTotal = currentSubtotal + currentGst;
  const currentBtc = Number((currentTotal / BTC_RATE_AUD).toFixed(6));

  // Save new automated invoice
  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || items.length === 0) return;

    // eslint-disable-next-line react-hooks/purity
    const currentTimestamp = Date.now();
    // eslint-disable-next-line react-hooks/purity
    const calculatedDueDate = new Date(currentTimestamp + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newInv: AutoInvoice = {
      id: `inv-auto-${currentTimestamp}`,
      invoiceNumber: `INV-AUTO-2026-0${invoices.length + 1}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || 'billing@client.com.au',
      serviceDescription: serviceDesc.trim() || 'Automated Marketplace & Media Invoicing',
      subtotal: currentSubtotal,
      gst: currentGst,
      total: currentTotal,
      btcAmount: currentBtc,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: calculatedDueDate,
      scheduleType,
      status: scheduleType === 'milestone' ? 'scheduled' : 'sent',
      autoReminderEnabled: reminderActive,
      paymentRail,
      items
    };

    setInvoices([newInv, ...invoices]);
    setIsCreating(false);
    setClientName('');
    setClientEmail('');
    setServiceDesc('');
    setItems([{ id: '1', description: 'Professional Services & Marketplace Media Management', quantity: 1, unitPrice: 1500 }]);
  };

  // Download printable PDF tax invoice
  const handleDownloadInvoicePDF = (inv: AutoInvoice) => {
    const business: BusinessDetails = {
      companyName: 'Suiter Marketplace & Media Systems',
      tradingAs: 'Tamara Alana Barber Enterprise (Suiter)',
      abn: '48 912 345 678',
      phone: '(08) 8234 5678',
      email: 'billing@suiter-marketplace.com.au',
      address: '100 King William Street, Adelaide SA 5000',
      website: 'https://suiter-marketplace.com.au',
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
      clientAddress: 'South Australia Registered Business',
      clientEmail: inv.clientEmail,
      items: inv.items,
      notes: `Payment Terms: 14 Days. Direct instant settlement supported via Bitcoin On-Chain / Lightning (${inv.btcAmount} BTC) or NPP Osko Instant Transfer (BSB: 062-948, Account: 2383 7561, Account Name: Tamara Alana Barber).`
    };

    downloadInvoicePDF(business, invoicePayload);
  };

  // Export Tax Claims CSV for ATO / accountant
  const handleExportTaxClaimsCSV = () => {
    const csvRows: string[] = [
      'Type,Date,Reference,Party,Description,Net Amount (AUD),GST (AUD),Gross (AUD),Settlement Rail,Status',
      ...invoices.map(inv => 
        `"Tax Invoice","${inv.issueDate}","${inv.invoiceNumber}","${inv.clientName}","${inv.serviceDescription.replace(/"/g, '""')}",${inv.subtotal.toFixed(2)},${inv.gst.toFixed(2)},${inv.total.toFixed(2)},"${inv.paymentRail}","${inv.status}"`
      ),
      `"Tax Deduction","2026-08-15","EXP-2026-01","Apple Developer Program","Annual Enterprise Dev Key & Enclave Signing",450.00,45.00,495.00,"NPP Osko","Deductible"`,
      `"Tax Deduction","2026-08-20","EXP-2026-02","Google Cloud Platform","Compute Unit, Container & Storage Hosting",1240.00,124.00,1364.00,"NPP Osko","Deductible"`,
      `"Tax Deduction","2026-09-02","EXP-2026-03","Telstra Enterprise Metro","Ultra-Low Latency Fiber & Communications",680.00,68.00,748.00,"NPP Osko","Deductible"`
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ATO_Tax_Claims_Pack_FY2026_Suiter.csv`);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  // Instant Bitcoin / NPP Payment Simulation without Barriers
  const handleSimulateInstantSettlement = (invoiceId: string) => {
    setIsSimulatingPayment(true);
    setSimulatedTxSuccess(null);

    setTimeout(() => {
      setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
          return {
            ...inv,
            status: 'instant_settled',
            lastReminderSent: `Instant settled via Bitcoin Lightning block #${Math.floor(860000 + Math.random() * 2000)} (Zero barriers, 0 fees)`
          };
        }
        return inv;
      }));

      // Credit the BTC balance
      const matched = invoices.find(i => i.id === invoiceId);
      if (matched) {
        setBtcBalance(prev => Number((prev + matched.btcAmount).toFixed(6)));
      }

      setIsSimulatingPayment(false);
      setSimulatedTxSuccess(`Transaction confirmed instantly! Funds credited with zero barrier lockups. Australian GST Tax receipt auto-dispatched.`);
    }, 1200);
  };

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      {trigger ? (
        <DialogTrigger render={trigger as any} />
      ) : null}

      <DialogContent className="sm:max-w-[1000px] w-[96vw] max-h-[94vh] rounded-[2.5rem] border-0 bg-zinc-950 text-white p-0 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950 border-b border-zinc-800/80 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-indigo-800 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 text-2xl font-bold">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-white">
                    Automated Invoicing & Assets
                  </h2>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] uppercase font-black tracking-wider">
                    ATO GST & Bitcoin Rails
                  </Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Automated recurring billing, instant Bitcoin/NPP payment rails with zero barriers, and one-click ATO tax claim documentation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-right">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                  <Coins className="w-3 h-3 text-amber-400" />
                  <span>Real-Time Bitcoin Vault</span>
                </div>
                <div className="font-mono font-bold text-amber-300 text-sm">
                  {btcBalance.toFixed(5)} BTC
                  <span className="text-[11px] text-zinc-400 font-normal ml-1">
                    (~${(btcBalance * BTC_RATE_AUD).toLocaleString('en-AU', { maximumFractionDigits: 0 })} AUD)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Invoiced</div>
                <div className="font-display font-bold text-white text-sm">
                  ${totalInvoiced.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Instant Settled</div>
                <div className="font-display font-bold text-emerald-400 text-sm">
                  ${totalSettled.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Outstanding</div>
                <div className="font-display font-bold text-amber-300 text-sm">
                  ${totalOutstanding.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Claimable Tax Refund</div>
                <div className="font-display font-bold text-purple-300 text-sm">
                  ${taxSummary.estimatedTaxRefund.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <TabsList className="bg-zinc-950 p-1 rounded-xl h-11 flex space-x-1 border border-zinc-800/80 overflow-x-auto max-w-full">
              <TabsTrigger value="invoices" className="rounded-lg text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5" />
                <span>Automated Invoices ({invoices.length})</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="rounded-lg text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Recurring & Auto-Chasing Rules</span>
              </TabsTrigger>
              <TabsTrigger value="bitcoin_rail" className="rounded-lg text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" />
                <span>Bitcoin & Instant Rails (Zero Barrier)</span>
              </TabsTrigger>
              <TabsTrigger value="tax_claims" className="rounded-lg text-xs font-bold data-[state=active]:bg-emerald-600 data-[state=active]:text-white cursor-pointer flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>ATO Tax Claim & Deductions Hub</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            {/* SUCCESS BANNER */}
            {simulatedTxSuccess && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 flex items-center justify-between gap-3 text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{simulatedTxSuccess}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSimulatedTxSuccess(null)}
                  className="h-7 text-xs text-emerald-300 hover:text-white"
                >
                  Dismiss
                </Button>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 1: AUTOMATED INVOICES LIST & GENERATION               */}
            {/* ========================================================= */}
            <TabsContent value="invoices" className="mt-0 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Filter Status:</span>
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {['all', 'instant_settled', 'sent', 'scheduled'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setInvoiceFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          invoiceFilter === f ? 'bg-emerald-600 text-white' : 'bg-zinc-950 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {f === 'all' ? 'All Invoices' : f === 'instant_settled' ? 'Instant Settled' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsCreating(!isCreating)}
                    className="rounded-xl h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isCreating ? 'Close Form' : 'New Automated Invoice'}</span>
                  </Button>
                </div>
              </div>

              {/* CREATE INVOICE ACCORDION FORM */}
              {isCreating && (
                <form onSubmit={handleSaveInvoice} className="p-6 rounded-3xl bg-zinc-900 border border-emerald-500/40 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Configure Automated Tax Invoice with Instant Settlement</span>
                    </h4>
                    <span className="text-[11px] text-zinc-400">Compliant with Australian GST (10%) & ATO Tax Standards</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Client / Advertiser Business Name *</Label>
                      <Input
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. City West Automotive Group"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Client Billing Email *</Label>
                      <Input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="e.g. accounts@citywesttoyota.com.au"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Service / Scope Description</Label>
                      <Input
                        value={serviceDesc}
                        onChange={(e) => setServiceDesc(e.target.value)}
                        placeholder="e.g. Monthly Apple Search Ads & Media Management"
                        className="h-10 rounded-xl bg-zinc-950 border-zinc-800 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Automation Trigger Schedule</Label>
                      <select
                        value={scheduleType}
                        onChange={(e) => setScheduleType(e.target.value as any)}
                        className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="recurring-monthly">Recurring Monthly (Auto-dispatched)</option>
                        <option value="milestone">Milestone Progress Claim (Stage Completion)</option>
                        <option value="automated-trigger">Automated Ad Spend Threshold Trigger</option>
                        <option value="one-time">One-Time Instant Invoice</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-zinc-300">Primary Payment Settlement Rail</Label>
                      <select
                        value={paymentRail}
                        onChange={(e) => setPaymentRail(e.target.value as any)}
                        className="w-full h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="multi_rail">Multi-Rail (Bitcoin + NPP Osko + Cards)</option>
                        <option value="bitcoin_lightning">Bitcoin On-Chain & Lightning (Instant)</option>
                        <option value="npp_osko">NPP Osko Instant (BSB: 062-948)</option>
                      </select>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-zinc-300">Itemized Deliverables & GST Breakdown</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleAddItem}
                        className="h-7 text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Line Item
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                          <Input
                            value={item.description}
                            onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                            placeholder="Description of service / trade work"
                            className="flex-1 h-8 text-xs bg-transparent border-0 text-white focus-visible:ring-0"
                          />
                          <div className="flex items-center gap-1.5 w-24">
                            <span className="text-[10px] text-zinc-500">Qty:</span>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)}
                              className="w-14 h-8 text-xs bg-zinc-900 border-zinc-700 text-white text-center font-mono"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 w-32">
                            <span className="text-[10px] text-zinc-500">$ AUD:</span>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value) || 0)}
                              className="w-24 h-8 text-xs bg-zinc-900 border-zinc-700 text-white text-right font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Calculated Subtotals */}
                    <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center justify-between text-xs font-mono gap-3">
                      <div className="space-y-0.5 text-zinc-400">
                        <div>Subtotal: <strong className="text-zinc-200">${currentSubtotal.toFixed(2)} AUD</strong></div>
                        <div>Australian GST (10%): <strong className="text-emerald-400">${currentGst.toFixed(2)} AUD</strong></div>
                      </div>
                      <div className="text-right space-y-0.5">
                        <div className="text-sm font-bold text-white">
                          Total Payable: ${currentTotal.toFixed(2)} AUD
                        </div>
                        <div className="text-amber-400 text-xs">
                          Equivalent: ≈ {currentBtc} BTC
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Auto Chasing Option */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-bold text-white">Automated Chaser & Payment Link Dispatch</div>
                        <div className="text-[10px] text-zinc-400">Sends reminder 3 days before due date and on due date with instant Bitcoin & NPP payment rails.</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReminderActive(!reminderActive)}
                      className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                        reminderActive ? 'bg-emerald-600' : 'bg-zinc-800'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-transform ${
                        reminderActive ? 'right-0.75' : 'left-0.75'
                      }`} />
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setIsCreating(false)}
                      className="rounded-xl h-9 text-xs text-zinc-400"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 shadow-md shadow-emerald-900/30"
                    >
                      Deploy Automated Invoice Schedule
                    </Button>
                  </div>
                </form>
              )}

              {/* INVOICES LIST */}
              <div className="space-y-3">
                {invoices
                  .filter(inv => invoiceFilter === 'all' || inv.status === invoiceFilter)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={
                            inv.status === 'instant_settled' 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]' 
                              : inv.status === 'sent'
                              ? 'bg-sky-500/20 text-sky-400 border-sky-500/30 text-[10px]'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]'
                          }>
                            {inv.status === 'instant_settled' ? '✓ Instant Settled' : inv.status === 'sent' ? '● Sent & Chasing' : '⏱ Scheduled'}
                          </Badge>
                          <span className="font-mono text-xs font-bold text-white">{inv.invoiceNumber}</span>
                          <span className="text-zinc-500 text-xs">•</span>
                          <span className="text-xs font-semibold text-zinc-300">{inv.clientName}</span>
                          <span className="text-zinc-500 text-xs">•</span>
                          <Badge className="bg-zinc-800 text-zinc-300 text-[10px] font-mono">
                            {inv.scheduleType}
                          </Badge>
                        </div>

                        <p className="text-xs text-zinc-400">{inv.serviceDescription}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                          <span>Total: <strong className="text-white">${inv.total.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD</strong></span>
                          <span>inc. GST: <strong className="text-emerald-400">${inv.gst.toFixed(2)}</strong></span>
                          <span>Bitcoin: <strong className="text-amber-400">≈ {inv.btcAmount} BTC</strong></span>
                          <span>Due: <strong className="text-zinc-300">{inv.dueDate}</strong></span>
                          {inv.lastReminderSent && (
                            <span className="text-zinc-500 text-[11px] truncate max-w-xs">{inv.lastReminderSent}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        {inv.status !== 'instant_settled' && (
                          <Button
                            size="sm"
                            disabled={isSimulatingPayment}
                            onClick={() => handleSimulateInstantSettlement(inv.id)}
                            className="rounded-xl h-9 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Instant settlement via Bitcoin zero-barrier rail"
                          >
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>Instant Settle (BTC)</span>
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoicePDF(inv)}
                          className="rounded-xl h-9 border-zinc-700 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                          <span>PDF Tax Invoice</span>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 2: RECURRING & AUTO-CHASING RULES                     */}
            {/* ========================================================= */}
            <TabsContent value="schedule" className="mt-0 space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Automated Invoicing Engine & Smart Dunning</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Configure automated delivery timelines, reminder cadence, and automated receipt disbursement.
                    </p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 font-mono text-xs">
                    Continuous Autonomous Mode
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Monthly Retainer Auto-Dispatch</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Dispatched on the 1st of every calendar month with attached PDF and instant Bitcoin Lightning payment QR.
                    </p>
                    <div className="pt-2 text-[10px] text-zinc-500 font-mono">
                      Next cycle: 01 October 2026
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">3-Stage Smart Auto-Chaser</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Friendly automated nudge 3 days prior to due date, on-due reminder, and 7-day overdue SMS notice.
                    </p>
                    <div className="pt-2 text-[10px] text-zinc-500 font-mono">
                      Escalation: Polite → Notice → Final
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Instant Receipt & Reconciliation</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Instantly updates ledger upon Bitcoin mempool confirmation or NPP Osko payment, generating official ATO tax receipt.
                    </p>
                    <div className="pt-2 text-[10px] text-zinc-500 font-mono">
                      Reconciliation: 100% Automated
                    </div>
                  </div>
                </div>
              </div>

              {/* Automation Rules Configuration Cards */}
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Default Banking & Tax Entity Configuration
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Registered Legal Entity</span>
                    <div className="font-bold text-white">Tamara Alana Barber</div>
                    <div className="text-[10px] text-zinc-400">ABN: 48 912 345 678</div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">NPP Osko Bank Rail</span>
                    <div className="font-bold text-white">NAB / Osko Direct</div>
                    <div className="text-[10px] text-emerald-400 font-mono">BSB: 062-948 | Acc: 2383 7561</div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Bitcoin On-Chain Native</span>
                    <div className="font-bold text-amber-300 truncate font-mono">bc1q98tamara...</div>
                    <div className="text-[10px] text-zinc-400">SegWit v0 Bech32</div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">ATO BAS Accounting</span>
                    <div className="font-bold text-white">Accruals / GST Reg.</div>
                    <div className="text-[10px] text-zinc-400">Quarterly Lodgement</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 3: BITCOIN & INSTANT RAILS (ZERO BARRIER)             */}
            {/* ========================================================= */}
            <TabsContent value="bitcoin_rail" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bitcoin Wallet & QR Column */}
                <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                          ₿
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-white text-sm">Bitcoin Payment Vault</h3>
                          <p className="text-[10px] text-zinc-400">Zero barriers • Native On-Chain & Lightning</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                        Live Mempool
                      </Badge>
                    </div>

                    {/* QR Code Graphic */}
                    <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center shadow-inner my-2">
                      {/* Stylized QR representation */}
                      <div className="w-44 h-44 bg-zinc-950 rounded-xl p-2.5 flex flex-col justify-between border-4 border-zinc-950">
                        <div className="flex justify-between">
                          <div className="w-10 h-10 border-4 border-white rounded-sm flex items-center justify-center">
                            <div className="w-4 h-4 bg-white" />
                          </div>
                          <div className="w-10 h-10 border-4 border-white rounded-sm flex items-center justify-center">
                            <div className="w-4 h-4 bg-white" />
                          </div>
                        </div>
                        <div className="flex items-center justify-center text-amber-400 font-bold text-2xl">
                          ₿
                        </div>
                        <div className="flex justify-between">
                          <div className="w-10 h-10 border-4 border-white rounded-sm flex items-center justify-center">
                            <div className="w-4 h-4 bg-white" />
                          </div>
                          <div className="w-10 h-10 grid grid-cols-2 gap-1 p-1">
                            <div className="bg-white rounded-xs" />
                            <div className="bg-white rounded-xs" />
                            <div className="bg-white rounded-xs" />
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-800 font-mono font-bold mt-2">
                        Scan to Pay via Any BTC Wallet
                      </span>
                    </div>

                    {/* Address String & Copy Button */}
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase">
                        <span>Native Bitcoin Address</span>
                        <button
                          type="button"
                          onClick={handleCopyBtc}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedBtc ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedBtc ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="font-mono text-xs text-amber-300 break-all select-all">
                        {btcWalletAddress}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-zinc-400">
                    Direct on-chain receipt funds software development, applet server compute units, and decentralized ventures without financial intermediaries.
                  </div>
                </div>

                {/* NPP Instant Bank Transfer & Combined Ledger */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-indigo-400" />
                        <div>
                          <h3 className="font-display font-bold text-white text-sm">NPP Osko Instant Transfer (Australia)</h3>
                          <p className="text-[10px] text-zinc-400">Sub-60 second bank disbursements via National Australia Bank</p>
                        </div>
                      </div>
                      <Badge className="bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                        NPP Rail Verified
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Account Name</span>
                        <div className="text-xs font-bold text-white mt-0.5">Tamara Alana Barber</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">BSB Code</span>
                        <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">062-948</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Account Number</span>
                        <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">2383 7561</div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time incoming rails log */}
                  <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                        <span>Instant Inbound Settlement Log</span>
                      </h4>
                      <span className="text-[11px] text-zinc-500 font-mono">100% Zero Barrier Confirmation</span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                            ₿
                          </div>
                          <div>
                            <div className="text-white font-bold">Bitcoin On-Chain Payment #861042</div>
                            <div className="text-[10px] text-zinc-500">From: bc1q...94a • 6 Confirmations</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold">+0.02153 BTC</div>
                          <div className="text-[10px] text-zinc-500">+$2,035.00 AUD</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                            <Landmark className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-white font-bold">NPP Osko Payment: City West Toyota</div>
                            <div className="text-[10px] text-zinc-500">Ref: INV-AUTO-2026-001 • Instant</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-bold">+$6,435.00 AUD</div>
                          <div className="text-[10px] text-zinc-500">Settled in 8 seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ========================================================= */}
            {/* TAB 4: ATO TAX CLAIM & DEDUCTIONS HUB                     */}
            {/* ========================================================= */}
            <TabsContent value="tax_claims" className="mt-0 space-y-6">
              <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>ATO Tax Claim & Business Deductions Hub</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Consolidated financial statements, GST BAS calculations, and tax-deductible expenditure packs.
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={handleExportTaxClaimsCSV}
                    className="rounded-xl h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export ATO Claims CSV</span>
                  </Button>
                </div>

                {/* Tax Ledger Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Total Gross Revenue</span>
                    <div className="text-lg font-display font-bold text-white mt-1">
                      ${taxSummary.totalRevenueInvoiced.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                    </div>
                    <span className="text-[10px] text-zinc-500">From verified marketplace invoices</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">GST Collected (1A)</span>
                    <div className="text-lg font-display font-bold text-emerald-400 mt-1">
                      ${taxSummary.gstCollected.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                    </div>
                    <span className="text-[10px] text-zinc-500">10% Australian Statutory GST</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Deductible Expenses (1B)</span>
                    <div className="text-lg font-display font-bold text-indigo-400 mt-1">
                      ${taxSummary.claimableDeductions.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                    </div>
                    <span className="text-[10px] text-zinc-500">Hosting, Dev tooling & Telecoms</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Estimated Tax Refund</span>
                    <div className="text-lg font-display font-bold text-purple-300 mt-1">
                      ${taxSummary.estimatedTaxRefund.toLocaleString('en-AU', { minimumFractionDigits: 2 })} AUD
                    </div>
                    <span className="text-[10px] text-purple-400 font-medium">Claimable via myGov / Tax Agent</span>
                  </div>
                </div>

                {/* Statutory ATO Guidance Box */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>ATO Business & Cryptocurrency Guidance</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Under Australian taxation law, Bitcoin received in exchange for goods and services is treated as ordinary business income valued in AUD at the time of transaction. Operating expenditures (hosting, compute power, Apple/Google advertising, enterprise developer subscriptions) are 100% tax-deductible against gross earnings. All records in this hub are preserved in accordance with the standard 5-year ATO statutory retention mandate.
                  </p>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
