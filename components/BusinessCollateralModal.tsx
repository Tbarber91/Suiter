'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  FileText, 
  CreditCard, 
  Receipt, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Check, 
  Building2, 
  Sparkles, 
  QrCode,
  ShieldCheck,
  Send,
  Palette
} from 'lucide-react';
import { 
  BusinessDetails, 
  InvoiceData, 
  InvoiceItem, 
  LetterheadData, 
  downloadInvoicePDF, 
  downloadLetterheadPDF 
} from '@/lib/collateral-pdf';

interface BusinessCollateralModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  initialTab?: 'letterhead' | 'business_card' | 'invoice';
}

const DEFAULT_BUSINESS: BusinessDetails = {
  companyName: 'Vance Custom Kitchens & Living',
  tradingAs: 'Vance Trade Group SA',
  abn: '48 912 345 678',
  phone: '(08) 8234 5678',
  email: 'quotes@vancekitchens.com.au',
  address: '142 King William Street, Adelaide SA 5000',
  website: 'www.vancekitchens.com.au',
  tagline: 'Master Crafted Kitchen Renovations & Architectural Joinery',
  ownerName: 'Marcus Vance',
  licenseNumber: 'BLD 294810 (Master Builders SA)',
  bankName: 'Commonwealth Bank of Australia',
  bsb: '065-000',
  accountNumber: '1092 8472',
  payId: 'quotes@vancekitchens.com.au'
};

const DEFAULT_LETTER: LetterheadData = {
  recipientName: 'Mr. Julian & Mrs. Claire Hastings',
  recipientOrg: 'Private Residence Renovation',
  recipientAddress: '28 Victoria Avenue, Unley Park SA 5061',
  date: new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }),
  subject: 'Bespoke Kitchen Renovation & Architectural Joinery Proposal',
  body: `Dear Julian & Claire,\n\nThank you for inviting Vance Custom Kitchens to conduct a site measurement and architectural assessment of your residential property in Unley Park.\n\nFollowing our on-site survey and spatial consultation, we are pleased to confirm our comprehensive renovation scope. This includes premium 2-pack polyurethane satin joinery, Quantum Quartz engineered stone benchtops, Blum soft-close European hardware throughout, and full integrated trade coordination (plumbing, electrical, and compliance sign-off).\n\nAll works are conducted strictly in compliance with South Australia Building Codes, Australian Standards AS 4386 (Domestic Kitchen Assemblies), and Master Builders SA quality benchmarks.\n\nPlease review the attached invoice schedule and do not hesitate to contact us directly should you wish to amend any finish specifications.`
};

const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: 'INV-2026-084',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  clientName: 'Julian & Claire Hastings',
  clientAddress: '28 Victoria Avenue, Unley Park SA 5061',
  clientEmail: 'hastings.family@unley.com.au',
  notes: 'Payment terms: 14 days from issue date. Milestone 1: Site measurement & preliminary 3D joinery cad completed.',
  items: [
    {
      id: '1',
      description: 'Site Feasibility, Laser Measurement & Architectural Kitchen Plan',
      quantity: 1,
      unitPrice: 850.00
    },
    {
      id: '2',
      description: 'Custom Joinery Fabrication Deposit (2-Pack Satin White Polyurethane)',
      quantity: 1,
      unitPrice: 4200.00
    },
    {
      id: '3',
      description: 'Quantum Quartz Engineered Stone Benchtop Slab Allocation (20mm Bevel)',
      quantity: 2,
      unitPrice: 1350.00
    }
  ]
};

const CARD_THEMES = [
  { id: 'dark', name: 'Obsidian Luxe', bg: 'bg-zinc-950 text-white', accent: 'bg-emerald-400', border: 'border-zinc-800' },
  { id: 'emerald', name: 'Emerald Trade', bg: 'bg-emerald-950 text-white', accent: 'bg-emerald-300', border: 'border-emerald-800' },
  { id: 'navy', name: 'Royal Navy', bg: 'bg-slate-900 text-white', accent: 'bg-sky-400', border: 'border-slate-800' },
  { id: 'light', name: 'Clean White Minimal', bg: 'bg-white text-zinc-900', accent: 'bg-zinc-900', border: 'border-zinc-200' }
];

export function BusinessCollateralModal({ isOpen, onOpenChange, trigger, initialTab = 'letterhead' }: BusinessCollateralModalProps) {
  const [activeTab, setActiveTab] = useState<'letterhead' | 'business_card' | 'invoice'>(initialTab);
  const [business, setBusiness] = useState<BusinessDetails>(DEFAULT_BUSINESS);
  const [letter, setLetter] = useState<LetterheadData>(DEFAULT_LETTER);
  const [invoice, setInvoice] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [cardTheme, setCardTheme] = useState(CARD_THEMES[0].id);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const selectedTheme = CARD_THEMES.find(t => t.id === cardTheme) || CARD_THEMES[0];

  const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: 'Additional Trade Labour or Material Item',
      quantity: 1,
      unitPrice: 150.00
    };
    setInvoice(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleRemoveItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[1000px] rounded-[2.5rem] border-0 glass p-0 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <DialogHeader className="p-6 pb-4 border-b bg-white/70 backdrop-blur-md shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="text-2xl font-display font-bold tracking-tight text-zinc-900">
                Brand & Business Collateral Studio
              </DialogTitle>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Individualized Print Suite
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Generate personalized letterheads, double-sided business cards, and tax invoices ready for immediate client delivery.
            </p>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex bg-zinc-100 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('letterhead')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'letterhead' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Letterhead
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('business_card')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'business_card' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" /> Business Cards
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('invoice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'invoice' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Invoices & GST
            </button>
          </div>
        </DialogHeader>

        {/* Studio Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          {/* TAB 1: LETTERHEAD STUDIO */}
          {activeTab === 'letterhead' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Config Controls */}
              <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Letterhead Parameters</h4>
                  <Badge variant="outline" className="text-[9px] font-mono">A4 Standard</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Business / Trading Name</Label>
                    <Input
                      value={business.companyName}
                      onChange={e => setBusiness({ ...business, companyName: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">ABN</Label>
                      <Input
                        value={business.abn}
                        onChange={e => setBusiness({ ...business, abn: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Phone</Label>
                      <Input
                        value={business.phone}
                        onChange={e => setBusiness({ ...business, phone: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tagline / Specialisation</Label>
                    <Input
                      value={business.tagline || ''}
                      onChange={e => setBusiness({ ...business, tagline: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Recipient Name & Address</Label>
                    <Input
                      value={letter.recipientName}
                      onChange={e => setLetter({ ...letter, recipientName: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs font-bold"
                      placeholder="Recipient Name"
                    />
                    <Input
                      value={letter.recipientAddress}
                      onChange={e => setLetter({ ...letter, recipientAddress: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs"
                      placeholder="Recipient Address"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Subject Line</Label>
                    <Input
                      value={letter.subject}
                      onChange={e => setLetter({ ...letter, subject: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Official Body Text</Label>
                    <textarea
                      value={letter.body}
                      onChange={e => setLetter({ ...letter, body: e.target.value })}
                      rows={6}
                      className="w-full mt-1 p-3 rounded-xl border border-zinc-200 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-zinc-400 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      onClick={() => downloadLetterheadPDF(business, letter)}
                      className="flex-1 rounded-xl h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="rounded-xl h-10 px-4 text-xs font-bold cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Live A4 Sheet Preview */}
              <div className="lg:col-span-7 flex justify-center items-start">
                <div className="w-full max-w-[520px] bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 min-h-[640px] flex flex-col justify-between relative overflow-hidden font-sans">
                  {/* Top Bar Accent */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-600" />
                  
                  <div>
                    {/* Brand Header */}
                    <div className="flex justify-between items-start border-b border-zinc-100 pb-5 mb-6">
                      <div>
                        <div className="w-4 h-1 bg-emerald-500 rounded-full mb-2" />
                        <h2 className="text-base font-display font-bold text-zinc-900 tracking-tight leading-tight">{business.companyName}</h2>
                        {business.tagline && (
                          <p className="text-[9px] text-zinc-500 font-medium italic mt-0.5">{business.tagline}</p>
                        )}
                      </div>
                      <div className="text-right text-[8.5px] text-zinc-400 space-y-0.5">
                        <p className="font-bold text-zinc-600">ABN {business.abn}</p>
                        <p>{business.address}</p>
                        <p>{business.phone} • {business.email}</p>
                        <p className="text-emerald-700 font-semibold">{business.website}</p>
                      </div>
                    </div>

                    {/* Recipient & Date */}
                    <div className="mb-5 space-y-0.5 text-xs text-zinc-600">
                      <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{letter.date}</p>
                      <p className="font-bold text-zinc-900">{letter.recipientName}</p>
                      <p className="text-[10px] text-zinc-500">{letter.recipientAddress}</p>
                    </div>

                    {/* Subject */}
                    <div className="mb-4">
                      <p className="text-xs font-bold text-zinc-900 uppercase tracking-wide border-l-2 border-emerald-500 pl-2">
                        RE: {letter.subject}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="text-[10.5px] text-zinc-700 leading-relaxed whitespace-pre-wrap font-serif">
                      {letter.body}
                    </div>

                    {/* Sign off */}
                    <div className="mt-8 text-xs text-zinc-800 space-y-0.5">
                      <p className="text-[10px] text-zinc-500">Sincerely,</p>
                      <p className="font-display font-bold text-zinc-900 text-sm mt-1">{business.ownerName}</p>
                      <p className="text-[9.5px] text-zinc-500">{business.companyName}</p>
                      {business.licenseNumber && (
                        <p className="text-[8.5px] text-emerald-700 font-medium">{business.licenseNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Footnote */}
                  <div className="pt-6 border-t border-zinc-100 text-center text-[7.5px] text-zinc-400">
                    {business.companyName} • Registered South Australian Merchant • ABN {business.abn}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INDIVIDUALIZED BUSINESS CARDS */}
          {activeTab === 'business_card' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls */}
              <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Card Specifications</h4>
                  <Badge variant="outline" className="text-[9px]">90 × 55 mm Standard</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Color Palette Selector */}
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Palette className="w-3 h-3" /> Finish Palette
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      {CARD_THEMES.map(theme => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setCardTheme(theme.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                            cardTheme === theme.id ? 'border-zinc-900 ring-2 ring-zinc-900/10' : 'border-zinc-200'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full ${theme.accent}`} />
                          <span className="truncate text-zinc-800">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flip Front / Back */}
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Face View</Label>
                    <div className="flex bg-zinc-100 p-1 rounded-xl mt-1">
                      <button
                        type="button"
                        onClick={() => setCardSide('front')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          cardSide === 'front' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                        }`}
                      >
                        Front Side
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardSide('back')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          cardSide === 'back' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500'
                        }`}
                      >
                        Back Side (QR & NFC)
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Representative Name</Label>
                    <Input
                      value={business.ownerName}
                      onChange={e => setBusiness({ ...business, ownerName: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Company Name</Label>
                    <Input
                      value={business.companyName}
                      onChange={e => setBusiness({ ...business, companyName: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Direct Phone</Label>
                      <Input
                        value={business.phone}
                        onChange={e => setBusiness({ ...business, phone: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Trade License #</Label>
                      <Input
                        value={business.licenseNumber || ''}
                        onChange={e => setBusiness({ ...business, licenseNumber: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      onClick={handlePrint}
                      className="flex-1 rounded-xl h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1.5" /> Print Ready Cards
                    </Button>
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-zinc-100/60 rounded-3xl border border-zinc-200/80">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Live 300-DPI Vector Card ({cardSide === 'front' ? 'Front' : 'Back'})
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
                    className="h-7 text-[10px] font-bold px-2 rounded-lg bg-white border border-zinc-200"
                  >
                    Flip Card
                  </Button>
                </div>

                {/* 3.5" x 2" Proportion Card Container */}
                <div 
                  className={`w-[380px] h-[218px] rounded-2xl shadow-2xl p-6 flex flex-col justify-between transition-all duration-500 relative overflow-hidden border ${selectedTheme.bg} ${selectedTheme.border}`}
                >
                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {cardSide === 'front' ? (
                    <>
                      {/* Top row */}
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <div className={`w-3.5 h-1 rounded-full ${selectedTheme.accent} mb-2`} />
                          <h3 className="font-display font-bold text-base tracking-tight leading-tight">{business.companyName}</h3>
                          {business.tradingAs && (
                            <p className="text-[8.5px] opacity-70 mt-0.5">{business.tradingAs}</p>
                          )}
                        </div>
                        <Badge className="bg-white/10 backdrop-blur-md text-[8px] font-mono border-white/10 uppercase">
                          Verified Pro
                        </Badge>
                      </div>

                      {/* Middle owner */}
                      <div className="relative z-10">
                        <p className="text-sm font-display font-bold tracking-tight">{business.ownerName}</p>
                        <p className="text-[9.5px] opacity-80">{business.tagline}</p>
                      </div>

                      {/* Bottom Contacts */}
                      <div className="relative z-10 pt-2 border-t border-white/10 flex justify-between items-end text-[8.5px] opacity-80">
                        <div>
                          <p>{business.phone}</p>
                          <p>{business.email}</p>
                        </div>
                        <div className="text-right">
                          <p>{business.website}</p>
                          <p className="font-mono text-[7.5px] opacity-60">ABN {business.abn}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Back Side */
                    <div className="flex items-center justify-between h-full relative z-10 gap-4">
                      <div className="space-y-2 flex-1">
                        <div className={`w-3 h-1 rounded-full ${selectedTheme.accent}`} />
                        <h4 className="font-display font-bold text-sm tracking-tight">{business.companyName}</h4>
                        <p className="text-[9px] opacity-75 leading-relaxed">
                          Instant site inspection bookings & verified trade quotes available via our direct digital channel.
                        </p>
                        {business.licenseNumber && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[8px] font-mono">
                            <ShieldCheck className="w-2.5 h-2.5" />
                            {business.licenseNumber}
                          </div>
                        )}
                      </div>

                      {/* QR Representation */}
                      <div className="bg-white p-2.5 rounded-xl shadow-lg flex flex-col items-center justify-center shrink-0">
                        <QrCode className="w-16 h-16 text-zinc-950" />
                        <span className="text-[6.5px] font-bold text-zinc-700 uppercase tracking-widest mt-1">Scan to Book</span>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[10px] text-zinc-400 mt-4 font-medium">
                  Compatible with standard commercial business card printers (Officeworks, Vistaprint, local print houses).
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: INVOICE & GST ENGINE */}
          {activeTab === 'invoice' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls */}
              <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Invoice Parameters</h4>
                  <Badge className="bg-zinc-900 text-white text-[9px] font-mono">Tax Invoice (ATO)</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Invoice #</Label>
                      <Input
                        value={invoice.invoiceNumber}
                        onChange={e => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Due Date</Label>
                      <Input
                        type="date"
                        value={invoice.dueDate}
                        onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Client / Customer Name</Label>
                    <Input
                      value={invoice.clientName}
                      onChange={e => setInvoice({ ...invoice, clientName: e.target.value })}
                      className="rounded-xl h-9 mt-1 text-xs font-bold"
                      placeholder="Client Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Client Email</Label>
                      <Input
                        value={invoice.clientEmail}
                        onChange={e => setInvoice({ ...invoice, clientEmail: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Client Site Address</Label>
                      <Input
                        value={invoice.clientAddress}
                        onChange={e => setInvoice({ ...invoice, clientAddress: e.target.value })}
                        className="rounded-xl h-9 mt-1 text-xs"
                      />
                    </div>
                  </div>

                  {/* Line Items Editor */}
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Itemized Breakdown</Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleAddItem}
                        className="h-6 text-[10px] font-bold px-2 rounded-lg bg-zinc-100 hover:bg-zinc-200"
                      >
                        <Plus className="w-3 h-3 mr-1" /> Add Line
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {invoice.items.map((item, idx) => (
                        <div key={item.id} className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                          <div className="flex gap-2">
                            <Input
                              value={item.description}
                              onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                              placeholder="Description"
                              className="h-8 rounded-lg text-xs bg-white flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-7 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[9px] text-zinc-400 font-bold uppercase">Qty:</span>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={e => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                                className="h-7 rounded-lg text-xs bg-white font-mono"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-400 font-bold uppercase">Price ($):</span>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={e => handleUpdateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="h-7 rounded-lg text-xs bg-white font-mono font-bold"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="pt-2 border-t grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-zinc-500">BSB</Label>
                      <Input
                        value={business.bsb}
                        onChange={e => setBusiness({ ...business, bsb: e.target.value })}
                        className="rounded-xl h-8 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] font-bold uppercase text-zinc-500">Account #</Label>
                      <Input
                        value={business.accountNumber}
                        onChange={e => setBusiness({ ...business, accountNumber: e.target.value })}
                        className="rounded-xl h-8 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button
                      onClick={() => downloadInvoicePDF(business, invoice)}
                      className="flex-1 rounded-xl h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download Tax Invoice PDF
                    </Button>
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="rounded-xl h-10 px-4 text-xs font-bold cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
                    </Button>
                  </div>
                </div>
              </div>

              {/* Live Invoice Preview */}
              <div className="lg:col-span-7 flex justify-center items-start">
                <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-xl border border-zinc-200 p-8 min-h-[640px] flex flex-col justify-between font-sans">
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-zinc-200 pb-5 mb-5">
                      <div>
                        <h2 className="text-lg font-display font-bold text-zinc-900 tracking-tight">{business.companyName}</h2>
                        <p className="text-[10px] text-zinc-500 font-mono">ABN {business.abn}</p>
                        <p className="text-[10px] text-zinc-500">{business.address}</p>
                        <p className="text-[10px] text-zinc-500">{business.phone} • {business.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-zinc-900 text-white text-[10px] font-mono px-2.5 py-0.5">TAX INVOICE</Badge>
                        <p className="text-xs font-bold text-zinc-900 font-mono mt-1.5">{invoice.invoiceNumber}</p>
                        <p className="text-[10px] text-zinc-400">Date: {invoice.issueDate}</p>
                        <p className="text-[10px] text-zinc-500 font-semibold">Due: {invoice.dueDate}</p>
                      </div>
                    </div>

                    {/* Bill To */}
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100 mb-5">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Billed To:</p>
                      <p className="text-xs font-bold text-zinc-900">{invoice.clientName}</p>
                      <p className="text-[10px] text-zinc-500">{invoice.clientAddress}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{invoice.clientEmail}</p>
                    </div>

                    {/* Items Table */}
                    <div className="border border-zinc-200 rounded-xl overflow-hidden mb-5">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-zinc-900 text-white text-[9px] uppercase tracking-wider">
                          <tr>
                            <th className="p-2.5 pl-3">Description</th>
                            <th className="p-2.5 text-center">Qty</th>
                            <th className="p-2.5 text-right">Price</th>
                            <th className="p-2.5 text-right pr-3">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                          {invoice.items.map((item, idx) => (
                            <tr key={item.id} className={idx % 2 === 1 ? 'bg-zinc-50/50' : 'bg-white'}>
                              <td className="p-2.5 pl-3 text-zinc-800 font-medium">{item.description}</td>
                              <td className="p-2.5 text-center text-zinc-600 font-mono">{item.quantity}</td>
                              <td className="p-2.5 text-right text-zinc-600 font-mono">${item.unitPrice.toFixed(2)}</td>
                              <td className="p-2.5 text-right pr-3 font-bold text-zinc-900 font-mono">
                                ${(item.quantity * item.unitPrice).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-6">
                      <div className="w-56 space-y-1.5 text-xs">
                        <div className="flex justify-between text-zinc-500">
                          <span>Subtotal:</span>
                          <span className="font-mono">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-zinc-500">
                          <span>GST (10%):</span>
                          <span className="font-mono">${gst.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-zinc-200 text-sm font-bold text-zinc-900">
                          <span>Total AUD:</span>
                          <span className="font-mono font-black text-emerald-700">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Remittance Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                      <p className="font-bold text-zinc-900 uppercase tracking-wide">Direct EFT Payment Details</p>
                      <p className="text-zinc-600">Bank: {business.bankName}</p>
                      <p className="text-zinc-600 font-mono">BSB: {business.bsb}  •  Account: {business.accountNumber}</p>
                      <p className="text-zinc-600">Account Name: {business.companyName}</p>
                      {business.payId && <p className="text-emerald-700 font-semibold font-mono">PayID: {business.payId}</p>}
                    </div>
                  </div>

                  <p className="text-[8px] text-zinc-400 text-center pt-4 border-t border-zinc-100">
                    Compliant with Australian Tax Office (ATO) Tax Invoice standards & Australian Consumer Law.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
