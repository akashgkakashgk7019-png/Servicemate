import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Car,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProviderAuthPageProps {
  onSuccessNavigate?: () => void;
}

export const ProviderAuthPage: React.FC<ProviderAuthPageProps> = ({ onSuccessNavigate }) => {
  const { loginProvider, registerProvider, categories, providers } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('rajesh.plumbing@servicemates.com');
  const [loginPassword, setLoginPassword] = useState('provider123');

  // Register inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [categoryId, setCategoryId] = useState('CAT01');
  const [experience, setExperience] = useState('4+ Years');
  const [location, setLocation] = useState('Bengaluru (Koramangala)');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(499);
  const [servicesOffered, setServicesOffered] = useState('Plumbing Inspection, Tap Sealing, Drain Clearing');
  const [vehicleType, setVehicleType] = useState('Honda Activa 6G');
  const [vehicleNumber, setVehicleNumber] = useState('KA-01-SM-2026');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = loginProvider(loginEmail, loginPassword);
    if (result.success) {
      setSuccessMessage('Credentials authenticated! Routing to Technician Desk...');
      if (onSuccessNavigate) {
        setTimeout(onSuccessNavigate, 600);
      }
    } else {
      setErrorMessage(result.message || 'Unable to log in.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name || !email || !phone) {
      setErrorMessage('Please fill in all mandatory profile details.');
      return;
    }

    const servicesArray = servicesOffered
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    registerProvider({
      name,
      email,
      phone,
      category_id: categoryId,
      experience,
      location,
      description: description || 'Certified professional service partner.',
      price: Number(price),
      services_offered: servicesArray.length > 0 ? servicesArray : ['General Service & Repairs'],
      vehicle_type: vehicleType,
      vehicle_number: vehicleNumber,
    });

    setSuccessMessage(
      'Partner application submitted successfully! It is now in PENDING status awaiting Admin verification. You can also switch to Admin HQ to approve this application instantly.'
    );
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
            <Wrench className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Technician & Provider Portal</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Manage your service orders, accept doorstep bookings, track your earnings, and set custom availability
          </p>

          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-xl max-w-xs mx-auto mt-5 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('LOGIN');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'LOGIN' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Partner Sign In
            </button>
            <button
              onClick={() => {
                setMode('REGISTER');
                setErrorMessage('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'REGISTER' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Become a Provider
            </button>
          </div>
        </div>

        {/* Demo Fast Login Banner */}
        {mode === 'LOGIN' && (
          <div className="bg-amber-50/70 border-b border-amber-100 p-3.5 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>
                Demo Verified Pro: <b>rajesh.plumbing@servicemates.com</b> / <b>provider123</b>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoginEmail('rajesh.plumbing@servicemates.com');
                setLoginPassword('provider123');
              }}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px]"
            >
              Fill Demo
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="m-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="m-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Operation Successful!</span>
            </div>
            <p className="leading-relaxed">{successMessage}</p>
          </div>
        )}

        {/* Login Form */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Registered Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="rajesh.plumbing@servicemates.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md transition-all mt-2"
            >
              <span>Access Provider Work Desk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Registration Form */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-4">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              💡 <b>Admin Approval Required:</b> After submitting, your status will be set to <b>PENDING</b>. You can open the <b>Admin HQ</b> from the top bar to review and approve your application instantly.
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Technician / Business Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar Services"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
              />
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 11223"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Service Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5+ Years"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Operational Location & City
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Davanagere (Vidyanagar, MCC B Block) or Bengaluru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Base Consultation / Service Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Vehicle Type
                </label>
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  placeholder="e.g. Honda Activa 6G"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Vehicle Plate Number
                </label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="KA-01-SM-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Specific Services Offered (Comma-separated)
              </label>
              <input
                type="text"
                value={servicesOffered}
                onChange={(e) => setServicesOffered(e.target.value)}
                placeholder="Tap Sealing, Pipe Repair, Bathroom Leakage"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Bio / Specialization
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share your certifications, specializations, or guarantees..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-md transition-all mt-2"
            >
              <span>Submit Partner Application</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
