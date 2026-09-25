'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Calendar, 
  Download, 
  Users, 
  Wrench, 
  FileText, 
  CreditCard, 
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { InstantBookingModal } from './InstantBookingModal';
import { BusinessCollateralModal } from './BusinessCollateralModal';

interface BusinessProfileModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
  businessName?: string;
}

export function BusinessProfileModal({ 
  isOpen, 
  onOpenChange, 
  trigger,
  businessName = 'Vance Custom Kitchens & Architectural Joinery'
}: BusinessProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'team' | 'compliance'>('overview');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[920px] rounded-[2.5rem] border-0 glass p-0 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Profile Hero Banner */}
        <div className="relative h-44 bg-zinc-950 overflow-hidden shrink-0">
          <img 
            src="https://picsum.photos/seed/kitcheninterior/1200/400" 
            alt="Business Banner"
            className="w-full h-full object-cover opacity-40 grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-end gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-xl flex items-center justify-center text-zinc-900 font-display font-black text-xl shrink-0 overflow-hidden">
                <span className="text-emerald-700">VK</span>
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-display font-bold tracking-tight">{businessName}</h2>
                  <Badge className="bg-emerald-500 text-zinc-950 font-black text-[9px] uppercase tracking-wider">
                    Verified Master Builder
                  </Badge>
                </div>
                <p className="text-xs text-zinc-300 flex items-center gap-2 mt-0.5">
                  <span>ABN 48 912 345 678</span>
                  <span>•</span>
                  <span>Lic BLD 294810</span>
                  <span>•</span>
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" /> 5.0 (38 reviews)
                  </span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <InstantBookingModal
                trigger={
                  <Button size="sm" className="rounded-xl h-9 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer shadow-lg">
                    <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book On-Site Quote
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 px-6 border-b bg-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex gap-2">
            {[
              { id: 'overview', label: 'Overview & Story' },
              { id: 'services', label: 'Trade Services' },
              { id: 'team', label: 'Staff & Roster' },
              { id: 'compliance', label: 'Statutory Credentials' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <BusinessCollateralModal
              initialTab="business_card"
              trigger={
                <Button variant="outline" size="sm" className="h-8 rounded-xl text-[11px] font-bold cursor-pointer">
                  <CreditCard className="w-3 h-3 mr-1" /> Digital Business Card
                </Button>
              }
            />
            <BusinessCollateralModal
              initialTab="letterhead"
              trigger={
                <Button variant="outline" size="sm" className="h-8 rounded-xl text-[11px] font-bold cursor-pointer">
                  <FileText className="w-3 h-3 mr-1" /> View Letterhead
                </Button>
              }
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-50/50 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-5">
                <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">About Vance Custom Kitchens</h3>
                  <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                    With over 15 years servicing homeowners across metropolitan Adelaide and the Adelaide Hills, Vance Custom Kitchens delivers turnkey architectural renovations, precision cabinetry, and integrated trade management.
                  </p>
                  <p className="text-xs text-zinc-700 leading-relaxed font-sans">
                    From initial on-site laser surveys to custom 3D CAD modeling, 2-pack polyurethane finishings, and stone benchtop installation, all projects adhere strictly to the South Australian Building Code and Australian Standard AS 4386.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 text-center">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Completed Projects</p>
                    <p className="text-xl font-black text-zinc-900 font-mono mt-0.5">240+</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 text-center">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Master Builders SA</p>
                    <p className="text-xl font-black text-emerald-600 font-mono mt-0.5">Verified</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-zinc-200 text-center">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">Escrow Protected</p>
                    <p className="text-xl font-black text-indigo-600 font-mono mt-0.5">100%</p>
                  </div>
                </div>

                {/* Recent Portfolio Gallery */}
                <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Recent Kitchen Installations</h3>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { title: 'Unley Park Classic Modern', img: 'https://picsum.photos/seed/kitchen1/400/300' },
                      { title: 'North Adelaide Architectural', img: 'https://picsum.photos/seed/kitchen2/400/300' },
                      { title: 'Norwood Heritage Revival', img: 'https://picsum.photos/seed/kitchen3/400/300' }
                    ].map((item, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-zinc-100 group">
                        <img src={item.img} alt={item.title} className="w-full h-24 object-cover group-hover:scale-105 transition-all duration-300" />
                        <div className="p-2 bg-white">
                          <p className="text-[10px] font-bold text-zinc-800 truncate">{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Contact Card */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-3.5 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-b pb-2">Business Contacts</h3>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-zinc-800">142 King William Street</p>
                        <p className="text-zinc-500 text-[11px]">Adelaide SA 5000 (Kaurna Country)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-zinc-400 shrink-0" />
                      <a href="tel:0882345678" className="text-zinc-800 font-bold hover:underline">(08) 8234 5678</a>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="text-zinc-600 font-mono text-[11px]">quotes@vancekitchens.com.au</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span className="text-zinc-600 text-[11px]">Mon-Fri: 7:30 AM - 5:00 PM</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <InstantBookingModal
                      trigger={
                        <Button className="w-full rounded-2xl h-10 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer shadow-sm">
                          <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book Inspection Slot
                        </Button>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Bespoke Kitchen Renovation & Joinery', price: 'From $12,500', desc: 'Full custom 2-pack polyurethane cabinetry, soft-close drawers, and integrated appliances.' },
                { title: 'Quantum Quartz & Granite Benchtops', price: 'From $2,800', desc: 'Engineered stone supply, precision templating, undermount sink cut-outs, and edge polishing.' },
                { title: 'Site Feasibility & 3D Architectural CAD', price: '$850 (Credited upon build)', desc: 'Full spatial survey, laser measurement, electrical & plumbing planning sign-off.' },
                { title: 'Second Hand Appliance & Joinery Fitting', price: '$120/hr', desc: 'Licensed alterations, retrofitting second hand sinks, cooktops, and rangehoods.' }
              ].map((svc, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-zinc-900">{svc.title}</h4>
                      <Badge className="bg-zinc-100 text-zinc-800 text-[10px] font-mono">{svc.price}</Badge>
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed mt-1">{svc.desc}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t flex justify-end">
                    <InstantBookingModal
                      listingTitle={svc.title}
                      listingPrice={svc.price}
                      trigger={
                        <Button size="sm" variant="ghost" className="h-7 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                          Book This Service <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-3">
              {[
                { name: 'Marcus Vance', role: 'Lead Master Builder', license: 'BLD 294810', phone: '0412 345 678' },
                { name: 'Liam Gallagher', role: 'Senior Cabinet Maker', license: 'CAB 849201', phone: '0423 456 789' },
                { name: 'Hamish Clark', role: 'Site Estimator', license: 'QS-SA-49102', phone: '0445 678 901' }
              ].map((member, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center text-xs font-bold">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{member.name}</p>
                      <p className="text-[10px] text-zinc-500">{member.role} • {member.license}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-600">{member.phone}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="bg-white p-5 rounded-3xl border border-zinc-200 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-zinc-900">Regulatory Certifications & Insurance</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-900">Consumer & Business Services (CBS) South Australia</p>
                    <p className="text-[11px] text-emerald-800">Licensed Building Work Contractor (General Building & Joinery). License # BLD 294810.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">$20M Public & Products Liability Insurance</p>
                    <p className="text-[11px] text-zinc-600">Policy: QBE-AU-918290. Current to October 2026. Covers all residential and commercial sites.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-zinc-900">South Australia ReturnToWorkSA Certified</p>
                    <p className="text-[11px] text-zinc-600">All trade apprentices and full-time carpenters covered under SA Workers Compensation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
