'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Wrench, 
  Car, 
  Home, 
  FileCheck, 
  ShieldCheck, 
  Phone, 
  Mail, 
  ArrowRight,
  Download,
  Sparkles,
  Star
} from 'lucide-react';
import { recordTransaction } from '@/lib/transactions';
import { LeaveReviewModal } from './LeaveReviewModal';

export type BookingCategory = 'kitchen_renovation' | 'cars_secondhand' | 'building_sites' | 'applications';

interface InstantBookingModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  initialCategory?: BookingCategory;
  listingTitle?: string;
  listingPrice?: string;
}

const BOOKING_CATEGORIES = [
  {
    id: 'kitchen_renovation' as BookingCategory,
    title: 'Kitchen & Home Renovations',
    subtitle: 'On-site laser measure, stone samples & 3D proposal',
    icon: Home,
    badge: 'Builder Attended',
    leadTime: 'Next-Day Available',
    duration: '45 mins on-site',
    deposit: 'Free Quote'
  },
  {
    id: 'cars_secondhand' as BookingCategory,
    title: 'Second Hand Items & Cars',
    subtitle: 'Mechanical inspection, roadworthy test drive & PPSR check',
    icon: Car,
    badge: 'LMVD Certified',
    leadTime: 'Same-Day Slots',
    duration: '60 mins inspection',
    deposit: '$0 Pre-Drive'
  },
  {
    id: 'building_sites' as BookingCategory,
    title: 'Building Sites & Trade Appraisals',
    subtitle: 'Quantity surveying, boundary survey & commercial appraisal',
    icon: Wrench,
    badge: 'Accredited QS',
    leadTime: '24h Notice',
    duration: '60 mins on site',
    deposit: 'Fixed Estimate'
  },
  {
    id: 'applications' as BookingCategory,
    title: 'Trade & License Applications',
    subtitle: 'Expedited verification & statutory sign-off consultation',
    icon: FileCheck,
    badge: 'Fast Review',
    leadTime: 'Instant Calendar',
    duration: '30 mins call',
    deposit: 'Direct Online'
  }
];

const TIME_SLOTS = [
  '08:30 AM',
  '10:00 AM',
  '11:30 AM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM'
];

export function InstantBookingModal({ 
  isOpen, 
  onOpenChange, 
  trigger, 
  initialCategory = 'kitchen_renovation',
  listingTitle,
  listingPrice
}: InstantBookingModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<BookingCategory>(initialCategory);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  
  // Customer info
  const [customerName, setCustomerName] = useState('Julian Hastings');
  const [customerPhone, setCustomerPhone] = useState('0412 890 123');
  const [customerEmail, setCustomerEmail] = useState('julian.hastings@adelaide.com.au');
  const [siteAddress, setSiteAddress] = useState('28 Victoria Avenue, Unley Park SA 5061');
  const [specificNotes, setSpecificNotes] = useState(listingTitle ? `Regarding listing: ${listingTitle} (${listingPrice || ''})` : 'Interested in full cabinet layout, stone island bench, and induction cooktop integration.');

  // Confirmation state
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [createdTx, setCreatedTx] = useState<any>(null);

  const activeCategoryData = BOOKING_CATEGORIES.find(c => c.id === selectedCategory) || BOOKING_CATEGORIES[0];

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `BK-${selectedCategory.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    const tx = recordTransaction({
      id: ref,
      listingId: listingTitle ? `bk-${ref}` : 'booking-service',
      listingTitle: listingTitle ? `${listingTitle} (Verified Session)` : `${activeCategoryData.title} Consultation`,
      listingType: 'service',
      listingPrice: listingPrice || activeCategoryData.deposit,
      sellerName: 'Marcus Vance (BLD 294810)',
      buyerName: customerName,
      buyerEmail: customerEmail,
      amount: activeCategoryData.deposit,
      status: 'completed',
      serviceCategory: activeCategoryData.title,
    });
    setCreatedTx(tx);
    setIsBooked(true);
  };

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Suiter Marketplace//Instant Booking//EN
BEGIN:VEVENT
UID:${bookingRef}@suitermarketplace.com.au
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${selectedDate.replace(/-/g, '')}T093000Z
DTEND:${selectedDate.replace(/-/g, '')}T103000Z
SUMMARY:${activeCategoryData.title} Booking (${bookingRef})
DESCRIPTION:${specificNotes} - Contact: ${customerName} (${customerPhone})
LOCATION:${siteAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${bookingRef}_Appointment.ics`);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[880px] rounded-[2.5rem] border-0 glass p-0 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-white/80 backdrop-blur-md shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle className="text-2xl font-display font-bold tracking-tight text-zinc-900">
                Instant Trade & Inspection Booking Engine
              </DialogTitle>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Real-time Slot Lock
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Book on-site kitchen quotes, vehicle mechanical inspections, site surveys, and application appraisals instantly.
            </p>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50">
          {!isBooked ? (
            <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category selector */}
              <div className="lg:col-span-12">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
                  Select Booking Specialisation
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {BOOKING_CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-md ring-2 ring-zinc-900/10'
                            : 'bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-800'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <Badge className={`text-[8px] px-1.5 py-0 uppercase ${
                            isSelected ? 'bg-emerald-400 text-zinc-950 font-bold' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {cat.badge}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{cat.title}</p>
                          <p className={`text-[9.5px] mt-1 line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            {cat.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Left Column: Date & Slot */}
              <div className="lg:col-span-5 space-y-4 bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-2">
                    <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" /> Choose Date
                  </Label>
                  <Input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="rounded-xl h-10 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> Available Time Slot
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                          selectedSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-600 space-y-1">
                  <p className="font-bold text-zinc-900">Appointment Parameters:</p>
                  <p>• Estimated Duration: {activeCategoryData.duration}</p>
                  <p>• Verified Attendant: Licensed Master Builder or LMVD Inspector</p>
                  <p>• Fee / Deposit: {activeCategoryData.deposit}</p>
                </div>
              </div>

              {/* Right Column: Customer Info & Site Location */}
              <div className="lg:col-span-7 space-y-4 bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Contact Person Name</Label>
                  <Input
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Full Name"
                    className="rounded-xl h-9 text-xs font-semibold mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Contact Phone</Label>
                    <Input
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="0400 000 000"
                      className="rounded-xl h-9 text-xs mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email Address</Label>
                    <Input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="rounded-xl h-9 text-xs mt-1 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Site Address / Vehicle Location (Kaurna Country)
                  </Label>
                  <Input
                    required
                    value={siteAddress}
                    onChange={e => setSiteAddress(e.target.value)}
                    placeholder="e.g. 142 King William St, Adelaide SA 5000"
                    className="rounded-xl h-9 text-xs mt-1"
                  />
                </div>

                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Specific Requirements or Vehicle Details</Label>
                  <textarea
                    value={specificNotes}
                    onChange={e => setSpecificNotes(e.target.value)}
                    rows={3}
                    placeholder="e.g. Dimensions of kitchen, make & model of car to inspect, access notes..."
                    className="w-full mt-1 p-2.5 rounded-xl border border-zinc-200 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-2xl h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Confirm Instant Booking Slot
                </Button>
              </div>
            </form>
          ) : (
            /* Confirmation Screen */
            <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl border border-zinc-200 text-center shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-400">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono px-3 py-1">
                  BOOKING CONFIRMED & CALENDAR LOCKED
                </Badge>
                <h3 className="text-xl font-display font-bold text-zinc-900 mt-2">
                  {activeCategoryData.title} Scheduled
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Reference Code: <span className="font-mono font-bold text-zinc-900">{bookingRef}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-zinc-200/60 pb-1.5">
                  <span className="text-zinc-500">Date & Slot:</span>
                  <span className="font-bold text-zinc-900">{selectedDate} @ {selectedSlot}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200/60 pb-1.5">
                  <span className="text-zinc-500">Client Contact:</span>
                  <span className="font-bold text-zinc-900">{customerName} ({customerPhone})</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200/60 pb-1.5">
                  <span className="text-zinc-500">Site Location:</span>
                  <span className="font-bold text-zinc-900 truncate max-w-[220px]">{siteAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Assigned Inspector:</span>
                  <span className="font-bold text-emerald-700">Marcus Vance (BLD 294810)</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => setIsReviewOpen(true)}
                  className="w-full rounded-xl h-10 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4 fill-white" />
                  <span>Rate & Review Service Experience (1-5★)</span>
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Button
                  onClick={handleDownloadICS}
                  className="flex-1 rounded-xl h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Add to Calendar (.ics)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsBooked(false)}
                  className="rounded-xl h-10 text-xs font-bold cursor-pointer"
                >
                  Book Another Appointment
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      <LeaveReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        transaction={createdTx || undefined}
        listingId={listingTitle ? `bk-${bookingRef}` : 'booking-service'}
        listingTitle={listingTitle || `${activeCategoryData.title} Consultation`}
      />
    </Dialog>
  );
}
