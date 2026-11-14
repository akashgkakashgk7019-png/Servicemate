import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KARNATAKA_DISTRICTS,
  KARNATAKA_ZONES,
  getDistrictsByZone,
  getDistrictById,
} from '../../data/karnatakaDistrictsData';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  ArrowRight,
  Heart,
  Navigation,
  QrCode,
  Wrench,
  Sparkles,
  Laptop,
  Car,
  Grid,
  Users,
  Compass,
  Zap,
  Phone,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onSelectCategory: (categoryId: string) => void;
  onViewService: (serviceId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectCategory,
  onViewService,
  onNavigateTab,
}) => {
  const {
    categories,
    services,
    providers,
    openBookingModal,
    openBookingForProvider,
    openTrackModalForProvider,
    toggleFavorite,
    favorites,
    selectedDistrictId,
    selectedRegion,
    setSelectedDistrictAndRegion,
    openDistrictSelector,
  } = useApp();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCity, setSelectedCity] = useState('Davanagere');
  const [activeZone, setActiveZone] = useState<string>(selectedRegion || 'Central Karnataka');
  const [activeDistrictId, setActiveDistrictId] = useState<string>(selectedDistrictId || 'davanagere');

  const currentActiveDistrict = useMemo(() => {
    return getDistrictById(activeDistrictId) || KARNATAKA_DISTRICTS[0];
  }, [activeDistrictId]);

  const districtsInZone = useMemo(() => {
    return getDistrictsByZone(activeZone);
  }, [activeZone]);

  const davanagereTechs = providers.filter((p) => p.location.toLowerCase().includes('davanagere'));
  const davanagereCount = davanagereTechs.length;

  const filteredFeaturedServices = services.filter((s) => {
    const matchCity =
      selectedCity === 'ALL' ||
      s.service_name.toLowerCase().includes(selectedCity.toLowerCase()) ||
      s.description.toLowerCase().includes(selectedCity.toLowerCase());

    const matchKeyword =
      !searchKeyword ||
      s.service_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      s.description.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchKeyword && matchCity;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-pink-500" />;
      case 'Laptop':
        return <Laptop className="w-6 h-6 text-purple-500" />;
      case 'Car':
        return <Car className="w-6 h-6 text-amber-500" />;
      default:
        return <Grid className="w-6 h-6 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BE Major Project Showcase: Multi-Role On-Demand Services</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            All Your Services, <br />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              One Unified Platform
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg">
            Find trusted service providers near you quickly and easily. Doorstep verified technicians, dynamic UPI QR payments, phone OTP verification, and live turn-by-turn Google Maps tracking.
          </p>

          {/* Unified Search & City Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2.5 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-900 mt-8">
            <button
              type="button"
              onClick={openDistrictSelector}
              className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto border-b sm:border-b-0 sm:border-r border-slate-200 text-left hover:bg-slate-50 transition-colors cursor-pointer group"
              title="Click to select Karnataka Region & District"
            >
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Karnataka District</span>
                <span className="text-xs font-black text-slate-900 max-w-[130px] truncate">
                  {currentActiveDistrict.name}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                {currentActiveDistrict.rtoCode}
              </span>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search plumbing, AC jet clean, salon, laptop repair..."
                className="w-full text-xs text-slate-800 outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            <button
              onClick={() => onNavigateTab('SERVICES')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Find a Service</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigateTab('SERVICES')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>Browse 1,100+ Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('SERVICE_MEN')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Explore 1,050+ Service Men</span>
            </button>
            <button
              onClick={() => onNavigateTab('KARNATAKA_MAP')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 animate-pulse"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Karnataka 31 Districts Google Map</span>
            </button>
            <button
              onClick={() => onNavigateTab('ADMIN_AUTH')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all"
            >
              Admin HQ Portal
            </button>
          </div>
        </div>

        {/* Dynamic Metrics Strip */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-blue-400">{services.length}+</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Verified Services</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-amber-400">{providers.length}+</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Certified Service Men</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-400">{davanagereCount}+</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Active in Davanagere</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-2xl sm:text-3xl font-black text-purple-400">4.8★</p>
            <p className="text-xs font-semibold text-slate-300 mt-1">Average Customer Rating</p>
          </div>
        </div>
      </section>

      {/* Main Service Categories Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Service Categories</h2>
            <p className="text-xs text-slate-500 mt-1">Explore verified professional solutions for home, car, and personal wellness</p>
          </div>
          <button
            onClick={() => onNavigateTab('SERVICES')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <div
              key={c.category_id}
              onClick={() => {
                onSelectCategory(c.category_id);
                onNavigateTab('SERVICES');
              }}
              className="group cursor-pointer bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                {getCategoryIcon(c.icon_name)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                  {c.category_name}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{c.description}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                <span>Browse</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Karnataka Regions & 31 Districts Required Services Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Statewide Coverage: All 31 Karnataka Districts</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Required Services in Your Region & District
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                Select your division and district to immediately discover tailored doorstep services, verified local technicians, and live emergency dispatch.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigateTab('KARNATAKA_MAP')}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>31 Districts Map</span>
              </button>

              <button
                onClick={openDistrictSelector}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
              >
                <span>All 31 Districts List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Region Tabs (Divisions) */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select Karnataka Region / Division:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {KARNATAKA_ZONES.map((zone) => {
                const isSelected = activeZone === zone;
                const count = KARNATAKA_DISTRICTS.filter((d) => d.zone === zone).length;
                return (
                  <button
                    key={zone}
                    onClick={() => {
                      setActiveZone(zone);
                      const matching = getDistrictsByZone(zone);
                      if (matching.length > 0) {
                        setActiveDistrictId(matching[0].id);
                        setSelectedDistrictAndRegion(matching[0].id, zone);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    <span>{zone}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950 text-amber-300 font-bold' : 'bg-white/20 text-white'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* District Chips in Active Region */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select District in {activeZone}:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {districtsInZone.map((d) => {
                const isSelected = activeDistrictId === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveDistrictId(d.id);
                      setSelectedDistrictAndRegion(d.id, d.zone);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-white text-slate-900 border-white shadow-lg scale-102'
                        : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span>{d.name}</span>
                    <span className="text-[10px] opacity-75">({d.kannadaName})</span>
                    <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${isSelected ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-white/10 text-slate-300'}`}>
                      {d.rtoCode}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Showcase Card for Selected District */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>{currentActiveDistrict.name}</span>
                  <span className="text-amber-400 font-bold text-sm">({currentActiveDistrict.kannadaName})</span>
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-xs font-mono font-black">
                  {currentActiveDistrict.rtoCode}
                </span>
                <span className="text-xs text-slate-300">
                  • {currentActiveDistrict.headquarters} ({currentActiveDistrict.zone})
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentActiveDistrict.description}
              </p>

              {/* Required Services Tags */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Required & Most-Requested Doorstep Services:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentActiveDistrict.topServices.map((srv, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDistrictAndRegion(currentActiveDistrict.id, currentActiveDistrict.zone);
                        onNavigateTab('SERVICES');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-amber-500 hover:text-slate-950 text-slate-100 text-xs font-semibold transition-all flex items-center gap-1 group"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 group-hover:text-slate-950" />
                      <span>{srv}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Metrics & CTA */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Average Doorstep ETA</span>
                  <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{currentActiveDistrict.avgResponseTimeMin} mins
                  </span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Techs</span>
                  <span className="text-sm font-black text-blue-400 flex items-center justify-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {currentActiveDistrict.activeProvidersCount}+ Pros
                  </span>
                </div>
              </div>

              <div className="text-center text-[11px] text-slate-300 font-mono py-1 border-t border-white/10">
                📞 Emergency Helpline: <span className="text-amber-400 font-bold">{currentActiveDistrict.helpline.split('/')[0]}</span>
              </div>

              <button
                onClick={() => {
                  setSelectedDistrictAndRegion(currentActiveDistrict.id, currentActiveDistrict.zone);
                  onNavigateTab('SERVICES');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Required Services in {currentActiveDistrict.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured & Most Booked Services</h2>
            <p className="text-xs text-slate-500 mt-1">Guaranteed pricing with certified doorstep technicians</p>
          </div>
          <button
            onClick={() => onNavigateTab('SERVICES')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFeaturedServices.slice(0, 8).map((s) => {
            const isFav = favorites.includes(s.service_id);
            return (
              <div
                key={s.service_id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="relative">
                  <img
                    src={s.image}
                    alt={s.service_name}
                    className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleFavorite(s.service_id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                    ⏱️ {s.duration}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{s.rating}</span>
                      <span className="text-slate-400">({s.reviews_count})</span>
                    </div>
                    <h3
                      onClick={() => onViewService(s.service_id)}
                      className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {s.service_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Standard Fare</p>
                      <p className="text-lg font-black text-slate-900">₹{s.price}</p>
                    </div>
                    <button
                      onClick={() => openBookingModal(s)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Service Men Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
              <Wrench className="w-3.5 h-3.5 text-amber-600" />
              <span>1,050+ Service Professionals</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Service Men & Technicians</h2>
            <p className="text-xs text-slate-500 mt-1">
              Top-rated verified technicians operating across Davanagere (Vidyanagar, MCC B Block, KTJ Nagar) and Karnataka
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('SERVICE_MEN')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl border border-amber-200 transition-all"
          >
            <span>View All 1,050+ Service Men</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.slice(0, 4).map((prov) => {
            const isDavanagere = prov.location.toLowerCase().includes('davanagere');

            return (
              <div
                key={prov.provider_id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-amber-400 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={prov.profile_photo}
                      alt={prov.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                      {prov.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{prov.rating}</span>
                      <span className="text-slate-400 font-normal">({prov.reviews_count})</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {prov.experience}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDavanagere ? 'text-amber-600' : 'text-blue-600'}`} />
                    <span className="font-semibold truncate text-[11px]">{prov.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                    <Car className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{prov.vehicle_type || 'Vehicle'} • {prov.vehicle_number || 'KA-17-SM-2026'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold block">Visit Fee</span>
                    <span className="text-base font-black text-slate-900">₹{prov.price}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openTrackModalForProvider(prov)}
                      title="View live GPS tracking radar on map"
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-600" />
                    </button>
                    <button
                      onClick={() => openBookingForProvider(prov)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Karnataka 31 Districts Google Map Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Platform Integration • 31 Administrative Districts</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Live Google Map Tracking <br />
                <span className="text-amber-400">Across All Karnataka Districts</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you are in Davanagere (Vidyanagar, MCC B Block), Bengaluru Urban, Mysuru, Hubballi-Dharwad, Belagavi, or Shivamogga, view active technician distribution, real-time response times, and 24/7 emergency dispatch on an interactive Google Map.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-lg font-black text-amber-400">31 / 31</p>
                  <p className="text-[10px] text-slate-400">Districts Active</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-lg font-black text-emerald-400">1,050+</p>
                  <p className="text-[10px] text-slate-400">Field Personnel</p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                  <p className="text-lg font-black text-blue-400">KA-17</p>
                  <p className="text-[10px] text-slate-400">Davanagere Hub</p>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('KARNATAKA_MAP')}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Launch Karnataka Districts Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Preview / interactive card */}
            <div className="w-full lg:w-96 bg-slate-900/90 border border-slate-700 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-white">Statewide Dispatch Grid</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Google Maps
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300 font-semibold">Davanagere (KA-17)</span>
                  <span className="text-amber-400 font-bold">520 Active Pros</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300 font-semibold">Bengaluru Urban (KA-01)</span>
                  <span className="text-blue-400 font-bold">480 Active Pros</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300 font-semibold">Hubballi-Dharwad (KA-25)</span>
                  <span className="text-emerald-400 font-bold">88 Active Pros</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-300 font-semibold">Mysuru Heritage (KA-09)</span>
                  <span className="text-purple-400 font-bold">95 Active Pros</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('KARNATAKA_MAP')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all text-center block border border-slate-700"
              >
                View Full Interactive Vector Map →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto md:mx-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Verified Professionals</h4>
            <p className="text-xs text-slate-400">Background checked and skill vetted technicians with admin approval workflow.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto md:mx-0">
              <QrCode className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Dynamic UPI QR Codes</h4>
            <p className="text-xs text-slate-400">Generated dynamic QR codes for instant UPI scan and pay via GPay, PhonePe, and Paytm.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto md:mx-0">
              <Navigation className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Live Google Map GPS</h4>
            <p className="text-xs text-slate-400">Turn-by-turn driving route and real-time technician radar simulator right on your map.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto md:mx-0">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-base">Doorstep Start OTP</h4>
            <p className="text-xs text-slate-400">Secure 4-digit verification handshake before service work begins at your home.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
