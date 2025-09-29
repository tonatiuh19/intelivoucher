import React from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Smartphone,
  User,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  ticketHoldersInfoSchema,
  Step2_5Values,
  TicketHolder,
  initialTicketHolder,
} from "@/lib/checkoutValidation";

interface TicketHoldersInfoStepProps {
  initialValues: Step2_5Values;
  ticketQuantity: number;
  primaryContact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onNext: (values: Step2_5Values) => void;
  onBack: () => void;
}

export const TicketHoldersInfoStep: React.FC<TicketHoldersInfoStepProps> = ({
  initialValues,
  ticketQuantity,
  primaryContact,
  onNext,
  onBack,
}) => {
  const { t } = useTranslation();

  // Initialize ticket holders if empty or quantity changed
  const getInitialTicketHolders = (): TicketHolder[] => {
    const holders = [...initialValues.ticketHolders];

    // If first ticket holder is empty, fill with primary contact info
    if (holders.length === 0 || !holders[0]?.firstName) {
      holders[0] = {
        ...initialTicketHolder,
        firstName: primaryContact.firstName,
        lastName: primaryContact.lastName,
        email: primaryContact.email,
        phone: primaryContact.phone,
      };
    }

    // Ensure we have the right number of holders
    while (holders.length < ticketQuantity) {
      holders.push({ ...initialTicketHolder });
    }

    // Remove excess holders
    return holders.slice(0, ticketQuantity);
  };

  const formInitialValues: Step2_5Values = {
    ticketHolders: getInitialTicketHolders(),
  };

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={ticketHoldersInfoSchema}
      onSubmit={(values) => {
        onNext(values);
      }}
      enableReinitialize={true}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form className="space-y-6">
          <div className="mb-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t("checkout.ticketHoldersInfo.description")}
            </p>
          </div>

          <FieldArray name="ticketHolders">
            {() => (
              <div className="space-y-6">
                {values.ticketHolders.map((holder, index) => (
                  <Card
                    key={index}
                    className="border border-slate-200 dark:border-slate-700"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>
                            {index === 0
                              ? t("checkout.ticketHoldersInfo.primaryHolder")
                              : t("checkout.ticketHoldersInfo.ticketHolder", {
                                  number: index + 1,
                                })}
                          </span>
                        </CardTitle>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {t("checkout.ticketHoldersInfo.primaryContact")}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Name Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketHolders.${index}.firstName`}>
                            {t("checkout.firstName")} *
                          </Label>
                          <Field name={`ticketHolders.${index}.firstName`}>
                            {({ field, meta }) => (
                              <div>
                                <Input
                                  id={`ticketHolders.${index}.firstName`}
                                  {...field}
                                  placeholder="John"
                                  className={`mt-1 dark:bg-slate-700 dark:text-white ${
                                    meta.touched && meta.error
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  disabled={index === 0} // Primary contact info is read-only
                                />
                                <ErrorMessage
                                  name={`ticketHolders.${index}.firstName`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div>
                          <Label htmlFor={`ticketHolders.${index}.lastName`}>
                            {t("checkout.lastName")} *
                          </Label>
                          <Field name={`ticketHolders.${index}.lastName`}>
                            {({ field, meta }) => (
                              <div>
                                <Input
                                  id={`ticketHolders.${index}.lastName`}
                                  {...field}
                                  placeholder="Doe"
                                  className={`mt-1 dark:bg-slate-700 dark:text-white ${
                                    meta.touched && meta.error
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  disabled={index === 0}
                                />
                                <ErrorMessage
                                  name={`ticketHolders.${index}.lastName`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketHolders.${index}.email`}>
                            {t("checkout.email")} *
                          </Label>
                          <Field name={`ticketHolders.${index}.email`}>
                            {({ field, meta }) => (
                              <div className="relative mt-1">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                  id={`ticketHolders.${index}.email`}
                                  type="email"
                                  {...field}
                                  placeholder="john.doe@example.com"
                                  className={`pl-10 dark:bg-slate-700 dark:text-white ${
                                    meta.touched && meta.error
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  disabled={index === 0}
                                />
                                <ErrorMessage
                                  name={`ticketHolders.${index}.email`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                        <div>
                          <Label htmlFor={`ticketHolders.${index}.phone`}>
                            {t("checkout.phone")} *
                          </Label>
                          <Field name={`ticketHolders.${index}.phone`}>
                            {({ field, meta }) => (
                              <div className="relative mt-1">
                                <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                  id={`ticketHolders.${index}.phone`}
                                  type="tel"
                                  {...field}
                                  placeholder="+1 (555) 123-4567"
                                  className={`pl-10 dark:bg-slate-700 dark:text-white ${
                                    meta.touched && meta.error
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                  disabled={index === 0}
                                />
                                <ErrorMessage
                                  name={`ticketHolders.${index}.phone`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                      </div>

                      {/* Date of Birth and ID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketHolders.${index}.dateOfBirth`}>
                            {t("checkout.ticketHoldersInfo.dateOfBirth")} *
                          </Label>
                          <Field name={`ticketHolders.${index}.dateOfBirth`}>
                            {({ field, meta }) => (
                              <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                  id={`ticketHolders.${index}.dateOfBirth`}
                                  type="date"
                                  {...field}
                                  className={`pl-10 dark:bg-slate-700 dark:text-white ${
                                    meta.touched && meta.error
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name={`ticketHolders.${index}.dateOfBirth`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                                {field.value && (
                                  <div className="text-xs text-slate-500 mt-1">
                                    {t("checkout.ticketHoldersInfo.age")}:{" "}
                                    {calculateAge(field.value)}{" "}
                                    {t("checkout.ticketHoldersInfo.yearsOld")}
                                  </div>
                                )}
                              </div>
                            )}
                          </Field>
                        </div>
                        <div>
                          <Label htmlFor={`ticketHolders.${index}.idNumber`}>
                            {t("checkout.ticketHoldersInfo.idNumber")} *
                          </Label>
                          <Field name={`ticketHolders.${index}.idNumber`}>
                            {({ field, meta }) => (
                              <div className="relative mt-1">
                                <CreditCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                  id={`ticketHolders.${index}.idNumber`}
                                  {...field}
                                  placeholder="ID/Passport Number"
                                  className={`pl-10 dark:bg-slate-700 dark:text-white ${
                                    meta.touched && meta.error
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                                <ErrorMessage
                                  name={`ticketHolders.${index}.idNumber`}
                                  component="div"
                                  className="text-red-500 text-sm mt-1"
                                />
                              </div>
                            )}
                          </Field>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </FieldArray>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t("checkout.ticketHoldersInfo.importantNote")}
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
