import React, { useState, useEffect, useMemo } from 'react';
import { Booking } from '../../types';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_ATTRIBUTION_IDS,
  GOOGLE_MAPS_MAP_ID,
} from '../../services/googleMapsConfig';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  KeyRound,
  Play,
  Pause,
  RotateCcw,
  Compass,
  Gauge,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Building2,
  Layers,
} from 'lucide-react';

interface LiveLocationTrackerProps {
  booking: Booking;
  onClose?: () => void;
}

export const LiveLocationTracker: React.FC<LiveLocationTrackerProps> = ({ booking, onClose }) => {
  const [mapEngine, setMapEngine] = useState<'google' | 'radar'>('google');
  const [simProgress, setSimProgress] = useState(35); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);

  // Check if booking is in Davanagere
  const isDavanagereBooking =
    (booking.city && booking.city.toLowerCase().includes('davanagere')) ||
    (booking.address && booking.address.toLowerCase().includes('davanagere')) ||
    (booking.provider?.location && booking.provider.location.toLowerCase().includes('davanagere'));

  const [cityRoute, setCityRoute] = useState<'DAVANAGERE' | 'BENGALURU'>(
    isDavanagereBooking ? 'DAVANAGERE' : 'BENGALURU'
  );

  // Simulation timer for the technician moving along the route
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return Math.min(prev + 0.5 * simSpeed, 100);
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const isDavanagereActive = cityRoute === 'DAVANAGERE';

  const providerName = isDavanagereActive
    ? (booking.provider?.name?.includes('Davanagere') ? booking.provider?.name : 'Girish Patil (Davanagere Pro)')
    : (booking.provider?.name || 'Rajesh Kumar');

  const providerPhone = booking.provider?.phone || '+91 99801 23456';

  const vehicle = isDavanagereActive
    ? 'Honda Activa 6G (Davanagere)'
    : (booking.provider?.vehicle_type || 'Two-Wheeler');

  const vehicleNo = isDavanagereActive
    ? 'KA-17-EM-3452' // KA-17 is Davanagere RTO
    : (booking.provider?.vehicle_number || 'KA-01-SM-2026');

  const customerAddress = isDavanagereActive
    ? 'Vidyanagar 2nd Main, Davanagere, Karnataka'
    : (booking.address || 'Flat 402, Green Glen Layout, Bellandur, Bengaluru');

  const originLocation = isDavanagereActive
    ? 'MCC B Block, Davanagere, Karnataka'
    : (booking.provider?.location || 'Koramangala, Bengaluru, Karnataka');

  // Exact coordinates for Davanagere and Bengaluru routes
  const routeCoords = useMemo(() => {
    if (isDavanagereActive) {
      return {
        origin: { lat: 14.4720, lng: 75.9180 }, // MCC B Block
        dest: { lat: 14.4530, lng: 75.9280 },   // Vidyanagar 2nd Main
      };
    }
    return {
      origin: { lat: 12.9352, lng: 77.6245 },   // Koramangala
      dest: { lat: 12.9260, lng: 77.6762 },     // Bellandur Green Glen
    };
  }, [isDavanagereActive]);

  // Current interpolated technician position based on simProgress
  const currentTechPosition = useMemo(() => {
    const fraction = simProgress / 100;
    return {
      lat: routeCoords.origin.lat + (routeCoords.dest.lat - routeCoords.origin.lat) * fraction,
      lng: routeCoords.origin.lng + (routeCoords.dest.lng - routeCoords.origin.lng) * fraction,
    };
  }, [routeCoords, simProgress]);

  // Computed metrics based on simulation progress
  const totalDistanceKm = isDavanagereActive ? 3.4 : 4.2;
  const remainingDistanceKm = ((totalDistanceKm * (100 - simProgress)) / 100).toFixed(1);
  const remainingMinutes = Math.max(1, Math.ceil((isDavanagereActive ? 9 : 12) * (100 - simProgress) / 100));
  const currentSpeedKmH = simProgress >= 100 ? 0 : Math.round(28 + Math.sin(simProgress) * 7);

  // Google Maps Direct Link
  const originQuery = encodeURIComponent(originLocation);
  const destQuery = encodeURIComponent(customerAddress);
  const googleMapsDirectUrl = `https://www.google.com/maps/dir/?api=1&origin=${originQuery}&destination=${destQuery}&travelmode=two_wheeler`;

  return (
    <div className="bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Banner / HUD with Back Button */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition-all shadow-sm"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4 text-blue-400" />
              <span>Back</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">Live Google Maps GPS Tracker</h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                GPS Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Booking <span className="font-mono text-slate-200">#{booking.booking_id}</span> • {booking.service?.service_name || 'Service Dispatch'}
            </p>
          </div>
        </div>

        {/* Engine switcher & Location quick toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Davanagere vs Bengaluru Route Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                setCityRoute('DAVANAGERE');
                setSimProgress(20);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                cityRoute === 'DAVANAGERE'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch live map route to Davanagere (MCC B Block ➔ Vidyanagar)"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Davanagere (KA-17)</span>
            </button>
            <button
              onClick={() => {
                setCityRoute('BENGALURU');
                setSimProgress(35);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                cityRoute === 'BENGALURU'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch live map route to Bengaluru (Koramangala ➔ Bellandur)"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bengaluru (KA-01)</span>
            </button>
          </div>

          {/* Map engine switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMapEngine('google')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                mapEngine === 'google'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Google Map
            </button>
            <button
              onClick={() => setMapEngine('radar')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                mapEngine === 'radar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar Sim
            </button>
          </div>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative h-[380px] sm:h-[430px] bg-slate-950 overflow-hidden flex items-center justify-center">
        {mapEngine === 'google' ? (
          <div className="w-full h-full relative">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
              <Map
                mapId={GOOGLE_MAPS_MAP_ID}
                defaultCenter={routeCoords.origin}
                center={currentTechPosition}
                defaultZoom={14}
                gestureHandling="greedy"
                disableDefaultUI={false}
                zoomControl={true}
                streetViewControl={false}
                fullscreenControl={false}
                className="w-full h-full"
                internalUsageAttributionIds={GOOGLE_MAPS_ATTRIBUTION_IDS}
              >
                {/* Origin Marker */}
                <AdvancedMarker
                  position={routeCoords.origin}
                  title={`Dispatch Hub: ${originLocation}`}
                >
                  <Pin
                    background="#f59e0b"
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={0.9}
                  />
                </AdvancedMarker>

                {/* Live Moving Technician Marker */}
                <AdvancedMarker
                  position={currentTechPosition}
                  title={`Technician: ${providerName}`}
                  zIndex={100}
                >
                  <div className="relative flex flex-col items-center cursor-pointer">
                    <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-bold text-[10px] shadow-lg whitespace-nowrap mb-1 flex items-center gap-1 border border-white">
                      <span>🛵 {providerName.split(' ')[0]}</span>
                      <span className="font-mono text-[9px] bg-amber-600/30 px-1 rounded">
                        {currentSpeedKmH} km/h
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-amber-500 p-0.5 shadow-xl ring-4 ring-amber-400/40 flex items-center justify-center">
                      <img
                        src={booking.provider?.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=128&q=80'}
                        alt={providerName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                </AdvancedMarker>

                {/* Destination Customer Marker */}
                <AdvancedMarker
                  position={routeCoords.dest}
                  title={`Customer Doorstep: ${customerAddress}`}
                >
                  <Pin
                    background="#10b981"
                    borderColor="#ffffff"
                    glyphColor="#ffffff"
                    scale={1.1}
                  />
                </AdvancedMarker>
              </Map>
            </APIProvider>

            {/* Bottom Right Direct Link */}
            <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end gap-1">
              <a
                href={googleMapsDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold shadow-lg transition-all"
              >
                <span>Open in Google Maps App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="text-[10px] text-slate-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded">
                Google Maps
              </div>
            </div>

            {/* Simulation controls overlay on Google Map */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 shadow-xl flex items-center gap-2.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all"
                title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              </button>
              <button
                onClick={() => {
                  setSimProgress(0);
                  setIsPlaying(true);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Restart Ride"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[10px] font-mono">
                {([1, 2, 5] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded ${
                      simSpeed === spd ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Radar / Interactive Map Simulation */
          <div className="relative w-full h-full bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
            {/* Grid background effect */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, #3b82f6 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Simulated Road / Route vector */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path
                d="M 80 80 Q 250 140 400 240 T 700 340"
                fill="none"
                stroke="#1e293b"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 80 80 Q 250 140 400 240 T 700 340"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="4"
                strokeDasharray="6 6"
                className="animate-pulse"
              />
            </svg>

            {/* Point A: Technician's Live Pin */}
            <div
              className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${15 + (simProgress * 0.7)}%`,
                top: `${20 + (simProgress * 0.65)}%`,
              }}
            >
              <div className="relative flex flex-col items-center">
                <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-bold text-[10px] shadow-lg whitespace-nowrap mb-1 flex items-center gap-1">
                  <span>🛵 {providerName}</span>
                  <span className="font-mono text-[9px] bg-amber-600/30 px-1 rounded">{currentSpeedKmH} km/h</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500 p-0.5 shadow-xl ring-4 ring-amber-400/30 flex items-center justify-center animate-bounce">
                  <img
                    src={booking.provider?.profile_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=128&q=80'}
                    alt={providerName}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Point B: Customer Doorstep Pin */}
            <div className="absolute right-12 bottom-12 z-20 flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-emerald-600 text-white px-2 py-0.5 rounded-md font-bold text-[10px] shadow-lg whitespace-nowrap mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>Your Doorstep</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl ring-8 ring-emerald-500/10">
                <MapPin className="w-6 h-6 fill-emerald-500 text-slate-950" />
              </div>
            </div>

            {/* Simulation controls widget */}
            <div className="relative z-30 self-end bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all"
                title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={() => {
                  setSimProgress(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Restart Ride"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
                {([1, 2, 5] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimSpeed(spd)}
                    className={`px-2 py-1 rounded ${
                      simSpeed === spd ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Floating Route Info Header Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800/80 shadow-xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                <Compass className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-none">{originLocation}</span>
              </div>
              <span className="text-slate-600">➔</span>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[160px] sm:max-w-xs">{customerAddress}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono">
              <span className="text-slate-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                {remainingDistanceKm} km
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ETA: ~{remainingMinutes}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Dispatch Detail Card */}
      <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Provider Profile Info */}
        <div className="flex items-center gap-3">
          <img
            src={
              booking.provider?.profile_photo ||
              'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=128&q=80'
            }
            alt={providerName}
            className="w-12 h-12 rounded-xl object-cover border-2 border-slate-700 shadow-md"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-white text-sm">{providerName}</h4>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-medium">
                Verified Pro
              </span>
            </div>
            <p className="text-xs text-slate-400">{vehicle} • <span className="font-mono text-slate-300">{vehicleNo}</span></p>
            <p className="text-[11px] text-amber-400 font-medium">★ {booking.provider?.rating || 4.9} Rating ({isDavanagereActive ? 'Davanagere' : 'Bengaluru'})</p>
          </div>
        </div>

        {/* Start OTP Security Box */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Start Service OTP</p>
              <p className="text-xs text-slate-300">Share at doorstep</p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xl font-extrabold tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/30">
              {booking.start_otp || '5821'}
            </span>
          </div>
        </div>

        {/* Action Controls with Back Option */}
        <div className="flex items-center justify-end gap-2.5">
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <a
            href={`tel:${providerPhone}`}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Technician</span>
          </a>
          {simProgress >= 100 && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>Arrived</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
