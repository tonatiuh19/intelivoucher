/**
 * Types and interfaces for the application
 */

export interface DemoResponse {
  message: string;
}

// i18n types
export type SupportedLanguage = "en" | "es";

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

// API Response types
export interface ApiCategory {
  id: number;
  name: string;
  description: string;
}

export interface ApiEventGift {
  id: number;
  event_id: number;
  gift_name: string;
  gift_name_es: string;
}

export interface ApiEventPaymentOptions {
  id: number;
  event_id: number;
  installments_available: number;
  presale_deposit_available: number;
  second_payment_installments_available: number;
}

export interface ApiEventZone {
  id: number;
  event_id: number;
  zone_name: string;
  zone_description: string;
  zone_name_es: string;
  zone_description_es: string;
  price: string;
  capacity: number;
  available_seats: number;
  is_available: number;
  display_order: number;
  created_at: string;
}

export interface ApiTransportationOption {
  id: number;
  event_id: number;
  transportation_type_id: number;
  lodging_type_id: number;
  additional_cost: string;
  capacity: number | null;
  is_available: number;
  special_instructions: string | null;
  special_instructions_es: string;
  display_order: number;
  type_name: string;
  type_name_es: string;
  description: string;
  description_es: string;
  is_active: number;
  lodging_name: string;
  lodging_name_es: string;
  lodging_description: string | null;
  lodging_description_es: string;
  lodging_is_active: number;
}

export interface ApiEvent {
  id: string;
  title: string;
  title_es: string;
  category_id: string;
  venue_id: string;
  description: string;
  event_details_html: string;
  description_es: string;
  event_details_html_es: string;
  event_date: string;
  event_time: string;
  image_url: string;
  is_sold_out: string;
  is_trending: string;
  includes_transportation: string;
  is_presale: string;
  requires_ticket_acquisition: string;
  refundable_if_no_ticket: string;
  accepts_under_age: string;
  jersey_addon_available: string;
  jersey_price: string;
  created_at: string;
  updated_at: string;
  active: string;
  category: ApiCategory;
  event_gifts: ApiEventGift[];
  event_payment_options: ApiEventPaymentOptions[];
  event_zones: ApiEventZone[];
  transportation_options: ApiTransportationOption[];
}

// App types (transformed from API)
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
  zone_name?: string;
  zone_description?: string;
  zone_name_es?: string;
  zone_description_es?: string;
}

export interface TransportationOption {
  id: string;
  name: string;
  name_es?: string;
  description?: string;
  description_es?: string;
  additionalCost: number;
  capacity: number | null;
  available: boolean;
  specialInstructions?: string;
  specialInstructions_es?: string;
  transportationTypeId: number;
  lodgingTypeId: number;
  lodgingName?: string;
  lodgingName_es?: string;
  lodgingDescription?: string;
  lodgingDescription_es?: string;
  lodgingActive: boolean;
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
  transportationOptions?: TransportationOption[];
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

// Reservation API types
export interface ReservationPassenger {
  attendee_name: string;
  ticket_status?: string;
}

export interface JerseyDetails {
  jersey_size: string;
  player_name?: string;
  player_number?: string;
  additional_cost?: number;
}

export interface CreateReservationRequest {
  user_id: number;
  event_id: number;
  zone_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  taxes: number;
  fees: number;
  discount?: number;
  total_amount: number;
  payment_method: "stripe" | "paypal";
  payment_token?: string; // For Stripe (payment method or setup intent)
  paypal_order_id?: string; // For PayPal
  currency?: string;
  purchase_reference?: string; // Client-generated unique reference to prevent duplicates
  passengers: ReservationPassenger[];
  purchase_status?: string;
  payment_installments?: number; // Number of installments (1 = pay in full)
  installment_amount?: number; // Amount per installment (calculated from total_amount / payment_installments)
  is_deposit_payment?: boolean; // Whether this is just a deposit payment
  transportation_option_id?: number;
  transport_origin?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  includes_jersey?: boolean;
  jersey_selections?: JerseyDetails[]; // Jersey details for each ticket
  special_requests?: string;
  promo_code?: string;
}

export interface ReservationTicket {
  ticket_id: number;
  ticket_number: string;
  attendee_name: string;
  ticket_status: string;
}

export interface CreateReservationResponse {
  success: boolean;
  purchase_id: number;
  transaction_id: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  tickets: ReservationTicket[];
  message: string;
  // Installment-specific fields
  payment_installments?: number;
  installment_amount?: number;
  remaining_balance?: number;
  next_payment_date?: string;
  is_deposit_payment?: boolean;
}

export interface ReservationErrorResponse {
  error: string;
}

export type ReservationApiResponse =
  | CreateReservationResponse
  | ReservationErrorResponse;

// User reservations types (for fetching existing reservations)
export interface ApiPurchase {
  id: number;
  user_id: number;
  event_id: number;
  zone_id: number;
  transaction_id: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
  taxes: string;
  fees: string;
  discount: string;
  total_amount: string;
  purchase_status: string;
  payment_status: string;
  payment_method: string;
  payment_installments: number;
  is_deposit_payment: number;
  transportation_option_id?: number;
  transport_origin: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  includes_jersey: number;
  special_requests?: string;
  promo_code?: string;
  purchase_reference: string;
  created_at: string;
  updated_at: string;
}

export interface ApiTicket {
  id: number;
  purchase_id: number;
  zone_id: number;
  ticket_number: string;
  attendee_name: string;
  ticket_status: string;
  qr_code?: string;
  seat_section?: string;
  seat_row?: string;
  seat_number?: string;
  created_at: string;
}

export interface ApiJerseySelection {
  id: number;
  purchase_id: number;
  ticket_index: number;
  jersey_size: string;
  jersey_type: string;
  player_name: string;
  player_number: string;
  additional_cost: string;
}

export interface ApiPaymentInstallment {
  id: number;
  purchase_id: number;
  installment_number: number;
  amount: string;
  due_date: string;
  payment_status: string;
  paid_at?: string;
  payment_method?: string;
  transaction_id?: string;
}

export interface UserReservation {
  purchase: ApiPurchase;
  tickets: ApiTicket[];
  jersey_selections: ApiJerseySelection[];
  payment_installments: ApiPaymentInstallment[];
}
