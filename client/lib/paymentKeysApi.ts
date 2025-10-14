import { API_ENDPOINTS } from "./apiConfig";

// Types for the payment keys API response
export interface PaymentKeyResponse {
  key_string: string;
  key_test: string;
  title: "stripe" | "paypal";
}

export interface PaymentKeysData {
  stripe?: {
    publishableKey: string;
    keyTest: string;
  };
  paypal?: {
    clientId: string;
    keyTest: string;
  };
}

/**
 * Fetch payment keys from the API
 * @returns Promise<PaymentKeysData> Payment keys organized by provider
 */
export const fetchPaymentKeys = async (): Promise<PaymentKeysData> => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_INFO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const keys: PaymentKeyResponse[] = await response.json();

    // Check if response contains error
    if ("error" in keys) {
      throw new Error("API returned an error");
    }

    // Transform the array response into organized object
    const paymentKeys: PaymentKeysData = {};

    keys.forEach((key) => {
      if (key.title === "stripe") {
        paymentKeys.stripe = {
          publishableKey: key.key_string,
          keyTest: key.key_test,
        };
      } else if (key.title === "paypal") {
        paymentKeys.paypal = {
          clientId: key.key_string,
          keyTest: key.key_test,
        };
      }
    });

    return paymentKeys;
  } catch (error) {
    console.error("Error fetching payment keys:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch payment keys",
    );
  }
};
