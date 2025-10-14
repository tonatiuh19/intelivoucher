import React, { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useStripeConfig } from "@/hooks/usePaymentKeys";
import { PAYMENT_STATIC_CONFIG } from "@/lib/paymentConfig";

// Note: stripePromise will be created dynamically in the component

interface StripePaymentFormProps {
  totalAmount: number;
  currency?: string;
  onPaymentStart?: () => void;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
  onPaymentMethodReady?: (processPayment: () => Promise<void>) => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({
  totalAmount,
  currency = "mxn",
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  onPaymentMethodReady,
}) => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [installments, setInstallments] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [cardSupportsInstallments, setCardSupportsInstallments] = useState<
    boolean | null
  >(null);
  const [isCheckingCard, setIsCheckingCard] = useState(false);

  // Check card installment eligibility
  const checkCardInstallmentEligibility = async (cardElement: any) => {
    if (!stripe || !cardElement) return false;

    setIsCheckingCard(true);

    try {
      // Create a temporary payment method to check installment eligibility
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError || !paymentMethod) {
        setIsCheckingCard(false);
        return false;
      }

      // In Mexico, most major credit cards support installments
      // You can enhance this by checking the card brand and BIN
      const cardBrand = paymentMethod.card?.brand;
      const supportedBrands = ["visa", "mastercard", "amex"];

      const supportsInstallments = supportedBrands.includes(cardBrand || "");

      // For a real implementation, you might want to call your backend
      // to verify installment eligibility with the card issuer

      setIsCheckingCard(false);
      return supportsInstallments;
    } catch (error) {
      console.error("Error checking card installment eligibility:", error);
      setIsCheckingCard(false);
      return false;
    }
  };

  // Check if installments are available based on amount AND card support
  const isInstallmentsAvailable =
    totalAmount >= PAYMENT_STATIC_CONFIG.stripe.installmentsOptions.minAmount &&
    cardSupportsInstallments === true;

  // Generate installment options (limited to 3 months maximum)
  const maxAllowedInstallments = 3;
  const installmentOptions = Array.from(
    {
      length: maxAllowedInstallments,
    },
    (_, i) => i + 1,
  ).filter((num) => {
    // Only show options where each installment is at least reasonable amount (50 MXN = 5000 cents per installment)
    const minInstallmentAmount = 5000; // 50 MXN in cents per installment
    return totalAmount / num >= minInstallmentAmount;
  });

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Notify parent component that payment processing has started
    if (onPaymentStart) {
      onPaymentStart();
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

      if (paymentMethodError) {
        setError(
          paymentMethodError.message || "Payment method creation failed",
        );
        setIsProcessing(false);
        return;
      }

      // In a real application, you would send the payment method ID and installment info
      // to your backend to create a payment intent with installments
      const paymentData = {
        payment_method: paymentMethod.id,
        amount: totalAmount,
        currency: currency.toLowerCase(),
        installments: installments > 1 ? installments : undefined,
        // For Mexico installments, you would also include:
        payment_method_options:
          installments > 1
            ? {
                card: {
                  installments: {
                    enabled: true,
                    plan: {
                      count: installments,
                      interval: "month",
                      type: "fixed_count",
                    },
                  },
                },
              }
            : undefined,
      };

      // This is where you would call your backend API
      console.log("Payment data to send to backend:", paymentData);

      // For demo/testing: return the payment method ID (not payment intent)
      // In production, you would create a payment intent on your backend and confirm it
      setTimeout(() => {
        onPaymentSuccess({
          id: paymentMethod.id, // Use the actual payment method ID
          amount: totalAmount,
          currency,
          installments,
          status: "succeeded",
        });
        setIsProcessing(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  // Expose the payment processing function to parent
  React.useEffect(() => {
    if (onPaymentMethodReady && stripe && elements) {
      onPaymentMethodReady(handleSubmit);
    }
  }, [stripe, elements, onPaymentMethodReady]);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffffff",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "system-ui, -apple-system, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-6">
      {/* Installments Selection */}
      {totalAmount >=
        PAYMENT_STATIC_CONFIG.stripe.installmentsOptions.minAmount && (
        <div className="space-y-2">
          <Label htmlFor="installments">
            {t("checkout.installments")}
            {isCheckingCard && (
              <span className="text-sm text-blue-500 ml-1 animate-pulse">
                ({t("checkout.checkingCardEligibility")})
              </span>
            )}
            {cardSupportsInstallments === true && (
              <span className="text-sm text-green-600 ml-1">
                ({t("checkout.installmentsAvailable")})
              </span>
            )}
            {cardSupportsInstallments === false && (
              <span className="text-sm text-amber-600 ml-1">
                ({t("checkout.installmentsNotAvailable")})
              </span>
            )}
          </Label>

          {isInstallmentsAvailable && installmentOptions.length > 1 ? (
            <Select
              value={installments.toString()}
              onValueChange={(value) => setInstallments(Number(value))}
            >
              <SelectTrigger className="w-full dark:bg-slate-700">
                <SelectValue placeholder={t("checkout.selectInstallments")} />
              </SelectTrigger>
              <SelectContent>
                {installmentOptions.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num === 1
                      ? t("checkout.payInFull")
                      : `${num} ${t("checkout.monthlyPayments")} - $${(totalAmount / num / 100).toFixed(2)} ${currency.toUpperCase()} ${t("checkout.perMonth")}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-400">
              {cardSupportsInstallments === false
                ? t("checkout.cardDoesNotSupportInstallments")
                : cardSupportsInstallments === null
                  ? t("checkout.enterCardDetailsForInstallments")
                  : t("checkout.installmentsNotAvailableForAmount")}
            </div>
          )}
        </div>
      )}

      {/* Card Details */}
      <div className="space-y-2">
        <Label htmlFor="card-element">{t("checkout.cardDetails")}</Label>
        <div className="relative">
          <div className="border rounded-lg p-3 dark:border-slate-600 dark:bg-slate-700">
            <CardElement
              id="card-element"
              options={cardElementOptions}
              onChange={async (event) => {
                if (event.error) {
                  setError(event.error.message);
                  setCardSupportsInstallments(null);
                } else {
                  setError(null);

                  // Check installment eligibility when card is complete
                  if (event.complete && event.value.postalCode !== undefined) {
                    const cardElement = elements?.getElement(CardElement);
                    if (cardElement) {
                      const supportsInstallments =
                        await checkCardInstallmentEligibility(cardElement);
                      setCardSupportsInstallments(supportsInstallments);

                      // Reset installments to 1 if card doesn't support installments
                      if (!supportsInstallments) {
                        setInstallments(1);
                      }
                    }
                  } else {
                    setCardSupportsInstallments(null);
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Summary */}
      {installments > 1 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100">
            {t("checkout.installmentSummary")}
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p>
              {installments} {t("checkout.monthlyPaymentsOf")}{" "}
              <strong>
                ${(totalAmount / installments / 100).toFixed(2)}{" "}
                {currency.toUpperCase()}
              </strong>
            </p>
            <p>
              {t("checkout.totalAmount")}:{" "}
              <strong>
                ${(totalAmount / 100).toFixed(2)} {currency.toUpperCase()}
              </strong>
            </p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center space-x-3">
        <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
        <div>
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">
            {t("checkout.securePayment")}
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            {t("checkout.stripeSecurityNote")}
          </p>
        </div>
      </div>

      {/* Submit Button - Only show if no parent callback is provided */}
      {!onPaymentMethodReady && (
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!stripe || !elements || isProcessing}
          className="w-full bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isProcessing
            ? t("checkout.processingPayment")
            : installments > 1
              ? `${t("checkout.payFirstInstallment")} ($${(totalAmount / installments / 100).toFixed(2)} ${currency.toUpperCase()})`
              : `${t("checkout.payNow")} ($${(totalAmount / 100).toFixed(2)} ${currency.toUpperCase()})`}
        </Button>
      )}
    </div>
  );
};

interface StripePaymentWrapperProps extends StripePaymentFormProps {}

export const StripePaymentComponent: React.FC<StripePaymentWrapperProps> = (
  props,
) => {
  const { publishableKey, isAvailable, isLoading, error } = useStripeConfig();

  // Create Stripe promise dynamically when key is available
  const stripePromise = useMemo(() => {
    if (publishableKey && isAvailable) {
      return loadStripe(publishableKey);
    }
    return null;
  }, [publishableKey, isAvailable]);

  // Show loading state while fetching keys
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">
            Loading payment configuration...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if keys failed to load
  if (error || !isAvailable || !stripePromise) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error ||
            "Stripe payment is currently unavailable. Please try again later or contact support."}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        locale: "es" as const, // Spanish locale for Mexico
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#3b82f6",
          },
        },
      }}
    >
      <StripePaymentForm {...props} />
    </Elements>
  );
};
