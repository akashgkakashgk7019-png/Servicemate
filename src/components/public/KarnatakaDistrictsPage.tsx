import React, { useState } from 'react';
import { KarnatakaDistrictsMap } from '../map/KarnatakaDistrictsMap';
import { KARNATAKA_DISTRICTS, KarnatakaDistrict } from '../../data/karnatakaDistrictsData';
import {
  MapPin,
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Sparkles,
  Phone,
  Building2,
  Navigation,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface KarnatakaDistrictsPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const KarnatakaDistrictsPage: React.FC<KarnatakaDistrictsPageProps> = ({ onNavigateTab }) => {
  const [selectedHubId, setSelectedHubId] = useState<string>('davanagere');

  const popularHubs = [
    { id: 'davanagere', label: 'Davanagere Hub (Central KA)', rto: 'KA-17', count: 520 },
    { id: 'bengaluru_urban', label: 'Bengaluru Urban', rto: 'KA-01 to 05', count: 480 },
    { id: 'mysuru', label: 'Mysuru Heritage', rto: 'KA-09', count: 95 },
    { id: 'dharwad', label: 'Hubballi-Dharwad', rto: 'KA-25', count: 88 },
    { id: 'belagavi', label: 'Belagavi Industrial', rto: 'KA-22', count: 72 },
    { id: 'shivamogga', label: 'Shivamogga (Malnad)', rto: 'KA-14', count: 64 },
    { id: 'dakshina_kannada', label: 'Mangaluru Coastal', rto: 'KA-19', count: 78 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Maps Platform Integration • Statewide Coverage</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Karnataka 31 Districts <span className="text-amber-400">Google Map Hub</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed">
              Explore real-time service personnel deployment across every administrative district of Karnataka.
              Centered at our flagship Davanagere Command Centre (KA-17) and metropolitan hubs statewide.
            </p>
          </div>

          {/* Quick Jump Hubs */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Focus Hub
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-md">
              {popularHubs.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => setSelectedHubId(hub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedHubId === hub.id
                      ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-2 ring-amber-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{hub.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({hub.rto})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* State Analytics Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Building2 className="w-4 h-4" />
              <span>Territory Coverage</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">31 / 31</p>
            <p className="text-xs text-slate-400 mt-0.5">Districts active statewide</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <Users className="w-4 h-4" />
              <span>Registered Field Pros</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">1,050+</p>
            <p className="text-xs text-slate-400 mt-0.5">Vetted & GPS-tracked</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1">
              <Clock className="w-4 h-4" />
              <span>Avg Emergency ETA</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">18–25 m</p>
            <p className="text-xs text-slate-400 mt-0.5">Rapid doorstep response</p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Davanagere Focal HQ</span>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">KA-17</p>
            <p className="text-xs text-slate-400 mt-0.5">520+ Specialists deployed</p>
          </div>
        </div>

        {/* Interactive Google Map Component */}
        <div className="relative">
          <KarnatakaDistrictsMap
            key={selectedHubId}
            initialDistrictId={selectedHubId}
            showFullHeight={false}
          />
        </div>

        {/* Regional Hub Highlights & Viva Defense Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Central Karnataka (Davanagere HQ)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Davanagere serves as the primary operational epicenter with rapid dispatch coverage connecting Vidyanagar, MCC A/B Block, PJ Extension, Shamnur Road, and KTJ Nagar.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-400 font-bold">
              Emergency Contact: +91 8192-234567
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Bengaluru Metropolitan Grid</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Covering Koramangala, Bellandur, Whitefield, HSR Layout, and Indiranagar with high-density technician allocation for immediate electronics, AC jet washes, and home emergency repairs.
            </p>
            <div className="pt-2 text-xs font-mono text-blue-400 font-bold">
              Dispatch Helpline: 1800-425-0808
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Statewide District Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every district features verified RTO-tagged technicians equipped with digital start-service OTP security and live GPS telemetry for transparent tracking.
            </p>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('SERVICE_MEN')}
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <span>Browse All 1,050+ Service Men</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Google Maps Attribution Line */}
        <div className="text-center pt-2 text-xs text-slate-500">
          Google Maps
        </div>
      </div>
    </div>
  );
};
