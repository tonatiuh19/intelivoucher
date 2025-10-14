import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard,
  Lock,
  User,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { paymentInfoSchema, Step3Values } from "@/lib/checkoutValidation";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { StripePaymentComponent } from "./StripePayment";
import { PayPalPaymentComponent } from "./PayPalPayment";
import { PaymentMethod } from "@/lib/paymentConfig";

interface Step3Props {
  initialValues: Step3Values;
  onNext: (values: Step3Values) => void;
  onBack: () => void;
  totalAmount?: number; // Total amount in cents
}

export const PaymentInfoStep: React.FC<Step3Props> = ({
  initialValues,
  onNext,
  onBack,
  totalAmount = 15000, // Default 150 MXN in cents
}) => {
  const { t } = useTranslation();
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaymentStart = () => {
    console.log("Payment processing started");
    setPaymentProcessing(true);
    setPaymentSuccess(false);
    setPaymentError(null);
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    console.log("Payment successful:", paymentResult);
    setPaymentProcessing(false);
    setPaymentSuccess(true);
    setPaymentError(null);

    // Pass the payment result to the next step
    setTimeout(() => {
      onNext({
        ...initialValues,
        paymentResult,
      });
    }, 1500); // Small delay to show success state
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    setPaymentProcessing(false);
    setPaymentSuccess(false);
    setPaymentError(error);
  };

  // If payment is successful, show success state
  if (paymentSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
              {t("checkout.paymentSuccessful")}
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mt-2">
              {t("checkout.processingOrder")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentInfoSchema}
      onSubmit={(values) => {
        // For traditional form submission (if needed)
        onNext(values);
      }}
      enableReinitialize={true}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-6 relative">
          {/* Payment Method Selection */}
          <PaymentMethodSelector
            selectedMethod={values.paymentMethod}
            onMethodChange={(method: PaymentMethod) => {
              setFieldValue("paymentMethod", method);
              setPaymentError(null); // Clear any previous errors
            }}
            totalAmount={totalAmount}
          />

          {/* Error Display */}
          {paymentError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          {/* Conditional Payment Form Rendering */}
          {values.paymentMethod === "stripe" && (
            <div className="space-y-6">
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  {t("checkout.creditCardPayment")}
                </h3>

                <StripePaymentComponent
                  totalAmount={totalAmount}
                  currency="mxn"
                  onPaymentStart={handlePaymentStart}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>

              {/* Fallback Traditional Card Form (if Stripe fails to load) */}
              <div className="hidden" id="fallback-card-form">
                <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-6">
                  <div>
                    <Label htmlFor="cardNumber">
                      {t("checkout.cardNumber")}
                    </Label>
                    <Field name="cardNumber">
                      {({ field, meta }) => (
                        <div className="relative mt-1">
                          <CreditCard className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                          <Input
                            id="cardNumber"
                            {...field}
                            placeholder="1234 5678 9012 3456"
                            className={`pl-10 dark:bg-slate-700 dark:text-white ${
                              meta.touched && meta.error ? "border-red-500" : ""
                            }`}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              const formattedValue = value.replace(
                                /(\d{4})(?=\d)/g,
                                "$1 ",
                              );
                              setFieldValue("cardNumber", formattedValue);
                            }}
                          />
                          <ErrorMessage
                            name="cardNumber"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      )}
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">{t("checkout.expiryDate")}</Label>
                      <Field name="expiry">
                        {({ field, meta }) => (
                          <div>
                            <Input
                              id="expiry"
                              {...field}
                              placeholder="MM/YY"
                              className={`mt-1 dark:bg-slate-700 dark:text-white ${
                                meta.touched && meta.error
                                  ? "border-red-500"
                                  : ""
                              }`}
                              onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length >= 2) {
                                  value =
                                    value.substring(0, 2) +
                                    "/" +
                                    value.substring(2, 4);
                                }
                                setFieldValue("expiry", value);
                              }}
                              maxLength={5}
                            />
                            <ErrorMessage
                              name="expiry"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                    <div>
                      <Label htmlFor="cvv">{t("checkout.cvv")}</Label>
                      <Field name="cvv">
                        {({ field, meta }) => (
                          <div>
                            <Input
                              id="cvv"
                              {...field}
                              placeholder="123"
                              type="password"
                              maxLength={4}
                              className={`mt-1 dark:bg-slate-700 dark:text-white ${
                                meta.touched && meta.error
                                  ? "border-red-500"
                                  : ""
                              }`}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setFieldValue("cvv", value);
                              }}
                            />
                            <ErrorMessage
                              name="cvv"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName">{t("checkout.nameOnCard")}</Label>
                    <Field name="cardName">
                      {({ field, meta }) => (
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                          <Input
                            id="cardName"
                            {...field}
                            placeholder="John Doe"
                            className={`pl-10 dark:bg-slate-700 dark:text-white ${
                              meta.touched && meta.error ? "border-red-500" : ""
                            }`}
                          />
                          <ErrorMessage
                            name="cardName"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          )}

          {values.paymentMethod === "paypal" && (
            <div className="space-y-6">
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.408-.33c-.862-.55-2.301-.718-4.32-.718h-2.35c-.537 0-.993.4-1.081.94l-.814 5.15c-.056.35.213.65.567.65h1.597c2.699 0 4.906-.543 6.265-4.215.619-1.674.608-2.738.544-1.477z" />
                  </svg>
                  {t("checkout.paypalPayment")}
                </h3>

                <PayPalPaymentComponent
                  totalAmount={totalAmount}
                  currency="MXN"
                  onPaymentStart={handlePaymentStart}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={paymentProcessing}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.previous")}
            </Button>

            {/* Only show traditional submit button for fallback scenarios */}
            <div className="hidden" id="traditional-submit">
              <Button
                type="submit"
                disabled={paymentProcessing}
                className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("checkout.processingPayment")}
                  </>
                ) : (
                  t("checkout.completePurchaseButton")
                )}
              </Button>
            </div>
          </div>

          {/* Payment Processing Overlay */}
          {paymentProcessing && !paymentSuccess && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto"></div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {t("checkout.processingPayment")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {t(
                      "checkout.paymentProcessingMessage",
                      "Please wait while we process your payment...",
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};
