import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, UserCheck, Wrench, Sparkles, BookOpen } from 'lucide-react';

interface DemoCredentialsBarProps {
  onOpenVivaKit: () => void;
  onOpenVivaTour?: () => void;
}

export const DemoCredentialsBar: React.FC<DemoCredentialsBarProps> = ({ onOpenVivaKit, onOpenVivaTour }) => {
  const { currentRole, switchRole } = useApp();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
            BE Major Project Demo
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Quick 1-Click Role Switcher:
          </span>
          <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-amber-300 font-bold border border-slate-700">
            1,100+ Services • 1,050+ Service Men
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Customer / User Button */}
          <button
            onClick={() => switchRole('USER')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              currentRole === 'USER'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Customer Mode (Priya Sharma)"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>Customer (Priya)</span>
          </button>

          {/* Service Provider Button */}
          <button
            onClick={() => switchRole('SERVICE_PROVIDER')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              currentRole === 'SERVICE_PROVIDER'
                ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Provider Mode (Rajesh - Plumber)"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-300" />
            <span>Technician (Rajesh)</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={() => switchRole('ADMIN')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
              currentRole === 'ADMIN'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Switch to Admin HQ"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Admin HQ</span>
          </button>

          {/* Guided Viva Tour */}
          {onOpenVivaTour && (
            <button
              onClick={onOpenVivaTour}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-sm transition-all"
              title="Launch Step-by-Step Viva Evaluation Guide"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Viva Guided Tour</span>
            </button>
          )}

          {/* Academic Viva Kit Button */}
          <button
            onClick={onOpenVivaKit}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-sm transition-all"
            title="Open Academic Viva Dossier, ER Diagrams, Architecture & MySQL Schema"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-200" />
            <span>Viva Kit & SQL DB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
