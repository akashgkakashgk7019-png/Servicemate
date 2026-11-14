import React from 'react';
import { Wrench, ShieldCheck, Heart, BookOpen } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenVivaKit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenVivaKit }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Wrench className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-base">SERVICE MATES</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            All-in-One on-demand home, personal, technical, and vehicle service booking platform developed for BE Major Project demonstration and viva evaluation.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Quick Navigation</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('SERVICES')} className="hover:text-white transition-colors">
                Services Catalog (1,100+)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('SERVICE_MEN')} className="hover:text-white transition-colors">
                Service Men & Technicians (1,050+)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('ABOUT')} className="hover:text-white transition-colors">
                About Platform
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('CONTACT')} className="hover:text-white transition-colors">
                Customer Support & Grievance
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Dedicated Portals</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onNavigate('USER_AUTH')} className="hover:text-white transition-colors">
                Customer Sign In & Registration (OTP)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('PROVIDER_AUTH')} className="hover:text-white transition-colors">
                Technician / Partner Registration & Sign In
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('USER_DASHBOARD')} className="hover:text-white transition-colors">
                Customer Dashboard & Bookings
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('PROVIDER_DASHBOARD')} className="hover:text-white transition-colors">
                Technician / Provider Work Desk
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('ADMIN_AUTH')} className="hover:text-white transition-colors">
                Admin HQ Login & Provisioning
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">BE Project Artifacts</h4>
          <p className="text-slate-500 mb-3">
            Includes MySQL 8.0 schema DDL, ER diagrams, DFDs, 3-Tier architecture, and top 25 viva questions.
          </p>
          <button
            onClick={onOpenVivaKit}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Viva Kit & SQL DB</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <p>© 2026 Service Mates. Bachelor of Engineering Major Project.</p>
        <p className="flex items-center gap-1">
          Built with React 19, TypeScript, Tailwind CSS, Dynamic QR & Live GPS Navigation
        </p>
      </div>
    </footer>
  );
};
