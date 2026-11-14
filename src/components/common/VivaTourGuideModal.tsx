import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Navigation,
  KeyRound,
  Wrench,
  Database,
  Award,
} from 'lucide-react';

interface VivaTourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab: (tab: string) => void;
  onOpenVivaKit: () => void;
}

const TOUR_STEPS = [
  {
    title: '1. Customer Phone OTP Verification',
    badge: 'Security & Auth',
    icon: ShieldCheck,
    color: 'text-blue-500',
    description:
      'Customer accounts verify identity via dynamic 6-digit SMS OTP. Open the Customer Portal or book a service to test the real-time OTP generator and countdown timer.',
    actionLabel: 'Open Customer Portal',
    targetTab: 'USER_AUTH',
  },
  {
    title: '2. Dynamic UPI QR Code & 5 Payment Modes',
    badge: 'Payment Engine',
    icon: QrCode,
    color: 'text-emerald-500',
    description:
      'Select any service and click "Book Now". Step 3 generates a real dynamic UPI QR code formatted to the exact price, with a 5-minute countdown and a 1-click UPI simulator.',
    actionLabel: 'Browse Services Catalog',
    targetTab: 'SERVICES',
  },
  {
    title: '3. Live Google Map & GPS Radar Tracking',
    badge: 'Dispatch Navigation',
    icon: Navigation,
    color: 'text-indigo-500',
    description:
      'Track technician dispatch with dual pins (Technician moving vehicle ➔ Customer Doorstep). Toggle between official Google Map driving directions and the animated radar simulation.',
    actionLabel: 'View Live GPS Tracker',
    targetTab: 'USER_DASHBOARD',
  },
  {
    title: '4. Doorstep Start OTP Handshake',
    badge: 'Fraud Prevention',
    icon: KeyRound,
    color: 'text-amber-500',
    description:
      'Every reservation generates a unique 4-digit Doorstep Start OTP. Technicians must request and verify this code before the service can officially start.',
    actionLabel: 'View Customer Dashboard',
    targetTab: 'USER_DASHBOARD',
  },
  {
    title: '5. Admin Onboarding (+ Add Service Man) & Approvals',
    badge: 'Platform Governance',
    icon: Wrench,
    color: 'text-purple-500',
    description:
      'The Admin HQ allows platform supervisors to onboard technicians directly with vehicle information, vet pending applications, dynamically add categories/services, and export CSV reports.',
    actionLabel: 'Open Admin HQ Dashboard',
    targetTab: 'ADMIN_DASHBOARD',
  },
  {
    title: '6. Relational 3NF Database & Viva Examination Kit',
    badge: 'Academic Defense',
    icon: Database,
    color: 'text-teal-500',
    description:
      'Includes the complete MySQL 8.0 DDL script (11 normalized tables, foreign keys, triggers), Entity-Relationship model, DFDs, 3-Tier architecture, and top 25 viva questions.',
    actionLabel: 'Open Full Viva Dossier',
    isVivaKit: true,
  },
];

export const VivaTourGuideModal: React.FC<VivaTourGuideModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab,
  onOpenVivaKit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;

  const handleActionClick = () => {
    onClose();
    if (step.isVivaKit) {
      onOpenVivaKit();
    } else if (step.targetTab) {
      onJumpToTab(step.targetTab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BE Viva Evaluation Tour</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Step {currentStep + 1} of {TOUR_STEPS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Card Content */}
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white shadow-lg">
            <Icon className={`w-8 h-8 ${step.color}`} />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {step.badge}
            </span>
            <h3 className="text-xl font-extrabold text-white">{step.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">{step.description}</p>
          </div>
        </div>

        {/* Action Button to launch the feature */}
        <div className="pt-2">
          <button
            onClick={handleActionClick}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{step.actionLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Stepper Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                  i === currentStep ? 'w-6 bg-blue-500' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            disabled={currentStep === TOUR_STEPS.length - 1}
            onClick={() => setCurrentStep((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
