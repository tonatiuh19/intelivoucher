import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Smartphone, ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { customerInfoSchema, Step2Values } from "@/lib/checkoutValidation";

interface Step2Props {
  initialValues: Step2Values;
  onNext: (values: Step2Values) => void;
  onBack: () => void;
}

export const CustomerInfoStep: React.FC<Step2Props> = ({
  initialValues,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={customerInfoSchema}
      onSubmit={(values) => {
        onNext(values);
      }}
      enableReinitialize={true}
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t("checkout.firstName")}</Label>
              <Field name="firstName">
                {({ field, meta }) => (
                  <div>
                    <Input
                      id="firstName"
                      {...field}
                      placeholder="John"
                      className={`mt-1 dark:bg-slate-700 dark:text-white ${
                        meta.touched && meta.error ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}
              </Field>
            </div>
            <div>
              <Label htmlFor="lastName">{t("checkout.lastName")}</Label>
              <Field name="lastName">
                {({ field, meta }) => (
                  <div>
                    <Input
                      id="lastName"
                      {...field}
                      placeholder="Doe"
                      className={`mt-1 dark:bg-slate-700 dark:text-white ${
                        meta.touched && meta.error ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}
              </Field>
            </div>
          </div>

          <div>
            <Label htmlFor="email">{t("checkout.email")}</Label>
            <Field name="email">
              {({ field, meta }) => (
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    placeholder="john.doe@example.com"
                    className={`pl-10 dark:bg-slate-700 dark:text-white ${
                      meta.touched && meta.error ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </Field>
          </div>

          <div>
            <Label htmlFor="phone">{t("checkout.phone")}</Label>
            <Field name="phone">
              {({ field, meta }) => (
                <div className="relative mt-1">
                  <Smartphone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    {...field}
                    placeholder="+1 (555) 123-4567"
                    className={`pl-10 dark:bg-slate-700 dark:text-white ${
                      meta.touched && meta.error ? "border-red-500" : ""
                    }`}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              )}
            </Field>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              {t("checkout.ticketsMobileNotice")}
            </p>
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
              {t("common.continue")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
