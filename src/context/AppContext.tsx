import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  User,
  Provider,
  Admin,
  Category,
  ServiceItem,
  Booking,
  BookingStatus,
  PaymentMethod,
  Review,
  NotificationItem,
  Complaint,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ADMINS,
  INITIAL_PROVIDERS,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_COMPLAINTS,
} from '../data/seedData';
import { GENERATE_1000_PROVIDERS, GENERATE_1000_SERVICES } from '../data/massiveDataset';
import { maskPhoneNumber } from '../utils/phonePrivacy';
import {
  dispatchOtpToSelfPhone,
  triggerVoiceOtpCall,
  requestDeviceNotificationPermission,
} from '../services/otpService';

// Pre-generate the 1000+ Providers & 1000+ Services master catalog
const MASTER_1000_PROVIDERS = GENERATE_1000_PROVIDERS();
const MASTER_1000_SERVICES = GENERATE_1000_SERVICES(MASTER_1000_PROVIDERS);

export interface OtpState {
  phone: string;
  maskedPhone: string;
  code: string;
  sent: boolean;
  verified: boolean;
  countdown: number;
  gatewayTxnId?: string;
  carrierName?: string;
  smsUrl?: string;
  whatsappUrl?: string;
}

interface AppContextType {
  currentRole: UserRole;
  currentUser: User | null;
  currentProvider: Provider | null;
  currentAdmin: Admin | null;
  users: User[];
  providers: Provider[];
  categories: Category[];
  services: ServiceItem[];
  bookings: Booking[];
  reviews: Review[];
  notifications: NotificationItem[];
  complaints: Complaint[];
  favorites: string[];
  
  // UI & modal states
  activeBookingService: ServiceItem | null;
  activeTrackBooking: Booking | null;
  isBookingModalOpen: boolean;
  isTrackModalOpen: boolean;
  isReviewModalOpen: boolean;
  reviewTargetBooking: Booking | null;

  // Location (Karnataka Region & District Selection)
  selectedRegion: string;
  selectedDistrictId: string;
  setSelectedRegion: (region: string) => void;
  setSelectedDistrictId: (districtId: string) => void;
  setSelectedDistrictAndRegion: (districtId: string, region?: string) => void;
  isDistrictSelectorOpen: boolean;
  openDistrictSelector: () => void;
  closeDistrictSelector: () => void;
  
  // Phone OTP System
  otpState: OtpState;
  sendPhoneOtp: (phone: string) => string;
  verifyPhoneOtp: (code: string) => boolean;
  resetOtp: () => void;
  triggerVoiceOtp: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  
  // Modals & Navigation
  openBookingModal: (service: ServiceItem) => void;
  openBookingForProvider: (provider: Provider) => void;
  closeBookingModal: () => void;
  openTrackModal: (booking: Booking) => void;
  openTrackModalForProvider: (provider: Provider) => void;
  closeTrackModal: () => void;
  openReviewModal: (booking: Booking) => void;
  closeReviewModal: () => void;
  
  // Role & Auth Switcher
  switchRole: (role: UserRole) => void;
  loginUser: (identifier: string, pass: string) => boolean;
  registerUser: (userData: Partial<User>) => User;
  updateUserProfile: (userData: Partial<User>) => void;
  loginProvider: (email: string, pass: string) => { success: boolean; message?: string };
  registerProvider: (data: Partial<Provider>) => Provider;
  loginAdmin: (email: string, pass: string) => boolean;
  registerAdmin: (data: { name: string; email: string; passcode: string }) => { success: boolean; message?: string };
  logout: () => void;
  
  // Bookings
  createBooking: (data: {
    service_id: string;
    booking_date: string;
    booking_time: string;
    address: string;
    city: string;
    district?: string;
    region?: string;
    requirements?: string;
    payment_method: PaymentMethod;
  }) => Booking;
  cancelBooking: (booking_id: string, reason?: string) => void;
  updateBookingStatus: (booking_id: string, status: BookingStatus) => void;
  
  // Provider operations
  acceptBooking: (booking_id: string) => void;
  rejectBooking: (booking_id: string) => void;
  startServiceStep: (booking_id: string) => void;
  completeServiceStep: (booking_id: string) => void;
  addProviderService: (service: Partial<ServiceItem>) => void;
  deleteProviderService: (service_id: string) => void;
  
  // Admin operations
  addProviderByAdmin: (providerData: Partial<Provider>) => void;
  approveProvider: (provider_id: string) => void;
  rejectProvider: (provider_id: string) => void;
  toggleUserBlock: (user_id: string) => void;
  addCategory: (category: Partial<Category>) => void;
  editCategory: (category_id: string, category: Partial<Category>) => void;
  deleteCategory: (category_id: string) => void;
  addService: (service: Partial<ServiceItem>) => void;
  editService: (service_id: string, service: Partial<ServiceItem>) => void;
  deleteService: (service_id: string) => void;
  resolveComplaint: (complaint_id: string) => void;
  sendBroadcastNotification: (title: string, message: string, target_role?: UserRole | 'ALL') => void;
  
  // Reviews & Favorites
  addReview: (data: { rating: number; review_text: string; booking_id?: string; provider_id: string; service_id: string }) => void;
  toggleFavorite: (service_id: string) => void;
  markNotificationRead: (notification_id: string) => void;
  submitComplaint: (data: { name: string; email: string; subject: string; message: string }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Roles & Auth
  const [currentRole, setCurrentRole] = useState<UserRole>('USER');
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]); // Default to Priya Sharma for immediate demo
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  // Entities
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [providers, setProviders] = useState<Provider[]>(() => {
    try {
      const saved = localStorage.getItem('sm_providers');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1000) {
          return parsed;
        }
      }
    } catch {}
    return MASTER_1000_PROVIDERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('sm_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem('sm_services');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 1000) {
          return parsed;
        }
      }
    } catch {}
    return MASTER_1000_SERVICES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('sm_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('sm_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sm_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('sm_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [favorites, setFavorites] = useState<string[]>(['SRV101', 'SRV103', 'SRV401']);

  // Modals
  const [activeBookingService, setActiveBookingService] = useState<ServiceItem | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTrackBooking, setActiveTrackBooking] = useState<Booking | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTargetBooking, setReviewTargetBooking] = useState<Booking | null>(null);

  // Location state (Karnataka Region & District Selection)
  const [selectedRegion, setSelectedRegionState] = useState<string>(() => {
    return localStorage.getItem('sm_selected_region') || 'Central Karnataka';
  });
  const [selectedDistrictId, setSelectedDistrictIdState] = useState<string>(() => {
    return localStorage.getItem('sm_selected_district') || 'davanagere';
  });
  const [isDistrictSelectorOpen, setIsDistrictSelectorOpen] = useState(false);

  const setSelectedRegion = (reg: string) => {
    setSelectedRegionState(reg);
    localStorage.setItem('sm_selected_region', reg);
  };

  const setSelectedDistrictId = (distId: string) => {
    setSelectedDistrictIdState(distId);
    localStorage.setItem('sm_selected_district', distId);
  };

  const setSelectedDistrictAndRegion = (distId: string, reg?: string) => {
    setSelectedDistrictIdState(distId);
    localStorage.setItem('sm_selected_district', distId);
    if (reg) {
      setSelectedRegionState(reg);
      localStorage.setItem('sm_selected_region', reg);
    }
  };

  const openDistrictSelector = () => setIsDistrictSelectorOpen(true);
  const closeDistrictSelector = () => setIsDistrictSelectorOpen(false);

  // Phone OTP Verification State
  const [otpState, setOtpState] = useState<OtpState>({
    phone: '',
    maskedPhone: '',
    code: '',
    sent: false,
    verified: false,
    countdown: 0,
  });

  // Countdown timer for OTP
  useEffect(() => {
    if (otpState.countdown > 0) {
      const timer = setTimeout(() => {
        setOtpState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [otpState.countdown]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sm_users', JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      // Store current providers state safely
      localStorage.setItem('sm_providers', JSON.stringify(providers.slice(0, 100)));
    } catch {}
  }, [providers]);

  useEffect(() => {
    try {
      localStorage.setItem('sm_categories', JSON.stringify(categories));
    } catch {}
  }, [categories]);

  useEffect(() => {
    try {
      // Store current services state safely
      localStorage.setItem('sm_services', JSON.stringify(services.slice(0, 100)));
    } catch {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('sm_bookings', JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sm_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('sm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sm_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // OTP Functions
  const sendPhoneOtp = (phone: string): string => {
    // Generate secure 6-digit random verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const masked = maskPhoneNumber(phone);

    setOtpState({
      phone,
      maskedPhone: masked,
      code: generatedCode,
      sent: true,
      verified: false,
      countdown: 60,
    });

    // Real-time dispatch to the entered self phone number via SMS/WhatsApp/Push
    dispatchOtpToSelfPhone(phone, generatedCode).then((res) => {
      setOtpState((prev) => ({
        ...prev,
        gatewayTxnId: res.gatewayTxnId,
        carrierName: res.carrierName,
        smsUrl: res.smsUrl,
        whatsappUrl: res.whatsappUrl,
      }));
    });

    return generatedCode;
  };

  const verifyPhoneOtp = (code: string): boolean => {
    if (code.trim() === otpState.code) {
      setOtpState((prev) => ({ ...prev, verified: true }));
      if (currentUser) {
        setUsers((prev) =>
          prev.map((u) => (u.user_id === currentUser.user_id ? { ...u, phone_verified: true } : u))
        );
        setCurrentUser((prev) => (prev ? { ...prev, phone_verified: true } : null));
      }
      return true;
    }
    return false;
  };

  const resetOtp = () => {
    setOtpState({
      phone: '',
      maskedPhone: '',
      code: '',
      sent: false,
      verified: false,
      countdown: 0,
    });
  };

  const triggerVoiceOtp = () => {
    if (otpState.code) {
      triggerVoiceOtpCall(otpState.code);
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    return requestDeviceNotificationPermission();
  };

  // Switch role seamlessly
  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'USER') {
      setCurrentUser(users[0] || INITIAL_USERS[0]);
      setCurrentProvider(null);
      setCurrentAdmin(null);
    } else if (role === 'SERVICE_PROVIDER') {
      setCurrentProvider(providers[0] || INITIAL_PROVIDERS[0]);
      setCurrentUser(null);
      setCurrentAdmin(null);
    } else if (role === 'ADMIN') {
      setCurrentAdmin(INITIAL_ADMINS[0]);
      setCurrentUser(null);
      setCurrentProvider(null);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentProvider(null);
    setCurrentAdmin(null);
  };

  // User Auth
  const loginUser = (identifier: string, pass: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanId || u.phone.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
    );
    if (found) {
      if (found.blocked) {
        alert('This account has been suspended by Admin. Please contact support.');
        return false;
      }
      setCurrentUser(found);
      setCurrentRole('USER');
      return true;
    }
    // Fallback: create on the fly if testing with demo input
    const newUser: User = {
      user_id: `USR${Date.now().toString().slice(-4)}`,
      name: identifier.includes('@') ? identifier.split('@')[0] : 'Valued Customer',
      email: identifier.includes('@') ? identifier : `${identifier}@customer.in`,
      phone: identifier.includes('@') ? '+91 98765 00000' : identifier,
      phone_verified: true,
      address: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      created_at: new Date().toISOString(),
      blocked: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('USER');
    return true;
  };

  const registerUser = (userData: Partial<User>): User => {
    const newUser: User = {
      user_id: `USR${Date.now().toString().slice(-4)}`,
      name: userData.name || 'New Customer',
      email: userData.email || `customer${Date.now().toString().slice(-4)}@gmail.com`,
      phone: userData.phone || '+91 98000 00000',
      phone_verified: otpState.verified || false,
      address: userData.address || 'Doorstep Address',
      city: userData.city || 'Bengaluru',
      profile_image:
        userData.profile_image ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      created_at: new Date().toISOString(),
      blocked: false,
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setCurrentRole('USER');
    return newUser;
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...userData };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.user_id === currentUser.user_id ? updated : u)));
  };

  // Provider Auth
  const loginProvider = (email: string, pass: string): { success: boolean; message?: string } => {
    const found = providers.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (found) {
      if (found.status === 'PENDING') {
        return { success: false, message: 'Your application is under review by the Admin. You will be notified once approved.' };
      }
      if (found.status === 'REJECTED' || found.status === 'SUSPENDED') {
        return { success: false, message: 'Your account access has been restricted by Admin.' };
      }
      setCurrentProvider(found);
      setCurrentRole('SERVICE_PROVIDER');
      return { success: true };
    }
    // Demo fallback for Rajesh
    const rajesh = providers.find((p) => p.provider_id === 'PRV001') || INITIAL_PROVIDERS[0];
    setCurrentProvider(rajesh);
    setCurrentRole('SERVICE_PROVIDER');
    return { success: true };
  };

  const registerProvider = (data: Partial<Provider>): Provider => {
    const newProv: Provider = {
      provider_id: `PRV${Date.now().toString().slice(-4)}`,
      name: data.name || 'New Service Partner',
      email: data.email || 'partner@servicemates.com',
      phone: data.phone || '+91 99000 11223',
      category_id: data.category_id || 'CAT01',
      experience: data.experience || '3+ Years',
      location: data.location || 'Bengaluru',
      description: data.description || 'Experienced verified service provider ready for service bookings.',
      price: data.price || 499,
      status: 'PENDING', // Requires Admin Approval
      rating: 0,
      reviews_count: 0,
      profile_photo:
        data.profile_photo ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      services_offered: data.services_offered || ['General Repair & Maintenance'],
      vehicle_type: data.vehicle_type || 'Two Wheeler',
      vehicle_number: data.vehicle_number || 'KA-01-SM-2026',
      live_lat: 12.9352,
      live_lng: 77.6245,
      created_at: new Date().toISOString(),
    };
    setProviders((prev) => [newProv, ...prev]);

    // Send admin notification
    const newNotif: NotificationItem = {
      notification_id: `NOTIF${Date.now().toString().slice(-4)}`,
      target_role: 'ADMIN',
      title: 'New Service Provider Application 📋',
      message: `${newProv.name} registered for ${newProv.location} and requires your approval.`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    return newProv;
  };

  // Admin Auth
  const loginAdmin = (email: string, pass: string): boolean => {
    setCurrentAdmin(INITIAL_ADMINS[0]);
    setCurrentRole('ADMIN');
    return true;
  };

  const registerAdmin = (data: { name: string; email: string; passcode: string }) => {
    if (data.passcode !== 'ADMIN2026') {
      return { success: false, message: 'Invalid Master Security Passcode! Required: ADMIN2026' };
    }
    const newAdmin: Admin = {
      admin_id: `ADM${Date.now().toString().slice(-3)}`,
      name: data.name,
      email: data.email,
      role: 'ADMIN',
      created_at: new Date().toISOString(),
    };
    setCurrentAdmin(newAdmin);
    setCurrentRole('ADMIN');
    return { success: true };
  };

  // Modals
  const openBookingModal = (service: ServiceItem) => {
    // If not logged in as customer, auto-assign active demo customer Priya Sharma
    if (!currentUser) {
      setCurrentUser(users[0] || INITIAL_USERS[0]);
      setCurrentRole('USER');
    }
    setActiveBookingService(service);
    setIsBookingModalOpen(true);
  };

  const openBookingForProvider = (provider: Provider) => {
    if (!currentUser) {
      setCurrentUser(users[0] || INITIAL_USERS[0]);
      setCurrentRole('USER');
    }
    const matchingService = services.find((s) => s.provider_id === provider.provider_id) || {
      service_id: `SRV_PROV_${provider.provider_id}`,
      category_id: provider.category_id,
      provider_id: provider.provider_id,
      service_name: `Doorstep Visit & Inspection: ${provider.name}`,
      description: `Direct booking with verified technician ${provider.name} (${provider.location}). Professional diagnostic & on-site service.`,
      price: provider.price || 499,
      duration: '1-2 Hours',
      image: provider.profile_photo,
      status: 'ACTIVE' as const,
      includes: ['Doorstep arrival & inspection', 'Standard tool kit diagnostics', '30-day workmanship guarantee'],
      rating: provider.rating || 4.9,
      reviews_count: provider.reviews_count || 45,
    };
    setActiveBookingService(matchingService);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setActiveBookingService(null);
  };

  const openTrackModal = (booking: Booking) => {
    setActiveTrackBooking(booking);
    setIsTrackModalOpen(true);
  };

  const openTrackModalForProvider = (provider: Provider) => {
    const isDavanagere = provider.location.toLowerCase().includes('davanagere');
    const demoBooking: Booking = {
      booking_id: `TRK${Date.now().toString().slice(-4)}`,
      user_id: currentUser ? currentUser.user_id : 'USR001',
      provider_id: provider.provider_id,
      service_id: 'SRV101',
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: 'Immediate Dispatch',
      address: isDavanagere ? 'Near Bapuji College, MCC B Block, Davanagere' : 'Bellandur, Outer Ring Road, Bengaluru',
      city: isDavanagere ? 'Davanagere' : 'Bengaluru',
      requirements: 'Live GPS radar simulation demo for BE Project examination',
      status: 'SERVICE_STARTED',
      payment_method: 'UPI_QR',
      payment_status: 'PAID',
      transaction_id: `TXN${Date.now().toString().slice(-6)}`,
      amount: provider.price || 499,
      start_otp: '7829',
      created_at: new Date().toISOString(),
      provider: provider,
      service: {
        service_id: 'SRV101',
        category_id: provider.category_id,
        provider_id: provider.provider_id,
        service_name: `Express Doorstep Service - ${provider.name}`,
        description: `Active dispatch of ${provider.name} on ${provider.vehicle_type || 'Two Wheeler'} (${provider.vehicle_number || 'KA-17-SM-2026'}).`,
        price: provider.price || 499,
        duration: 'In Transit',
        image: provider.profile_photo,
        status: 'ACTIVE',
        rating: provider.rating,
        reviews_count: provider.reviews_count,
      },
    };
    setActiveTrackBooking(demoBooking);
    setIsTrackModalOpen(true);
  };

  const closeTrackModal = () => {
    setIsTrackModalOpen(false);
    setActiveTrackBooking(null);
  };

  const openReviewModal = (booking: Booking) => {
    setReviewTargetBooking(booking);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewTargetBooking(null);
  };

  // Create Booking
  const createBooking = (data: {
    service_id: string;
    booking_date: string;
    booking_time: string;
    address: string;
    city: string;
    district?: string;
    region?: string;
    requirements?: string;
    payment_method: PaymentMethod;
  }): Booking => {
    const user = currentUser || users[0] || INITIAL_USERS[0];
    const service = services.find((s) => s.service_id === data.service_id) || services[0];
    const provider = providers.find((p) => p.provider_id === service.provider_id) || providers[0];

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newBookingId = `SMB202600${randomNum}`;
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const isOnlinePayment = data.payment_method !== 'CASH';

    const newBooking: Booking = {
      booking_id: newBookingId,
      user_id: user.user_id,
      provider_id: provider.provider_id,
      service_id: service.service_id,
      booking_date: data.booking_date,
      booking_time: data.booking_time,
      address: data.address || user.address || 'Flat 402, Green Glen Layout, Bellandur',
      city: data.city || user.city || 'Bengaluru',
      district: data.district || user.district || 'bengaluru_urban',
      region: data.region || user.region || 'Bengaluru Division',
      requirements: data.requirements || 'Standard service request',
      status: 'CONFIRMED',
      payment_method: data.payment_method,
      payment_status: isOnlinePayment ? 'PAID' : 'PENDING',
      transaction_id: isOnlinePayment ? `TXN${Date.now().toString().slice(-8)}` : `COD-${randomNum}`,
      amount: service.price,
      start_otp: startOtp,
      created_at: new Date().toISOString(),
      service,
      provider,
      user,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Send notifications to user and provider
    const notifs: NotificationItem[] = [
      {
        notification_id: `NOTIF${Date.now()}-1`,
        target_role: 'USER',
        target_id: user.user_id,
        title: 'Booking Confirmed! 🚀',
        message: `Your booking for ${service.service_name} (#${newBookingId}) has been confirmed with ${provider.name}. Start OTP: ${startOtp}`,
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        notification_id: `NOTIF${Date.now()}-2`,
        target_role: 'SERVICE_PROVIDER',
        target_id: provider.provider_id,
        title: 'New Service Booking Received! 📦',
        message: `New booking #${newBookingId} for ${service.service_name} from ${user.name} at ${newBooking.city}.`,
        read: false,
        created_at: new Date().toISOString(),
      },
    ];
    setNotifications((prev) => [...notifs, ...prev]);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    return newBooking;
  };

  const cancelBooking = (booking_id: string, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.booking_id === booking_id ? { ...b, status: 'CANCELLED' as BookingStatus } : b))
    );
    const notif: NotificationItem = {
      notification_id: `NOTIF${Date.now()}`,
      target_role: 'ALL',
      title: 'Booking Cancelled ⚠️',
      message: `Booking #${booking_id} has been cancelled. ${reason ? `Reason: ${reason}` : ''}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateBookingStatus = (booking_id: string, status: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.booking_id === booking_id ? { ...b, status } : b))
    );
  };

  // Provider Actions
  const acceptBooking = (booking_id: string) => {
    updateBookingStatus(booking_id, 'ACCEPTED');
    const b = bookings.find((item) => item.booking_id === booking_id);
    if (b) {
      const notif: NotificationItem = {
        notification_id: `NOTIF${Date.now()}`,
        target_role: 'USER',
        target_id: b.user_id,
        title: 'Provider Accepted Your Booking! 🛠️',
        message: `Your booking #${booking_id} was accepted. Technician will arrive as per schedule.`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const rejectBooking = (booking_id: string) => {
    updateBookingStatus(booking_id, 'REJECTED');
  };

  const startServiceStep = (booking_id: string) => {
    updateBookingStatus(booking_id, 'SERVICE_STARTED');
    const b = bookings.find((item) => item.booking_id === booking_id);
    if (b) {
      const notif: NotificationItem = {
        notification_id: `NOTIF${Date.now()}`,
        target_role: 'USER',
        target_id: b.user_id,
        title: 'Service Started! ⏱️',
        message: `Your service provider has verified OTP and commenced work for booking #${booking_id}.`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const completeServiceStep = (booking_id: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.booking_id === booking_id
          ? { ...b, status: 'COMPLETED' as BookingStatus, payment_status: 'PAID' }
          : b
      )
    );
    const b = bookings.find((item) => item.booking_id === booking_id);
    if (b) {
      const notif: NotificationItem = {
        notification_id: `NOTIF${Date.now()}`,
        target_role: 'USER',
        target_id: b.user_id,
        title: 'Service Completed! 🌟',
        message: `Booking #${booking_id} is complete. Please share your rating and review!`,
        read: false,
        created_at: new Date().toISOString(),
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const addProviderService = (service: Partial<ServiceItem>) => {
    const provId = currentProvider ? currentProvider.provider_id : 'PRV001';
    const newSrv: ServiceItem = {
      service_id: `SRV${Date.now().toString().slice(-4)}`,
      category_id: service.category_id || 'CAT01',
      provider_id: provId,
      service_name: service.service_name || 'New Custom Service',
      description: service.description || 'Professional service by certified partner.',
      price: service.price || 499,
      duration: service.duration || '1 Hour',
      image:
        service.image ||
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE',
      includes: service.includes || ['Standard service kit', 'Verified technician'],
      rating: 5.0,
      reviews_count: 1,
    };
    setServices((prev) => [newSrv, ...prev]);
  };

  const deleteProviderService = (service_id: string) => {
    setServices((prev) => prev.filter((s) => s.service_id !== service_id));
  };

  // Admin Actions
  const addProviderByAdmin = (providerData: Partial<Provider>) => {
    const newProv: Provider = {
      provider_id: `PRV${Date.now().toString().slice(-4)}`,
      name: providerData.name || 'New Technician',
      email: providerData.email || 'tech@servicemates.com',
      phone: providerData.phone || '+91 98450 00000',
      category_id: providerData.category_id || 'CAT01',
      experience: providerData.experience || '5+ Years',
      location: providerData.location || 'Bengaluru',
      description: providerData.description || 'Admin-verified professional service provider.',
      price: providerData.price || 499,
      status: 'APPROVED', // Direct admin onboarding is auto-approved
      rating: 5.0,
      reviews_count: 1,
      profile_photo:
        providerData.profile_photo ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      services_offered: providerData.services_offered || ['Professional Repairs'],
      vehicle_type: providerData.vehicle_type || 'Hero Splendor',
      vehicle_number: providerData.vehicle_number || 'KA-01-SM-9999',
      live_lat: 12.9352,
      live_lng: 77.6245,
      created_at: new Date().toISOString(),
    };
    setProviders((prev) => [newProv, ...prev]);
  };

  const approveProvider = (provider_id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.provider_id === provider_id ? { ...p, status: 'APPROVED' } : p))
    );
  };

  const rejectProvider = (provider_id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.provider_id === provider_id ? { ...p, status: 'REJECTED' } : p))
    );
  };

  const toggleUserBlock = (user_id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.user_id === user_id ? { ...u, blocked: !u.blocked } : u))
    );
  };

  const addCategory = (category: Partial<Category>) => {
    const newCat: Category = {
      category_id: `CAT0${categories.length + 1}`,
      category_name: category.category_name || 'Special Services',
      description: category.description || 'Specialized service solutions.',
      image:
        category.image ||
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      icon_name: category.icon_name || 'Grid',
      service_count: 0,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const editCategory = (category_id: string, data: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.category_id === category_id ? { ...c, ...data } : c))
    );
  };

  const deleteCategory = (category_id: string) => {
    setCategories((prev) => prev.filter((c) => c.category_id !== category_id));
  };

  const addService = (service: Partial<ServiceItem>) => {
    const newSrv: ServiceItem = {
      service_id: `SRV${Date.now().toString().slice(-4)}`,
      category_id: service.category_id || 'CAT01',
      provider_id: service.provider_id || (providers[0]?.provider_id ?? 'PRV001'),
      service_name: service.service_name || 'New Master Service',
      description: service.description || 'High quality guaranteed service.',
      price: service.price || 499,
      duration: service.duration || '1 Hour',
      image:
        service.image ||
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE',
      includes: service.includes || ['Certified tools', 'Post-service warranty'],
      rating: 5.0,
      reviews_count: 1,
    };
    setServices((prev) => [newSrv, ...prev]);
  };

  const editService = (service_id: string, data: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((s) => (s.service_id === service_id ? { ...s, ...data } : s))
    );
  };

  const deleteService = (service_id: string) => {
    setServices((prev) => prev.filter((s) => s.service_id !== service_id));
  };

  const resolveComplaint = (complaint_id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.complaint_id === complaint_id ? { ...c, status: 'RESOLVED' } : c))
    );
  };

  const sendBroadcastNotification = (title: string, message: string, target_role: UserRole | 'ALL' = 'ALL') => {
    const notif: NotificationItem = {
      notification_id: `NOTIF${Date.now()}`,
      target_role,
      title,
      message,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Review & Favorites
  const addReview = (data: {
    rating: number;
    review_text: string;
    booking_id?: string;
    provider_id: string;
    service_id: string;
  }) => {
    const newRev: Review = {
      review_id: `REV${Date.now().toString().slice(-4)}`,
      user_id: currentUser ? currentUser.user_id : 'USR001',
      user_name: currentUser ? currentUser.name : 'Priya Sharma',
      provider_id: data.provider_id,
      service_id: data.service_id,
      booking_id: data.booking_id,
      rating: data.rating,
      review_text: data.review_text,
      created_at: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate provider rating
    setProviders((prev) =>
      prev.map((p) => {
        if (p.provider_id === data.provider_id) {
          const provReviews = [...reviews.filter((r) => r.provider_id === p.provider_id), newRev];
          const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
          return {
            ...p,
            rating: Number(avg.toFixed(1)),
            reviews_count: provReviews.length,
          };
        }
        return p;
      })
    );
  };

  const toggleFavorite = (service_id: string) => {
    setFavorites((prev) =>
      prev.includes(service_id) ? prev.filter((id) => id !== service_id) : [...prev, service_id]
    );
  };

  const markNotificationRead = (notification_id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.notification_id === notification_id ? { ...n, read: true } : n))
    );
  };

  const submitComplaint = (data: { name: string; email: string; subject: string; message: string }) => {
    const newCmp: Complaint = {
      complaint_id: `CMP${Date.now().toString().slice(-4)}`,
      user_name: data.name,
      user_email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };
    setComplaints((prev) => [newCmp, ...prev]);
  };

  // Attach joined relationships to bookings
  const enrichedBookings: Booking[] = bookings.map((b) => ({
    ...b,
    service: services.find((s) => s.service_id === b.service_id),
    provider: providers.find((p) => p.provider_id === b.provider_id),
    user: users.find((u) => u.user_id === b.user_id),
  }));

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentUser,
        currentProvider,
        currentAdmin,
        users,
        providers,
        categories,
        services,
        bookings: enrichedBookings,
        reviews,
        notifications,
        complaints,
        favorites,
        activeBookingService,
        activeTrackBooking,
        isBookingModalOpen,
        isTrackModalOpen,
        isReviewModalOpen,
        reviewTargetBooking,
        selectedRegion,
        selectedDistrictId,
        setSelectedRegion,
        setSelectedDistrictId,
        setSelectedDistrictAndRegion,
        isDistrictSelectorOpen,
        openDistrictSelector,
        closeDistrictSelector,
        otpState,
        sendPhoneOtp,
        verifyPhoneOtp,
        resetOtp,
        triggerVoiceOtp,
        requestNotificationPermission,
        openBookingModal,
        openBookingForProvider,
        closeBookingModal,
        openTrackModal,
        openTrackModalForProvider,
        closeTrackModal,
        openReviewModal,
        closeReviewModal,
        switchRole,
        loginUser,
        registerUser,
        updateUserProfile,
        loginProvider,
        registerProvider,
        loginAdmin,
        registerAdmin,
        logout,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        acceptBooking,
        rejectBooking,
        startServiceStep,
        completeServiceStep,
        addProviderService,
        deleteProviderService,
        addProviderByAdmin,
        approveProvider,
        rejectProvider,
        toggleUserBlock,
        addCategory,
        editCategory,
        deleteCategory,
        addService,
        editService,
        deleteService,
        resolveComplaint,
        sendBroadcastNotification,
        addReview,
        toggleFavorite,
        markNotificationRead,
        submitComplaint,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
