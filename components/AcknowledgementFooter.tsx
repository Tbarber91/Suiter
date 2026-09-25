'use client';

import React, { useState } from 'react';
import { Logo } from './Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Sparkles, ShieldCheck, Scale } from 'lucide-react';
import { GovernanceModal } from './GovernanceModal';

export function AcknowledgementFooter() {
  const [activeTab, setActiveTab] = useState<'mit' | 'apache' | 'cc' | 'lottie'>('mit');

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
                        This project supports verified open licensing standards: MIT License, Apache License 2.0, Creative Commons (CC-BY 4.0 / CC0), and Lottie Simple License.
                      </p>
                    </DialogHeader>

                    <div className="flex gap-1.5 my-4 p-1 bg-zinc-100 rounded-xl overflow-x-auto">
                      <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'mit' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('mit')}
                        className={`flex-1 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'mit' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600'}`}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" /> MIT
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'apache' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('apache')}
                        className={`flex-1 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'apache' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600'}`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Apache 2.0
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'cc' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('cc')}
                        className={`flex-1 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'cc' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600'}`}
                      >
                        <Scale className="w-3.5 h-3.5 mr-1.5" /> Creative Commons
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={activeTab === 'lottie' ? 'default' : 'ghost'}
                        onClick={() => setActiveTab('lottie')}
                        className={`flex-1 rounded-lg text-xs font-bold shrink-0 ${activeTab === 'lottie' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600'}`}
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Lottie
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
                    ) : activeTab === 'apache' ? (
                      <div className="bg-zinc-900 text-zinc-200 font-mono text-[11px] p-5 rounded-2xl leading-relaxed whitespace-pre-wrap border border-zinc-800 select-all">
{`Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.
"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.
"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

2. Grant of Copyright License.
Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

3. Grant of Patent License.
Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work.

4. Redistribution.
You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:
(a) You must give any other recipients of the Work or Derivative Works a copy of this License; and
(b) You must cause any modified files to carry prominent notices stating that You changed the files; and
(c) You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work.

DISCLAIMER OF WARRANTY: Unless required by applicable law or agreed to in writing, Licensor provides the Work "AS IS", WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.`}
                      </div>
                    ) : activeTab === 'cc' ? (
                      <div className="bg-zinc-900 text-zinc-200 font-mono text-[11px] p-5 rounded-2xl leading-relaxed whitespace-pre-wrap border border-zinc-800 select-all">
{`Creative Commons Attribution 4.0 International (CC BY 4.0) & CC0 1.0 Universal

Suiter Marketplace Public Creative Assets & Content

You are free to:
1. Share — copy and redistribute the material in any medium or format for any purpose, even commercially.
2. Adapt — remix, transform, and build upon the material for any purpose, even commercially.

Under the following terms:
- Attribution: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- No additional restrictions: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.

Public Domain Dedication (CC0 1.0 Universal):
Where designated, select marketplace icons, templates, and raw schema specifications are dedicated to the public domain under CC0 1.0 Universal, waiving all copyright and related rights worldwide.`}
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

                <GovernanceModal
                  trigger={
                    <button className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 hover:text-emerald-900 transition-colors bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 cursor-pointer">
                      <Scale className="w-3 h-3 text-emerald-600" />
                      Governance & Compliance
                    </button>
                  }
                />
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

