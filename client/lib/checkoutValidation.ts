import * as yup from "yup";
import { ValidationMessages } from "./validationMessages";

// Validation schema for Step 1: Ticket Selection
export const ticketSelectionSchema = yup.object().shape({
  ticketQuantity: yup
    .number()
    .min(1, ValidationMessages.ticketQuantity.min)
    .max(8, ValidationMessages.ticketQuantity.max)
    .required(ValidationMessages.ticketQuantity.required),
  selectedZone: yup.string().required(ValidationMessages.zone.required),
  transportationMode: yup
    .string()
    .required(ValidationMessages.transportationMode.required),
  transportOrigin: yup.string().when("transportationMode", {
    is: (value: string) => value !== "none",
    then: (schema) =>
      schema.required(ValidationMessages.transportOrigin.required),
    otherwise: (schema) => schema.notRequired(),
  }),
  vanSeats: yup.array().of(yup.string()).notRequired(), // Disabled for dynamic transportation options
  jerseySelected: yup.array().of(yup.boolean()).notRequired(),
  jerseyPersonalized: yup.array().of(yup.boolean()).notRequired(),
  jerseyNames: yup
    .array()
    .of(yup.string())
    .test(
      "jersey-names-required",
      ValidationMessages.jersey.namesRequired,
      function (value) {
        const { jerseySelected, jerseyPersonalized } = this.parent;
        if (!jerseySelected || !jerseyPersonalized || !value) return true;

        for (let i = 0; i < jerseySelected.length; i++) {
          if (
            jerseySelected[i] &&
            jerseyPersonalized[i] &&
            (!value[i] || value[i].trim() === "")
          ) {
            return false;
          }
        }
        return true;
      },
    ),
  jerseyNumbers: yup
    .array()
    .of(yup.string())
    .test(
      "jersey-numbers-required",
      ValidationMessages.jersey.numbersRequired,
      function (value) {
        const { jerseySelected, jerseyPersonalized } = this.parent;
        if (!jerseySelected || !jerseyPersonalized || !value) return true;

        for (let i = 0; i < jerseySelected.length; i++) {
          if (
            jerseySelected[i] &&
            jerseyPersonalized[i] &&
            (!value[i] || value[i].trim() === "")
          ) {
            return false;
          }
        }
        return true;
      },
    ),
  jerseySizes: yup
    .array()
    .of(yup.string())
    .test(
      "jersey-sizes-required",
      ValidationMessages.jersey.sizesRequired,
      function (value) {
        const { jerseySelected } = this.parent;
        if (!jerseySelected || !value) return true;

        for (let i = 0; i < jerseySelected.length; i++) {
          if (jerseySelected[i] && (!value[i] || value[i].trim() === "")) {
            return false;
          }
        }
        return true;
      },
    ),
  jerseyTypes: yup
    .array()
    .of(yup.string().oneOf(["local", "away"]))
    .test(
      "jersey-types-required",
      ValidationMessages.jersey.typesRequired,
      function (value) {
        const { jerseySelected } = this.parent;
        if (!jerseySelected || !value) return true;

        for (let i = 0; i < jerseySelected.length; i++) {
          if (jerseySelected[i] && (!value[i] || value[i].trim() === "")) {
            return false;
          }
        }
        return true;
      },
    ),
});

// Validation schema for individual ticket holder
export const ticketHolderSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, ValidationMessages.firstName.min)
    .max(50, ValidationMessages.firstName.max)
    .matches(/^[a-zA-Z\s]*$/, ValidationMessages.firstName.matches)
    .required(ValidationMessages.firstName.required),
  lastName: yup
    .string()
    .trim()
    .min(2, ValidationMessages.lastName.min)
    .max(50, ValidationMessages.lastName.max)
    .matches(/^[a-zA-Z\s]*$/, ValidationMessages.lastName.matches)
    .required(ValidationMessages.lastName.required),
  email: yup
    .string()
    .email(ValidationMessages.email.format)
    .required(ValidationMessages.email.required),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, ValidationMessages.phone.format)
    .required(ValidationMessages.phone.required),
  dateOfBirth: yup
    .date()
    .max(new Date(), ValidationMessages.dateOfBirth.max)
    .required(ValidationMessages.dateOfBirth.required),
  idNumber: yup
    .string()
    .trim()
    .min(5, ValidationMessages.idNumber.min)
    .max(20, ValidationMessages.idNumber.max)
    .required(ValidationMessages.idNumber.required),
});

// Validation schema for Step 2: Customer Information (Primary contact)
export const customerInfoSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, ValidationMessages.firstName.min)
    .max(50, ValidationMessages.firstName.max)
    .matches(/^[a-zA-Z\s]*$/, ValidationMessages.firstName.matches)
    .required(ValidationMessages.firstName.required),
  lastName: yup
    .string()
    .trim()
    .min(2, ValidationMessages.lastName.min)
    .max(50, ValidationMessages.lastName.max)
    .matches(/^[a-zA-Z\s]*$/, ValidationMessages.lastName.matches)
    .required(ValidationMessages.lastName.required),
  email: yup
    .string()
    .email(ValidationMessages.email.format)
    .required(ValidationMessages.email.required),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, ValidationMessages.phone.format)
    .required(ValidationMessages.phone.required),
  specialInstructions: yup
    .string()
    .max(500, "Special instructions cannot exceed 500 characters")
    .notRequired(),
  emergencyContactName: yup
    .string()
    .trim()
    .min(2, "Emergency contact name must be at least 2 characters")
    .max(100, "Emergency contact name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z\s]*$/,
      "Emergency contact name must contain only letters and spaces",
    )
    .notRequired(),
  emergencyContactPhone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .notRequired(),
});

// Modified validation schema for Step 2.5: Individual Ticket Information
export const ticketHoldersInfoSchema = yup.object().shape({
  ticketHolders: yup
    .array()
    .of(
      yup.object().shape({
        firstName: yup
          .string()
          .trim()
          .min(2, ValidationMessages.firstName.min)
          .max(50, ValidationMessages.firstName.max)
          .matches(/^[a-zA-Z\s]*$/, ValidationMessages.firstName.matches)
          .required(ValidationMessages.firstName.required),
        lastName: yup
          .string()
          .trim()
          .min(2, ValidationMessages.lastName.min)
          .max(50, ValidationMessages.lastName.max)
          .matches(/^[a-zA-Z\s]*$/, ValidationMessages.lastName.matches)
          .required(ValidationMessages.lastName.required),
        // Email, phone, dateOfBirth, and idNumber are only required for the primary contact (first ticket holder)
        email: yup
          .string()
          .email(ValidationMessages.email.format)
          .test(
            "primary-required",
            ValidationMessages.email.required,
            function (value) {
              const { parent, path } = this;
              const ticketHolderIndex = parseInt(
                path.split("[")[1]?.split("]")[0] || "0",
              );
              if (ticketHolderIndex === 0) {
                return !!value; // Required for primary contact
              }
              return true; // Not required for additional passengers
            },
          ),
        phone: yup
          .string()
          .matches(/^[\+]?[1-9][\d]{0,15}$/, ValidationMessages.phone.format)
          .test(
            "primary-required",
            ValidationMessages.phone.required,
            function (value) {
              const { parent, path } = this;
              const ticketHolderIndex = parseInt(
                path.split("[")[1]?.split("]")[0] || "0",
              );
              if (ticketHolderIndex === 0) {
                return !!value; // Required for primary contact
              }
              return true; // Not required for additional passengers
            },
          ),
        dateOfBirth: yup
          .date()
          .max(new Date(), ValidationMessages.dateOfBirth.max)
          .test(
            "primary-required",
            ValidationMessages.dateOfBirth.required,
            function (value) {
              const { parent, path } = this;
              const ticketHolderIndex = parseInt(
                path.split("[")[1]?.split("]")[0] || "0",
              );
              if (ticketHolderIndex === 0) {
                return !!value; // Required for primary contact
              }
              return true; // Not required for additional passengers
            },
          ),
        idNumber: yup
          .string()
          .trim()
          .min(5, ValidationMessages.idNumber.min)
          .max(20, ValidationMessages.idNumber.max)
          .test(
            "primary-required",
            ValidationMessages.idNumber.required,
            function (value) {
              const { parent, path } = this;
              const ticketHolderIndex = parseInt(
                path.split("[")[1]?.split("]")[0] || "0",
              );
              if (ticketHolderIndex === 0) {
                return !!value; // Required for primary contact
              }
              return true; // Not required for additional passengers
            },
          ),
      }),
    )
    .min(1, ValidationMessages.ticketHolders.min)
    .required(ValidationMessages.ticketHolders.required),
});

// Validation schema for Step 3: Payment Information
export const paymentInfoSchema = yup.object().shape({
  paymentMethod: yup
    .string()
    .oneOf(["stripe", "paypal"], ValidationMessages.paymentMethod.oneOf)
    .required(ValidationMessages.paymentMethod.required),
  installments: yup
    .number()
    .min(1, ValidationMessages.installments.min)
    .max(12, ValidationMessages.installments.max)
    .when("paymentMethod", {
      is: "stripe",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),
  // Stripe-specific fields (conditional validation)
  cardNumber: yup.string().when("paymentMethod", {
    is: "stripe",
    then: (schema) =>
      schema
        .matches(/^[\d\s]{13,19}$/, ValidationMessages.cardNumber.format)
        .test(
          "luhn-check",
          ValidationMessages.cardNumber.luhn,
          function (value) {
            if (!value) return false;

            // Remove spaces and non-digits
            const digits = value.replace(/\D/g, "");

            // Luhn algorithm validation
            let sum = 0;
            let isEven = false;

            for (let i = digits.length - 1; i >= 0; i--) {
              let digit = parseInt(digits[i]);

              if (isEven) {
                digit *= 2;
                if (digit > 9) {
                  digit -= 9;
                }
              }

              sum += digit;
              isEven = !isEven;
            }

            return sum % 10 === 0;
          },
        )
        .required(ValidationMessages.cardNumber.required),
    otherwise: (schema) => schema.notRequired(),
  }),
  expiry: yup.string().when("paymentMethod", {
    is: "stripe",
    then: (schema) =>
      schema
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, ValidationMessages.expiry.format)
        .test(
          "expiry-date",
          ValidationMessages.expiry.expired,
          function (value) {
            if (!value) return false;

            const [month, year] = value.split("/");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            const expYear = parseInt(year);
            const expMonth = parseInt(month);

            if (expYear < currentYear) return false;
            if (expYear === currentYear && expMonth < currentMonth)
              return false;

            return true;
          },
        )
        .required(ValidationMessages.expiry.required),
    otherwise: (schema) => schema.notRequired(),
  }),
  cvv: yup.string().when("paymentMethod", {
    is: "stripe",
    then: (schema) =>
      schema
        .matches(/^\d{3,4}$/, ValidationMessages.cvv.format)
        .required(ValidationMessages.cvv.required),
    otherwise: (schema) => schema.notRequired(),
  }),
  cardName: yup.string().when("paymentMethod", {
    is: "stripe",
    then: (schema) =>
      schema
        .trim()
        .min(2, ValidationMessages.cardName.min)
        .max(50, ValidationMessages.cardName.max)
        .matches(/^[a-zA-Z\s]*$/, ValidationMessages.cardName.matches)
        .required(ValidationMessages.cardName.required),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Combined schema for all steps
export const checkoutSchema = yup.object().shape({
  step1: ticketSelectionSchema,
  step2: customerInfoSchema,
  step2_5: ticketHoldersInfoSchema,
  step3: paymentInfoSchema,
});

// Initial ticket holder values
export const initialTicketHolder = {
  firstName: "Test",
  lastName: "User",
  email: "test.user@example.com",
  phone: "+1234567892",
  dateOfBirth: "1995-03-10" as string,
  idNumber: "C99887766",
};

// Initial form values
export const initialCheckoutValues = {
  step1: {
    ticketQuantity: 2,
    selectedZone: "",
    transportationMode: "none" as string,
    transportOrigin: "",
    vanSeats: [] as string[],
    jerseySelected: [] as boolean[],
    jerseyPersonalized: [] as boolean[],
    jerseyNames: [] as string[],
    jerseyNumbers: [] as string[],
    jerseySizes: [] as string[],
    jerseyTypes: [] as string[],
  },
  /*Test data for development purposes */
  step2: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    specialInstructions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  },
  step2_5: {
    ticketHolders: [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        dateOfBirth: "1990-05-15",
        idNumber: "A12345678",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+1234567891",
        dateOfBirth: "1992-08-22",
        idNumber: "B87654321",
      },
    ] as TicketHolder[],
  },
  /* End test data */
  /*
  step2: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  step2_5: {
    ticketHolders: [] as TicketHolder[],
  },
  */
  step3: {
    paymentMethod: "stripe" as "stripe" | "paypal",
    installments: 1,
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
    paymentResult: null as any,
  },
};

// Type definitions for form values
export type TicketHolder = typeof initialTicketHolder;
export type CheckoutFormValues = typeof initialCheckoutValues;
export type Step1Values = CheckoutFormValues["step1"];
export type Step2Values = CheckoutFormValues["step2"];
export type Step2_5Values = CheckoutFormValues["step2_5"];
export type Step3Values = CheckoutFormValues["step3"];
