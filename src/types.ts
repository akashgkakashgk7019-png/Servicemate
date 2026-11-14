export type UserRole = 'USER' | 'SERVICE_PROVIDER' | 'ADMIN';

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  phone_verified?: boolean;
  address: string;
  city: string;
  district?: string;
  region?: string;
  profile_image: string;
  created_at: string;
  blocked?: boolean;
}

export interface Provider {
  provider_id: string;
  name: string;
  email: string;
  phone: string;
  category_id: string;
  experience: string;
  location: string;
  description: string;
  price: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rating: number;
  reviews_count: number;
  profile_photo: string;
  services_offered: string[];
  vehicle_type?: string;
  vehicle_number?: string;
  live_lat?: number;
  live_lng?: number;
  created_at: string;
}

export interface Admin {
  admin_id: string;
  name: string;
  email: string;
  role: 'ADMIN';
  created_at: string;
}

export interface Category {
  category_id: string;
  category_name: string;
  description: string;
  image: string;
  icon_name: string;
  service_count?: number;
}

export interface ServiceItem {
  service_id: string;
  category_id: string;
  provider_id: string;
  service_name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  status: 'ACTIVE' | 'INACTIVE';
  includes?: string[];
  rating: number;
  reviews_count: number;
}

export type BookingStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'CONFIRMED' 
  | 'SERVICE_STARTED' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'REJECTED';

export type PaymentMethod = 'UPI_QR' | 'CARD' | 'NETBANKING' | 'WALLET' | 'CASH';

export interface Booking {
  booking_id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  address: string;
  city: string;
  district?: string;
  region?: string;
  requirements?: string;
  status: BookingStatus;
  payment_method: PaymentMethod;
  payment_status: 'PAID' | 'PENDING' | 'REFUNDED';
  transaction_id: string;
  amount: number;
  start_otp: string;
  created_at: string;
  // joined info for display
  service?: ServiceItem;
  provider?: Provider;
  user?: User;
}

export interface Review {
  review_id: string;
  user_id: string;
  user_name: string;
  provider_id: string;
  service_id: string;
  booking_id?: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export interface NotificationItem {
  notification_id: string;
  target_role: UserRole | 'ALL';
  target_id?: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Complaint {
  complaint_id: string;
  user_name: string;
  user_email: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  created_at: string;
}
