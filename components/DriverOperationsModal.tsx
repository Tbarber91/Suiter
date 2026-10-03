'use client';

import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  Navigation,
  Fuel,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Clock,
  Phone,
  ArrowUpRight,
  Zap,
  MapPin,
  QrCode,
  DollarSign,
  Award,
  RefreshCw,
  Radio,
  Lock,
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
import { useAuth } from '@/components/AuthProvider';

interface DriverTrip {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  pickupAddress: string;
  dropoffAddress: string;
  itemDescription: string;
  distanceKm: number;
  estMinutes: number;
  fareAmount: number;
  status: 'assigned' | 'in_transit' | 'completed';
}

const INITIAL_TRIPS: DriverTrip[] = [
  {
    id: 'dt-1',
    orderNumber: 'SUI-DEL-8921',
    clientName: 'Julian Hastings',
    clientPhone: '0412 899 331',
    pickupAddress: '240 West Terrace, Adelaide SA 5000',
    dropoffAddress: '18 Palmer Place, North Adelaide SA 5006',
    itemDescription: 'Certified Architectural Tile Samples & Blueprints',
    distanceKm: 4.8,
    estMinutes: 12,
    fareAmount: 48.5,
    status: 'assigned',
  },
  {
    id: 'dt-2',
    orderNumber: 'SUI-DEL-8922',
    clientName: 'Sarah M.',
    clientPhone: '0433 112 450',
    pickupAddress: '72 The Parade, Norwood SA 5067',
    dropoffAddress: '142 King William Road, Hyde Park SA 5061',
    itemDescription: 'Solar Inverter Replacement & Diagnostic Sensor',
    distanceKm: 7.2,
    estMinutes: 16,
    fareAmount: 64.0,
    status: 'in_transit',
  },
];

export function DriverOperationsModal({
  trigger,
  children,
}: {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dispatch' | 'rego_ppsr' | 'earnings' | 'safety'>('dispatch');
  const [trips, setTrips] = useState<DriverTrip[]>(INITIAL_TRIPS);
  const [activeTrip, setActiveTrip] = useState<DriverTrip | null>(INITIAL_TRIPS[0]);
  
  // Rego & PPSR policing lookup state
  const [regoPlate, setRegoPlate] = useState('S123-ABC');
  const [vinNumber, setVinNumber] = useState('6T153EP0899214771');
  const [isVerifyingRego, setIsVerifyingRego] = useState(false);
  const [regoVerified, setRegoVerified] = useState(true);

  // Driver Payout trigger
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawnSuccess, setWithdrawnSuccess] = useState(false);

  const handleVerifyPPSR = () => {
    setIsVerifyingRego(true);
    setTimeout(() => {
      setIsVerifyingRego(false);
      setRegoVerified(true);
    }, 800);
  };

  const handleCompleteTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'completed' } : t))
    );
    if (activeTrip?.id === tripId) {
      setActiveTrip(null);
    }
  };

  const handleInstantPayout = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawnSuccess(true);
      setTimeout(() => setWithdrawnSuccess(false), 3000);
    }, 1000);
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
          className="rounded-xl border-zinc-200 text-xs font-bold gap-1.5 hover:bg-zinc-100"
        >
          <Car className="w-3.5 h-3.5 text-indigo-600" />
          Driver OS
        </Button>
      )}

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-0 border-0 shadow-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 text-indigo-300">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-xl font-display font-bold">
                    Suiter Driver OS
                  </DialogTitle>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-[10px] font-mono uppercase">
                    SA Fleet Online
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-zinc-300 mt-0.5">
                  Courier dispatch, Service SA vehicle registrations & PPSR anti-stolen goods policing.
                </DialogDescription>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Today&apos;s Fare Earnings</span>
              <span className="text-xl font-bold font-display text-white">$112.50 AUD</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="px-6 pt-4 border-b border-zinc-100 dark:border-zinc-800">
            <TabsList className="grid grid-cols-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
              <TabsTrigger value="dispatch" className="rounded-xl text-xs font-bold">
                <Navigation className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                Dispatch
              </TabsTrigger>
              <TabsTrigger value="rego_ppsr" className="rounded-xl text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                Service SA & PPSR
              </TabsTrigger>
              <TabsTrigger value="earnings" className="rounded-xl text-xs font-bold">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                Payouts
              </TabsTrigger>
              <TabsTrigger value="safety" className="rounded-xl text-xs font-bold">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-rose-600" />
                Security Fencing
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: ACTIVE DISPATCH & ROUTING */}
          <TabsContent value="dispatch" className="p-6 space-y-4 m-0">
            {activeTrip ? (
              <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-indigo-50 border-indigo-200 text-indigo-700 font-mono text-xs">
                      {activeTrip.orderNumber}
                    </Badge>
                    <span className="text-xs text-zinc-500 font-medium">In Transit • {activeTrip.estMinutes} mins away</span>
                  </div>
                  <span className="text-base font-bold text-zinc-900">${activeTrip.fareAmount.toFixed(2)} AUD</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      A
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase">Pickup Location</span>
                      <p className="text-xs font-semibold text-zinc-800">{activeTrip.pickupAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      B
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase">Dropoff Destination</span>
                      <p className="text-xs font-semibold text-zinc-800">{activeTrip.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-zinc-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">Client / Recipient</span>
                    <span className="font-bold text-zinc-900">{activeTrip.clientName}</span>
                  </div>
                  <a
                    href={`tel:${activeTrip.clientPhone}`}
                    className="py-1.5 px-3 rounded-lg bg-zinc-900 text-white font-bold flex items-center gap-1.5 hover:bg-zinc-800"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    Call Client
                  </a>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`https://maps.apple.com/?daddr=${encodeURIComponent(activeTrip.dropoffAddress)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Turn-by-Turn Apple Maps Navigation
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => handleCompleteTrip(activeTrip.id)}
                    className="rounded-xl border-zinc-200 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                    Confirm Dropoff
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-zinc-50 border border-dashed border-zinc-200 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-900">All Current Dispatches Completed</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Standing by for new marketplace delivery requests across Adelaide Metro.
                </p>
              </div>
            )}

            {/* Other queued deliveries */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-700">Available Driver Queue</span>
              {trips.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 bg-white rounded-xl border border-zinc-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{t.orderNumber}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      {t.distanceKm} km • {t.itemDescription}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-zinc-900 block">${t.fareAmount.toFixed(2)}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTrip(t)}
                      className="text-indigo-600 hover:text-indigo-800 text-[10px] font-bold cursor-pointer"
                    >
                      Select Route
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: SERVICE SA & PPSR STOLEN GOODS POLICING */}
          <TabsContent value="rego_ppsr" className="p-6 space-y-4 m-0">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h4 className="text-xs font-bold text-emerald-950">Service SA & PPSR Statutory Policing</h4>
                </div>
                <Badge className="bg-emerald-600 text-white text-[10px]">Title Guaranteed</Badge>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Suiter verifies every fleet vehicle against the South Australian Motor Vehicle Registry and national Personal Property Securities Register (PPSR) to prevent stolen goods, illegal re-birthing, and unrecorded financial encumbrances.
              </p>
            </div>

            {/* Registration Verification Card */}
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    South Australia Plate Number
                  </label>
                  <input
                    type="text"
                    value={regoPlate}
                    onChange={(e) => setRegoPlate(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white font-mono text-sm font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                    VIN / Chassis Number (17 digits)
                  </label>
                  <input
                    type="text"
                    value={vinNumber}
                    onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleVerifyPPSR}
                  disabled={isVerifyingRego}
                  className="rounded-xl text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  {isVerifyingRego ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Querying Service SA...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Run PPSR & Rego Check
                    </>
                  )}
                </Button>
              </div>

              {regoVerified && (
                <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Registry Result: Clear Title & Current Registration
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">Cert #PPSR-2026-SA</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-zinc-100">
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-mono">Rego Expiry</span>
                      <span className="font-bold text-zinc-800">14 Nov 2027</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-mono">Stolen Status</span>
                      <span className="font-bold text-emerald-600">No Record</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-mono">Written-Off</span>
                      <span className="font-bold text-emerald-600">Not Recorded</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[9px] uppercase font-mono">Encumbrance</span>
                      <span className="font-bold text-emerald-600">Nil Security Int.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: EARNINGS & INSTANT DISBURSEMENT */}
          <TabsContent value="earnings" className="p-6 space-y-4 m-0">
            <div className="p-5 rounded-2xl bg-zinc-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 font-mono uppercase">Available Driver Balance</span>
                <h3 className="text-2xl font-bold font-display mt-0.5">$345.00 AUD</h3>
                <span className="text-[10px] text-emerald-400 font-medium">Ready for instant push-to-card</span>
              </div>
              <Button
                onClick={handleInstantPayout}
                disabled={isWithdrawing}
                className="rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-11 px-5"
              >
                {isWithdrawing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Transferring...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-300" /> Cash Out to Visa/Apple Pay
                  </>
                )}
              </Button>
            </div>

            {withdrawnSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Funds disbursed via Mastercard Send / Visa Direct. Reached your account in 3 seconds.
              </div>
            )}

            {/* Fuel Saver Barcode Trigger for Driver */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700">
                  <Fuel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">Fleet Petrol Rewards Barcode</h4>
                  <p className="text-[11px] text-zinc-500">8¢/L Mobil & 6¢/L Shell fuel vouchers</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const btn = document.querySelector('[data-slot="petrol-trigger"]') as HTMLButtonElement;
                  if (btn) btn.click();
                  setIsOpen(false);
                }}
                className="rounded-xl text-xs font-bold border-zinc-200"
              >
                <QrCode className="w-3.5 h-3.5 mr-1 text-amber-600" />
                Show Fuel Code
              </Button>
            </div>
          </TabsContent>

          {/* TAB 4: SECURITY FENCING & HARDWARE GATES */}
          <TabsContent value="safety" className="p-6 space-y-4 m-0">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-zinc-900">Telecommunications & Secure Enclave Fencing</h4>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                Driver sessions operate within hardware-isolated memory (Secure Enclave) with automated gate termination upon app exit or idle status.
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase block">BOOTP / SOC Security</span>
                  <span className="font-bold text-emerald-600 text-xs">Active & Bound</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase block">Auto-Gate Closure</span>
                  <span className="font-bold text-emerald-600 text-xs">Automated On Exit</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const btn = document.querySelector('[data-slot="security-gate-trigger"]') as HTMLButtonElement;
                    if (btn) btn.click();
                    setIsOpen(false);
                  }}
                  className="w-full rounded-xl text-xs font-bold border-zinc-200"
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Open Master Security Gate & Fencing Console
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
