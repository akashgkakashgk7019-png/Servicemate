import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { KARNATAKA_DISTRICTS, KarnatakaDistrict } from '../../data/karnatakaDistrictsData';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_ATTRIBUTION_IDS,
  GOOGLE_MAPS_MAP_ID,
  KARNATAKA_CENTER,
} from '../../services/googleMapsConfig';
import { useApp } from '../../context/AppContext';
import { Provider } from '../../types';
import {
  MapPin,
  Search,
  Filter,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  Navigation,
  Sparkles,
  Layers,
  ChevronRight,
  Maximize2,
  Compass,
  Building2,
  CheckCircle2,
  ExternalLink,
  Info,
  Calendar,
  Wrench,
} from 'lucide-react';

// Controller to smoothly pan & zoom map when district selection changes
const MapPanController: React.FC<{
  targetCenter: { lat: number; lng: number } | null;
  targetZoom: number;
}> = ({ targetCenter, targetZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCenter) {
      map.panTo(targetCenter);
      map.setZoom(targetZoom);
    }
  }, [map, targetCenter, targetZoom]);

  return null;
};

interface KarnatakaDistrictsMapProps {
  initialDistrictId?: string;
  onSelectDistrict?: (district: KarnatakaDistrict) => void;
  showFullHeight?: boolean;
}

export const KarnatakaDistrictsMap: React.FC<KarnatakaDistrictsMapProps> = ({
  initialDistrictId = 'davanagere',
  onSelectDistrict,
  showFullHeight = false,
}) => {
  const { providers, openBookingForProvider, openTrackModalForProvider } = useApp();

  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDistrictId);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTechniciansOnMap, setShowTechniciansOnMap] = useState<boolean>(true);
  const [activeInfoWindow, setActiveInfoWindow] = useState<'district' | 'technician' | null>(null);
  const [selectedTech, setSelectedTech] = useState<Provider | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');

  // Currently selected district object
  const selectedDistrict = useMemo(() => {
    return (
      KARNATAKA_DISTRICTS.find((d) => d.id === selectedDistrictId) ||
      KARNATAKA_DISTRICTS[0]
    );
  }, [selectedDistrictId]);

  // Target map coordinates & zoom
  const [mapTarget, setMapTarget] = useState<{
    center: { lat: number; lng: number };
    zoom: number;
  }>({
    center: selectedDistrict.center,
    zoom: selectedDistrict.id === 'davanagere' ? 12 : 11,
  });

  // Filter districts based on zone and search query
  const filteredDistricts = useMemo(() => {
    return KARNATAKA_DISTRICTS.filter((d) => {
      if (selectedZone !== 'ALL' && d.zone !== selectedZone) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.name.toLowerCase().includes(q);
        const matchKannada = d.kannadaName.toLowerCase().includes(q);
        const matchRto = d.rtoCode.toLowerCase().includes(q);
        const matchHq = d.headquarters.toLowerCase().includes(q);
        return matchName || matchKannada || matchRto || matchHq;
      }
      return true;
    });
  }, [selectedZone, searchQuery]);

  // Providers associated with the selected district (matching Davanagere, Bengaluru, or nearby)
  const districtProviders = useMemo(() => {
    const isDavanagere = selectedDistrict.id === 'davanagere';
    const isBengaluru =
      selectedDistrict.id === 'bengaluru_urban' ||
      selectedDistrict.id === 'bengaluru_rural';

    return providers.filter((p) => {
      const loc = p.location.toLowerCase();
      if (isDavanagere) {
        return loc.includes('davanagere') || loc.includes('mcc') || loc.includes('vidyanagar');
      }
      if (isBengaluru) {
        return loc.includes('bengaluru') || loc.includes('koramangala') || loc.includes('bellandur');
      }
      // For other districts, match name or fallback to nearby regional providers
      return loc.includes(selectedDistrict.name.toLowerCase());
    }).slice(0, 16);
  }, [providers, selectedDistrict]);

  const handleSelectDistrict = useCallback(
    (district: KarnatakaDistrict) => {
      setSelectedDistrictId(district.id);
      setSelectedTech(null);
      setActiveInfoWindow('district');
      setMapTarget({
        center: district.center,
        zoom: district.id === 'davanagere' ? 12 : 11,
      });
      if (onSelectDistrict) {
        onSelectDistrict(district);
      }
    },
    [onSelectDistrict]
  );

  const handleResetToKarnataka = () => {
    setMapTarget({
      center: KARNATAKA_CENTER,
      zoom: 7,
    });
    setActiveInfoWindow(null);
    setSelectedTech(null);
  };

  const zones = [
    { id: 'ALL', label: 'All 31 Districts' },
    { id: 'Central Karnataka', label: 'Central (Davanagere Hub)' },
    { id: 'Bengaluru Division', label: 'Bengaluru Division' },
    { id: 'Mysuru Division', label: 'Mysuru Division' },
    { id: 'Belagavi Division', label: 'Belagavi Division' },
    { id: 'Kalyana Karnataka', label: 'Kalyana Karnataka' },
  ];

  return (
    <div className={`flex flex-col bg-slate-900 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl ${
      showFullHeight ? 'h-[calc(100vh-8rem)]' : 'min-h-[750px]'
    }`}>
      {/* Top Banner / HUD Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <MapPin className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Karnataka 31 Districts Google Map</span>
                <span className="text-amber-400 font-normal text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  ಕರ್ನಾಟಕ ನಕಾಶೆ
                </span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live GPS Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Google Maps Platform dispatch covering 1,050+ verified service men across all 31 Karnataka administrative districts.
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Map Type Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mapType === 'roadmap'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vector Road
            </button>
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                mapType === 'hybrid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Reset Zoom Button */}
          <button
            onClick={handleResetToKarnataka}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm"
            title="View entire Karnataka state map"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Reset to Karnataka</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Interactive Search, Zone Filter & District Directory */}
        <div className="lg:col-span-4 xl:col-span-3 bg-slate-950/90 border-r border-slate-800 flex flex-col h-full max-h-[750px] overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search district or RTO (e.g. Davanagere, KA-17)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Zone Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
              {zones.map((z) => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    selectedZone === z.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Technician Pins Toggle */}
            <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
              <span>Showing {filteredDistricts.length} of 31 Districts</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={showTechniciansOnMap}
                  onChange={(e) => setShowTechniciansOnMap(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                />
                <span>Show Pros on Map</span>
              </label>
            </div>
          </div>

          {/* District List Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredDistricts.map((d) => {
              const isSelected = d.id === selectedDistrictId;
              const isDavanagere = d.id === 'davanagere';

              return (
                <div
                  key={d.id}
                  onClick={() => handleSelectDistrict(d)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/50 shadow-md'
                      : 'hover:bg-slate-900 border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isDavanagere
                            ? 'bg-amber-500 text-slate-950 font-black ring-2 ring-amber-400/50'
                            : isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDavanagere ? '★' : d.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                            {d.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({d.kannadaName})
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          RTO: <strong className="text-slate-300">{d.rtoCode}</strong> • {d.zone.replace(' Division', '')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isDavanagere
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {d.activeProvidersCount} Pros
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{d.avgResponseTimeMin} min ETA</p>
                    </div>
                  </div>

                  {/* Highlights if selected */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2 border-t border-amber-500/20 text-[11px] text-slate-300 space-y-1">
                      <p className="text-[11px] text-amber-200/90 leading-relaxed line-clamp-2">
                        {d.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>Avg {d.avgResponseTimeMin}m Response</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-blue-400" />
                          <span>{d.helpline.split('/')[0]}</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Google Map & Bottom Info Drawer */}
        <div className="lg:col-span-8 xl:col-span-9 relative flex flex-col h-[520px] lg:h-auto min-h-[500px]">
          {/* Google Maps Container */}
          <div className="flex-1 relative w-full h-full bg-slate-950">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
              <Map
                mapId={GOOGLE_MAPS_MAP_ID}
                defaultCenter={KARNATAKA_CENTER}
                defaultZoom={7}
                center={mapTarget.center}
                zoom={mapTarget.zoom}
                mapTypeId={mapType}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                streetViewControl={false}
                fullscreenControl={true}
                className="w-full h-full"
                internalUsageAttributionIds={GOOGLE_MAPS_ATTRIBUTION_IDS}
              >
                {/* Dynamic Camera Pan Controller */}
                <MapPanController
                  targetCenter={mapTarget.center}
                  targetZoom={mapTarget.zoom}
                />

                {/* 31 Karnataka Districts Advanced Markers */}
                {filteredDistricts.map((district) => {
                  const isSelected = district.id === selectedDistrictId;
                  const isDavanagere = district.id === 'davanagere';

                  return (
                    <AdvancedMarker
                      key={`district-${district.id}`}
                      position={district.center}
                      title={`${district.name} (${district.kannadaName}) - ${district.activeProvidersCount} Service Men`}
                      onClick={() => handleSelectDistrict(district)}
                      zIndex={isSelected ? 100 : isDavanagere ? 90 : 50}
                    >
                      {/* Custom Pin Design */}
                      {isDavanagere ? (
                        <div className="relative group cursor-pointer">
                          <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-sm animate-pulse" />
                          <div className="relative px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 rounded-2xl shadow-2xl font-black text-xs border-2 border-white flex items-center gap-1.5 scale-110">
                            <span className="text-sm">★</span>
                            <span>{district.name}</span>
                            <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px]">
                              {district.activeProvidersCount}
                            </span>
                          </div>
                        </div>
                      ) : isSelected ? (
                        <div className="relative px-3 py-1 bg-blue-600 text-white rounded-xl shadow-xl font-bold text-xs border-2 border-white flex items-center gap-1 scale-105 cursor-pointer">
                          <span>{district.name}</span>
                          <span className="px-1 rounded bg-white text-blue-700 text-[10px] font-black">
                            {district.rtoCode}
                          </span>
                        </div>
                      ) : (
                        <Pin
                          background={
                            district.zone === 'Central Karnataka'
                              ? '#f59e0b'
                              : district.zone === 'Bengaluru Division'
                              ? '#3b82f6'
                              : district.zone === 'Mysuru Division'
                              ? '#10b981'
                              : district.zone === 'Belagavi Division'
                              ? '#8b5cf6'
                              : '#ec4899'
                          }
                          borderColor="#ffffff"
                          glyphColor="#ffffff"
                          scale={0.85}
                        />
                      )}
                    </AdvancedMarker>
                  );
                })}

                {/* Technicians Markers in the selected district */}
                {showTechniciansOnMap &&
                  districtProviders.map((tech, idx) => {
                    const lat = tech.live_lat || selectedDistrict.center.lat + ((idx % 4) - 2) * 0.008;
                    const lng = tech.live_lng || selectedDistrict.center.lng + (((idx * 3) % 5) - 2) * 0.008;

                    return (
                      <AdvancedMarker
                        key={`tech-${tech.provider_id}`}
                        position={{ lat, lng }}
                        title={`${tech.name} - ₹${tech.price}`}
                        onClick={() => {
                          setSelectedTech(tech);
                          setActiveInfoWindow('technician');
                        }}
                        zIndex={200}
                      >
                        <div className="relative cursor-pointer group">
                          <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-slate-900 shadow-lg overflow-hidden flex items-center justify-center transform group-hover:scale-125 transition-transform">
                            {tech.profile_photo ? (
                              <img
                                src={tech.profile_photo}
                                alt={tech.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Wrench className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-slate-900 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                {/* InfoWindow for Selected District */}
                {activeInfoWindow === 'district' && selectedDistrict && (
                  <InfoWindow
                    position={selectedDistrict.center}
                    onCloseClick={() => setActiveInfoWindow(null)}
                    pixelOffset={[0, -20]}
                  >
                    <div className="p-2 max-w-[280px] text-slate-900">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-1.5">
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {selectedDistrict.name}
                        </h4>
                        <span className="text-xs font-bold text-amber-600">
                          {selectedDistrict.kannadaName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                        {selectedDistrict.description}
                      </p>
                      <div className="bg-slate-50 p-2 rounded-lg text-[11px] space-y-1 mb-2">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Active Service Pros:</span>
                          <strong className="text-emerald-600 font-bold">{selectedDistrict.activeProvidersCount}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Avg ETA:</span>
                          <strong className="text-slate-700">{selectedDistrict.avgResponseTimeMin} Mins</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">RTO Code:</span>
                          <strong className="text-slate-700">{selectedDistrict.rtoCode}</strong>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 italic">
                        Google Maps
                      </div>
                    </div>
                  </InfoWindow>
                )}

                {/* InfoWindow for Selected Technician */}
                {activeInfoWindow === 'technician' && selectedTech && (
                  <InfoWindow
                    position={{
                      lat: selectedTech.live_lat || selectedDistrict.center.lat,
                      lng: selectedTech.live_lng || selectedDistrict.center.lng,
                    }}
                    onCloseClick={() => {
                      setActiveInfoWindow(null);
                      setSelectedTech(null);
                    }}
                    pixelOffset={[0, -25]}
                  >
                    <div className="p-2 max-w-[260px] text-slate-900">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={selectedTech.profile_photo}
                          alt={selectedTech.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {selectedTech.name}
                          </h4>
                          <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{selectedTech.rating} ({selectedTech.reviews_count})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 mb-2">
                        {selectedTech.location} • <strong className="text-blue-600">₹{selectedTech.price}</strong>
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => openBookingForProvider(selectedTech)}
                          className="flex-1 py-1 px-2 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors"
                        >
                          Book Now
                        </button>
                        <button
                          onClick={() => openTrackModalForProvider(selectedTech)}
                          className="py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors"
                          title="Open Live GPS tracker"
                        >
                          <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                      </div>
                      <div className="text-[9px] text-slate-400 italic mt-1.5">
                        Google Maps
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>

            {/* Quick Floating HUD overlay over map */}
            <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700 px-3.5 py-2.5 rounded-2xl shadow-xl max-w-sm hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">Active District Hub</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold">
                  {selectedDistrict.rtoCode}
                </span>
              </div>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {selectedDistrict.name} ({selectedDistrict.kannadaName})
              </p>
              <p className="text-[11px] text-slate-300">
                {selectedDistrict.headquarters} • {selectedDistrict.activeProvidersCount} Technicians on Standby
              </p>
            </div>

            {/* Legend Overlay at bottom right */}
            <div className="absolute bottom-4 right-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shadow-xl text-[10px] text-slate-300 space-y-1 hidden md:block">
              <span className="font-bold text-slate-200 block text-[11px]">Karnataka Zones Legend</span>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Central (Davanagere)</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Bengaluru Div.</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Mysuru Div.</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Belagavi Div.</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" /> Kalyana Karnataka</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Live Technician</span>
              </div>
              <div className="pt-1 text-[9px] text-slate-500 border-t border-slate-800">
                Google Maps
              </div>
            </div>
          </div>

          {/* Bottom District Deep-Dive Bar */}
          <div className="bg-slate-950 border-t border-slate-800 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* District & Taluk coverage */}
              <div className="md:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Key Taluks Covered
                </span>
                <p className="text-xs text-slate-200 font-semibold line-clamp-2 mt-0.5">
                  {selectedDistrict.keyTaluks.join(', ')}
                </p>
              </div>

              {/* Top demanded services in this district */}
              <div className="md:col-span-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  High-Demand Services in {selectedDistrict.name}
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {selectedDistrict.topServices.map((srv, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-medium"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>

              {/* District Emergency & Grievance Helpline */}
              <div className="md:col-span-1 flex flex-col justify-end text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  24/7 District Helpline
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 mt-0.5">
                  {selectedDistrict.helpline}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Priority Dispatch within {selectedDistrict.avgResponseTimeMin}m
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Attribution & Production Note */}
      <div className="bg-slate-950/80 px-6 py-2.5 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Google Maps Platform enabled with Starter/Demo tier. Note: Utilizing Google Maps Platform services in production may incur costs against your Google Cloud billing account.
          </span>
        </div>
        <div className="font-semibold text-slate-400">
          Google Maps
        </div>
      </div>
    </div>
  );
};
