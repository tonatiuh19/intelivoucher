import React, { useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePayPalConfig } from "@/hooks/usePaymentKeys";
import { PAYMENT_STATIC_CONFIG } from "@/lib/paymentConfig";

interface PayPalPaymentFormProps {
  totalAmount: number;
  currency?: string;
  onPaymentStart?: () => void;
  onPaymentSuccess: (details: any) => void;
  onPaymentError: (error: string) => void;
}

const PayPalPaymentForm: React.FC<PayPalPaymentFormProps> = ({
  totalAmount,
  currency = "MXN",
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { t } = useTranslation();
  const [{ isResolved }] = usePayPalScriptReducer();
  const [error, setError] = useState<string | null>(null);

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: (totalAmount / 100).toFixed(2), // Convert cents to currency units
          },
          description: t("checkout.ticketPurchase"),
        },
      ],
      intent: "CAPTURE",
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      // Notify parent component that payment processing has started
      if (onPaymentStart) {
        onPaymentStart();
      }
      const details = await actions.order.capture();
      onPaymentSuccess({
        id: details.id,
        amount: totalAmount,
        currency,
        status: "completed",
        paymentMethod: "paypal",
        payerInfo: details.payer,
      });
    } catch (err: any) {
      const errorMessage =
        err.message || t("checkout.paypalError", "PayPal payment failed");
      setError(errorMessage);
      onPaymentError(errorMessage);
    }
  };

  const onError = (err: any) => {
    const errorMessage = err.message || t("checkout.paypalError");
    setError(errorMessage);
    onPaymentError(errorMessage);
  };

  const onCancel = (data: any) => {
    setError(t("checkout.paymentCancelled"));
  };

  if (!isResolved) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
          {t("checkout.loadingPaypal")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Payment Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
          {t("checkout.paymentSummary")}
        </h4>
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p>
            {t("checkout.totalAmount")}:{" "}
            <strong>
              ${(totalAmount / 100).toFixed(2)} {currency}
            </strong>
          </p>
          <p className="text-xs mt-1">{t("checkout.paypalNote")}</p>
        </div>
      </div>

      {/* PayPal Buttons */}
      <div className="space-y-4">
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "pay",
            height: 50,
          }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
          disabled={false}
        />
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center space-x-3">
        <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
        <div>
          <p className="text-sm font-semibold text-green-800 dark:text-green-200">
            {t("checkout.securePayment")}
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            {t("checkout.paypalSecurityNote")}
          </p>
        </div>
      </div>

      {/* PayPal Info */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p>{t("checkout.paypalAccepted")}</p>
        <p>{t("checkout.paypalRedirect")}</p>
      </div>
    </div>
  );
};

interface PayPalPaymentWrapperProps extends PayPalPaymentFormProps {}

export const PayPalPaymentComponent: React.FC<PayPalPaymentWrapperProps> = (
  props,
) => {
  const { clientId, isAvailable, isLoading, error } = usePayPalConfig();

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
  if (error || !isAvailable || !clientId) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error ||
            "PayPal payment is currently unavailable. Please try again later or contact support."}
        </AlertDescription>
      </Alert>
    );
  }

  const initialOptions = {
    clientId,
    currency: PAYMENT_STATIC_CONFIG.paypal.currency,
    intent: PAYMENT_STATIC_CONFIG.paypal.intent,
    locale: PAYMENT_STATIC_CONFIG.paypal.options.locale,
    components: PAYMENT_STATIC_CONFIG.paypal.options.components,
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalPaymentForm {...props} />
    </PayPalScriptProvider>
  );
};
