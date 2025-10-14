import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadPaymentKeys } from "@/store/slices/paymentKeysSlice";
import {
  selectPaymentKeysData,
  selectPaymentKeysLoading,
  selectPaymentKeysError,
  selectShouldRefreshPaymentKeys,
  selectStripePublishableKey,
  selectPayPalClientId,
} from "@/store/selectors";

/**
 * Custom hook to manage payment keys
 * Automatically fetches payment keys when component mounts or when they need refreshing
 *
 * @param autoFetch - Whether to automatically fetch keys on mount (default: true)
 * @returns Object containing payment keys data, loading state, error, and manual fetch function
 */
export const usePaymentKeys = (autoFetch: boolean = true) => {
  const dispatch = useAppDispatch();

  // Selectors
  const paymentKeysData = useAppSelector(selectPaymentKeysData);
  const isLoading = useAppSelector(selectPaymentKeysLoading);
  const error = useAppSelector(selectPaymentKeysError);
  const shouldRefresh = useAppSelector(selectShouldRefreshPaymentKeys);
  const stripePublishableKey = useAppSelector(selectStripePublishableKey);
  const paypalClientId = useAppSelector(selectPayPalClientId);

  // Fetch payment keys
  const fetchPaymentKeys = () => {
    dispatch(loadPaymentKeys());
  };

  // Auto-fetch effect
  useEffect(() => {
    if (autoFetch && shouldRefresh && !isLoading) {
      fetchPaymentKeys();
    }
  }, [autoFetch, shouldRefresh, isLoading, dispatch]);

  // Check if keys are ready for use
  const isReady = !isLoading && !error && paymentKeysData !== null;
  const hasStripeKey = Boolean(stripePublishableKey);
  const hasPayPalKey = Boolean(paypalClientId);

  return {
    // Data
    paymentKeysData,
    stripePublishableKey,
    paypalClientId,

    // States
    isLoading,
    error,
    isReady,
    hasStripeKey,
    hasPayPalKey,

    // Actions
    fetchPaymentKeys,
    refetch: fetchPaymentKeys, // Alias for easier use
  };
};

/**
 * Hook specifically for Stripe configuration
 */
export const useStripeConfig = () => {
  const {
    stripePublishableKey,
    hasStripeKey,
    isLoading,
    error,
    fetchPaymentKeys,
  } = usePaymentKeys();

  return {
    publishableKey: stripePublishableKey,
    isAvailable: hasStripeKey,
    isLoading,
    error,
    refetch: fetchPaymentKeys,
  };
};

/**
 * Hook specifically for PayPal configuration
 */
export const usePayPalConfig = () => {
  const { paypalClientId, hasPayPalKey, isLoading, error, fetchPaymentKeys } =
    usePaymentKeys();

  return {
    clientId: paypalClientId,
    isAvailable: hasPayPalKey,
    isLoading,
    error,
    refetch: fetchPaymentKeys,
  };
};

/**
 * Hook that provides complete payment configuration
 * Combines store keys with static configuration
 */
export const usePaymentConfiguration = () => {
  const { paymentKeysData, isLoading, error, fetchPaymentKeys, isReady } =
    usePaymentKeys();

  // Import the configuration creator
  const { createPaymentConfig } = require("@/lib/paymentConfig");

  // Create configuration with current keys
  const paymentConfig = createPaymentConfig(paymentKeysData);

  return {
    config: paymentConfig,
    isReady,
    isLoading,
    error,
    refetch: fetchPaymentKeys,
  };
};
