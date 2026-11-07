export type FuelType = 'Diesel' | 'Petrol' | 'CNG' | 'Electric';
export type TransmissionType = 'Manual' | 'Automatic';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MUV' | 'Van';

export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  price: number;
  priceNegotiable: boolean;
  km: number;
  fuel: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  owners: string;
  registration: string;
  passingValidUntil: string;
  insurance: string;
  color: string;
  isSold: boolean;
  isFeatured?: boolean;
  images: string[];
  videoUrl?: string;
  reelUrl?: string;
  features: string[];
  description: string;
  createdAt: number;
}

export interface ShowroomConfig {
  name: string;
  marathiName: string;
  proprietor: string;
  tagline: string;
  subTagline: string;
  whatsappNumber: string;
  callNumber: string;
  address: string;
  city: string;
  timings: string;
  instagramUrl: string;
  mapLocationUrl: string;
  financePartner: string;
}

export interface BookingDetails {
  customerName: string;
  phoneNumber?: string;
  visitDate: string;
  visitTime: string;
  carId: string;
  carTitle: string;
  carPrice: number;
  notes?: string;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConfigured: boolean;
}
