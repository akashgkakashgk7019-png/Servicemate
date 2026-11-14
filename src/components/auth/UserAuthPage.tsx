import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maskPhoneNumber } from '../../utils/phonePrivacy';
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  PhoneCall,
} from 'lucide-react';

interface UserAuthPageProps {
  onSuccessNavigate?: () => void;
}

export const UserAuthPage: React.FC<UserAuthPageProps> = ({ onSuccessNavigate }) => {
  const {
    loginUser,
    registerUser,
    sendPhoneOtp,
    verifyPhoneOtp,
    otpState,
    triggerVoiceOtp,
    requestNotificationPermission,
  } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login inputs
  const [loginIdentifier, setLoginIdentifier] = useState('priya@gmail.com');
  const [loginPassword, setLoginPassword] = useState('user123');

  // Register inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [showRegPhoneInPlain, setShowRegPhoneInPlain] = useState(false);
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Bengaluru');

  // Phone OTP Verification in Registration
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginIdentifier || !loginPassword) {
      setErrorMessage('Please enter your email/phone and password.');
      return;
    }
    const ok = loginUser(loginIdentifier, loginPassword);
    if (ok) {
      setSuccessMessage('Welcome back! Logged in successfully.');
      if (onSuccessNavigate) {
        setTimeout(onSuccessNavigate, 600);
      }
    }
  };

  const handleSendOtp = () => {
    if (!regPhone || regPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number before requesting OTP.');
      return;
    }
    setErrorMessage('');
    sendPhoneOtp(regPhone);
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!otpInput) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    const verified = verifyPhoneOtp(otpInput);
    if (verified) {
      setIsPhoneVerified(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid OTP code. Please check the SMS received on your mobile device and try again.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!isPhoneVerified) {
      setErrorMessage('Please verify your mobile number via OTP before creating your account.');
      return;
    }

    registerUser({
      name: regName,
      email: regEmail,
      phone: regPhone,
      address: regAddress,
      city: regCity,
      phone_verified: true,
    });

    setSuccessMessage('Account registered successfully! Welcome to Service Mates.');
    if (onSuccessNavigate) {
      setTimeout(onSuccessNavigate, 800);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center mx-auto mb-3 text-blue-400">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Customer Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            Access doorstep services, track live technicians, and manage bookings
          </p>

          {/* Mode Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-xl max-w-xs mx-auto mt-4 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('LOGIN');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'LOGIN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('REGISTER');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'REGISTER' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Customer Registration
            </button>
          </div>
        </div>

        {/* Demo Fast Login Banner */}
        {mode === 'LOGIN' && (
          <div className="bg-blue-50/70 border-b border-blue-100 p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-slate-700">
                Demo User: <b>priya@gmail.com</b> / <b>user123</b>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginIdentifier('priya@gmail.com');
                setLoginPassword('user123');
              }}
              className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 text-[11px]"
            >
              Auto Fill
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="m-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            ⚠️ {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="m-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="priya@gmail.com or 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition-all mt-2"
            >
              <span>Sign In to Customer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Register Form with Phone OTP Verification */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="priya@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Mobile Number (For OTP)
                  </label>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Self Phone Hidden
                  </span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type={showRegPhoneInPlain ? 'tel' : 'password'}
                    required
                    value={regPhone}
                    onChange={(e) => {
                      setRegPhone(e.target.value);
                      setIsPhoneVerified(false);
                    }}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPhoneInPlain(!showRegPhoneInPlain)}
                    className="absolute right-2 top-2 px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center gap-1"
                    title={showRegPhoneInPlain ? 'Hide phone' : 'Show phone while typing'}
                  >
                    {showRegPhoneInPlain ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showRegPhoneInPlain ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  🔒 Preview: <span className="font-mono font-bold text-slate-700">{maskPhoneNumber(regPhone)}</span> (Self phone is strictly protected and never displayed on web)
                </p>
              </div>
            </div>

            {/* OTP Verification Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Phone OTP Verification
                </span>
                {isPhoneVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Number Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold">
                    Required for signup
                  </span>
                )}
              </div>

              {!isPhoneVerified && (
                <div className="space-y-3">
                  {/* Real-time SMS Gateway Dispatch Status */}
                  {otpSent && (
                    <div className="p-3 bg-slate-900 text-white rounded-xl text-xs space-y-2 border border-slate-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          <span className="font-semibold text-emerald-400">SMS OTP Dispatched to Handset</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {otpState.carrierName || 'Telecom IN'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Verification OTP was sent to your self phone <b className="font-mono text-white">{maskPhoneNumber(regPhone)}</b>.
                        For security, your self phone number and the verification code are <u>NOT displayed on the web</u>.
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800 text-[11px]">
                        {otpState.smsUrl && (
                          <a
                            href={otpState.smsUrl}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
                            title="Open SMS app on device"
                          >
                            <span>📱 Open SMS</span>
                          </a>
                        )}
                        {otpState.whatsappUrl && (
                          <a
                            href={otpState.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
                            title="Receive code via WhatsApp"
                          >
                            <span>💬 WhatsApp OTP</span>
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
                          title="Receive notification alert"
                        >
                          <span>🔔 Alert</span>
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
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono text-center tracking-widest bg-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      Verify
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
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Flat / House / Area"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  City
                </label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Davanagere">Davanagere (Karnataka)</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-md transition-all mt-2"
            >
              <span>Complete Customer Registration</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
