import React from 'react';
import { useApp } from '../../context/AppContext';
import { LiveLocationTracker } from './LiveLocationTracker';
import { X, Navigation } from 'lucide-react';

export const LocationTrackerModal: React.FC = () => {
  const { isTrackModalOpen, activeTrackBooking, closeTrackModal, bookings } = useApp();

  if (!isTrackModalOpen) return null;

  // Fallback to latest active booking or sample booking
  const targetBooking = activeTrackBooking || bookings[0];
  if (!targetBooking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        {/* Header with Back and Close */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={closeTrackModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
            >
              <span>← Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">Live Service Dispatch & Map Tracker</h2>
            </div>
          </div>
          <button
            onClick={closeTrackModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker component */}
        <div className="p-4 sm:p-6">
          <LiveLocationTracker booking={targetBooking} onClose={closeTrackModal} />
        </div>
      </div>
    </div>
  );
};
