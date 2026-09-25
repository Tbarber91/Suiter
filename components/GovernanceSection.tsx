'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Filter, 
  ExternalLink, 
  Scale, 
  BookOpen, 
  Lock, 
  FileCheck, 
  Clock, 
  Building2, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { GOVERNANCE_ITEMS, GovernanceItem, GovernanceCategory } from '@/lib/governance-data';
import { generateGovernancePDF, generateFullDossierPDF } from '@/lib/governance-pdf';

interface GovernanceSectionProps {
  embedded?: boolean;
}

export function GovernanceSection({ embedded = false }: GovernanceSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GovernanceCategory>('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isDownloadingDossier, setIsDownloadingDossier] = useState(false);

  // Filter items based on search query, category, and jurisdiction
  const filteredItems = useMemo(() => {
    return GOVERNANCE_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesJurisdiction = selectedJurisdiction === 'all' || item.jurisdiction === selectedJurisdiction;

      if (!matchesCategory || !matchesJurisdiction) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.authority.toLowerCase().includes(query) ||
        item.jurisdiction.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        item.keyObligations.some((ob) => ob.toLowerCase().includes(query)) ||
        item.codeOfPractice.some((cop) => cop.toLowerCase().includes(query)) ||
        item.platformControls.some((ctrl) => ctrl.toLowerCase().includes(query))
      );
    });
  }, [searchQuery, selectedCategory, selectedJurisdiction]);

  // Counts for tabs
  const counts = useMemo(() => {
    return {
      all: GOVERNANCE_ITEMS.length,
      privacy: GOVERNANCE_ITEMS.filter((i) => i.category === 'privacy').length,
      code_of_practice: GOVERNANCE_ITEMS.filter((i) => i.category === 'code_of_practice').length,
      regulation: GOVERNANCE_ITEMS.filter((i) => i.category === 'regulation').length,
      security: GOVERNANCE_ITEMS.filter((i) => i.category === 'security').length,
    };
  }, []);

  const handleDownloadItem = async (item: GovernanceItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDownloadingId(item.id);
    try {
      generateGovernancePDF(item);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const handleDownloadFullDossier = async () => {
    setIsDownloadingDossier(true);
    try {
      generateFullDossierPDF(filteredItems.length > 0 ? filteredItems : GOVERNANCE_ITEMS);
    } catch (err) {
      console.error('Failed to generate full dossier PDF:', err);
    } finally {
      setTimeout(() => setIsDownloadingDossier(false), 1200);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={`w-full ${embedded ? 'space-y-6' : 'space-y-8'}`}>
      {/* Header and Compliance Metrics */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-zinc-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-mono tracking-widest uppercase py-0.5">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Continuous Attestation
              </Badge>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] font-mono tracking-widest uppercase py-0.5 hidden sm:inline-flex">
                Tarntanya / Adelaide CBD
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white">
              Governance, Privacy & Regulatory Library
            </h2>
            <p className="text-xs md:text-sm text-zinc-300 font-normal leading-relaxed">
              Official register of privacy statutes, fair trading codes of practice, and security regulations governing Suiter Marketplace. Every instrument includes downloadable PDF compliance summaries for enterprise audits.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Button
              onClick={handleDownloadFullDossier}
              disabled={isDownloadingDossier}
              className="w-full md:w-auto rounded-2xl h-12 px-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs md:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isDownloadingDossier ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  Generating Dossier PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download Full Compliance Dossier (PDF)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quick Compliance Metric Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Compliance Rating</div>
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4" /> 100%
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Fully Verified</div>
          </div>
          <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Indexed Frameworks</div>
            <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
              <Scale className="w-4 h-4 text-indigo-400" /> {GOVERNANCE_ITEMS.length} Codes
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Federal & State</div>
          </div>
          <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Privacy Standard</div>
            <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
              <Lock className="w-4 h-4 text-amber-400" /> APP 1-13
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">OAIC Compliant</div>
          </div>
          <div className="bg-zinc-900/60 rounded-2xl p-3 border border-zinc-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Audit Status</div>
            <div className="text-xl font-bold text-white flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-teal-400" /> 2026
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">Active & In Force</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laws, regulations, codes, authorities, or keywords (e.g., Privacy Act, ACCC, ISO, Escrow)..."
              className="rounded-2xl h-12 pl-11 pr-10 bg-white border-zinc-200 shadow-sm text-xs md:text-sm font-medium focus-visible:ring-2 focus-visible:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Jurisdiction Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-60">
              <select
                value={selectedJurisdiction}
                onChange={(e) => setSelectedJurisdiction(e.target.value)}
                className="w-full h-12 rounded-2xl bg-white border border-zinc-200 px-4 text-xs font-semibold text-zinc-700 shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Jurisdictions</option>
                <option value="Commonwealth of Australia">Federal (Australia)</option>
                <option value="South Australia">South Australia (State)</option>
                <option value="International / Cross-Border">International / Cross-Border</option>
                <option value="Global Standards">Global Standards (ISO/SOC2)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            All Frameworks ({counts.all})
          </button>
          <button
            onClick={() => setSelectedCategory('privacy')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'privacy'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            Privacy Laws ({counts.privacy})
          </button>
          <button
            onClick={() => setSelectedCategory('code_of_practice')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'code_of_practice'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            Codes of Practice ({counts.code_of_practice})
          </button>
          <button
            onClick={() => setSelectedCategory('regulation')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'regulation'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-500" />
            Regulations ({counts.regulation})
          </button>
          <button
            onClick={() => setSelectedCategory('security')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'security'
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            Security Standards ({counts.security})
          </button>
        </div>
      </div>

      {/* Results Header / Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium px-1">
        <span>Showing {filteredItems.length} of {GOVERNANCE_ITEMS.length} legal instruments</span>
        {(searchQuery || selectedCategory !== 'all' || selectedJurisdiction !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedJurisdiction('all');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset filters
          </button>
        )}
      </div>

      {/* Documents List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No matching governance records found</h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Try adjusting your search terms or filter criteria to find the relevant privacy statutes, codes of practice, or regulations.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedJurisdiction('all');
            }}
            className="rounded-xl text-xs font-bold"
          >
            Clear Search & Show All
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedItemId === item.id;
            const isDownloading = downloadingId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                  isExpanded ? 'border-zinc-300 ring-1 ring-zinc-200' : 'border-zinc-200/80 hover:border-zinc-300'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-5 md:p-6 cursor-pointer select-none" onClick={() => toggleExpand(item.id)}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px] font-bold tracking-wider bg-zinc-50 border-zinc-300 text-zinc-700">
                          {item.code}
                        </Badge>
                        <Badge className={`text-[10px] font-bold ${
                          item.category === 'privacy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          item.category === 'code_of_practice' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          item.category === 'regulation' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-cyan-50 text-cyan-700 border-cyan-200'
                        }`}>
                          {item.categoryLabel}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-medium text-zinc-600 border-zinc-200">
                          {item.jurisdiction}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 ml-auto md:ml-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-display font-bold text-zinc-900 tracking-tight leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                        {item.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-400 font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                          Authority: <strong className="text-zinc-600">{item.authority}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          Audited: <strong className="text-zinc-600">{item.lastAudited}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => handleDownloadItem(item, e)}
                        disabled={isDownloading}
                        className="rounded-xl h-10 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {isDownloading ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            PDF...
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            Download PDF Summary
                          </>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(item.id)}
                        className="w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse details' : 'Expand full compliance breakdown'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="px-5 md:px-6 pb-6 pt-2 border-t border-zinc-100 bg-zinc-50/50 space-y-5 animate-in fade-in-50 duration-200">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-semibold bg-white border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Mandated Obligations */}
                      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900">
                          <Scale className="w-4 h-4 text-emerald-600" />
                          Mandated Statutory Obligations
                        </div>
                        <ul className="space-y-1.5 text-xs text-zinc-600">
                          {item.keyObligations.map((ob, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                              <span className="leading-relaxed">{ob}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Code of Practice & Implementation */}
                      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          Marketplace Code of Practice
                        </div>
                        <ul className="space-y-1.5 text-xs text-zinc-600">
                          {item.codeOfPractice.map((cop, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                              <span className="leading-relaxed">{cop}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Technical Controls & Safeguards */}
                    <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900">
                        <Lock className="w-4 h-4 text-cyan-600" />
                        Technical Safeguards & Architectural Controls
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {item.platformControls.map((ctrl, idx) => (
                          <div key={idx} className="bg-zinc-50 rounded-xl p-2.5 border border-zinc-100 text-[11px] text-zinc-700 font-medium leading-relaxed">
                            {ctrl}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Penalties & Cryptographic Verification Seal */}
                    <div className="bg-zinc-100/80 rounded-2xl p-4 border border-zinc-200 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">Enforcement Thresholds</span>
                        <p className="text-zinc-700 text-xs font-medium max-w-xl">{item.penaltiesAndEnforcement}</p>
                      </div>

                      <div className="text-left sm:text-right flex-shrink-0 font-mono text-[10px] text-zinc-500 bg-white px-3 py-2 rounded-xl border border-zinc-200">
                        <div className="text-[9px] font-bold uppercase text-emerald-600">Integrity Stamp</div>
                        <div>{item.verificationHash.substring(0, 24)}...</div>
                      </div>
                    </div>

                    {/* Bottom action inside expanded view */}
                    <div className="pt-2 flex justify-end">
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => handleDownloadItem(item, e)}
                        disabled={isDownloading}
                        className="rounded-xl h-10 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Generate & Download PDF Compliance Summary ({item.code})
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
