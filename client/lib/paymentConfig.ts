import type { PaymentKeysData } from "./paymentKeysApi";

// Static configuration (non-key related settings)
export const PAYMENT_STATIC_CONFIG = {
  stripe: {
    options: {
      locale: "es" as const, // Spanish locale for Mexico
    },
    // Mexico installments configuration
    installmentsOptions: {
      enabled: true,
      maxInstallments: 12, // Maximum number of installments
      minAmount: 30000, // Minimum amount in cents (300 MXN)
    },
  },
  paypal: {
    currency: "MXN", // Mexican Peso
    intent: "capture" as const,
    options: {
      locale: "es_MX",
      components: "buttons,funding-eligibility",
    },
  },
} as const;

/**
 * Create payment configuration with keys from the store
 * @param paymentKeys - Payment keys from the Redux store
 * @returns Complete payment configuration with keys
 */
export const createPaymentConfig = (paymentKeys: PaymentKeysData | null) => {
  // Fallback to environment variables if store keys are not available
  const stripeKey = paymentKeys?.stripe?.publishableKey;

  const paypalClientId = paymentKeys?.paypal?.clientId;

  return {
    stripe: {
      publishableKey: stripeKey,
      ...PAYMENT_STATIC_CONFIG.stripe,
    },
    paypal: {
      clientId: paypalClientId,
      ...PAYMENT_STATIC_CONFIG.paypal,
    },
  };
};

export type PaymentMethod = "stripe" | "paypal";

/**
 * Get payment methods configuration with i18n support
 * @param t - Translation function from react-i18next
 * @returns Payment methods configuration with translated strings
 */
export const getPaymentMethods = (t: any) => ({
  stripe: {
    id: "stripe" as const,
    name: t("checkout.creditCardPayment", "Credit/Debit Card"),
    icon: "credit-card" as const,
    description: t(
      "checkout.creditCardDescription",
      "Pay with your credit or debit card",
    ),
    installmentsAvailable: true,
  },
  paypal: {
    id: "paypal" as const,
    name: t("checkout.paypalPayment", "PayPal"),
    icon: "paypal" as const,
    description: t(
      "checkout.paypalDescription",
      "Pay with your PayPal account",
    ),
    installmentsAvailable: false,
  },
});

// Legacy export for backward compatibility - use getPaymentMethods() instead
export const PAYMENT_METHODS = {
  stripe: {
    id: "stripe",
    name: "Credit/Debit Card",
    icon: "credit-card",
    description: "Pay with your credit or debit card",
    installmentsAvailable: true,
  },
  paypal: {
    id: "paypal",
    name: "PayPal",
    icon: "paypal",
    description: "Pay with your PayPal account",
    installmentsAvailable: false,
  },
} as const;
