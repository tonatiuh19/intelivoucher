import { useEffect } from "react";
import { usePaymentKeys } from "./usePaymentKeys";

/**
 * Component to initialize payment keys on app startup
 * This component doesn't render anything but ensures payment keys are fetched early
 */
export const PaymentKeysInitializer: React.FC = () => {
  const { fetchPaymentKeys, paymentKeysData, error } = usePaymentKeys(true);

  // Log initialization status for debugging
  useEffect(() => {
    if (paymentKeysData) {
      console.log("Payment keys loaded successfully");
    }
    if (error) {
      console.warn("Failed to load payment keys:", error);
    }
  }, [paymentKeysData, error]);

  return null; // This component doesn't render anything
};

/**
 * Hook to ensure payment keys are initialized
 * Can be used in components that need payment configuration
 *
 * @returns Object with initialization status and methods
 */
export const usePaymentKeysInit = () => {
  const paymentKeys = usePaymentKeys(true);

  return {
    ...paymentKeys,
    isInitialized: paymentKeys.isReady || Boolean(paymentKeys.error),
  };
};
