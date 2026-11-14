import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, KeyRound, ArrowRight, CheckCircle2, User } from 'lucide-react';

interface AdminAuthPageProps {
  onSuccessNavigate?: () => void;
}

export const AdminAuthPage: React.FC<AdminAuthPageProps> = ({ onSuccessNavigate }) => {
  const { loginAdmin, registerAdmin } = useApp();

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login
  const [email, setEmail] = useState('admin@servicemates.com');
  const [password, setPassword] = useState('admin123');

  // Register
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPasscode, setRegPasscode] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = loginAdmin(email, password);
    if (ok) {
      setSuccess('Admin credentials verified. Routing to HQ Dashboard...');
      if (onSuccessNavigate) {
        setTimeout(onSuccessNavigate, 600);
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = registerAdmin({
      name: regName,
      email: regEmail,
      passcode: regPasscode,
    });
    if (res.success) {
      setSuccess('Administrator provisioned successfully! Redirecting to HQ...');
      if (onSuccessNavigate) {
        setTimeout(onSuccessNavigate, 800);
      }
    } else {
      setError(res.message || 'Failed to provision admin account.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white">
        {/* Top Header */}
        <div className="p-6 text-center border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 text-purple-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Service Mates Admin HQ</h2>
          <p className="text-xs text-slate-400 mt-1">
            Platform governance, technician approvals, service catalogue & financials
          </p>

          <div className="flex bg-slate-950 p-1 rounded-xl max-w-xs mx-auto mt-4 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('LOGIN');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'LOGIN' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Sign In
            </button>
            <button
              onClick={() => {
                setMode('REGISTER');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                mode === 'REGISTER' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Provision Admin
            </button>
          </div>
        </div>

        {/* Demo Fast Login Banner */}
        {mode === 'LOGIN' && (
          <div className="bg-purple-950/40 border-b border-purple-800/50 p-3 flex items-center justify-between text-xs text-purple-200">
            <span>
              Preset HQ Credentials: <b>admin@servicemates.com</b> / <b>admin123</b>
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@servicemates.com');
                setPassword('admin123');
              }}
              className="px-2 py-0.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[10px]"
            >
              Fill
            </button>
          </div>
        )}

        {error && (
          <div className="m-5 p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="m-5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@servicemates.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl shadow-lg transition-all mt-2"
            >
              <span>Authenticate & Enter HQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Register Form with Master Security Passcode */}
        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Officer Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="System Supervisor"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="supervisor@servicemates.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            {/* Master Security Passcode */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Master Security Passcode
                </label>
                <span className="text-[10px] text-purple-400 font-mono">Code: ADMIN2026</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={regPasscode}
                  onChange={(e) => setRegPasscode(e.target.value)}
                  placeholder="Enter ADMIN2026"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold rounded-xl shadow-lg transition-all mt-2"
            >
              <span>Provision Admin Account</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
