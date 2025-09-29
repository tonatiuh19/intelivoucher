import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, User, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { paymentInfoSchema, Step3Values } from "@/lib/checkoutValidation";

interface Step3Props {
  initialValues: Step3Values;
  onNext: (values: Step3Values) => void;
  onBack: () => void;
}

export const PaymentInfoStep: React.FC<Step3Props> = ({
  initialValues,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={paymentInfoSchema}
      onSubmit={(values) => {
        onNext(values);
      }}
      enableReinitialize={true}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          <div>
            <Label htmlFor="cardNumber">{t("checkout.cardNumber")}</Label>
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
                      // Format card number with spaces
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
                        meta.touched && meta.error ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        // Format expiry date MM/YY
                        let value = e.target.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value =
                            value.substring(0, 2) + "/" + value.substring(2, 4);
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
                        meta.touched && meta.error ? "border-red-500" : ""
                      }`}
                      onChange={(e) => {
                        // Only allow numbers
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

          <div className="bg-green-50 rounded-lg p-4 flex items-center space-x-3">
            <Lock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                {t("checkout.securePayment")}
              </p>
              <p className="text-xs text-green-700">
                {t("checkout.paymentSecurityNote")}
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.previous")}
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-cyan hover:to-brand-blue"
            >
              {t("checkout.completePurchaseButton")}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
