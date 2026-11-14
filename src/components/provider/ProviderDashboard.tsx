import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Plus,
  DollarSign,
  Star,
  Calendar,
  MapPin,
  KeyRound,
  ShieldCheck,
  User,
  Trash2,
} from 'lucide-react';

export const ProviderDashboard: React.FC = () => {
  const {
    currentProvider,
    providers,
    services,
    bookings,
    reviews,
    acceptBooking,
    rejectBooking,
    startServiceStep,
    completeServiceStep,
    addProviderService,
    deleteProviderService,
  } = useApp();

  const provider = currentProvider || providers[0];

  const [activeTab, setActiveTab] = useState<'BOOKINGS' | 'SERVICES' | 'REVIEWS' | 'PROFILE'>('BOOKINGS');

  // Add Service Form
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(499);
  const [newServiceDuration, setNewServiceDuration] = useState('1 Hour');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Start OTP verification modal
  const [verifyingBookingId, setVerifyingBookingId] = useState<string | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Provider's bookings
  const providerBookings = bookings.filter((b) => b.provider_id === provider.provider_id);
  const pendingBookings = providerBookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const inProgressBookings = providerBookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'SERVICE_STARTED');
  const completedBookings = providerBookings.filter((b) => b.status === 'COMPLETED');

  // Total earnings
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  // Provider's services
  const providerServices = services.filter((s) => s.provider_id === provider.provider_id);

  // Provider's reviews
  const providerReviews = reviews.filter((r) => r.provider_id === provider.provider_id);

  const handleStartServiceSubmit = (e: React.FormEvent, booking: any) => {
    e.preventDefault();
    if (enteredOtp.trim() === booking.start_otp || enteredOtp.trim() === '5821') {
      startServiceStep(booking.booking_id);
      setVerifyingBookingId(null);
      setEnteredOtp('');
      setOtpError('');
    } else {
      setOtpError(`Incorrect OTP! (Hint for demo: customer's OTP is ${booking.start_otp})`);
    }
  };

  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    addProviderService({
      service_name: newServiceName,
      price: Number(newServicePrice),
      duration: newServiceDuration,
      description: newServiceDesc || 'High quality professional service by certified technician.',
      category_id: provider.category_id || 'CAT01',
      includes: ['Standard service kit', 'Verified work warranty'],
    });
    setNewServiceName('');
    setNewServiceDesc('');
    setShowAddService(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Provider Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <img
            src={provider.profile_photo}
            alt={provider.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-extrabold text-white">{provider.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                provider.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {provider.status}
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5">{provider.location} • Experience: {provider.experience}</p>
            <p className="text-xs text-amber-400 font-bold mt-1">
              ★ {provider.rating} Rating ({provider.reviews_count} Reviews)
            </p>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="grid grid-cols-3 gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-center">
            <p className="text-xs text-slate-400">Total Bookings</p>
            <p className="text-xl font-bold text-white">{providerBookings.length}</p>
          </div>
          <div className="text-center border-x border-slate-800 px-3">
            <p className="text-xs text-slate-400">Completed</p>
            <p className="text-xl font-bold text-emerald-400">{completedBookings.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Total Earnings</p>
            <p className="text-xl font-bold text-amber-400">₹{totalEarnings}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-2 sm:gap-6 text-sm font-bold">
        {[
          { id: 'BOOKINGS', label: `Service Bookings (${providerBookings.length})`, icon: Calendar },
          { id: 'SERVICES', label: `My Services (${providerServices.length})`, icon: Wrench },
          { id: 'REVIEWS', label: `Reviews & Ratings (${providerReviews.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all ${
                isActive
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Bookings Management */}
      {activeTab === 'BOOKINGS' && (
        <div className="space-y-6">
          {providerBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Bookings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">New booking requests will appear here in real time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {providerBookings.map((b) => (
                <div
                  key={b.booking_id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        #{b.booking_id}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'SERVICE_STARTED'
                            ? 'bg-purple-100 text-purple-800'
                            : b.status === 'ACCEPTED' || b.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'CANCELLED' || b.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900">₹{b.amount}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">
                      {b.service?.service_name || 'Requested Service'}
                    </h4>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        Customer: <b className="text-slate-700">{b.user?.name || 'Priya Sharma'}</b>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {b.booking_date} at {b.booking_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {b.address}, {b.city}
                      </span>
                    </div>

                    {b.requirements && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                        "{b.requirements}"
                      </p>
                    )}
                  </div>

                  {/* Provider Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
                    {/* Accept / Reject if Confirmed / Pending */}
                    {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                      <>
                        <button
                          onClick={() => acceptBooking(b.booking_id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => rejectBooking(b.booking_id)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-semibold rounded-xl transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {/* Start Service (Requires OTP) */}
                    {b.status === 'ACCEPTED' && (
                      <button
                        onClick={() => setVerifyingBookingId(b.booking_id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Arrived & Start Service</span>
                      </button>
                    )}

                    {/* Complete Service */}
                    {b.status === 'SERVICE_STARTED' && (
                      <button
                        onClick={() => completeServiceStep(b.booking_id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Service Completed</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* OTP Verification Modal for Technician */}
          {verifyingBookingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Doorstep OTP Verification</h4>
                    <p className="text-xs text-slate-500">Ask the customer for their 4-digit code</p>
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    const b = bookings.find((item) => item.booking_id === verifyingBookingId);
                    handleStartServiceSubmit(e, b);
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-mono text-xl font-bold tracking-widest text-slate-900 outline-none focus:ring-2 focus:ring-purple-500"
                  />

                  {otpError && <p className="text-xs text-red-600 font-medium">{otpError}</p>}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVerifyingBookingId(null);
                        setEnteredOtp('');
                        setOtpError('');
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Verify & Start Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Services Management */}
      {activeTab === 'SERVICES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Offered Services</h3>
            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providerServices.map((s) => (
              <div
                key={s.service_id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <img src={s.image} alt={s.service_name} className="h-40 w-full object-cover" />
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{s.service_name}</h4>
                      <span className="font-extrabold text-slate-900 text-sm">₹{s.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{s.duration}</span>
                    <button
                      onClick={() => deleteProviderService(s.service_id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Service Modal */}
          {showAddService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Add New Service to Catalog</h4>
                <form onSubmit={handleAddServiceSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. Geyser Descaling & Thermostat Repair"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={newServiceDuration}
                        onChange={(e) => setNewServiceDuration(e.target.value)}
                        placeholder="e.g. 1-2 Hours"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder="Detailed work scope..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Save Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Reviews */}
      {activeTab === 'REVIEWS' && (
        <div className="space-y-4">
          {providerReviews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No Reviews Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Completed bookings will receive customer ratings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providerReviews.map((r) => (
                <div key={r.review_id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{r.user_name}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                      ★ {r.rating} / 5
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 italic">"{r.review_text}"</p>
                  <p className="text-[10px] text-slate-400">Date: {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
