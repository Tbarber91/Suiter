'use client';

import React, { useState } from 'react';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Sparkles, ShieldCheck } from 'lucide-react';

export function AcknowledgementFooter() {
  const [activeTab, setActiveTab] = useState<'mit' | 'lottie'>('mit');

  return (
    <footer className="w-full bg-zinc-50/50 relative border-t border-zinc-100">
      {/* Subtle Leaf Decorative Trim */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-800/20 to-transparent" />
      
      <div className="container mx-auto py-20 px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          
          <div className="md:col-span-3 flex flex-col items-center md:items-start gap-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <Logo size={56} />
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold tracking-tight text-zinc-900 leading-none">Suiter</span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-1">Enterprise</span>
              </div>
            </div>

            {/* Aboriginal Flag */}
            <div 
              className="flex-shrink-0 w-32 h-20 flex flex-col border border-white shadow-2xl shadow-zinc-200 rounded-2xl overflow-hidden ring-1 ring-zinc-100"
              aria-label="Aboriginal Flag"
            >
              <div className="h-1/2 bg-black" />
              <div className="h-1/2 bg-[#e03a3e] relative">
                <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-12 rounded-full bg-[#ffcd00]" />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.3em]">Institutional Partner</span>
              <div className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-[1.25rem] shadow-sm">
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex-shrink-0" />
                <span className="text-xs text-zinc-900 font-black tracking-tight">Yellow Pages Directory</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-9 flex flex-col gap-6">
            <h3 className="text-sm font-display font-bold uppercase tracking-widest text-zinc-900 border-l-2 border-emerald-800 pl-4">
              Acknowledgement of Country
            </h3>
            
            <div className="grid gap-4 text-sm leading-relaxed text-zinc-500 font-medium font-sans">
              <p>
                We acknowledge the <span className="text-zinc-900 font-bold">First Peoples</span> of this Nation and their enduring cultural and spiritual connections to the lands, waters, seas, skies, and communities.
              </p>
              
              <p>
                We recognise that we are meeting on <span className="text-zinc-900 font-bold">Kaurna Country in Tarntanya</span>, and we are grateful for the privilege to gather, work, and live on this land.
              </p>
              
              <p>
                We acknowledge the Kaurna people as the Traditional Custodians of the Adelaide Plains and pay our deepest respects to their Elders past and present. We extend that respect to all Aboriginal and Torres Strait Islander peoples here today.
              </p>
            </div>
            
            <div className="pt-8 mt-4 border-t border-zinc-200/50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                  © 2026 Suiter Marketplace • Adelaide, SA
                </p>

                <Dialog>
                  <DialogTrigger render={
                    <button className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50/80 hover:bg-indigo-100 px-2.5 py-1 rounded-full cursor-pointer">
                      <FileText className="w-3 h-3" />
                      Licenses (MIT & Lottie)
                    </button>
                  } />
                  <DialogContent className="sm:max-w-[620px] rounded-[2.5rem] border-0 glass p-8 max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <DialogTitle className="text-2xl font-display font-bold tracking-tight">Open Source Licenses</DialogTitle>
                        <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 mr-1 inline" /> Verified Open Source
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        This project is licensed under the standard MIT License for code and Lottie Simple License for animation assets.
                      </p>
                    </DialogHeader>

                    <div className="flex gap-2 my-4 p-1 bg-zinc-100 rounded-xl">
                      <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'mit' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('mit')}
                        className={`flex-1 rounded-lg text-xs font-bold ${activeTab === 'mit' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600'}`}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> MIT License
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'lottie' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('lottie')}
                        className={`flex-1 rounded-lg text-xs font-bold ${activeTab === 'lottie' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600'}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Lottie Simple License
                      </Button>
                    </div>

                    {activeTab === 'mit' ? (
                      <div className="bg-zinc-900 text-zinc-200 font-mono text-[11px] p-5 rounded-2xl leading-relaxed whitespace-pre-wrap border border-zinc-800 select-all">
{`MIT License

Copyright (c) 2026 Suiter Marketplace Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                      </div>
                    ) : (
                      <div className="bg-zinc-900 text-zinc-200 font-mono text-[11px] p-5 rounded-2xl leading-relaxed whitespace-pre-wrap border border-zinc-800 select-all">
{`Lottie Simple License (v1.0)

Copyright (c) 2026 Suiter Marketplace and Lottie Animation Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of the Lottie animation files and associated media assets (the "Animation Assets"),
to deal in the Animation Assets without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Animation Assets, and to permit persons to whom the Animation Assets
are furnished to do so, subject to the following terms:

1. Permitted Uses:
   - Universal use in personal and commercial projects, including web applications,
     mobile applications, software, presentations, websites, and digital media.
   - Modification, editing, restyling, resizing, and composition with other creative works.
   - Bundled distribution as an integrated part of an application or product.

2. Restrictions:
   - You may not sell, sublicense, or redistribute the standalone Animation Asset files
     as standalone animations, templates, or stock media in an asset library or stock marketplace.
   - You may not claim exclusive ownership or copyright over original unmodified third-party
     Lottie animations.

3. Disclaimer:
   THE ANIMATION ASSETS ARE PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.`}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex gap-6 opacity-30">
                {[...Array(3)].map((_, i) => (
                  <svg key={i} viewBox="0 0 100 100" className="w-6 h-6 text-emerald-950 fill-emerald-800/30 rotate-[15deg]">
                    <path d="M50 0 C60 10 95 40 85 70 C75 100 25 100 15 70 C5 40 40 10 50 0" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

