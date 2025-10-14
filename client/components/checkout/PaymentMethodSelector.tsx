import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreditCard, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PaymentMethod, getPaymentMethods } from "@/lib/paymentConfig";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  totalAmount: number;
  className?: string;
}

// PayPal SVG Icon Component
const PayPalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.408-.33c-.862-.55-2.301-.718-4.32-.718h-2.35c-.537 0-.993.4-1.081.94l-.814 5.15c-.056.35.213.65.567.65h1.597c2.699 0 4.906-.543 6.265-4.215.619-1.674.608-2.738.544-1.477z" />
  </svg>
);

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  totalAmount,
  className = "",
}) => {
  const { t } = useTranslation();

  // Get payment methods with i18n support
  const paymentMethods = getPaymentMethods(t);

  // Check if installments are available for Stripe (minimum amount requirement)
  const isInstallmentsAvailable = totalAmount >= 30000; // 300 MXN in cents

  return (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-base font-semibold">
        {t("checkout.selectPaymentMethod")}
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stripe Payment Method */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedMethod === "stripe"
              ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
          onClick={() => onMethodChange("stripe")}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div
                className={`rounded-full p-2 ${
                  selectedMethod === "stripe"
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {paymentMethods.stripe.name}
                  </h3>
                  <input
                    type="radio"
                    checked={selectedMethod === "stripe"}
                    onChange={() => onMethodChange("stripe")}
                    className="text-blue-600"
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {paymentMethods.stripe.description}
                </p>

                {/* Installments Badge */}
                {isInstallmentsAvailable && (
                  <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                    <Shield className="w-3 h-3 mr-1" />
                    {t("checkout.installmentsAvailableBadge")} (1-3{" "}
                    {t("checkout.months")})
                  </div>
                )}

                {/* Accepted Cards */}
                <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {t("checkout.acceptedCards")} Visa, MasterCard, American
                    Express
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PayPal Payment Method */}
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedMethod === "paypal"
              ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 dark:bg-blue-950/30"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }`}
          onClick={() => onMethodChange("paypal")}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div
                className={`rounded-full p-2 ${
                  selectedMethod === "paypal"
                    ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <PayPalIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    {paymentMethods.paypal.name}
                  </h3>
                  <input
                    type="radio"
                    checked={selectedMethod === "paypal"}
                    onChange={() => onMethodChange("paypal")}
                    className="text-blue-600"
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {paymentMethods.paypal.description}
                </p>

                {/* PayPal Features */}
                <div className="mt-2 space-y-1">
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    <Shield className="w-3 h-3 mr-1" />
                    {t("checkout.buyerProtection")}
                  </div>
                </div>

                {/* PayPal Info */}
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{t("checkout.paypalInfo")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-center space-x-2">
        <Shield className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {t("checkout.securityNotice")}
        </p>
      </div>
    </div>
  );
};
