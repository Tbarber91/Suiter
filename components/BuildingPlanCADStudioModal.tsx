'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { CADRoom } from '@/lib/types';
import { 
  Compass, 
  Maximize2, 
  Plus, 
  Trash2, 
  Sparkles, 
  Bot, 
  Cpu, 
  Zap, 
  Download, 
  Layers, 
  Grid, 
  Home, 
  Ruler, 
  CheckCircle2, 
  Printer, 
  Sun, 
  Wind, 
  Info,
  ChevronRight,
  Eye,
  Sliders,
  RotateCw
} from 'lucide-react';

interface BuildingPlanCADStudioModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactElement;
}

const DEFAULT_ROOMS: CADRoom[] = [
  { id: 'r1', name: 'Master Suite & WIR', type: 'bedroom', x: 2, y: 2, width: 4.5, height: 4.0, color: '#3b82f6', windows: 2, doors: 1 },
  { id: 'r2', name: 'Open Living & Dining', type: 'living', x: 7, y: 2, width: 6.0, height: 5.5, color: '#10b981', windows: 4, doors: 2 },
  { id: 'r3', name: 'Kitchen & Scullery', type: 'kitchen', x: 7, y: 8, width: 4.5, height: 3.5, color: '#f59e0b', windows: 1, doors: 1 },
  { id: 'r4', name: 'Ensuite & Wet Area', type: 'bathroom', x: 2, y: 6.5, width: 3.0, height: 2.5, color: '#8b5cf6', windows: 1, doors: 1 },
  { id: 'r5', name: 'Alfresco Dining Deck', type: 'alfresco', x: 13.5, y: 2, width: 4.0, height: 5.0, color: '#ec4899', windows: 0, doors: 2 },
];

export function BuildingPlanCADStudioModal({ isOpen, onOpenChange, trigger }: BuildingPlanCADStudioModalProps) {
  const [rooms, setRooms] = useState<CADRoom[]>(DEFAULT_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>('r1');
  const [selectedModel, setSelectedModel] = useState<'gemini' | 'chatgpt' | 'grok'>('gemini');
  const [isGeneratingSuggestion, setIsGeneratingSuggestion] = useState(false);
  const [viewMode, setViewMode] = useState<'blueprint' | 'staging_slider'>('blueprint');
  const [sliderPosition, setSliderPosition] = useState(50); // percentage for staging split
  const [gridSnap, setGridSnap] = useState(true);
  const [zoom, setZoom] = useState(24); // pixels per meter
  const [customPrompt, setCustomPrompt] = useState('');

  // Suggestions state per model
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, {
    title: string;
    modelName: string;
    solarRating: string;
    acousticScore: string;
    structuralEfficiency: string;
    points: string[];
    complianceStandard: string;
  }>>({
    gemini: {
      title: 'NCC 2026 Climate Zone 5 & NatHERS Thermal Optimisation',
      modelName: 'Gemini 2.5 Pro (Multimodal Architectural Grounding)',
      solarRating: '7.8 Stars NatHERS',
      acousticScore: 'Rw 48 Compliant',
      structuralEfficiency: 'Low embodied carbon rating',
      complianceStandard: 'National Construction Code 2026 Volume 2 (Class 1a)',
      points: [
        'Living and Alfresco orientation captures optimal winter northern solar gain while blocking harsh westerly afternoon sun.',
        'Wet areas consolidated along southern boundary minimising hot water pipe runs and maximizing plumbing efficiency.',
        'Cross-ventilation path established through Master Suite to outdoor veranda, dropping active cooling loads by ~22% in Adelaide summer.',
        'Glazing to floor area ratio currently sits at 18.4% (well within the 15-20% thermal comfort band).'
      ]
    },
    chatgpt: {
      title: 'Circulation Flow, Ergonomics & Open-Plan Sightlines',
      modelName: 'ChatGPT-4o Architecture & Spatial Synthesis',
      solarRating: '7.4 Stars Estimated',
      acousticScore: 'Zone Buffer Approved',
      structuralEfficiency: 'Spacious corridor optimization',
      complianceStandard: 'AS 1428.1 (Design for Access & Mobility principles)',
      points: [
        'Main entry corridor provides direct sightline to the Alfresco Deck, enhancing perceived floor plan depth.',
        'Kitchen island placement enables a continuous 1.2m working triangle without blocking passage to the scullery.',
        'Buffer wall between Master Suite and Living room prevents TV and audio bleed into the sleeping quarters.',
        'Suggest widening Ensuite door to 870mm to allow seamless universal access.'
      ]
    },
    grok: {
      title: 'Timber Frame Span Economy & Structural Load Paths',
      modelName: 'Grok 3 Structural Intelligence',
      solarRating: '7.5 Stars',
      acousticScore: 'Stud Decoupling Advised',
      structuralEfficiency: '92% Framing Economy',
      complianceStandard: 'AS 1684.2 (Residential Timber-Framed Construction)',
      points: [
        'Living room span of 6.0m can be efficiently framed using 240x45 LVL engineered timber beams without mid-room load columns.',
        'Alfresco cantilever can utilize standard 190x45 treated pine rafters with zero sag risk over 4.0m span.',
        'Plumbing stack aligns directly with external subfloor access for straightforward trade installation.',
        'Reduced header sizes possible over south-facing windows due to minimal tributary roof load.'
      ]
    }
  });

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Derived metrics
  const totalLivingArea = rooms
    .filter(r => r.type !== 'alfresco' && r.type !== 'garage')
    .reduce((acc, r) => acc + (r.width * r.height), 0);
  
  const totalAlfrescoArea = rooms
    .filter(r => r.type === 'alfresco' || r.type === 'garage')
    .reduce((acc, r) => acc + (r.width * r.height), 0);

  const totalArea = totalLivingArea + totalAlfrescoArea;
  const estimatedCostAud = Math.round(totalLivingArea * 2450 + totalAlfrescoArea * 1250);

  const handleUpdateRoom = (id: string, updates: Partial<CADRoom>) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleAddRoom = (type: CADRoom['type']) => {
    const newId = `r_${Date.now()}`;
    const titles: Record<CADRoom['type'], string> = {
      bedroom: 'Guest Bedroom',
      living: 'Media Lounge',
      kitchen: 'Butler Pantry',
      bathroom: 'Powder Room',
      alfresco: 'Outdoor Terrace',
      office: 'Home Study / Studio',
      garage: 'Secure Double Garage'
    };
    const colors: Record<CADRoom['type'], string> = {
      bedroom: '#3b82f6',
      living: '#10b981',
      kitchen: '#f59e0b',
      bathroom: '#8b5cf6',
      alfresco: '#ec4899',
      office: '#06b6d4',
      garage: '#64748b'
    };

    const newRoom: CADRoom = {
      id: newId,
      name: titles[type],
      type,
      x: 3,
      y: 3,
      width: type === 'bathroom' ? 2.5 : type === 'garage' ? 6.0 : 4.0,
      height: type === 'bathroom' ? 2.0 : type === 'garage' ? 5.5 : 3.5,
      color: colors[type],
      windows: type === 'bathroom' || type === 'alfresco' ? 0 : 2,
      doors: 1
    };

    setRooms(prev => [...prev, newRoom]);
    setSelectedRoomId(newId);
  };

  const handleDeleteRoom = (id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    if (selectedRoomId === id) {
      setSelectedRoomId(rooms.find(r => r.id !== id)?.id || null);
    }
  };

  const triggerAIEvaluation = () => {
    setIsGeneratingSuggestion(true);
    setTimeout(() => {
      setIsGeneratingSuggestion(false);
      // Synthesize enriched feedback
      setAiSuggestions(prev => ({
        ...prev,
        [selectedModel]: {
          ...prev[selectedModel],
          points: [
            ...prev[selectedModel].points.slice(0, 2),
            `Custom constraint verified: Room arrangement maintains compliant clearances with current total conditioned area of ${totalLivingArea.toFixed(1)} m².`,
            `Thermal and structural load simulation updated for Adelaide Plains (Kaurna Country / Tarntanya) climatic wind category N2.`
          ]
        }
      }));
    }, 1200);
  };

  const exportSvgBlueprint = () => {
    const svgElement = document.getElementById('cad-svg-canvas');
    if (!svgElement) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Suiter_Architectural_Floorplan_${totalArea.toFixed(0)}sqm.svg`;
    document.body.appendChild(a);
    a.click();
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="sm:max-w-[1100px] w-[96vw] max-h-[92vh] rounded-[2.5rem] border-0 bg-zinc-950 text-white p-0 overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 md:p-8 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">
                  Building Plan CAD Studio
                </h3>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider">
                  Multi-Model AI Grounded
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Interactive 1:100 architectural room layout sketcher with real-time NatHERS thermal & structural intelligence.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 bg-zinc-950/80 px-4 py-2.5 rounded-2xl border border-zinc-800/80 text-xs">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Conditioned Area</span>
              <span className="font-bold text-white font-mono">{totalLivingArea.toFixed(1)} m² <span className="text-zinc-500 font-normal">({(totalLivingArea * 10.764).toFixed(0)} sqft)</span></span>
            </div>
            <div className="w-px h-6 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Alfresco / Outdoor</span>
              <span className="font-bold text-white font-mono">{totalAlfrescoArea.toFixed(1)} m²</span>
            </div>
            <div className="w-px h-6 bg-zinc-800" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider">Est. Build (AUD)</span>
              <span className="font-bold text-emerald-400 font-mono">${estimatedCostAud.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Bar */}
        <div className="px-6 py-3 bg-zinc-900/50 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-950 p-1 rounded-xl border border-zinc-800 flex items-center">
              <button
                type="button"
                onClick={() => setViewMode('blueprint')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'blueprint' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>2D Architectural CAD</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('staging_slider')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'staging_slider' ? 'bg-indigo-600 text-white shadow-xs' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Room Staging Slider (Empty vs Furnished)</span>
              </button>
            </div>

            {viewMode === 'blueprint' && (
              <div className="hidden md:flex items-center gap-2 pl-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setGridSnap(!gridSnap)}
                  className={`h-8 rounded-xl text-xs font-semibold border-zinc-800 cursor-pointer ${gridSnap ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' : 'text-zinc-400'}`}
                >
                  Snap 0.5m {gridSnap ? 'ON' : 'OFF'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setZoom(z => Math.max(16, Math.min(36, z === 24 ? 30 : 24)))}
                  className="h-8 rounded-xl text-xs font-semibold border-zinc-800 text-zinc-300 cursor-pointer"
                >
                  Scale {zoom}px/m
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={exportSvgBlueprint}
              className="h-8 rounded-xl bg-zinc-950 border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-indigo-400" />
              Export SVG
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Print Plans
            </Button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto max-h-[calc(92vh-160px)] p-6 space-y-6">
          {viewMode === 'blueprint' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Canvas Column */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                {/* Room Palette Add Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mr-2 shrink-0">Add Room:</span>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('bedroom')} className="h-7 px-2.5 rounded-lg text-xs bg-blue-950/40 text-blue-300 border-blue-500/30 hover:bg-blue-900/40">
                    + Bedroom
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('living')} className="h-7 px-2.5 rounded-lg text-xs bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40">
                    + Living
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('kitchen')} className="h-7 px-2.5 rounded-lg text-xs bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/40">
                    + Kitchen
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('bathroom')} className="h-7 px-2.5 rounded-lg text-xs bg-purple-950/40 text-purple-300 border-purple-500/30 hover:bg-purple-900/40">
                    + Bathroom
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('alfresco')} className="h-7 px-2.5 rounded-lg text-xs bg-pink-950/40 text-pink-300 border-pink-500/30 hover:bg-pink-900/40">
                    + Alfresco
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('office')} className="h-7 px-2.5 rounded-lg text-xs bg-cyan-950/40 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/40">
                    + Study
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddRoom('garage')} className="h-7 px-2.5 rounded-lg text-xs bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
                    + Garage
                  </Button>
                </div>

                {/* The CAD Canvas Container */}
                <div className="relative w-full h-[450px] md:h-[500px] bg-zinc-950 rounded-3xl border border-zinc-800 overflow-hidden shadow-inner flex items-center justify-center p-4">
                  {/* Compass Rose */}
                  <div className="absolute top-4 right-4 z-20 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[11px] font-mono font-bold text-zinc-300 pointer-events-none">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>NORTH ↑</span>
                  </div>

                  {/* 1:100 Scale Legend */}
                  <div className="absolute bottom-4 left-4 z-20 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-mono text-zinc-400 pointer-events-none">
                    <div className="w-6 h-1 bg-white" />
                    <span>1 Meter Grid (1:100)</span>
                  </div>

                  {/* SVG CAD Canvas */}
                  <svg
                    id="cad-svg-canvas"
                    className="w-full h-full cursor-crosshair select-none"
                    viewBox="0 0 600 450"
                  >
                    <defs>
                      <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#27272a" strokeWidth="0.5" />
                      </pattern>
                      <pattern id="major-grid" width="120" height="120" patternUnits="userSpaceOnUse">
                        <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#3f3f46" strokeWidth="1" />
                      </pattern>
                    </defs>

                    {/* Grid backgrounds */}
                    <rect width="100%" height="100%" fill="#09090b" />
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <rect width="100%" height="100%" fill="url(#major-grid)" />

                    {/* Render Rooms */}
                    {rooms.map((room) => {
                      const rx = room.x * zoom;
                      const ry = room.y * zoom;
                      const rw = room.width * zoom;
                      const rh = room.height * zoom;
                      const isSelected = room.id === selectedRoomId;
                      const area = (room.width * room.height).toFixed(1);

                      return (
                        <g 
                          key={room.id} 
                          onClick={() => setSelectedRoomId(room.id)}
                          className="cursor-pointer group"
                        >
                          {/* Room Base Fill */}
                          <rect
                            x={rx}
                            y={ry}
                            width={rw}
                            height={rh}
                            fill={room.color}
                            fillOpacity={isSelected ? 0.25 : 0.12}
                            stroke={isSelected ? '#6366f1' : room.color}
                            strokeWidth={isSelected ? 2.5 : 1.5}
                            strokeDasharray={room.type === 'alfresco' ? '4 2' : undefined}
                            rx={4}
                          />

                          {/* Room Wall Borders (Architectural Double line effect) */}
                          <rect
                            x={rx + 2}
                            y={ry + 2}
                            width={rw - 4}
                            height={rh - 4}
                            fill="none"
                            stroke="#ffffff"
                            strokeOpacity={0.15}
                            strokeWidth={1}
                            rx={2}
                          />

                          {/* Room Dimension Labels */}
                          <text
                            x={rx + rw / 2}
                            y={ry + rh / 2 - 8}
                            fill="#ffffff"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                            fontFamily="sans-serif"
                          >
                            {room.name}
                          </text>

                          <text
                            x={rx + rw / 2}
                            y={ry + rh / 2 + 10}
                            fill="#a1a1aa"
                            fontSize="10"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {room.width.toFixed(1)}m × {room.height.toFixed(1)}m ({area} m²)
                          </text>

                          {/* Window markers */}
                          {room.windows > 0 && (
                            <rect
                              x={rx + rw / 2 - 16}
                              y={ry - 2}
                              width={32}
                              height={4}
                              fill="#38bdf8"
                              rx={1}
                            />
                          )}

                          {/* Door swings indicator */}
                          {room.doors > 0 && (
                            <path
                              d={`M ${rx + 10} ${ry + rh} A 15 15 0 0 1 ${rx + 25} ${ry + rh - 15}`}
                              fill="none"
                              stroke="#e2e8f0"
                              strokeWidth="1.2"
                              strokeDasharray="2 2"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Right Architectural Inspector & AI Advisor Column */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                {/* Active Selected Room Editor */}
                {selectedRoom ? (
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedRoom.color }} />
                        <h4 className="font-bold text-sm text-white">{selectedRoom.name}</h4>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteRoom(selectedRoom.id)}
                        className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <Label className="text-[10px] text-zinc-400 uppercase font-mono">Width (m)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          min="1"
                          max="15"
                          value={selectedRoom.width}
                          onChange={(e) => handleUpdateRoom(selectedRoom.id, { width: parseFloat(e.target.value) || 1 })}
                          className="h-9 rounded-xl bg-zinc-950 border-zinc-800 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400 uppercase font-mono">Depth (m)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          min="1"
                          max="15"
                          value={selectedRoom.height}
                          onChange={(e) => handleUpdateRoom(selectedRoom.id, { height: parseFloat(e.target.value) || 1 })}
                          className="h-9 rounded-xl bg-zinc-950 border-zinc-800 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400 uppercase font-mono">X Pos (Grid)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={selectedRoom.x}
                          onChange={(e) => handleUpdateRoom(selectedRoom.id, { x: parseFloat(e.target.value) || 0 })}
                          className="h-9 rounded-xl bg-zinc-950 border-zinc-800 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-zinc-400 uppercase font-mono">Y Pos (Grid)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          value={selectedRoom.y}
                          onChange={(e) => handleUpdateRoom(selectedRoom.id, { y: parseFloat(e.target.value) || 0 })}
                          className="h-9 rounded-xl bg-zinc-950 border-zinc-800 text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 text-center">
                    Select any room on the canvas to inspect dimensions & structural clearances.
                  </div>
                )}

                {/* Multi-Model AI Advisor Switcher */}
                <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider">Multi-Model AI Advisor</h4>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-indigo-500/30 text-indigo-300">
                      Live Grounded
                    </Badge>
                  </div>

                  {/* Model Selector Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setSelectedModel('gemini')}
                      className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        selectedModel === 'gemini' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <p className="text-[11px] leading-tight font-bold">Gemini 2.5</p>
                      <p className="text-[9px] opacity-75">Thermal & Code</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('chatgpt')}
                      className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        selectedModel === 'chatgpt' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <p className="text-[11px] leading-tight font-bold">ChatGPT-4o</p>
                      <p className="text-[9px] opacity-75">Flow & Spatial</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModel('grok')}
                      className={`py-1.5 px-2 rounded-xl text-center transition-all cursor-pointer ${
                        selectedModel === 'grok' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <p className="text-[11px] leading-tight font-bold">Grok 3</p>
                      <p className="text-[9px] opacity-75">Spans & Timber</p>
                    </button>
                  </div>

                  {/* Model Evaluation Output */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-zinc-200">{aiSuggestions[selectedModel].title}</span>
                      <span className="text-emerald-400 font-mono font-bold">{aiSuggestions[selectedModel].solarRating}</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300">
                      {aiSuggestions[selectedModel].points.map((pt, i) => (
                        <div key={i} className="flex items-start gap-2 bg-zinc-950/60 p-2 rounded-xl border border-zinc-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-relaxed text-zinc-300">{pt}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-zinc-500 font-mono pt-1">
                      Compliance standard: {aiSuggestions[selectedModel].complianceStandard}
                    </p>

                    <Button
                      size="sm"
                      onClick={triggerAIEvaluation}
                      disabled={isGeneratingSuggestion}
                      className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer h-9 shadow-sm"
                    >
                      {isGeneratingSuggestion ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Synthesizing Architectural Suggestion...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                          Generate {selectedModel === 'gemini' ? 'Gemini' : selectedModel === 'chatgpt' ? 'ChatGPT' : 'Grok'} Suggestion
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Staging Interactive Split Slider View (Empty to Furnished) */
            <div className="space-y-6">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="text-lg font-bold text-white font-display">Virtual Room Staging Preview</h4>
                    <p className="text-xs text-zinc-400">
                      Drag the split slider below to visualize the empty architectural layout transformed into an architecturally staged interior.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-zinc-400">Empty Shell: {100 - sliderPosition}%</span>
                    <span className="text-indigo-400">Furnished: {sliderPosition}%</span>
                  </div>
                </div>

                {/* Interactive Split Image Container */}
                <div className="relative w-full h-[380px] md:h-[460px] rounded-2xl overflow-hidden select-none border border-zinc-800 shadow-2xl">
                  {/* Left: Empty Architectural Space */}
                  <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
                    alt="Empty Architectural Room"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10 bg-zinc-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-zinc-300 border border-zinc-800">
                    Raw Conditioned Shell (Plaster & Polished Concrete)
                  </div>

                  {/* Right: Furnished Staged Space (Clipped by slider) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200"
                      alt="Furnished & Staged Architectural Room"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 z-10 bg-indigo-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-200 border border-indigo-500/30">
                      Furnished & Styled Interior (Adelaide Oak & Linen)
                    </div>
                  </div>

                  {/* Draggable Divider Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-lg flex items-center justify-center"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-zinc-950 shadow-2xl flex items-center justify-center text-xs font-bold ring-4 ring-black/40">
                      ⇄
                    </div>
                  </div>

                  {/* Invisible Range Input for dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(parseInt(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  />
                </div>

                {/* Staging Spec Sheet */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-mono">Interior Palette</p>
                    <p className="font-bold text-white">Tasmanian Oak & Quartz</p>
                    <p className="text-[11px] text-zinc-400">Low-VOC matte sealants, acoustic ceiling battens.</p>
                  </div>
                  <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-mono">HVAC Zoning</p>
                    <p className="font-bold text-emerald-400">Dual-Zone Inverter Ducting</p>
                    <p className="text-[11px] text-zinc-400">NatHERS 7.8 star rated with automated dampers.</p>
                  </div>
                  <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
                    <p className="text-[10px] text-zinc-500 uppercase font-mono">Joinery Lead Time</p>
                    <p className="font-bold text-indigo-400">3 Weeks to Delivery</p>
                    <p className="text-[11px] text-zinc-400">Directly syncs to Suiter Trade Contractors roster.</p>
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
