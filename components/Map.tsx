'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Location } from '@/lib/types';
import { ShieldCheck, Layers, Navigation, Star, MapPin, Compass } from 'lucide-react';

interface MapProps {
  locations: Location[];
  onMarkerClick?: (location: Location) => void;
  center?: [number, number];
  zoom?: number;
  selectedLocationId?: string | null;
}

const TILE_SERVERS = {
  streets: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    name: 'Street View'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    name: 'Satellite'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    name: 'Dark Mode'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
    name: 'Terrain'
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
const createCustomIcon = (type: string, title: string, isSelected: boolean) => {
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
      background: ${isSelected ? '#09090b' : 'rgba(255, 255, 255, 0.95)'};
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

export default function Map({ locations, onMarkerClick, center = [-34.9285, 138.6007], zoom = 13, selectedLocationId }: MapProps) {
  const [activeLayer, setActiveLayer] = useState<'streets' | 'satellite' | 'dark' | 'terrain'>('streets');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [smartRouteActive, setSmartRouteActive] = useState(false);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const userLoc: [number, number] = [-34.9285, 138.6007]; // CBD Central reference point

  return (
    <div className="relative w-full h-full">
      {/* Map Control Buttons Overlay */}
      <div className="absolute top-6 right-6 z-[400] flex flex-col items-end gap-2">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-zinc-200/80 text-xs font-extrabold text-zinc-900 hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Map View: {TILE_SERVERS[activeLayer].name}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-100 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-200">
              {(Object.keys(TILE_SERVERS) as Array<keyof typeof TILE_SERVERS>).map((layerKey) => (
                <button
                  key={layerKey}
                  onClick={() => {
                    setActiveLayer(layerKey);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeLayer === layerKey
                      ? 'bg-zinc-900 text-white shadow-md'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  {TILE_SERVERS[layerKey].name}
                  {activeLayer === layerKey && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </div>
          )}
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
            <span>{smartRouteActive ? 'Smart Route On' : 'Plot Smart Route'}</span>
          </button>
        )}
      </div>

      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution={TILE_SERVERS[activeLayer].attribution}
          url={TILE_SERVERS[activeLayer].url}
        />
        
        <MapUpdater center={center} zoom={zoom} />

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

        {locations.map((loc) => {
          const isSelected = selectedLocationId === loc.id;
          return (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]} 
              icon={createCustomIcon(loc.type, loc.title, isSelected)}
              eventHandlers={{
                click: () => onMarkerClick?.(loc),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="font-sans max-w-[240px] p-1">
                  {loc.image && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-2.5 shadow-sm">
                      <img src={loc.image} alt={loc.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-zinc-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                        {loc.type}
                      </span>
                    </div>
                  )}

                  <h3 className="font-bold text-sm text-zinc-900 tracking-tight leading-snug">{loc.title}</h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 my-1 font-medium">{loc.description}</p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                    <span className="font-black text-sm text-zinc-900">{loc.price}</span>
                    {loc.rating && (
                      <span className="flex items-center gap-1 text-[11px] font-black bg-amber-50 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-200/60">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {loc.rating}
                      </span>
                    )}
                  </div>

                  {/* Verification badges */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    <span className="text-[8px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 flex items-center gap-1">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> Certified
                    </span>
                    <span className="text-[8px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200/80">
                      Regulatory Compliant
                    </span>
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
