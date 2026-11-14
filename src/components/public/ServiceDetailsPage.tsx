import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  KARNATAKA_DISTRICTS,
  KARNATAKA_ZONES,
  getDistrictsByZone,
  getDistrictById,
} from '../../data/karnatakaDistrictsData';
import {
  ArrowLeft,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Heart,
  QrCode,
  KeyRound,
  User,
  Zap,
  Phone,
} from 'lucide-react';

interface ServiceDetailsPageProps {
  serviceId: string;
  onBack: () => void;
}

export const ServiceDetailsPage: React.FC<ServiceDetailsPageProps> = ({
  serviceId,
  onBack,
}) => {
  const {
    services,
    providers,
    reviews,
    openBookingModal,
    toggleFavorite,
    favorites,
    selectedDistrictId,
    selectedRegion,
    setSelectedDistrictAndRegion,
    openDistrictSelector,
  } = useApp();

  const service = services.find((s) => s.service_id === serviceId) || services[0];
  const provider = providers.find((p) => p.provider_id === service.provider_id) || providers[0];
  const serviceReviews = reviews.filter((r) => r.service_id === service.service_id);
  const isFav = favorites.includes(service.service_id);

  const activeDistrict = useMemo(() => {
    return getDistrictById(selectedDistrictId) || KARNATAKA_DISTRICTS[0];
  }, [selectedDistrictId]);

  const isDistrictTopService = useMemo(() => {
    if (!activeDistrict) return false;
    const text = (service.service_name + ' ' + service.description).toLowerCase();
    return activeDistrict.topServices.some((ts) =>
      ts.toLowerCase().split(' ').some((w) => w.length > 3 && text.includes(w))
    );
  }, [activeDistrict, service]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Services Catalog</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Column: Image & Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src={service.image}
              alt={service.service_name}
              className="w-full h-80 object-cover"
            />
            <button
              onClick={() => toggleFavorite(service.service_id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md shadow-md hover:scale-110 transition-transform"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
            </button>
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Standard Duration: {service.duration}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{service.rating}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({service.reviews_count} verified customer reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {service.service_name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
          </div>

          {/* What's Included */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              What’s Included in This Service Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(service.includes || ['Certified tools', 'Post-service warranty', 'Clean doorstep finish']).map((inc, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg">Customer Reviews</h3>
            {serviceReviews.length === 0 ? (
              <p className="text-xs text-slate-500">No written reviews yet for this specific service item.</p>
            ) : (
              <div className="space-y-3">
                {serviceReviews.map((r) => (
                  <div key={r.review_id} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-xs">{r.user_name}</span>
                      <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        ★ {r.rating} / 5
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.review_text}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Booking Card */}
        <div className="space-y-6 sticky top-20">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Standard Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-900">₹{service.price}</span>
                <span className="text-xs text-slate-400">/ service visit</span>
              </div>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">
                ✓ 100% Guaranteed Price (No hidden fees)
              </p>
            </div>

            {/* Provider Mini Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Pro</span>
              <div className="flex items-center gap-3">
                <img
                  src={provider.profile_photo}
                  alt={provider.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{provider.name}</h4>
                  <p className="text-[11px] text-slate-500">Exp: {provider.experience} • ★ {provider.rating}</p>
                  <p className="text-[10px] text-blue-600 font-medium">{provider.location}</p>
                </div>
              </div>
            </div>

            {/* District Availability & Required Service Status */}
            <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Doorstep Availability</span>
                </span>
                <button
                  type="button"
                  onClick={openDistrictSelector}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                >
                  Change District
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200/70 text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">
                    {activeDistrict.name} ({activeDistrict.kannadaName})
                  </span>
                  <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                    {activeDistrict.rtoCode}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600">
                  <span className="text-emerald-700 font-bold">Doorstep ETA: ~{activeDistrict.avgResponseTimeMin} mins</span>
                  <span className="text-blue-600 font-semibold">{activeDistrict.activeProvidersCount} Techs</span>
                </div>
                {isDistrictTopService && (
                  <div className="pt-1 border-t border-slate-100 flex items-center gap-1 text-[10px] font-bold text-amber-800">
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>Top-Requested Service in {activeDistrict.name}!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Perks */}
            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Dynamic UPI QR Code Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Doorstep OTP Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>30-Day Service Guarantee</span>
              </div>
            </div>

            {/* Book Now Button */}
            <button
              onClick={() => openBookingModal(service)}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all"
            >
              Book This Service Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
