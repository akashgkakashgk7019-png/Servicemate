import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getDistrictById } from '../../data/karnatakaDistrictsData';
import {
  Wrench,
  User,
  ShieldCheck,
  Menu,
  X,
  BookOpen,
  Sparkles,
  LogOut,
  MapPin,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenVivaKit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenVivaKit }) => {
  const {
    currentRole,
    currentUser,
    currentProvider,
    currentAdmin,
    logout,
    selectedDistrictId,
    openDistrictSelector,
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentDistrict = useMemo(() => {
    return getDistrictById(selectedDistrictId);
  }, [selectedDistrictId]);

  const getProfileName = () => {
    if (currentRole === 'USER') return currentUser?.name || 'Customer';
    if (currentRole === 'SERVICE_PROVIDER') return currentProvider?.name || 'Technician';
    if (currentRole === 'ADMIN') return currentAdmin?.name || 'Admin HQ';
    return 'Guest';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Location Selector */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              onClick={() => onNavigate('HOME')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  SERVICE <span className="text-blue-600">MATES</span>
                </span>
                <span className="hidden sm:block text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                  All-in-One Services
                </span>
              </div>
            </div>

            {/* Quick District Selector Button in Header */}
            <button
              onClick={openDistrictSelector}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-slate-800 border border-amber-200 text-xs font-bold transition-all shadow-xs group"
              title="Click to select Karnataka Region & District"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
              <div className="text-left flex items-center gap-1">
                <span className="hidden xl:inline text-[10px] text-amber-800 font-semibold uppercase">District:</span>
                <span className="text-slate-900 font-extrabold max-w-[110px] sm:max-w-[140px] truncate">
                  {currentDistrict?.name || 'Davanagere'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors" />
            </button>
          </div>

          {/* Desktop Navigation Links (Note: NO separate "HOME" button as requested) */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-slate-600">
            <button
              onClick={() => onNavigate('SERVICES')}
              className={`hover:text-blue-600 transition-colors flex items-center gap-1.5 ${
                currentTab === 'SERVICES' ? 'text-blue-600' : ''
              }`}
            >
              <span>Services</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black">
                1,100+
              </span>
            </button>
            <button
              onClick={() => onNavigate('SERVICE_MEN')}
              className={`hover:text-amber-600 transition-colors flex items-center gap-1.5 ${
                currentTab === 'SERVICE_MEN' ? 'text-amber-600' : ''
              }`}
            >
              <span>Service Men</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">
                1,050+
              </span>
            </button>
            <button
              onClick={() => onNavigate('KARNATAKA_MAP')}
              className={`hover:text-amber-600 transition-colors flex items-center gap-1.5 ${
                currentTab === 'KARNATAKA_MAP' ? 'text-amber-600' : ''
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Karnataka Map</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                31 Districts
              </span>
            </button>
            <button
              onClick={() => onNavigate('ABOUT')}
              className={`hover:text-blue-600 transition-colors ${
                currentTab === 'ABOUT' ? 'text-blue-600' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate('CONTACT')}
              className={`hover:text-blue-600 transition-colors ${
                currentTab === 'CONTACT' ? 'text-blue-600' : ''
              }`}
            >
              Help & Grievance
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Academic Viva Kit Shortcut */}
            <button
              onClick={onOpenVivaKit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Viva Kit & SQL DB</span>
            </button>

            {/* Role Dedicated Button */}
            {currentRole === 'USER' && (
              <button
                onClick={() => onNavigate('USER_DASHBOARD')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Dashboard</span>
              </button>
            )}

            {currentRole === 'SERVICE_PROVIDER' && (
              <button
                onClick={() => onNavigate('PROVIDER_DASHBOARD')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-all"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Provider Desk</span>
              </button>
            )}

            {currentRole === 'ADMIN' && (
              <button
                onClick={() => onNavigate('ADMIN_DASHBOARD')}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-800 hover:bg-purple-100 text-xs font-bold transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin HQ</span>
              </button>
            )}

            {/* Dedicated Auth Gateways */}
            <button
              onClick={() => onNavigate('USER_AUTH')}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 px-2 py-1"
            >
              User Login
            </button>
            <button
              onClick={() => onNavigate('PROVIDER_AUTH')}
              className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200"
            >
              Partner / Technician
            </button>
            <button
              onClick={() => onNavigate('ADMIN_AUTH')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-xl"
            >
              Admin HQ
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenVivaKit}
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 text-xs font-bold text-slate-700">
          {/* Mobile District Selector */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <div>
                <span className="text-[10px] text-amber-800 uppercase block font-semibold">Active District</span>
                <span className="font-extrabold text-slate-900">{currentDistrict?.name || 'Davanagere'} ({currentDistrict?.kannadaName})</span>
              </div>
            </div>
            <button
              onClick={() => {
                openDistrictSelector();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold text-xs"
            >
              Change
            </button>
          </div>

          <button
            onClick={() => {
              onNavigate('SERVICES');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-blue-600 flex items-center justify-between"
          >
            <span>Services Catalog</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">1,100+</span>
          </button>
          <button
            onClick={() => {
              onNavigate('SERVICE_MEN');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-amber-600 flex items-center justify-between"
          >
            <span>Service Men / Technicians</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">1,050+</span>
          </button>
          <button
            onClick={() => {
              onNavigate('KARNATAKA_MAP');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-amber-600 flex items-center justify-between font-bold text-amber-700"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Karnataka 31 Districts Google Map</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">Live</span>
          </button>
          <button
            onClick={() => {
              onNavigate('ABOUT');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            About
          </button>
          <button
            onClick={() => {
              onNavigate('CONTACT');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            Help & Grievance
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('USER_AUTH');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-center"
            >
              Customer Login / Register
            </button>
            <button
              onClick={() => {
                onNavigate('PROVIDER_AUTH');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-center"
            >
              Partner / Technician Portal
            </button>
            <button
              onClick={() => {
                onNavigate('ADMIN_AUTH');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-purple-600 text-white rounded-xl text-center"
            >
              Admin HQ Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
