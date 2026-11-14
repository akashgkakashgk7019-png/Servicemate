import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import { maskPhoneNumber } from '../../utils/phonePrivacy';
import {
  KARNATAKA_DISTRICTS,
  KARNATAKA_ZONES,
  getDistrictsByZone,
} from '../../data/karnatakaDistrictsData';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Navigation,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  PhoneCall,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    activeBookingService,
    closeBookingModal,
    currentUser,
    createBooking,
    openTrackModal,
    sendPhoneOtp,
    verifyPhoneOtp,
    otpState,
    triggerVoiceOtp,
    requestNotificationPermission,
    selectedDistrictId: globalDistrictId,
    selectedRegion: globalRegion,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Date/Time, 2: Address & Phone OTP, 3: Payment, 4: Confirmed

  // Form states
  const [selectedDate, setSelectedDate] = useState('Today');
  const [customDate, setCustomDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('11:30 AM');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Davanagere');
  const [selectedRegion, setSelectedRegion] = useState<string>(globalRegion || 'Central Karnataka');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(globalDistrictId || 'davanagere');
  const [phone, setPhone] = useState('');
  const [showPhoneInPlain, setShowPhoneInPlain] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI_QR');

  // Phone OTP local state
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isPhoneVerifiedLocally, setIsPhoneVerifiedLocally] = useState(false);

  // QR Code data URL state
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [qrCountdown, setQrCountdown] = useState(300); // 5 minutes timer
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Resulting confirmed booking
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Sync initial user details when modal opens
  useEffect(() => {
    if (currentUser) {
      setAddress(currentUser.address || 'House 45, 2nd Main, Vidyanagar');
      setCity(currentUser.city || 'Davanagere');
      setSelectedRegion(globalRegion || currentUser.region || (currentUser.city?.toLowerCase().includes('davanagere') ? 'Central Karnataka' : 'Bengaluru Division'));
      setSelectedDistrictId(globalDistrictId || currentUser.district || (currentUser.city?.toLowerCase().includes('davanagere') ? 'davanagere' : 'bengaluru_urban'));
      setPhone(currentUser.phone || '+91 99801 88990');
      if (currentUser.phone_verified) {
        setIsPhoneVerifiedLocally(true);
      }
    } else {
      setAddress('House 45, 2nd Main, Vidyanagar');
      setCity('Davanagere');
      setSelectedRegion(globalRegion || 'Central Karnataka');
      setSelectedDistrictId(globalDistrictId || 'davanagere');
      setPhone('+91 99801 88990');
      setIsPhoneVerifiedLocally(true);
    }
    setStep(1);
    setConfirmedBookingData(null);
  }, [isBookingModalOpen, currentUser]);

  // Generate dynamic QR Code when entering Step 3 or when payment method is UPI_QR
  useEffect(() => {
    if (activeBookingService && step === 3 && paymentMethod === 'UPI_QR') {
      const upiUrl = `upi://pay?pa=servicemates@upi&pn=ServiceMates&am=${activeBookingService.price}&cu=INR&tn=Booking_${activeBookingService.service_id}`;
      QRCode.toDataURL(upiUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('QR code generation error', err));
    }
  }, [step, paymentMethod, activeBookingService]);

  // QR timer
  useEffect(() => {
    if (step === 3 && paymentMethod === 'UPI_QR' && qrCountdown > 0) {
      const timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, paymentMethod, qrCountdown]);

  if (!isBookingModalOpen || !activeBookingService) return null;

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpError('');
    sendPhoneOtp(phone);
  };

  const handleVerifyOtp = () => {
    if (!otpInput) {
      setOtpError('Please enter the 6-digit OTP.');
      return;
    }
    const success = verifyPhoneOtp(otpInput);
    if (success) {
      setIsPhoneVerifiedLocally(true);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please check the SMS received on your mobile device and try again.');
    }
  };

  const handleCompleteBooking = (overridePaymentMethod?: PaymentMethod) => {
    const finalMethod = overridePaymentMethod || paymentMethod;
    const finalDate = selectedDate === 'Custom' ? customDate || '2026-09-28' : selectedDate;
    const chosenDistrict = KARNATAKA_DISTRICTS.find((d) => d.id === selectedDistrictId) || KARNATAKA_DISTRICTS[0];

    const newBooking = createBooking({
      service_id: activeBookingService.service_id,
      booking_date: finalDate,
      booking_time: selectedTime,
      address: address || 'Vidyanagar 2nd Main, Davanagere',
      city: chosenDistrict.name,
      district: chosenDistrict.id,
      region: chosenDistrict.zone,
      requirements: requirements || 'Standard service request',
      payment_method: finalMethod,
    });

    setConfirmedBookingData(newBooking);
    setStep(4);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('servicemates@upi');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 my-8">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-white">Book Service Appointment</h2>
              <p className="text-xs text-slate-300">
                {activeBookingService.service_name} • <span className="font-bold text-emerald-400">₹{activeBookingService.price}</span>
              </p>
            </div>
          </div>
          <button
            onClick={closeBookingModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Stepper Progress Bar */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</span>
              <span>Schedule</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</span>
              <span>Address & OTP</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-200" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : ''}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
              <span>Payment & QR</span>
            </div>
          </div>
        )}

        {/* Step 1: Date & Time Slot Picker */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Service Date
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Today', 'Tomorrow', 'Custom'].map((dateOpt) => (
                  <button
                    key={dateOpt}
                    type="button"
                    onClick={() => setSelectedDate(dateOpt)}
                    className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                      selectedDate === dateOpt
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {dateOpt}
                  </button>
                ))}
              </div>
              {selectedDate === 'Custom' && (
                <div className="mt-3">
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Select Arrival Time Slot
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '07:30 PM'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedTime === slot
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{slot}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Summary Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={activeBookingService.image}
                  alt={activeBookingService.service_name}
                  className="w-14 h-14 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{activeBookingService.service_name}</p>
                  <p className="text-xs text-slate-500">Duration: {activeBookingService.duration}</p>
                  <p className="text-xs text-emerald-600 font-medium">★ {activeBookingService.rating} ({activeBookingService.reviews_count} reviews)</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Total Payable</p>
                <p className="text-xl font-extrabold text-slate-900">₹{activeBookingService.price}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <span>Continue to Address & OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Doorstep Address & Phone OTP Verification */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Service Delivery Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat, House no., Building, Street name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Region & District Selection */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Karnataka Region & District Selection</span>
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  31 Districts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    1. Select Region / Division
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => {
                      const newReg = e.target.value;
                      setSelectedRegion(newReg);
                      const matching = getDistrictsByZone(newReg);
                      if (matching.length > 0) {
                        setSelectedDistrictId(matching[0].id);
                        setCity(matching[0].name);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {KARNATAKA_ZONES.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    2. Select District
                  </label>
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => {
                      const distId = e.target.value;
                      setSelectedDistrictId(distId);
                      const dist = KARNATAKA_DISTRICTS.find((d) => d.id === distId);
                      if (dist) {
                        setCity(dist.name);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {getDistrictsByZone(selectedRegion).map((dist) => (
                      <option key={dist.id} value={dist.id}>
                        {dist.name} ({dist.kannadaName}) - {dist.rtoCode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic District Status Card */}
              {(() => {
                const currentDist =
                  KARNATAKA_DISTRICTS.find((d) => d.id === selectedDistrictId) ||
                  KARNATAKA_DISTRICTS[0];
                return (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-extrabold text-slate-900">
                        {currentDist.name} ({currentDist.kannadaName})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-mono font-black">
                        RTO: {currentDist.rtoCode}
                      </span>
                      <span className="text-[11px] text-slate-500 hidden sm:inline">
                        • {currentDist.activeProvidersCount} Active Technicians
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-emerald-700 font-bold">
                        ETA: ~{currentDist.avgResponseTimeMin} mins
                      </span>
                      <span className="text-blue-600 font-mono text-[10px]">
                        Helpline: {currentDist.helpline.split('/')[0]}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mobile Number
                </label>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Lock className="w-3 h-3" />
                    Self Phone Hidden on Web
                  </span>
                </div>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showPhoneInPlain ? 'tel' : 'password'}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setIsPhoneVerifiedLocally(false);
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhoneInPlain(!showPhoneInPlain)}
                    className="absolute right-2 top-2 px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center gap-1"
                    title={showPhoneInPlain ? 'Hide phone on screen' : 'Show phone while typing'}
                  >
                    {showPhoneInPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPhoneInPlain ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  🔒 Preview: <span className="font-mono font-bold text-slate-700">{maskPhoneNumber(phone)}</span> (Your real self phone is protected and never displayed on web)
                </p>
              </div>

            {/* Customer Phone OTP Verification Block */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className={`w-5 h-5 ${isPhoneVerifiedLocally ? 'text-emerald-600' : 'text-blue-600'}`} />
                  <span className="text-xs font-bold text-slate-800">
                    Customer Phone Verification (SMS OTP)
                  </span>
                </div>
                {isPhoneVerifiedLocally ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Number Verified
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    OTP Required
                  </span>
                )}
              </div>

              {!isPhoneVerifiedLocally ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    To guarantee booking safety and receive your Doorstep Security PIN, enter your mobile number and request a verification OTP:
                  </p>

                  {/* Real-time SMS Gateway Dispatch Banner (Does NOT leak OTP or full phone on web) */}
                  {otpState.sent && (
                    <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="font-semibold text-emerald-400">SMS OTP Dispatched to Handset</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {otpState.carrierName || 'Telecom IN'} • Txn: {otpState.gatewayTxnId || 'GATEWAY-OK'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Verification code sent directly to your entered self phone <b className="font-mono text-white">{maskPhoneNumber(phone)}</b>.
                        For privacy, your self phone number and the OTP code are <u>NOT displayed on the web</u>. Please check the SMS on your handset.
                      </p>
                      
                      {/* Direct mobile triggers */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800 text-[11px]">
                        {otpState.smsUrl && (
                          <a
                            href={otpState.smsUrl}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                            title="Open SMS inbox on your mobile phone"
                          >
                            <span>📱 Open SMS App</span>
                          </a>
                        )}
                        {otpState.whatsappUrl && (
                          <a
                            href={otpState.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                            title="Receive verification code via WhatsApp"
                          >
                            <span>💬 Send to WhatsApp</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={triggerVoiceOtp}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
                          title="Hear OTP via voice call on device"
                        >
                          <PhoneCall className="w-3 h-3 text-amber-400" />
                          <span>Voice Call OTP</span>
                        </button>
                        <button
                          type="button"
                          onClick={requestNotificationPermission}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition-colors"
                          title="Receive native device alert on screen"
                        >
                          <span>🔔 Device Alert</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit SMS OTP"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpState.countdown > 0}
                      className="px-3 py-2 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 text-xs font-semibold rounded-xl transition-all"
                    >
                      {otpState.countdown > 0 ? `Resend (${otpState.countdown}s)` : 'Send OTP'}
                    </button>
                  </div>

                  {otpError && <p className="text-xs text-red-600 mt-1 font-medium">{otpError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-emerald-800 font-medium bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Phone authenticated ({maskPhoneNumber(phone)})
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    🔒 Self phone hidden on web for privacy
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Special Instructions or Problem Description (Optional)
              </label>
              <textarea
                rows={2}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. Please bring spare PVC elbow joints or call before ringing the bell"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Options & Dynamic QR Code */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Choose Payment Method
              </label>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'UPI_QR', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'CARD', label: 'Cards (Visa/MC)', icon: CreditCard },
                  { id: 'NETBANKING', label: 'Net Banking', icon: ShieldCheck },
                  { id: 'CASH', label: 'Cash on Service', icon: Clock },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1 text-slate-600" />
                      <span className="text-xs font-bold">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic UPI QR Code View */}
            {paymentMethod === 'UPI_QR' && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center shrink-0">
                  {qrCodeDataUrl ? (
                    <img src={qrCodeDataUrl} alt="UPI QR Code" className="w-44 h-44 object-contain" />
                  ) : (
                    <div className="w-44 h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      Generating QR...
                    </div>
                  )}
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mt-1">
                    Scan with any UPI App
                  </span>
                </div>

                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-mono">
                      Payable: ₹{activeBookingService.price}
                    </span>
                    <span className="text-xs text-slate-400">
                      Timer: {Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Scan using <b>Google Pay, PhonePe, Paytm, CRED</b> or BHIM to pay instantly.
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
                    <span className="font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
                      servicemates@upi
                    </span>
                    <button
                      onClick={copyUpiId}
                      className="p-1 hover:text-blue-400 transition-colors"
                      title="Copy UPI ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedUpi && <span className="text-[10px] text-emerald-400">Copied!</span>}
                  </div>

                  {/* 1-Click UPI Simulator Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleCompleteBooking('UPI_QR')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Simulate Scan & Pay from UPI App (Instant)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card Payment View */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    defaultValue="4532 •••• •••• 8912"
                    placeholder="16-digit Card Number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono text-slate-800 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      defaultValue="08/29"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      defaultValue="782"
                      maxLength={4}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking View */}
            {paymentMethod === 'NETBANKING' && (
              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Select Your Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-white text-xs font-semibold text-slate-800 text-center"
                    >
                      {bank}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cash on Service */}
            {paymentMethod === 'CASH' && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 space-y-1">
                <p className="font-bold">💵 Cash on Service (Pay Post-Work)</p>
                <p className="text-amber-800">
                  You can inspect the service and pay ₹{activeBookingService.price} directly to the technician via Cash or UPI after work is completed.
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => handleCompleteBooking()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition-all"
              >
                <span>Confirm Booking & Reserve</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Booking Confirmed & Success Screen */}
        {step === 4 && confirmedBookingData && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900">Booking Confirmed!</h3>
              <p className="text-sm text-slate-500">
                Your service has been scheduled. A technician has been notified.
              </p>
            </div>

            {/* Booking Details Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Booking ID</span>
                <span className="text-xs font-mono font-bold text-blue-600">
                  #{confirmedBookingData.booking_id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Service</span>
                <span className="text-xs font-bold text-slate-800">
                  {activeBookingService.service_name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Schedule</span>
                <span className="text-xs font-semibold text-slate-800">
                  {confirmedBookingData.booking_date} at {confirmedBookingData.booking_time}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Payment Status</span>
                <span className="text-xs font-bold text-emerald-600">
                  {confirmedBookingData.payment_status} (₹{confirmedBookingData.amount})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Customer Phone</span>
                <span className="text-xs font-mono font-medium text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>{maskPhoneNumber(phone)}</span>
                  <span className="text-[10px] text-emerald-600 font-sans font-semibold">(Protected on Web)</span>
                </span>
              </div>
              {/* Start OTP PIN */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center bg-white p-3 rounded-xl border">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Doorstep Start OTP</p>
                    <p className="text-xs text-slate-600">Share with technician</p>
                  </div>
                </div>
                <span className="font-mono text-lg font-extrabold text-emerald-600 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-200">
                  {confirmedBookingData.start_otp}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  closeBookingModal();
                  openTrackModal(confirmedBookingData);
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>📍 Track on Live Map</span>
              </button>

              <button
                onClick={closeBookingModal}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-all"
              >
                Done / Return to Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
