import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Provider } from '../../types';
import { KarnatakaDistrictsMap } from '../map/KarnatakaDistrictsMap';
import {
  Search,
  Filter,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  Phone,
  Wrench,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Car,
  Clock,
  Award,
  Layers,
  Check,
} from 'lucide-react';

const DAVANAGERE_LOCALITIES = [
  'ALL',
  'Vidyanagar, Davanagere',
  'MCC A Block, Davanagere',
  'MCC B Block, Davanagere',
  'PJ Extension, Davanagere',
  'Shamnur Road, Davanagere',
  'Hadadi Road, Davanagere',
  'KTJ Nagar, Davanagere',
  'Anjaneya Badavane, Davanagere',
  'PB Road, Davanagere',
  'Shabanur, Davanagere',
  'Nittuvalli, Davanagere',
  'Dental College Road, Davanagere',
  'Saraswathi Nagar, Davanagere',
  'SS Layout, Davanagere',
  'Durgigudi, Davanagere',
];

export const ServiceMenPage: React.FC = () => {
  const { providers, categories, openBookingForProvider, openTrackModalForProvider } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<'ALL' | 'DAVANAGERE' | 'BENGALURU'>('ALL');
  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minExpYears, setMinExpYears] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'RATING' | 'REVIEWS' | 'PRICE_LOW' | 'PRICE_HIGH'>('RATING');
  const [viewMode, setViewMode] = useState<'GRID' | 'MAP'>('GRID');

  // Pagination state (24 service men per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const filteredProviders = useMemo(() => {
    return providers
      .filter((p) => {
        // Status filter: only approved or active
        if (p.status === 'REJECTED' || p.status === 'SUSPENDED') return false;

        // City filter
        const isDavanagere = p.location.toLowerCase().includes('davanagere');
        const isBengaluru = p.location.toLowerCase().includes('bengaluru');

        if (selectedCityFilter === 'DAVANAGERE' && !isDavanagere) return false;
        if (selectedCityFilter === 'BENGALURU' && !isBengaluru) return false;

        // Locality filter
        if (selectedLocality !== 'ALL' && !p.location.includes(selectedLocality.split(',')[0])) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && p.category_id !== selectedCategory) {
          return false;
        }

        // Experience filter
        const expMatch = parseInt(p.experience, 10) || 0;
        if (minExpYears > 0 && expMatch < minExpYears) {
          return false;
        }

        // Rating filter
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchLoc = p.location.toLowerCase().includes(q);
          const matchPhone = p.phone.toLowerCase().includes(q);
          const matchVehicle = (p.vehicle_number || '').toLowerCase().includes(q) || (p.vehicle_type || '').toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchLoc && !matchPhone && !matchVehicle && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'RATING') return b.rating - a.rating;
        if (sortBy === 'REVIEWS') return b.reviews_count - a.reviews_count;
        if (sortBy === 'PRICE_LOW') return a.price - b.price;
        if (sortBy === 'PRICE_HIGH') return b.price - a.price;
        return 0;
      });
  }, [
    providers,
    searchQuery,
    selectedCityFilter,
    selectedLocality,
    selectedCategory,
    minExpYears,
    minRating,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredProviders.length / pageSize));
  const currentActualPage = Math.min(currentPage, totalPages);

  const paginatedProviders = useMemo(() => {
    const start = (currentActualPage - 1) * pageSize;
    return filteredProviders.slice(start, start + pageSize);
  }, [filteredProviders, currentActualPage, pageSize]);

  const handleFilterReset = () => {
    setSearchQuery('');
    setSelectedCityFilter('ALL');
    setSelectedLocality('ALL');
    setSelectedCategory('ALL');
    setMinExpYears(0);
    setMinRating(0);
    setSortBy('RATING');
    setCurrentPage(1);
  };

  const startRecord = (currentActualPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentActualPage * pageSize, filteredProviders.length);

  const davanagereCount = providers.filter((p) => p.location.toLowerCase().includes('davanagere')).length;
  const bengaluruCount = providers.filter((p) => p.location.toLowerCase().includes('bengaluru')).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>1,050+ Certified Service Men Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Find & Book Service Professionals
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Directly hire verified plumbers, electricians, mechanics, beauticians, and technicians across Davanagere, Bengaluru, and Karnataka. Track their live GPS radar and request doorstep service.
          </p>
        </div>

        {/* Quick Highlights / Stats Counter */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
            <p className="text-2xl font-black text-amber-400">{providers.length}+</p>
            <p className="text-[11px] font-semibold text-slate-300">Total Service Men</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-center">
            <p className="text-2xl font-black text-emerald-400">{davanagereCount}+</p>
            <p className="text-[11px] font-semibold text-slate-300">In Davanagere</p>
          </div>
        </div>
      </div>

      {/* Davanagere Hub Quick Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-700 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold">Specialized Coverage in Davanagere, Karnataka</p>
            <p className="text-[11px] text-amber-700">
              Active dispatch hubs in Vidyanagar, MCC A & B Block, PJ Extension, KTJ Nagar, Shamnur Road & PB Road. Average arrival time 25 mins.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedCityFilter('DAVANAGERE');
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shrink-0 transition-all shadow-sm"
        >
          View 500+ Davanagere Technicians
        </button>
      </div>

      {/* View Switcher: Cards Grid vs Karnataka Google Map */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('GRID')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'GRID'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Personnel Directory ({filteredProviders.length})</span>
          </button>
          <button
            onClick={() => setViewMode('MAP')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'MAP'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md ring-2 ring-amber-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Karnataka 31 Districts Google Map</span>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 text-[10px] font-black">
              Live GPS
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          {viewMode === 'MAP' ? (
            <span className="font-semibold text-slate-700">Google Maps Platform • Interactive Territory View</span>
          ) : (
            <span>Showing {startRecord}–{endRecord} of {filteredProviders.length} verified pros</span>
          )}
        </div>
      </div>

      {viewMode === 'MAP' ? (
        /* Interactive Google Maps View */
        <div className="space-y-4">
          <KarnatakaDistrictsMap showFullHeight={false} />
        </div>
      ) : (
        /* Regular Directory Grid View */
        <>
      {/* Filter and Search Bar Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        {/* Row 1: Search and City Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by technician name, locality (Vidyanagar, MCC B Block), vehicle number (KA-17), skill..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => {
                setSelectedCityFilter('ALL');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCityFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Karnataka ({providers.length})
            </button>
            <button
              onClick={() => {
                setSelectedCityFilter('DAVANAGERE');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedCityFilter === 'DAVANAGERE'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Davanagere ({davanagereCount})</span>
            </button>
            <button
              onClick={() => {
                setSelectedCityFilter('BENGALURU');
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                selectedCityFilter === 'BENGALURU'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Bengaluru ({bengaluruCount})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Dropdowns (Category, Locality, Experience, Sort) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Profession / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by profession or category"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Davanagere Locality Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Davanagere Locality
            </label>
            <select
              value={selectedLocality}
              onChange={(e) => {
                setSelectedLocality(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Davanagere locality"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Localities</option>
              {DAVANAGERE_LOCALITIES.slice(1).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Minimum Experience
            </label>
            <select
              value={minExpYears}
              onChange={(e) => {
                setMinExpYears(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Filter by minimum experience"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Any Experience</option>
              <option value={3}>3+ Years Experience</option>
              <option value={5}>5+ Years Experience</option>
              <option value={8}>8+ Years Experience</option>
              <option value={10}>10+ Years Master Tech</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              aria-label="Sort service men"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="RATING">Highest Rating (4.9★+)</option>
              <option value="REVIEWS">Most Reviews & Bookings</option>
              <option value="PRICE_LOW">Visit Charge: Low to High</option>
              <option value="PRICE_HIGH">Visit Charge: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Summary and Reset */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div>
            Showing <span className="font-bold text-slate-900">{filteredProviders.length === 0 ? 0 : startRecord}-{endRecord}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredProviders.length}</span> verified service personnel
            {selectedCityFilter !== 'ALL' && ` in ${selectedCityFilter}`}
          </div>
          {(searchQuery || selectedCityFilter !== 'ALL' || selectedLocality !== 'ALL' || selectedCategory !== 'ALL' || minExpYears > 0) && (
            <button
              onClick={handleFilterReset}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Service Men Cards Grid */}
      {paginatedProviders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Wrench className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Service Personnel Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No technicians match your search or filter parameters. Try clearing the filter or expanding your location to all areas.
          </p>
          <button
            onClick={handleFilterReset}
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProviders.map((prov) => {
            const isDavanagere = prov.location.toLowerCase().includes('davanagere');
            const cat = categories.find((c) => c.category_id === prov.category_id);

            return (
              <div
                key={prov.provider_id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all p-5 flex flex-col justify-between group space-y-4"
              >
                {/* Header Profile Info */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={prov.profile_photo}
                      alt={prov.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow"
                      title="Available & On Duty"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {prov.name}
                      </h3>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                        <span>Verified</span>
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      {cat ? cat.category_name : 'Multi-Skill Professional'}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{prov.rating}</span>
                        <span className="text-slate-400 font-normal">({prov.reviews_count})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                        {prov.experience}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges / Details */}
                <div className="bg-slate-50 rounded-2xl p-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDavanagere ? 'text-amber-600' : 'text-blue-600'}`} />
                    <span className="font-semibold truncate">
                      {prov.location}
                    </span>
                    {isDavanagere && (
                      <span className="ml-auto text-[9px] font-extrabold bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded">
                        Davanagere Local
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Car className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {prov.vehicle_type || 'Vehicle'} • <span className="font-mono font-bold text-slate-700">{prov.vehicle_number || 'KA-17-SM-2026'}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{prov.phone}</span>
                  </div>
                </div>

                {/* Description Snippet */}
                <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                  "{prov.description}"
                </p>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Inspection Fare</span>
                    <span className="text-base font-black text-slate-900">₹{prov.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Live GPS Radar Tracker Button */}
                    <button
                      onClick={() => openTrackModalForProvider(prov)}
                      title="View technician on live Google Maps GPS simulation"
                      className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition-all flex items-center gap-1 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5 text-amber-600" />
                      <span className="hidden sm:inline">Live Radar</span>
                    </button>

                    {/* Book This Technician */}
                    <button
                      onClick={() => openBookingForProvider(prov)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Book Service</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Page <span className="font-bold text-slate-900">{currentActualPage}</span> of{' '}
            <span className="font-bold text-slate-900">{totalPages}</span> ({filteredProviders.length} Service Men)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentActualPage === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Quick numeric buttons */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentActualPage - 2 + i;
                if (pageNum < 1) pageNum = i + 1;
                if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentPage(pageNum);
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      currentActualPage === pageNum
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentActualPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
