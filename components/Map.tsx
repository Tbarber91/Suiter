'use client';

import { useEffect, useState, useMemo, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Location } from '@/lib/types';
import { 
  ShieldCheck, 
  Layers, 
  Navigation, 
  Star, 
  MapPin, 
  Compass, 
  Flame, 
  BarChart3, 
  Info, 
  X, 
  Zap, 
  Building2, 
  ExternalLink, 
  Sparkles,
  Phone
} from 'lucide-react';
import { AppleMapsAdModal } from './AppleMapsAdModal';
import { computeRatingStats } from '@/lib/transactions';

interface MapProps {
  locations: Location[];
  onMarkerClick?: (location: Location) => void;
  onViewDetails?: (location: Location) => void;
  onAdCreated?: (newLocation: Location) => void;
  center?: [number, number];
  zoom?: number;
  selectedLocationId?: string | null;
}

const TILE_SERVERS = {
  appleMaps: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: 'Map &copy; Apple Maps &copy; OpenStreetMap',
    name: ' Apple Maps'
  },
  appleMapsClean: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
    attribution: 'Map &copy; Apple Maps Vector',
    name: ' Apple Maps (Vector)'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; USDA, USGS, AeroGRID',
    name: 'Satellite'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    name: 'Dark Mode'
  },
  streets: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    name: 'OpenStreetMap'
  }
};

function MapUpdater({ center, zoom }: { center?: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Generate custom SVG / HTML div icons for Leaflet markers based on listing type
const createCustomIcon = (type: string, title: string, isSelected: boolean, isAppleMapsSponsored?: boolean) => {
  if (isAppleMapsSponsored) {
    const shortTitle = title.length > 18 ? title.slice(0, 16) + '...' : title;
    const html = `
      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        background: ${isSelected ? '#09090b' : 'linear-gradient(135deg, #18181b 0%, #27272a 100%)'};
        color: #ffffff;
        padding: 6px 13px;
        border-radius: 9999px;
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4), 0 0 12px rgba(129, 140, 248, 0.5);
        border: 2px solid #6366f1;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s ease;
        transform: ${isSelected ? 'scale(1.18)' : 'scale(1)'};
      ">
        <span style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 9999px;
          background: #6366f1;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
        "></span>
        <span>${shortTitle}</span>
        <span style="
          background: #10b981;
          color: #ffffff;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
          padding: 1px 4px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        ">Ad</span>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-marker apple-maps-marker',
      iconSize: [136, 36],
      iconAnchor: [68, 18],
      popupAnchor: [0, -20]
    });
  }

  const bgColors: { [key: string]: string } = {
    service: '#4f46e5', // indigo
    shop: '#10b981',    // emerald
    product: '#f59e0b',  // amber
    ad: '#8b5cf6'       // violet
  };

  const bgColor = bgColors[type] || '#18181b';
  const shortTitle = title.length > 18 ? title.slice(0, 16) + '...' : title;

  const html = `
    <div style="
      display: flex;
      align-items: center;
      gap: 6px;
      background: ${isSelected ? '#09090b' : 'rgba(255, 255, 255, 0.96)'};
      color: ${isSelected ? '#ffffff' : '#09090b'};
      padding: 6px 12px;
      border-radius: 9999px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border: 2px solid ${bgColor};
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 11px;
      font-weight: 800;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
      transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
    ">
      <span style="
        width: 10px;
        height: 10px;
        border-radius: 9999px;
        background-color: ${bgColor};
        display: inline-block;
        box-shadow: 0 0 8px ${bgColor};
      "></span>
      <span>${shortTitle}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [120, 36],
    iconAnchor: [60, 18],
    popupAnchor: [0, -20]
  });
};

interface HeatCluster {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count: number;
  demandTier: 'high' | 'moderate' | 'emerging';
  color: string;
  fillColor: string;
  radius: number;
  topCategory: string;
}

const SUBURB_ANCHORS = [
  { name: 'Adelaide CBD & Civic Square', lat: -34.9285, lng: 138.6007 },
  { name: 'North Adelaide & Parkland Corridor', lat: -34.9080, lng: 138.5950 },
  { name: 'Unley & King William Precinct', lat: -34.9450, lng: 138.6080 },
  { name: 'Norwood & The Parade East', lat: -34.9220, lng: 138.6340 },
  { name: 'Prospect & Churchill Road Hub', lat: -34.8870, lng: 138.5980 },
  { name: 'Glenelg & Coastal Strip', lat: -34.9810, lng: 138.5150 },
  { name: 'Port Adelaide Maritime District', lat: -34.8460, lng: 138.5040 },
  { name: 'Burnside & Eastern Foothills', lat: -34.9390, lng: 138.6650 }
];

export default function Map({
  locations,
  onMarkerClick,
  onViewDetails,
  onAdCreated,
  center = [-34.9285, 138.6007],
  zoom = 13,
  selectedLocationId = null
}: MapProps) {
  const [activeLayer, setActiveLayer] = useState<keyof typeof TILE_SERVERS>('appleMaps');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showMapInsights, setShowMapInsights] = useState(false);
  const [smartRouteActive, setSmartRouteActive] = useState(false);
  const [manualCenter, setManualCenter] = useState<[number, number] | null>(null);
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const [sponsoredOnly, setSponsoredOnly] = useState(false);

  const effectiveCenter: [number, number] = manualCenter || center;
  const effectiveZoom: number = manualZoom || zoom;

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const userLoc: [number, number] = [-34.9285, 138.6007];

  // Filter locations if user only wants Apple Maps sponsored ads
  const displayedLocations = useMemo(() => {
    if (sponsoredOnly) {
      return locations.filter(l => l.isAppleMapsSponsored);
    }
    return locations;
  }, [locations, sponsoredOnly]);

  const sponsoredCount = useMemo(() => {
    return locations.filter(l => l.isAppleMapsSponsored).length;
  }, [locations]);

  // Compute Spatial Demand Clusters (Map Insights)
  const heatClusters: HeatCluster[] = useMemo(() => {
    return SUBURB_ANCHORS.map((anchor, idx) => {
      const nearby = locations.filter(loc => {
        const dLat = Math.abs(loc.lat - anchor.lat);
        const dLng = Math.abs(loc.lng - anchor.lng);
        return dLat < 0.035 && dLng < 0.035;
      });

      const count = nearby.length;
      if (count === 0) return null;

      let demandTier: HeatCluster['demandTier'] = 'emerging';
      let color = '#10b981';
      let fillColor = '#059669';
      let radius = 1000;

      if (count >= 3) {
        demandTier = 'high';
        color = '#ef4444';
        fillColor = '#dc2626';
        radius = 1800;
      } else if (count === 2) {
        demandTier = 'moderate';
        color = '#f59e0b';
        fillColor = '#d97706';
        radius = 1400;
      }

      const catCount: { [k: string]: number } = {};
      nearby.forEach(n => {
        const cat = n.category || 'Trades';
        catCount[cat] = (catCount[cat] || 0) + 1;
      });
      const topCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Services';

      return {
        id: `cluster-${idx}`,
        name: anchor.name,
        lat: anchor.lat,
        lng: anchor.lng,
        count,
        demandTier,
        color,
        fillColor,
        radius,
        topCategory
      };
    }).filter(Boolean) as HeatCluster[];
  }, [locations]);

  const highDemandCount = heatClusters.filter(c => c.demandTier === 'high').length;
  const moderateCount = heatClusters.filter(c => c.demandTier === 'moderate').length;

  return (
    <div className="relative w-full h-full">
      {/* Top Map Control Bar */}
      <div className="absolute top-6 right-6 z-[400] flex flex-col items-end gap-2">
        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Apple Maps Direct Advertising Portal Trigger */}
          <AppleMapsAdModal
            onAdCreated={(newLoc) => {
              if (onAdCreated) onAdCreated(newLoc);
              setActiveMapCenter([newLoc.lat, newLoc.lng]);
              setActiveZoom(15);
            }}
            trigger={
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-zinc-950 text-white hover:bg-zinc-900 shadow-xl border border-indigo-500/40 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-indigo-500/20"
                title="Sponsor and pin business details directly on Apple Maps"
              >
                <span className="text-indigo-400 font-bold text-sm"></span>
                <span>Advertise on Apple Maps</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </button>
            }
          />

          {/* Toggle Apple Maps Sponsored Pins Filter */}
          <button
            type="button"
            onClick={() => setSponsoredOnly(!sponsoredOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl shadow-xl border text-xs font-extrabold transition-all cursor-pointer ${
              sponsoredOnly
                ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-300'
                : 'bg-white/90 backdrop-blur-md border-zinc-200/80 text-zinc-800 hover:bg-white'
            }`}
          >
            <span className="text-indigo-600 font-bold"></span>
            <span>{sponsoredOnly ? 'Sponsored Only' : `Apple Ads (${sponsoredCount})`}</span>
          </button>

          {/* Open current viewport in native Apple Maps */}
          <a
            href={`https://maps.apple.com/?ll=${effectiveCenter[0]},${effectiveCenter[1]}&z=${effectiveZoom}&q=Adelaide`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-zinc-200/80 text-xs font-extrabold text-zinc-900 hover:bg-white transition-all cursor-pointer"
            title="Open viewport in Apple Maps"
          >
            <span className="text-xs font-bold"></span>
            <span className="hidden sm:inline">Apple Maps App</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>

          {/* Map Insights Heatmap Toggle */}
          <button
            onClick={() => setShowMapInsights(!showMapInsights)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl shadow-xl border text-xs font-extrabold transition-all cursor-pointer ${
              showMapInsights
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-200 scale-105'
                : 'bg-white/90 backdrop-blur-md border-zinc-200/80 text-zinc-800 hover:bg-white'
            }`}
          >
            <Flame className={`w-4 h-4 ${showMapInsights ? 'text-amber-300 animate-pulse' : 'text-rose-500'}`} />
            <span className="hidden sm:inline">{showMapInsights ? 'Insights: ON' : 'Insights'}</span>
          </button>

          {/* Layer Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-zinc-200/80 text-xs font-extrabold text-zinc-900 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{TILE_SERVERS[activeLayer].name}</span>
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200 z-50">
                {(Object.keys(TILE_SERVERS) as Array<keyof typeof TILE_SERVERS>).map((layerKey) => (
                  <button
                    key={layerKey}
                    onClick={() => {
                      setActiveLayer(layerKey);
                      setShowLayerMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                      activeLayer === layerKey
                        ? 'bg-zinc-900 text-white shadow-md'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{TILE_SERVERS[layerKey].name}</span>
                    {activeLayer === layerKey && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedLocation && (
          <button
            onClick={() => setSmartRouteActive(!smartRouteActive)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-xl border text-xs font-extrabold transition-all cursor-pointer ${
              smartRouteActive
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-200 scale-105'
                : 'bg-white/90 backdrop-blur-md border-zinc-200/80 text-zinc-800 hover:bg-white'
            }`}
          >
            <Navigation className={`w-4 h-4 ${smartRouteActive ? 'text-white animate-bounce' : 'text-indigo-600'}`} />
            <span>{smartRouteActive ? 'Smart Route Active' : 'Plot Smart Route'}</span>
          </button>
        )}
      </div>

      {/* Floating Map Insights Overlay Dashboard */}
      {showMapInsights && (
        <div className="absolute top-20 left-6 z-[400] w-80 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-rose-200/60 p-5 space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <Flame className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <h4 className="text-sm font-display font-black text-zinc-900 tracking-tight">
                  Map Insights
                </h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                  Demand Density Hotspots
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMapInsights(false)}
              className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Density Key Legend */}
          <div className="grid grid-cols-3 gap-2 p-2 bg-zinc-50 rounded-2xl border border-zinc-200/60 text-center">
            <div className="p-1.5 rounded-xl bg-white border border-rose-200 shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mx-auto mb-1 animate-pulse" />
              <div className="text-[10px] font-black text-rose-700">High ({highDemandCount})</div>
              <div className="text-[8px] text-zinc-400">3+ Services</div>
            </div>

            <div className="p-1.5 rounded-xl bg-white border border-amber-200 shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mx-auto mb-1" />
              <div className="text-[10px] font-black text-amber-700">Mod ({moderateCount})</div>
              <div className="text-[8px] text-zinc-400">2 Services</div>
            </div>

            <div className="p-1.5 rounded-xl bg-white border border-emerald-200 shadow-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1" />
              <div className="text-[10px] font-black text-emerald-700">Emerging</div>
              <div className="text-[8px] text-zinc-400">1 Service</div>
            </div>
          </div>

          {/* Hotspot List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
              Active Service Density Hotspots
            </span>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {heatClusters.map(cluster => (
                <div 
                  key={cluster.id}
                  onClick={() => {
                    setManualCenter([cluster.lat, cluster.lng]);
                    setManualZoom(14);
                  }}
                  className="p-2.5 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/80 hover:border-zinc-300 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: cluster.color }} 
                    />
                    <div className="truncate max-w-[170px]">
                      <div className="text-xs font-bold text-zinc-900 truncate">{cluster.name}</div>
                      <div className="text-[9px] text-zinc-500 font-medium">Top: {cluster.topCategory}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    {cluster.count} {cluster.count === 1 ? 'Listing' : 'Listings'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Map Container */}
      <MapContainer 
        center={effectiveCenter} 
        zoom={effectiveZoom} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <MapUpdater center={effectiveCenter} zoom={effectiveZoom} />
        <TileLayer
          attribution={TILE_SERVERS[activeLayer].attribution}
          url={TILE_SERVERS[activeLayer].url}
        />

        {/* Heatmap Density Clusters */}
        {showMapInsights && heatClusters.map((cluster) => (
          <Fragment key={cluster.id}>
            <Circle
              center={[cluster.lat, cluster.lng]}
              radius={cluster.radius}
              pathOptions={{
                color: cluster.color,
                fillColor: cluster.fillColor,
                fillOpacity: cluster.demandTier === 'high' ? 0.22 : 0.12,
                weight: 1.5,
                dashArray: cluster.demandTier === 'high' ? '4, 4' : undefined
              }}
            />
            <Circle
              center={[cluster.lat, cluster.lng]}
              radius={cluster.radius * 0.45}
              pathOptions={{
                color: cluster.color,
                fillColor: cluster.fillColor,
                fillOpacity: cluster.demandTier === 'high' ? 0.45 : 0.3,
                weight: 1,
                opacity: 0.8
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 font-sans">
                  <div className="flex items-center gap-1.5 text-xs font-black text-rose-600 mb-1">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Demand Density Hotspot</span>
                  </div>
                  <h4 className="font-bold text-sm text-zinc-900">{cluster.name}</h4>
                  <div className="text-xs text-zinc-600 font-medium mt-0.5">
                    {cluster.count} Active Service Listings • Primary: {cluster.topCategory}
                  </div>
                </div>
              </Popup>
            </Circle>
          </Fragment>
        ))}

        {/* Smart Route Polyline between center and selected location */}
        {smartRouteActive && selectedLocation && (
          <Polyline
            positions={[
              userLoc,
              [selectedLocation.lat, selectedLocation.lng]
            ]}
            pathOptions={{
              color: '#4f46e5',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.8
            }}
          />
        )}

        {/* Location Markers */}
        {displayedLocations.map((loc) => {
          const isSelected = selectedLocationId === loc.id;
          return (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]} 
              icon={createCustomIcon(loc.type, loc.title, isSelected, loc.isAppleMapsSponsored)}
              eventHandlers={{
                click: () => onMarkerClick?.(loc),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="font-sans max-w-[260px] p-1">
                  {loc.isAppleMapsSponsored && (
                    <div className="mb-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-zinc-950 text-white text-[10px] font-bold shadow-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="text-indigo-400 font-bold text-xs"></span>
                        <span>Apple Maps Sponsored Pin</span>
                      </span>
                      <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-wider">
                        {loc.appleMapsBadge || 'Verified Ad'}
                      </span>
                    </div>
                  )}

                  {loc.businessName && (
                    <div className="text-[11px] font-extrabold text-indigo-700 mb-1 truncate flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span className="truncate">{loc.businessName}</span>
                    </div>
                  )}

                  {loc.image && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-2 shadow-sm">
                      <img src={loc.image} alt={loc.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-zinc-900/85 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                        {loc.type}
                      </span>
                    </div>
                  )}

                  <h3 className="font-bold text-sm text-zinc-900 tracking-tight leading-snug">{loc.title}</h3>
                  
                  {loc.address && (
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1 truncate">
                      <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                      <span className="truncate">{loc.address}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-500 line-clamp-2 my-1.5 font-medium leading-relaxed">{loc.description}</p>

                  <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-zinc-100">
                    <span className="font-black text-sm text-zinc-900">{loc.price}</span>
                    {(() => {
                      const stats = computeRatingStats(loc.reviews, loc.rating);
                      return stats.average > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-black bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200/60">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{stats.average.toFixed(1)}</span>
                          <span className="text-[9px] text-amber-700/70 font-normal">({stats.count})</span>
                        </span>
                      ) : null;
                    })()}
                  </div>

                  {/* Verification badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Certified
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80">
                      Regulatory Compliant
                    </span>
                  </div>

                  {/* Interactive Details & Apple Maps Actions */}
                  <div className="mt-3 pt-2 border-t border-zinc-100 flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewDetails ? onViewDetails(loc) : onMarkerClick?.(loc)}
                      className="w-full py-1.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>View Full Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href={`https://maps.apple.com/?ll=${loc.lat},${loc.lng}&q=${encodeURIComponent(loc.title)}&daddr=${loc.lat},${loc.lng}&dirflg=d`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-1.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span className="font-bold text-xs"></span>
                      <span>Directions in Apple Maps</span>
                      <Navigation className="w-3 h-3 text-indigo-600" />
                    </a>

                    {loc.phone && (
                      <a
                        href={`tel:${loc.phone.replace(/[^0-9+]/g, '')}`}
                        className="w-full py-1 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-medium flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Phone className="w-3 h-3 text-zinc-500" />
                        <span>{loc.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
