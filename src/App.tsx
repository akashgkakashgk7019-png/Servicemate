import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoCredentialsBar } from './components/common/DemoCredentialsBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/public/HomePage';
import { ServicesPage } from './components/public/ServicesPage';
import { ServiceMenPage } from './components/public/ServiceMenPage';
import { ServiceDetailsPage } from './components/public/ServiceDetailsPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { UserAuthPage } from './components/auth/UserAuthPage';
import { ProviderAuthPage } from './components/auth/ProviderAuthPage';
import { AdminAuthPage } from './components/auth/AdminAuthPage';
import { UserDashboard } from './components/user/UserDashboard';
import { ProviderDashboard } from './components/provider/ProviderDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingModal } from './components/booking/BookingModal';
import { LocationTrackerModal } from './components/map/LocationTrackerModal';
import { ReviewModal } from './components/common/ReviewModal';
import { ProjectVivaKit } from './components/docs/ProjectVivaKit';
import { VivaTourGuideModal } from './components/common/VivaTourGuideModal';
import { KarnatakaDistrictsPage } from './components/public/KarnatakaDistrictsPage';
import { DistrictSelectorModal } from './components/common/DistrictSelectorModal';

function MainLayout() {
  const { currentRole } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('HOME');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('SRV101');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [isVivaKitOpen, setIsVivaKitOpen] = useState(false);
  const [isVivaTourOpen, setIsVivaTourOpen] = useState(false);

  // Sync role switches with relevant view if on auth or dashboard
  const handleOpenServiceDetails = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentTab('SERVICE_DETAILS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCurrentTab('SERVICES');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Quick Role Switcher Bar for BE Viva Defense */}
      <DemoCredentialsBar
        onOpenVivaKit={() => setIsVivaKitOpen(true)}
        onOpenVivaTour={() => setIsVivaTourOpen(true)}
      />

      {/* Main Navigation (Clean Header with NO redundant "Home" button) */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenVivaKit={() => setIsVivaKitOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'HOME' && (
          <HomePage
            onSelectCategory={handleSelectCategory}
            onViewService={handleOpenServiceDetails}
            onNavigateTab={handleNavigate}
          />
        )}

        {currentTab === 'SERVICES' && (
          <ServicesPage
            initialCategoryId={selectedCategoryId}
            onViewService={handleOpenServiceDetails}
          />
        )}

        {currentTab === 'SERVICE_MEN' && <ServiceMenPage />}

        {currentTab === 'KARNATAKA_MAP' && (
          <KarnatakaDistrictsPage onNavigateTab={handleNavigate} />
        )}

        {currentTab === 'SERVICE_DETAILS' && (
          <ServiceDetailsPage
            serviceId={selectedServiceId}
            onBack={() => setCurrentTab('SERVICES')}
          />
        )}

        {currentTab === 'ABOUT' && <AboutPage />}

        {currentTab === 'CONTACT' && <ContactPage />}

        {currentTab === 'USER_AUTH' && (
          <UserAuthPage onSuccessNavigate={() => setCurrentTab('USER_DASHBOARD')} />
        )}

        {currentTab === 'PROVIDER_AUTH' && (
          <ProviderAuthPage onSuccessNavigate={() => setCurrentTab('PROVIDER_DASHBOARD')} />
        )}

        {currentTab === 'ADMIN_AUTH' && (
          <AdminAuthPage onSuccessNavigate={() => setCurrentTab('ADMIN_DASHBOARD')} />
        )}

        {currentTab === 'USER_DASHBOARD' && <UserDashboard />}

        {currentTab === 'PROVIDER_DASHBOARD' && <ProviderDashboard />}

        {currentTab === 'ADMIN_DASHBOARD' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenVivaKit={() => setIsVivaKitOpen(true)}
      />

      {/* Global Modals */}
      <DistrictSelectorModal onNavigateTab={handleNavigate} />
      <BookingModal />
      <LocationTrackerModal />
      <ReviewModal />
      <ProjectVivaKit
        isOpen={isVivaKitOpen}
        onClose={() => setIsVivaKitOpen(false)}
      />
      <VivaTourGuideModal
        isOpen={isVivaTourOpen}
        onClose={() => setIsVivaTourOpen(false)}
        onJumpToTab={handleNavigate}
        onOpenVivaKit={() => setIsVivaKitOpen(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
