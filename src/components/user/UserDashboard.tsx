import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveLocationTracker } from '../map/LiveLocationTracker';
import { InvoiceModal } from '../common/InvoiceModal';
import { Booking } from '../../types';
import {
  KARNATAKA_DISTRICTS,
  KARNATAKA_ZONES,
  getDistrictsByZone,
  getDistrictById,
  KarnatakaDistrict,
} from '../../data/karnatakaDistrictsData';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Star,
  Heart,
  Bell,
  User,
  Navigation,
  KeyRound,
  ShieldCheck,
  Phone,
  ArrowRight,
  ArrowLeft,
  FileText,
  Building2,
  Sparkles,
  Filter,
  Wrench,
  Search,
  ChevronRight,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    bookings,
    services,
    categories,
    favorites,
    notifications,
    openBookingModal,
    openTrackModal,
    openReviewModal,
    cancelBooking,
    toggleFavorite,
    markNotificationRead,
    updateUserProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'DISTRICT_SERVICES' | 'MAP_TRACK' | 'FAVORITES' | 'NOTIFICATIONS' | 'PROFILE'>('BOOKINGS');

  // Invoice modal state
  const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Cancel Booking modal state
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of schedule');

  // Region & District Selection state for Required Services
  const userDistrict =
    currentUser?.district ||
    (currentUser?.city?.toLowerCase().includes('davanagere') ? 'davanagere' : 'bengaluru_urban');
  const initialDistObj = getDistrictById(userDistrict) || KARNATAKA_DISTRICTS[0];

  const [selectedRegion, setSelectedRegion] = useState<string>(
    currentUser?.region || initialDistObj.zone
  );
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(userDistrict);
  const [districtCategoryFilter, setDistrictCategoryFilter] = useState<string>('ALL');
  const [districtSearch, setDistrictSearch] = useState<string>('');
  const [setHomeDistrictSuccess, setSetHomeDistrictSuccess] = useState(false);

  // Profile Edit State
  const [editName, setEditName] = useState(currentUser?.name || 'Priya Sharma');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [editAddress, setEditAddress] = useState(currentUser?.address || 'House 45, 2nd Main, Vidyanagar');
  const [editRegion, setEditRegion] = useState(currentUser?.region || 'Central Karnataka');
  const [editDistrictId, setEditDistrictId] = useState(currentUser?.district || 'davanagere');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected booking for the embedded live map tab
  const [mapSelectedBookingId, setMapSelectedBookingId] = useState<string>(
    bookings[0]?.booking_id || ''
  );

  const userBookings = bookings.filter((b) => b.user_id === currentUser?.user_id);
  const activeBookings = userBookings.filter((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && b.status !== 'REJECTED');
  const pastBookings = userBookings.filter((b) => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'REJECTED');

  const favoriteServices = services.filter((s) => favorites.includes(s.service_id));

  const targetMapBooking =
    bookings.find((b) => b.booking_id === mapSelectedBookingId) || bookings[0];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const chosenDist = getDistrictById(editDistrictId) || KARNATAKA_DISTRICTS[0];
    updateUserProfile({
      name: editName,
      phone: editPhone,
      address: editAddress,
      city: chosenDist.name,
      district: chosenDist.id,
      region: chosenDist.zone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSetHomeDistrict = (district: KarnatakaDistrict) => {
    setSelectedDistrictId(district.id);
    setSelectedRegion(district.zone);
    setEditDistrictId(district.id);
    setEditRegion(district.zone);
    updateUserProfile({
      district: district.id,
      region: district.zone,
      city: district.name,
    });
    setSetHomeDistrictSuccess(true);
    setTimeout(() => setSetHomeDistrictSuccess(false), 2500);
  };

  const handleConfirmCancel = () => {
    if (cancellingBookingId) {
      cancelBooking(cancellingBookingId, cancelReason);
      setCancellingBookingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <img
            src={
              currentUser?.profile_image ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'
            }
            alt={currentUser?.name || 'Customer'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-extrabold text-white">
                Welcome back, {currentUser?.name || 'Valued Customer'}!
              </h1>
              <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Phone Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {currentUser?.address || 'Flat 402, Green Glen Layout, Bellandur'} • {currentUser?.city || 'Bengaluru'}
            </p>
          </div>
        </div>

        {/* Quick Booking Summary */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div className="text-center px-2">
            <p className="text-slate-400">Active Bookings</p>
            <p className="text-lg font-bold text-blue-400">{activeBookings.length}</p>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div className="text-center px-2">
            <p className="text-slate-400">Completed</p>
            <p className="text-lg font-bold text-emerald-400">
              {pastBookings.filter((b) => b.status === 'COMPLETED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 text-sm font-bold overflow-x-auto">
        {[
          { id: 'BOOKINGS', label: `My Bookings (${userBookings.length})`, icon: Calendar },
          { id: 'DISTRICT_SERVICES', label: 'Services by Region & District', icon: MapPin },
          { id: 'MAP_TRACK', label: 'Live GPS Tracking Map', icon: Navigation },
          { id: 'FAVORITES', label: `My Favorites (${favoriteServices.length})`, icon: Heart },
          { id: 'NOTIFICATIONS', label: `Alerts (${notifications.length})`, icon: Bell },
          { id: 'PROFILE', label: 'Profile Settings', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: MY BOOKINGS */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-8">
          {/* Active Bookings Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Upcoming & In-Progress Bookings</span>
            </h3>

            {activeBookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <p className="text-xs text-slate-500">No active bookings right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {activeBookings.map((b) => (
                  <div
                    key={b.booking_id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            #{b.booking_id}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {b.booking_date} at {b.booking_time}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mt-1">
                          {b.service?.service_name || 'Service Booking'}
                        </h4>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className="text-xl font-black text-slate-900">₹{b.amount}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          {b.payment_method} ({b.payment_status})
                        </span>
                      </div>
                    </div>

                    {/* Progress Status Stepper */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                        {['PENDING', 'ACCEPTED', 'CONFIRMED', 'SERVICE_STARTED', 'COMPLETED'].map((st, idx) => {
                          const statusOrder = ['PENDING', 'ACCEPTED', 'CONFIRMED', 'SERVICE_STARTED', 'COMPLETED'];
                          const currentIdx = statusOrder.indexOf(b.status);
                          const isDone = currentIdx >= idx;
                          return (
                            <div key={st} className="flex flex-col items-center">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 ${
                                  isDone
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-200 text-slate-500'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <span className={isDone ? 'text-blue-600' : ''}>{st.replace('_', ' ')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Technician Info + Doorstep OTP */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            b.provider?.profile_photo ||
                            'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=128&q=80'
                          }
                          alt={b.provider?.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{b.provider?.name || 'Technician'}</p>
                          <p className="text-[11px] text-slate-500">{b.provider?.vehicle_type}</p>
                          <a
                            href={`tel:${b.provider?.phone}`}
                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{b.provider?.phone}</span>
                          </a>
                        </div>
                      </div>

                      {/* Security Start OTP */}
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <KeyRound className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-[10px] text-emerald-800 uppercase font-bold">Start OTP</p>
                            <p className="text-xs text-emerald-600">Share at door</p>
                          </div>
                        </div>
                        <span className="font-mono text-base font-black text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                          {b.start_otp || '5821'}
                        </span>
                      </div>

                      {/* Live Tracker, Invoice & Cancel Actions */}
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setInvoiceBooking(b);
                            setIsInvoiceOpen(true);
                          }}
                          className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                          title="View Official Tax Invoice"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Invoice</span>
                        </button>
                        <button
                          onClick={() => openTrackModal(b)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Track Live</span>
                        </button>
                        <button
                          onClick={() => setCancellingBookingId(b.booking_id)}
                          className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-xl font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings Section */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Past Service History</h3>
            <div className="grid grid-cols-1 gap-3">
              {pastBookings.map((b) => (
                <div
                  key={b.booking_id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">#{b.booking_id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-sm">{b.service?.service_name}</h5>
                    <p className="text-xs text-slate-500">
                      Completed on {b.booking_date} with {b.provider?.name} • ₹{b.amount}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setInvoiceBooking(b);
                        setIsInvoiceOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Invoice</span>
                    </button>
                    {b.status === 'COMPLETED' && (
                      <button
                        onClick={() => openReviewModal(b)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold shadow-sm transition-all"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Rate & Review</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: REQUIRED SERVICES IN REGIONS & DISTRICTS */}
      {activeTab === 'DISTRICT_SERVICES' && (() => {
        const currentDist = getDistrictById(selectedDistrictId) || KARNATAKA_DISTRICTS[0];
        const isHomeDistrict = currentUser?.district === currentDist.id;

        const filteredDistrictServices = services.filter((s) => {
          if (districtCategoryFilter !== 'ALL' && s.category_id !== districtCategoryFilter) {
            return false;
          }
          if (districtSearch.trim()) {
            const q = districtSearch.toLowerCase();
            const matchName = s.service_name.toLowerCase().includes(q);
            const matchDesc = s.description.toLowerCase().includes(q);
            if (!matchName && !matchDesc) return false;
          }
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Statewide District Dispatch • 31 Administrative Districts</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                  <span>Required Services in</span>
                  <span className="text-amber-400">{currentDist.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-normal">
                    {currentDist.kannadaName}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Select your Karnataka region and district to access guaranteed doorstep service dispatch with verified local technicians, local RTO vehicle fleet, and transparent pricing.
                </p>
              </div>

              {/* Set Home District CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                {isHomeDistrict ? (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>My Home District</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetHomeDistrict(currentDist)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Set as My Default District</span>
                  </button>
                )}
                {setHomeDistrictSuccess && (
                  <span className="text-xs font-bold text-emerald-400 animate-pulse">
                    ✓ Saved to Profile!
                  </span>
                )}
              </div>
            </div>

            {/* Region & District Selector Console */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Select Your Service Region & District
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  Karnataka Division / Hub Selector
                </span>
              </div>

              {/* Row 1: Region Selection Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                {KARNATAKA_ZONES.map((zone) => {
                  const isZoneActive = selectedRegion === zone;
                  return (
                    <button
                      key={zone}
                      onClick={() => {
                        setSelectedRegion(zone);
                        const match = getDistrictsByZone(zone);
                        if (match.length > 0) {
                          setSelectedDistrictId(match[0].id);
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        isZoneActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{zone}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: District Selection Dropdown & Search */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
                {/* District dropdown */}
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Administrative District (Select from {getDistrictsByZone(selectedRegion).length} in this region)
                  </label>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => setSelectedDistrictId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {getDistrictsByZone(selectedRegion).map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name} ({dist.kannadaName}) - {dist.rtoCode} • {dist.activeProvidersCount} Pros
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Service input */}
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Search Required Service
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      placeholder="e.g. AC Repair, Short Circuit, Water Tank..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Category filter */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Service Category
                  </label>
                  <select
                    value={districtCategoryFilter}
                    onChange={(e) => setDistrictCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.category_id} value={c.category_id}>
                        {c.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Active District Operational Information Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center font-black text-xs">
                      {currentDist.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                        <span>{currentDist.name} Hub</span>
                        <span className="text-xs text-amber-700 font-bold">({currentDist.kannadaName})</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 text-[10px] font-mono font-bold">
                          {currentDist.rtoCode}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        HQ: {currentDist.headquarters} • Division: {currentDist.zone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Avg ETA: ~{currentDist.avgResponseTimeMin} mins</span>
                    </span>
                    <span className="flex items-center gap-1 text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{currentDist.helpline.split('/')[0]}</span>
                    </span>
                  </div>
                </div>

                {/* Key taluks & high demand badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Key Localities & Taluks Covered:
                    </span>
                    <p className="text-[11px] text-slate-700 mt-0.5 line-clamp-1">
                      {currentDist.keyTaluks.join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      High-Demand Services in {currentDist.name}:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {currentDist.topServices.map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-semibold"
                        >
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Required Services List in this District */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Available & Required Services ({filteredDistrictServices.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Book verified technicians stationed within {currentDist.name} ({currentDist.rtoCode})
                  </p>
                </div>
              </div>

              {filteredDistrictServices.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
                  <p className="text-sm font-semibold text-slate-700">
                    No services matched your search criteria in {currentDist.name}.
                  </p>
                  <button
                    onClick={() => {
                      setDistrictSearch('');
                      setDistrictCategoryFilter('ALL');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDistrictServices.slice(0, 18).map((srv) => {
                    const isHighDemand = currentDist.topServices.some((ts) =>
                      srv.service_name.toLowerCase().includes(ts.toLowerCase().slice(0, 6))
                    );

                    return (
                      <div
                        key={srv.service_id}
                        className="bg-white rounded-3xl border border-slate-200 hover:border-blue-400 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group space-y-4"
                      >
                        <div className="space-y-3">
                          <div className="relative h-36 rounded-2xl overflow-hidden">
                            <img
                              src={srv.image}
                              alt={srv.service_name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {isHighDemand && (
                              <span className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-md flex items-center gap-1">
                                <span>★ Top Demand in {currentDist.name}</span>
                              </span>
                            )}
                            <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold">
                              ⏱️ {srv.duration}
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mb-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{srv.rating}</span>
                              <span className="text-slate-400 font-normal">({srv.reviews_count} reviews)</span>
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                              {srv.service_name}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                              {srv.description}
                            </p>
                          </div>

                          {/* District Dispatch Tag */}
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              <span>{currentDist.name} Priority</span>
                            </span>
                            <span className="text-emerald-700 font-bold">
                              ETA ~{currentDist.avgResponseTimeMin}m
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                              Doorstep Fare
                            </span>
                            <span className="text-lg font-black text-slate-900">
                              ₹{srv.price}
                            </span>
                          </div>

                          <button
                            onClick={() => openBookingModal(srv)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                          >
                            <span>Book in {currentDist.name}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* TAB 2: LIVE GPS TRACKING MAP */}
      {activeTab === 'MAP_TRACK' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('BOOKINGS')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Back to My Bookings"
              >
                <ArrowLeft className="w-4 h-4 text-blue-600" />
                <span>Back to Bookings</span>
              </button>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Live GPS Dispatch Map (Davanagere / Bengaluru)</h3>
                <p className="text-xs text-slate-500">
                  View real-time technician movements, driving distance, ETA, and doorstep arrival
                </p>
              </div>
            </div>

            <select
              value={targetMapBooking?.booking_id || ''}
              onChange={(e) => setMapSelectedBookingId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              {bookings.map((b) => (
                <option key={b.booking_id} value={b.booking_id}>
                  #{b.booking_id} - {b.service?.service_name || 'Service'} ({b.city || 'City'} • {b.provider?.name || 'Tech'})
                </option>
              ))}
            </select>
          </div>

          {targetMapBooking ? (
            <LiveLocationTracker
              booking={targetMapBooking}
              onClose={() => setActiveTab('BOOKINGS')}
            />
          ) : (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200">
              <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No active dispatches right now.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FAVORITES */}
      {activeTab === 'FAVORITES' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Saved Favorite Services</h3>
          {favoriteServices.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Heart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No favorite services bookmarked yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteServices.map((s) => (
                <div
                  key={s.service_id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <img src={s.image} alt={s.service_name} className="h-40 w-full object-cover" />
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-sm">{s.service_name}</h4>
                        <span className="font-extrabold text-slate-900">₹{s.price}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleFavorite(s.service_id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                        <span>Remove</span>
                      </button>
                      <button
                        onClick={() => openBookingModal(s)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-base">Notifications & System Alerts</h3>
          <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                onClick={() => markNotificationRead(n.notification_id)}
                className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  !n.read ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-slate-900 text-sm">{n.title}</h5>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-600">{n.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROFILE SETTINGS */}
      {activeTab === 'PROFILE' && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-base">Customer Account Profile</h3>
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Default Doorstep Address
              </label>
              <input
                type="text"
                required
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Karnataka Region / Division
                </label>
                <select
                  value={editRegion}
                  onChange={(e) => {
                    const newReg = e.target.value;
                    setEditRegion(newReg);
                    const match = getDistrictsByZone(newReg);
                    if (match.length > 0) {
                      setEditDistrictId(match[0].id);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  {KARNATAKA_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Default District (31 Districts)
                </label>
                <select
                  value={editDistrictId}
                  onChange={(e) => setEditDistrictId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                >
                  {getDistrictsByZone(editRegion).map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.name} ({dist.kannadaName}) - {dist.rtoCode}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected District info preview */}
            {(() => {
              const d = getDistrictById(editDistrictId) || KARNATAKA_DISTRICTS[0];
              return (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-slate-700">
                    Selected Hub: <strong className="text-slate-900">{d.name} ({d.kannadaName})</strong> • RTO: {d.rtoCode}
                  </span>
                  <span className="text-emerald-700 font-bold">
                    ~{d.avgResponseTimeMin}m ETA • {d.activeProvidersCount} Active Pros
                  </span>
                </div>
              );
            })()}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Profile & District Preferences</span>
            </button>

          </form>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-base">Cancel Service Booking?</h4>
            <p className="text-xs text-slate-500">
              Please specify the cancellation reason for booking #{cancellingBookingId}:
            </p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            >
              <option value="Change of schedule">Change of schedule</option>
              <option value="Found alternative service">Found alternative service</option>
              <option value="Accidental booking">Accidental booking</option>
              <option value="Issue resolved already">Issue resolved already</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancellingBookingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Official Tax Invoice Modal */}
      <InvoiceModal
        booking={invoiceBooking}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};
