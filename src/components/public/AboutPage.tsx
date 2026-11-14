import React from 'react';
import { ShieldCheck, Award, Users, HeartHandshake, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          About Service Mates
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-slate-600">
          Service Mates was built as a comprehensive BE Major Project platform to seamlessly connect everyday homeowners with vetted, high-integrity service technicians.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified & Vetted</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every technician undergoes two-stage identity vetting and admin approval before being dispatched to user homes.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Transparent Pricing</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fixed upfront pricing with instant dynamic UPI QR code payments and cash on service options with zero surprise fees.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">30-Day Guarantee</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our Service Protection guarantee covers rework and repairs if you are not 100% delighted with the craftsmanship.
          </p>
        </div>
      </div>
    </div>
  );
};
