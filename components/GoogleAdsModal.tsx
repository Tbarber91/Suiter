'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  TrendingUp, 
  Target, 
  DollarSign, 
  MousePointerClick, 
  PhoneCall, 
  Eye, 
  Globe, 
  AlertCircle,
  RefreshCw,
  Layers,
  MapPin
} from 'lucide-react';
import { useAuth } from './AuthProvider';

interface GoogleAdsModalProps {
  trigger?: React.ReactElement;
  listingTitle?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GoogleAdsModal({
  trigger,
  listingTitle,
  isOpen: controlledIsOpen,
  onOpenChange: controlledOnOpenChange
}: GoogleAdsModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const onOpenChange = controlledOnOpenChange || setInternalIsOpen;

  const { user } = useAuth();

  // Connection State
  const [customerId, setCustomerId] = useState('842-195-4309');
  const [conversionTag, setConversionTag] = useState('AW-1094829104');
  const [isConnected, setIsConnected] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  // Campaign State
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'settings'>('campaigns');
  const [headline, setHeadline] = useState(listingTitle || 'Licensed Master Kitchen & Renovation Specialists');
  const [subHeadline, setSubHeadline] = useState('Bespoke Cabinetry & 3D Scans • Adelaide Fast Quotes');
  const [dailyBudget, setDailyBudget] = useState('25');
  const [targetRadius, setTargetRadius] = useState('25km (Greater Adelaide)');
  const [targetGoal, setTargetGoal] = useState<'leads' | 'calls' | 'clicks'>('leads');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // Mock Performance Metrics
  const [stats, setStats] = useState({
    impressions: '14,820',
    clicks: '942',
    ctr: '6.35%',
    avgCpc: '$1.42',
    conversions: '48 Leads',
    cost: '$326.50'
  });

  const handleLinkAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      setIsConnected(true);
      setLinkSuccess(true);
      setTimeout(() => setLinkSuccess(false), 3000);
    }, 1200);
  };

  const handleLaunchCampaign = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => {
        setDeploySuccess(false);
        setActiveTab('campaigns');
      }, 1500);
    }, 1200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger render={trigger} />
      ) : (
        <DialogTrigger render={
          <Button 
            variant="outline" 
            size="sm"
            className="rounded-2xl h-10 px-3.5 text-xs font-bold bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800 flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-0.5 font-black">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-yellow-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </div>
            <span className="font-extrabold text-zinc-900">Ads</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </Button>
        } />
      )}

      <DialogContent className="sm:max-w-[700px] p-0 rounded-[2.5rem] overflow-hidden border-0 glass max-h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 md:p-8 pb-4 bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 text-white relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center p-2 shadow-lg">
                {/* Google Ads icon styling */}
                <div className="flex items-center gap-0.5 font-black text-sm">
                  <span className="text-blue-600 font-extrabold">G</span>
                  <span className="text-amber-500 font-extrabold">A</span>
                  <span className="text-emerald-600 font-extrabold">d</span>
                  <span className="text-rose-500 font-extrabold">s</span>
                </div>
              </div>
              <div>
                <DialogTitle className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                  Google Ads Integration
                </DialogTitle>
                <p className="text-xs text-zinc-400 font-medium">
                  Sync marketplace services & ads to Google Search & Local Maps Sponsored placements.
                </p>
              </div>
            </div>

            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 mr-1 inline text-emerald-400" />
              Connected
            </Badge>
          </div>

          {/* Nav Tabs */}
          <div className="flex gap-2 p-1 bg-white/10 rounded-2xl mt-5">
            <button
              type="button"
              onClick={() => setActiveTab('campaigns')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'campaigns'
                  ? 'bg-white text-zinc-900 shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Campaign Performance
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white text-zinc-900 shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Launch New Ad
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-zinc-900 shadow-md'
                  : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Account & Tag Linking
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-white space-y-6">
          {/* TAB 1: CAMPAIGN PERFORMANCE */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {/* Telemetry Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-blue-500" /> Impressions
                  </div>
                  <div className="text-xl font-black text-zinc-900 mt-1 font-display">{stats.impressions}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+18.4% vs last week</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <MousePointerClick className="w-3 h-3 text-indigo-500" /> Clicks
                  </div>
                  <div className="text-xl font-black text-zinc-900 mt-1 font-display">{stats.clicks}</div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">CTR: {stats.ctr}</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <Target className="w-3 h-3 text-emerald-500" /> Conversions
                  </div>
                  <div className="text-xl font-black text-zinc-900 mt-1 font-display">{stats.conversions}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Phone calls & quotes</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-500" /> Avg Cost / Click
                  </div>
                  <div className="text-xl font-black text-zinc-900 mt-1 font-display">{stats.avgCpc}</div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Local auction price</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-sky-500" /> Active Region
                  </div>
                  <div className="text-sm font-bold text-zinc-900 mt-1 truncate">Adelaide Metro</div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">25km geo-fence</div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-rose-500" /> Total Spend
                  </div>
                  <div className="text-xl font-black text-zinc-900 mt-1 font-display">{stats.cost}</div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-0.5">Within daily budget</div>
                </div>
              </div>

              {/* Active Campaigns List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Live Google Ad Campaigns</h4>
                  <Button 
                    size="sm"
                    onClick={() => setActiveTab('create')}
                    className="h-8 rounded-xl text-xs font-bold bg-zinc-900 text-white cursor-pointer hover:bg-zinc-800"
                  >
                    + Boost Listing
                  </Button>
                </div>

                <div className="p-4 rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all space-y-3 bg-white shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[9px] font-bold">
                          ACTIVE • GOOGLE SEARCH & MAPS
                        </Badge>
                        <span className="text-[10px] text-zinc-400 font-mono">ID: GA-78401</span>
                      </div>
                      <h5 className="font-bold text-sm text-zinc-900 mt-1.5">
                        {listingTitle || 'Vance Master Kitchen Renovation & Joinery'}
                      </h5>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Targeting: &ldquo;kitchen renovations adelaide&rdquo;, &ldquo;cabinet maker near me&rdquo;, &ldquo;home builders SA&rdquo;
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-zinc-900">$25.00/day</div>
                      <div className="text-[10px] text-emerald-600 font-bold">Optimal CPA</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-xs">
                    <div className="flex items-center gap-4 text-[11px] text-zinc-600 font-medium">
                      <span>428 Clicks</span>
                      <span>•</span>
                      <span>24 Inquiries</span>
                      <span>•</span>
                      <span>Avg Pos: 1.2</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href="https://ads.google.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        Google Ads Dashboard <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE / BOOST AD */}
          {activeTab === 'create' && (
            <div className="space-y-6">
              {deploySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Google Ads campaign synced and submitted to Google Ad Network!
                </div>
              )}

              <div className="space-y-4">
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Sponsored Ad Headline (Appears in Google Search)
                  </Label>
                  <Input 
                    value={headline} 
                    onChange={(e) => setHeadline(e.target.value)} 
                    className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-semibold"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Call-out / Sub-heading
                  </Label>
                  <Input 
                    value={subHeadline} 
                    onChange={(e) => setSubHeadline(e.target.value)} 
                    className="rounded-xl h-11 bg-white border-zinc-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Daily Spend Budget ($ AUD)
                    </Label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <Input 
                        value={dailyBudget} 
                        onChange={(e) => setDailyBudget(e.target.value)} 
                        className="rounded-xl h-11 pl-9 bg-white border-zinc-200 text-xs font-bold font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Geographic Targeting Radius
                    </Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select 
                        value={targetRadius} 
                        onChange={(e) => setTargetRadius(e.target.value)}
                        className="w-full rounded-xl h-11 pl-9 pr-3 bg-white border border-zinc-200 text-xs font-semibold text-zinc-800"
                      >
                        <option value="10km (Inner Adelaide CBD)">10km (Inner Adelaide CBD)</option>
                        <option value="25km (Greater Adelaide)">25km (Greater Adelaide)</option>
                        <option value="50km (Adelaide Hills & Coast)">50km (Adelaide Hills & Coast)</option>
                        <option value="South Australia Wide">South Australia Wide</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live Google Search Preview */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                    Live Google Search Ad Mockup
                  </span>

                  <div className="p-4 bg-white rounded-xl border border-zinc-200 shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-700">
                      <span className="font-bold text-black text-[10px] border border-zinc-300 rounded px-1">Sponsored</span>
                      <span className="text-zinc-500 font-mono text-[11px]">https://marketplace.suiter.adelaide › {user?.handle || 'services'}</span>
                    </div>

                    <div className="text-blue-700 hover:underline font-medium text-sm cursor-pointer">
                      {headline} | Official Marketplace Listing
                    </div>

                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {subHeadline}. Verified licensed trade on Kaurna Country. Fast quotes, certified insurance, and sovereign compliance.
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-[11px] text-blue-700 font-medium">
                      <span className="hover:underline cursor-pointer">Instant Booking</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">Request Quote</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer">View Reviews ★ 5.0</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleLaunchCampaign}
                  disabled={isDeploying}
                  className="w-full rounded-2xl h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xl shadow-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isDeploying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Syncing Ad to Google Ads Engine...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Deploy to Google Ads Network
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & TAG SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleLinkAccount} className="space-y-5">
              {linkSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Google Ads account and measurement tag successfully linked!
                </div>
              )}

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Google Ads Customer ID (CID)
                  </Label>
                  <Input 
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="123-456-7890"
                    required
                    className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-mono font-bold text-zinc-800"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Located in the top right corner of your Google Ads manager console.
                  </p>
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Conversion Tracking Tag / Global Site Tag
                  </Label>
                  <Input 
                    value={conversionTag}
                    onChange={(e) => setConversionTag(e.target.value)}
                    placeholder="AW-XXXXXXXXX"
                    required
                    className="rounded-xl h-11 bg-white border-zinc-200 text-xs font-mono font-bold text-zinc-800"
                  />
                  <p className="text-[10px] text-zinc-500">
                    Automatically fires conversion events whenever a user clicks &ldquo;Book Now&rdquo; or submits an inquiry.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Auto-Tagging & Enhanced Measurement</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[9px]">ENABLED</Badge>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your listings will automatically append Google Click Identifier (`gclid`) parameters for cross-domain attribution.
                </p>
              </div>

              <Button 
                type="submit"
                disabled={isLinking}
                className="w-full rounded-2xl h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-xl shadow-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLinking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Validating Google Ads OAuth Connection...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Save & Update Google Ads Link
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
