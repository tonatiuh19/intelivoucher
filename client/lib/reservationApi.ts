import axios from "axios";
import { API_ENDPOINTS, API_CONFIG } from "./apiConfig";
import { generatePurchaseReference } from "./utils";
import type {
  CreateReservationRequest,
  CreateReservationResponse,
  ReservationErrorResponse,
  ReservationApiResponse,
  UserReservation,
} from "@/types";

// Create axios instance with default config
const reservationApiClient = axios.create({
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
reservationApiClient.interceptors.request.use(
  (config) => {
    console.log("Reservation API Request:", config);
    console.log(
      "Request data purchase_reference:",
      config.data?.purchase_reference,
    );
    return config;
  },
  (error) => {
    console.error("Reservation API Request Error:", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for error handling
reservationApiClient.interceptors.response.use(
  (response) => {
    console.log("Reservation API Response:", response);
    return response;
  },
  (error) => {
    console.error("Reservation API Response Error:", error);
    return Promise.reject(error);
  },
);

/**
 * Create a new reservation with payment processing
 */
export const createReservation = async (
  reservationData: CreateReservationRequest,
): Promise<CreateReservationResponse> => {
  try {
    const response = await reservationApiClient.post<ReservationApiResponse>(
      API_ENDPOINTS.CREATE_RESERVATION,
      reservationData,
    );

    // Check if the response contains an error
    if ("error" in response.data) {
      throw new Error((response.data as ReservationErrorResponse).error);
    }

    return response.data as CreateReservationResponse;
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.status) {
        throw new Error(
          `API request failed with status ${error.response.status}`,
        );
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout - please try again");
      } else if (error.code === "ERR_NETWORK") {
        throw new Error("Network error - please check your connection");
      }
    }

    // Re-throw any other errors
    throw error;
  }
};

/**
 * Helper function to validate reservation data before submission
 */
export const validateReservationData = (
  data: CreateReservationRequest,
): string[] => {
  const errors: string[] = [];

  // Required fields validation
  const requiredFields: Array<keyof CreateReservationRequest> = [
    "user_id",
    "event_id",
    "zone_id",
    "quantity",
    "unit_price",
    "subtotal",
    "taxes",
    "fees",
    "total_amount",
    "payment_method",
    "passengers",
  ];

  requiredFields.forEach((field) => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
    ) {
      errors.push(`${field} is required`);
    }
  });

  // Payment method validation
  if (
    data.payment_method &&
    !["stripe", "paypal"].includes(data.payment_method)
  ) {
    errors.push("Invalid payment method. Must be stripe or paypal");
  }

  // Stripe-specific validation
  if (data.payment_method === "stripe" && !data.payment_token) {
    errors.push("Payment token is required for Stripe payments");
  }

  // PayPal-specific validation
  if (data.payment_method === "paypal" && !data.paypal_order_id) {
    errors.push("PayPal order ID is required for PayPal payments");
  }

  // Passengers validation
  if (data.passengers && data.quantity) {
    if (!Array.isArray(data.passengers)) {
      errors.push("Passengers must be an array");
    } else if (data.passengers.length !== data.quantity) {
      errors.push("Number of passengers must match ticket quantity");
    } else {
      data.passengers.forEach((passenger, index) => {
        if (!passenger.attendee_name || passenger.attendee_name.trim() === "") {
          errors.push(`Attendee name is required for passenger ${index + 1}`);
        }
      });
    }
  }

  // Jersey validation
  if (data.includes_jersey && data.jersey_selections) {
    if (!Array.isArray(data.jersey_selections)) {
      errors.push("Jersey selections must be an array when jersey is included");
    } else {
      data.jersey_selections.forEach((jersey, index) => {
        if (!jersey.jersey_size || jersey.jersey_size.trim() === "") {
          errors.push(`Jersey size is required for jersey ${index + 1}`);
        }

        // Validate personalized jersey fields if they are provided
        if (jersey.player_name && !jersey.player_number) {
          errors.push(
            `Player number is required when player name is provided for jersey ${
              index + 1
            }`,
          );
        }
        if (jersey.player_number && !jersey.player_name) {
          errors.push(
            `Player name is required when player number is provided for jersey ${
              index + 1
            }`,
          );
        }
      });
    }
  }

  // Numeric validation
  const numericFields: Array<keyof CreateReservationRequest> = [
    "user_id",
    "event_id",
    "zone_id",
    "quantity",
    "unit_price",
    "subtotal",
    "taxes",
    "fees",
    "total_amount",
  ];

  numericFields.forEach((field) => {
    const value = data[field];
    if (
      value !== undefined &&
      value !== null &&
      (isNaN(Number(value)) || Number(value) < 0)
    ) {
      errors.push(`${field} must be a valid positive number`);
    }
  });

  // Purchase reference validation
  if (data.purchase_reference !== undefined && data.purchase_reference === "") {
    errors.push("Purchase reference cannot be empty if provided");
  }

  return errors;
};

/**
 * Helper function to prepare reservation data from checkout form
 */
export const prepareReservationData = (
  checkoutData: any, // You can type this more specifically based on your checkout form structure
  paymentData: {
    payment_method: "stripe" | "paypal";
    payment_token?: string;
    paypal_order_id?: string;
  },
): CreateReservationRequest => {
  const prepared = {
    user_id: checkoutData.userId || 1, // You'll need to get this from your auth state
    event_id: checkoutData.eventId,
    zone_id: checkoutData.zoneId,
    quantity: checkoutData.quantity,
    unit_price: checkoutData.unitPrice,
    subtotal: checkoutData.subtotal,
    taxes: checkoutData.taxes || 0,
    fees: checkoutData.fees || 0,
    discount: checkoutData.discount || 0,
    total_amount: checkoutData.totalAmount,
    payment_method: paymentData.payment_method,
    payment_token: paymentData.payment_token,
    paypal_order_id: paymentData.paypal_order_id,
    currency: checkoutData.currency || "usd",
    purchase_reference:
      checkoutData.purchaseReference || generatePurchaseReference(), // Include the generated reference with fallback
    passengers: checkoutData.passengers || [],
    purchase_status: "confirmed",
    payment_installments: checkoutData.paymentInstallments || 1,
    is_deposit_payment: checkoutData.isDepositPayment || false,
    transportation_option_id: checkoutData.transportationOptionId,
    transport_origin: checkoutData.transportOrigin,
    emergency_contact_name: checkoutData.emergencyContactName,
    emergency_contact_phone: checkoutData.emergencyContactPhone,
    includes_jersey: checkoutData.includesJersey || false,
    jersey_selections: checkoutData.jerseySelections || undefined,
    special_requests: checkoutData.specialRequests,
    promo_code: checkoutData.promoCode,
  };

  console.log(
    "Prepared reservation data - purchase_reference:",
    prepared.purchase_reference,
  );
  return prepared;
};

/**
 * Fetch user reservations/purchases
 */
export const fetchUserReservations = async (
  user_id: number,
): Promise<UserReservation[]> => {
  try {
    console.log("🔍 Fetching user reservations for user_id:", user_id);
    console.log("🌐 API Endpoint:", API_ENDPOINTS.FETCH_USER_RESERVATIONS);

    const response = await reservationApiClient.post(
      API_ENDPOINTS.FETCH_USER_RESERVATIONS,
      { user_id },
    );

    console.log("📦 API Response:", response.data);

    if (response.data.error) {
      console.error("❌ API returned error:", response.data.error);
      throw new Error(response.data.error);
    }

    console.log(
      "✅ Reservations fetched successfully:",
      response.data.length,
      "items",
    );
    return response.data as UserReservation[];
  } catch (error) {
    console.error("💥 Error fetching reservations:", error);
    if (axios.isAxiosError(error)) {
      console.error("🔍 Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
      });
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error(`HTTP ${error.response?.status}: ${error.message}`);
    }
    throw error;
  }
};

export default {
  createReservation,
  validateReservationData,
  prepareReservationData,
  fetchUserReservations,
};
