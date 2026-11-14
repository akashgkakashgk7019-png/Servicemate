import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KARNATAKA_DISTRICTS,
  KARNATAKA_ZONES,
  getDistrictsByZone,
  getDistrictById,
  KarnatakaDistrict,
} from '../../data/karnatakaDistrictsData';
import {
  X,
  MapPin,
  Search,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Phone,
  Compass,
} from 'lucide-react';

interface DistrictSelectorModalProps {
  onNavigateTab?: (tab: string) => void;
}

export const DistrictSelectorModal: React.FC<DistrictSelectorModalProps> = ({ onNavigateTab }) => {
  const {
    isDistrictSelectorOpen,
    closeDistrictSelector,
    selectedDistrictId,
    selectedRegion,
    setSelectedDistrictAndRegion,
  } = useApp();

  const [activeZoneTab, setActiveZoneTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentDistrict = useMemo(() => {
    return getDistrictById(selectedDistrictId) || KARNATAKA_DISTRICTS[0];
  }, [selectedDistrictId]);

  const filteredDistricts = useMemo(() => {
    return KARNATAKA_DISTRICTS.filter((d) => {
      const matchZone = activeZoneTab === 'ALL' || d.zone === activeZoneTab;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.kannadaName.toLowerCase().includes(q) ||
        d.rtoCode.toLowerCase().includes(q) ||
        d.headquarters.toLowerCase().includes(q) ||
        d.keyTaluks.some((t) => t.toLowerCase().includes(q)) ||
        d.topServices.some((s) => s.toLowerCase().includes(q));

      return matchZone && matchQuery;
    });
  }, [activeZoneTab, searchQuery]);

  if (!isDistrictSelectorOpen) return null;

  const handleSelectDistrict = (dist: KarnatakaDistrict) => {
    setSelectedDistrictAndRegion(dist.id, dist.zone);
    closeDistrictSelector();
  };

  const handleSelectAndExploreServices = (dist: KarnatakaDistrict) => {
    setSelectedDistrictAndRegion(dist.id, dist.zone);
    closeDistrictSelector();
    if (onNavigateTab) {
      onNavigateTab('SERVICES');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Karnataka Doorstep Services Hub</span>
              </span>
              <span className="text-[11px] text-slate-300 hidden sm:inline">
                All 31 Districts Supported
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Select District in Region</span>
              <span className="text-amber-400 font-normal text-sm sm:text-base">/ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
            </h2>
            <p className="text-xs text-slate-300">
              Select your Karnataka district to view verified doorstep service providers, real-time ETA, and required services.
            </p>
          </div>

          <button
            onClick={closeDistrictSelector}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active District Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-medium">Currently Selected:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {currentDistrict.name} ({currentDistrict.kannadaName})
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">
              {currentDistrict.rtoCode}
            </span>
            <span className="text-slate-500 hidden md:inline">
              • {currentDistrict.zone}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
              Doorstep ETA: ~{currentDistrict.avgResponseTimeMin} mins
            </span>
            <span className="text-blue-700 font-medium bg-blue-100/70 px-2 py-0.5 rounded-md">
              {currentDistrict.activeProvidersCount} Active Pros
            </span>
          </div>
        </div>

        {/* Quick Pick High-Demand Hubs */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Compass className="w-3 h-3 text-amber-600" />
            <span>Popular:</span>
          </span>
          {[
            { id: 'davanagere', name: 'Davanagere (HQ)', zone: 'Central Karnataka' },
            { id: 'bengaluru_urban', name: 'Bengaluru Urban', zone: 'Bengaluru Division' },
            { id: 'mysuru', name: 'Mysuru', zone: 'Mysuru Division' },
            { id: 'dharwad', name: 'Hubballi-Dharwad', zone: 'Belagavi Division' },
            { id: 'shivamogga', name: 'Shivamogga', zone: 'Central Karnataka' },
            { id: 'belagavi', name: 'Belagavi', zone: 'Belagavi Division' },
            { id: 'kalaburagi', name: 'Kalaburagi', zone: 'Kalyana Karnataka' },
          ].map((hub) => (
            <button
              key={hub.id}
              onClick={() => {
                const dist = getDistrictById(hub.id);
                if (dist) handleSelectDistrict(dist);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedDistrictId === hub.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-amber-500 hover:text-amber-700'
              }`}
            >
              📍 {hub.name}
            </button>
          ))}
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 space-y-3 shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search district by English / ಕನ್ನಡ name, RTO code (KA-17, KA-01), taluk, or required service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveZoneTab('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeZoneTab === 'ALL'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Regions (31)
            </button>
            {KARNATAKA_ZONES.map((zone) => {
              const count = KARNATAKA_DISTRICTS.filter((d) => d.zone === zone).length;
              return (
                <button
                  key={zone}
                  onClick={() => setActiveZoneTab(zone)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeZoneTab === zone
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {zone} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Districts Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredDistricts.map((district) => {
              const isSelected = selectedDistrictId === district.id;

              return (
                <div
                  key={district.id}
                  onClick={() => handleSelectDistrict(district)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-amber-50 to-orange-50/40 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <div>
                    {/* Header: Name, Kannada, RTO, Selected Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {district.name}
                          </h3>
                          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                            {district.kannadaName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {district.headquarters} • <span className="font-medium text-slate-700">{district.zone}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {district.rtoCode}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Stats strip */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Doorstep: ~{district.avgResponseTimeMin} mins</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{district.activeProvidersCount} Service Pros</span>
                      </div>
                    </div>

                    {/* Required / In-Demand Services in this district */}
                    <div className="mt-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        ⚡ In-Demand Required Services:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {district.topServices.slice(0, 3).map((srv, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            {srv}
                          </span>
                        ))}
                        {district.topServices.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
                            +{district.topServices.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">
                      📞 {district.helpline.split('/')[0]}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectAndExploreServices(district);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 transition-all"
                    >
                      <span>Explore Services</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDistricts.length === 0 && (
            <div className="text-center py-12 space-y-3">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">
                No districts matched "{searchQuery}" in {activeZoneTab === 'ALL' ? 'Karnataka' : activeZoneTab}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveZoneTab('ALL');
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Background-Checked Technicians dispatched across all 31 districts.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeDistrictSelector();
                if (onNavigateTab) {
                  onNavigateTab('KARNATAKA_MAP');
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1.5 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Open 31 Districts Google Map</span>
            </button>

            <button
              onClick={closeDistrictSelector}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
