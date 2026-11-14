import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KARNATAKA_DISTRICTS,
  KARNATAKA_ZONES,
  getDistrictsByZone,
  getDistrictById,
  KarnatakaDistrict,
} from '../../data/karnatakaDistrictsData';
import {
  Search,
  Filter,
  Star,
  Heart,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Phone,
  Compass,
  Zap,
  Users,
} from 'lucide-react';

interface ServicesPageProps {
  initialCategoryId?: string;
  onViewService: (serviceId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  initialCategoryId,
  onViewService,
}) => {
  const {
    categories,
    services,
    openBookingModal,
    toggleFavorite,
    favorites,
    selectedDistrictId,
    selectedRegion,
    setSelectedDistrictAndRegion,
    openDistrictSelector,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'ALL');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>(selectedRegion || 'Central Karnataka');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>(selectedDistrictId || 'davanagere');
  const [activeRequiredServiceFilter, setActiveRequiredServiceFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'RELEVANCE' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'>('RELEVANCE');

  // Pagination state (24 services per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  // Keep local filter synced with global context when user changes district via modal or navbar
  useEffect(() => {
    if (selectedDistrictId) {
      setSelectedDistrictFilter(selectedDistrictId);
      const d = getDistrictById(selectedDistrictId);
      if (d) {
        setSelectedRegionFilter(d.zone);
      }
    }
  }, [selectedDistrictId]);

  const activeDistrictData = useMemo(() => {
    if (selectedDistrictFilter === 'ALL') return null;
    return getDistrictById(selectedDistrictFilter) || null;
  }, [selectedDistrictFilter]);

  const districtsInSelectedRegion = useMemo(() => {
    return getDistrictsByZone(selectedRegionFilter);
  }, [selectedRegionFilter]);

  const filteredServices = useMemo(() => {
    return services
      .filter((s) => {
        const matchCat = selectedCategory === 'ALL' || s.category_id === selectedCategory;

        // Required service quick filter (e.g. clicked "AC & Cooler Servicing")
        let matchRequiredService = true;
        if (activeRequiredServiceFilter) {
          const req = activeRequiredServiceFilter.toLowerCase();
          const target = (s.service_name + ' ' + s.description + ' ' + (s.includes?.join(' ') || '')).toLowerCase();
          const keywords = req.split(' ').filter((w) => w.length > 2);
          matchRequiredService = keywords.some((k) => target.includes(k));
        }

        // District filter
        let matchDistrict = true;
        if (selectedDistrictFilter !== 'ALL') {
          const dist = getDistrictById(selectedDistrictFilter);
          if (dist) {
            const text = (s.service_name + ' ' + s.description).toLowerCase();
            if (dist.id === 'davanagere') {
              matchDistrict = text.includes('davanagere') || !text.includes('bengaluru');
            } else if (dist.id === 'bengaluru_urban' || dist.id === 'bengaluru_rural') {
              matchDistrict = text.includes('bengaluru') || !text.includes('davanagere');
            } else {
              // For other districts, service is provided by mobile vans/technicians
              matchDistrict = true;
            }
          }
        }

        const matchSearch =
          !searchQuery ||
          s.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchPrice = s.price <= maxPrice;
        const matchRating = s.rating >= minRating;

        return matchCat && matchRequiredService && matchDistrict && matchSearch && matchPrice && matchRating;
      })
      .sort((a, b) => {
        // If an active district is chosen, give precedence to services matching district's required services
        if (activeDistrictData && sortBy === 'RELEVANCE') {
          const aText = (a.service_name + ' ' + a.description).toLowerCase();
          const bText = (b.service_name + ' ' + b.description).toLowerCase();
          const aMatchesReq = activeDistrictData.topServices.some((ts) =>
            ts.toLowerCase().split(' ').some((w) => w.length > 3 && aText.includes(w))
          );
          const bMatchesReq = activeDistrictData.topServices.some((ts) =>
            ts.toLowerCase().split(' ').some((w) => w.length > 3 && bText.includes(w))
          );
          if (aMatchesReq && !bMatchesReq) return -1;
          if (!aMatchesReq && bMatchesReq) return 1;
        }

        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'PRICE_HIGH') return b.price - a.price;
        if (sortBy === 'RATING') return b.rating - a.rating;
        return 0;
      });
  }, [
    services,
    selectedCategory,
    selectedDistrictFilter,
    selectedRegionFilter,
    activeRequiredServiceFilter,
    activeDistrictData,
    searchQuery,
    maxPrice,
    minRating,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const currentActualPage = Math.min(currentPage, totalPages);

  const paginatedServices = useMemo(() => {
    const start = (currentActualPage - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, currentActualPage, pageSize]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSelectDistrict = (distId: string, zone?: string) => {
    setSelectedDistrictFilter(distId);
    setActiveRequiredServiceFilter(null);
    if (zone) {
      setSelectedRegionFilter(zone);
      setSelectedDistrictAndRegion(distId, zone);
    } else {
      const d = getDistrictById(distId);
      if (d) {
        setSelectedRegionFilter(d.zone);
        setSelectedDistrictAndRegion(distId, d.zone);
      }
    }
    handleFilterChange();
  };

  const startRecord = (currentActualPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentActualPage * pageSize, filteredServices.length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>1,000+ Verified Doorstep Services Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Doorstep Services in Karnataka</h1>
          <p className="text-xs text-slate-500 mt-1">
            Select your region and district to access required doorstep services with verified technicians and instant tracking.
          </p>
        </div>

        {/* Change District via Global Modal button */}
        <button
          onClick={openDistrictSelector}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs shadow-sm transition-all"
        >
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Browse All 31 Districts Hub</span>
        </button>
      </div>

      {/* Region & District Selector Control Station */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-5 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                Region & District Selection
              </span>
              <h2 className="text-base font-extrabold text-white">
                Choose Karnataka Region & District
              </h2>
            </div>
          </div>

          {selectedDistrictFilter !== 'ALL' && (
            <button
              onClick={() => {
                setSelectedDistrictFilter('ALL');
                setSelectedRegionFilter('ALL');
                setActiveRequiredServiceFilter(null);
                handleFilterChange();
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Show All Karnataka (31 Districts)
            </button>
          )}
        </div>

        {/* Step 1: Select Region Division Tabs */}
        <div>
          <span className="text-[11px] font-bold text-slate-300 block mb-2">
            Step 1: Select Division / Region in Karnataka:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => {
                setSelectedRegionFilter('ALL');
                setSelectedDistrictFilter('ALL');
                setActiveRequiredServiceFilter(null);
                handleFilterChange();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedRegionFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              All Regions (31 Districts)
            </button>
            {KARNATAKA_ZONES.map((zone) => {
              const isSelected = selectedRegionFilter === zone;
              const count = KARNATAKA_DISTRICTS.filter((d) => d.zone === zone).length;
              return (
                <button
                  key={zone}
                  onClick={() => {
                    setSelectedRegionFilter(zone);
                    const matching = getDistrictsByZone(zone);
                    if (matching.length > 0) {
                      handleSelectDistrict(matching[0].id, zone);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  <span>{zone}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-900 text-amber-400' : 'bg-white/20 text-white'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select District from Selected Region */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-300">
              Step 2: Select District in {selectedRegionFilter === 'ALL' ? 'Karnataka' : selectedRegionFilter}:
            </span>
            <span className="text-[10px] text-slate-400">
              Showing {districtsInSelectedRegion.length} Districts
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {districtsInSelectedRegion.map((dist) => {
              const isSelected = selectedDistrictFilter === dist.id;
              return (
                <button
                  key={dist.id}
                  onClick={() => handleSelectDistrict(dist.id, dist.zone)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-white text-slate-900 border-white shadow-md'
                      : 'bg-white/5 border-white/15 text-slate-300 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{dist.name}</span>
                  <span className="text-[10px] opacity-75">({dist.kannadaName})</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${isSelected ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-white/10 text-slate-300'}`}>
                    {dist.rtoCode}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected District Required Services Spotlight Banner */}
      {activeDistrictData && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50/30 border-2 border-amber-300/80 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-950 font-bold text-[11px] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-700" />
                  <span>High-Demand Doorstep Hub</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 font-mono text-[11px] font-extrabold">
                  {activeDistrictData.rtoCode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>Required Services in {activeDistrictData.name}</span>
                <span className="text-amber-800 font-bold text-sm sm:text-base">
                  ({activeDistrictData.kannadaName})
                </span>
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl">
                {activeDistrictData.description}
              </p>
            </div>

            {/* Quick Dispatch Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <div className="bg-white px-3 py-2 rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Avg Doorstep ETA</span>
                <span className="text-sm font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  ~{activeDistrictData.avgResponseTimeMin} mins
                </span>
              </div>

              <div className="bg-white px-3 py-2 rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold block">Active Technicians</span>
                <span className="text-sm font-extrabold text-blue-700 flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {activeDistrictData.activeProvidersCount}+ Pros
                </span>
              </div>

              <div className="bg-white px-3 py-2 rounded-2xl border border-amber-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-semibold block">District Helpline</span>
                <span className="text-xs font-mono font-bold text-slate-800 flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  {activeDistrictData.helpline.split('/')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Required Services Chips for this district */}
          <div className="pt-3 border-t border-amber-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Top Required Services in {activeDistrictData.name} (Click to Filter):</span>
              </span>
              {activeRequiredServiceFilter && (
                <button
                  onClick={() => {
                    setActiveRequiredServiceFilter(null);
                    handleFilterChange();
                  }}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Clear filter (Show all in {activeDistrictData.name})
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {activeDistrictData.topServices.map((reqSrv, idx) => {
                const isActive = activeRequiredServiceFilter === reqSrv;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (isActive) {
                        setActiveRequiredServiceFilter(null);
                      } else {
                        setActiveRequiredServiceFilter(reqSrv);
                      }
                      handleFilterChange();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                      isActive
                        ? 'bg-amber-600 text-white scale-102 shadow-md'
                        : 'bg-white hover:bg-amber-100/80 text-amber-950 border border-amber-200 hover:border-amber-400'
                    }`}
                  >
                    <span>⚡ {reqSrv}</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange();
              }}
              placeholder={`Search across 1,000+ services in ${activeDistrictData ? activeDistrictData.name : 'Karnataka'}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                handleFilterChange();
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none bg-white"
            >
              <option value="ALL">All Categories ({services.length})</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                handleFilterChange();
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none bg-white"
            >
              <option value="RELEVANCE">Sort: Recommended in District</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Highest Rated (★)</option>
            </select>
          </div>
        </div>

        {/* Sliders for Price & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-600">Max Budget:</span>
              <span className="font-extrabold text-blue-600">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="200"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                handleFilterChange();
              }}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-600">Minimum Rating:</span>
              <span className="font-extrabold text-amber-500">★ {minRating > 0 ? `${minRating}+` : 'Any'}</span>
            </div>
            <div className="flex gap-2">
              {[0, 4.5, 4.8].map((rt) => (
                <button
                  key={rt}
                  onClick={() => {
                    setMinRating(rt);
                    handleFilterChange();
                  }}
                  className={`px-3 py-1 rounded-lg border font-semibold ${
                    minRating === rt ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {rt === 0 ? 'All' : `${rt}★+`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 font-semibold px-1">
        <span>
          Showing {filteredServices.length > 0 ? `${startRecord} – ${endRecord}` : 0} of{' '}
          <b className="text-slate-900">{filteredServices.length}</b> Services{' '}
          {activeDistrictData ? (
            <>
              available for doorstep dispatch in <b className="text-blue-700">{activeDistrictData.name} ({activeDistrictData.zone})</b>
            </>
          ) : (
            'across Karnataka'
          )}
        </span>
        <span className="text-[11px] text-slate-400">
          Page {currentActualPage} of {totalPages}
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedServices.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Services Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No services matched your current filters in {activeDistrictData?.name || 'this location'}. Try clearing required service tags or adjusting your search keyword.
            </p>
            {activeRequiredServiceFilter && (
              <button
                onClick={() => {
                  setActiveRequiredServiceFilter(null);
                  handleFilterChange();
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Clear Required Service Filter
              </button>
            )}
          </div>
        ) : (
          paginatedServices.map((s) => {
            const isFav = favorites.includes(s.service_id);
            const isDavanagere = s.service_name.toLowerCase().includes('davanagere');

            // Check if service is specifically in top required services of active district
            const isTopRequiredInActiveDistrict = activeDistrictData?.topServices.some((ts) =>
              ts.toLowerCase().split(' ').some((w) => w.length > 3 && (s.service_name + ' ' + s.description).toLowerCase().includes(w))
            );

            return (
              <div
                key={s.service_id}
                className={`group bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                  isTopRequiredInActiveDistrict
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="relative">
                  <img
                    src={s.image}
                    alt={s.service_name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <button
                    onClick={() => toggleFavorite(s.service_id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:scale-110 transition-transform"
                    title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                  </button>

                  {/* Location badge on top of image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span>{activeDistrictData ? activeDistrictData.name : (isDavanagere ? 'Davanagere' : 'Bengaluru')}</span>
                  </div>

                  {isTopRequiredInActiveDistrict && (
                    <div className="absolute top-11 left-3 bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-md text-[9px] shadow-md flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>REQUIRED IN {activeDistrictData?.name.toUpperCase()}</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-white">
                    ⏱️ {s.duration}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{s.rating}</span>
                      <span className="text-slate-400">({s.reviews_count} reviews)</span>
                    </div>

                    <h3
                      onClick={() => onViewService(s.service_id)}
                      className="font-bold text-slate-900 text-base hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {s.service_name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>

                    {s.includes && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {s.includes.slice(0, 2).map((inc, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{inc}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Standard Rate</p>
                      <p className="text-xl font-black text-slate-900">₹{s.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewService(s.service_id)}
                        className="px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => openBookingModal(s)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold">
          <div className="text-slate-500">
            Page {currentActualPage} of {totalPages} (24 items/page)
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentActualPage === 1}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 text-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentActualPage > 3) {
                pageNum = currentActualPage - 2 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    currentActualPage === pageNum
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentActualPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 text-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
