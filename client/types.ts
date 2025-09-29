/**
 * Types and interfaces for the application
 */

export interface DemoResponse {
  message: string;
}

export interface PaymentOptions {
  installmentsAvailable: boolean;
  presaleDepositAvailable: boolean;
  secondPaymentInstallmentsAvailable: boolean;
}

export interface ZoneOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  available: boolean;
}

export interface Trip {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: string;
  image: string;
  rating: number;
  soldOut: boolean;
  trending: boolean;
  includesTransportation: boolean;
  isPresale: boolean;
  requiresTicketAcquisition: boolean;
  refundableIfNoTicket: boolean;
  paymentOptions: PaymentOptions;
  gifts?: string[];
  acceptsUnderAge: boolean;
  jerseyAddonAvailable?: boolean;
  jerseyPrice?: number;
  availableZones: ZoneOption[];
}

export type TransportationMode = "none" | "van" | "flight";

export interface JerseySelection {
  size: string;
  playerName: string;
  playerNumber: string;
}

export interface Purchase {
  id: string;
  tripId: string;
  title: string;
  date: string;
  location: string;
  image: string;
  quantity: number;
  zone: string;
  transportation: TransportationMode;
  transportOrigin?: string;
  jerseySelections?: (JerseySelection | null)[]; // length = quantity, null if not selected
  total: number;
  status: "reserved" | "confirmed" | "cancelled" | "refunded";
  createdAt: string;
}
