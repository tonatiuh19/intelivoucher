import * as yup from "yup";

// Validation schema for Step 1: Ticket Selection
export const ticketSelectionSchema = yup.object().shape({
  ticketQuantity: yup
    .number()
    .min(1, "At least 1 ticket is required")
    .max(8, "Maximum 8 tickets allowed")
    .required("Ticket quantity is required"),
  selectedZone: yup.string().required("Please select a zone"),
  transportationMode: yup
    .string()
    .oneOf(["none", "van", "flight"], "Invalid transportation mode")
    .required("Transportation mode is required"),
  transportOrigin: yup.string().when("transportationMode", {
    is: (value: string) => value === "van" || value === "flight",
    then: (schema) =>
      schema.required("Origin city is required for transportation"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vanSeats: yup
    .array()
    .of(yup.string())
    .when("transportationMode", {
      is: "van",
      then: (schema) =>
        schema.test(
          "van-seats-required",
          "All passengers must select van seats",
          function (value) {
            const { ticketQuantity } = this.parent;
            if (!value || value.length !== ticketQuantity) return false;
            return value.every((seat: string) => seat && seat.trim() !== "");
          },
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  jerseySelected: yup.array().of(yup.boolean()).notRequired(),
  jerseyPersonalized: yup.array().of(yup.boolean()).notRequired(),
  jerseyNames: yup
    .array()
    .of(yup.string())
    .test(
      "jersey-names-required",
      "Jersey names are required for personalized jerseys",
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
      "Jersey numbers are required for personalized jerseys",
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
      "Jersey sizes are required for personalized jerseys",
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
});

// Validation schema for individual ticket holder
export const ticketHolderSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces")
    .required("First name is required"),
  lastName: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
  dateOfBirth: yup
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
  idNumber: yup
    .string()
    .trim()
    .min(5, "ID number must be at least 5 characters")
    .max(20, "ID number must not exceed 20 characters")
    .required("ID number is required"),
});

// Validation schema for Step 2: Customer Information (Primary contact)
export const customerInfoSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "First name can only contain letters and spaces")
    .required("First name is required"),
  lastName: yup
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Last name can only contain letters and spaces")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .required("Phone number is required"),
});

// Validation schema for Step 2.5: Individual Ticket Information
export const ticketHoldersInfoSchema = yup.object().shape({
  ticketHolders: yup
    .array()
    .of(ticketHolderSchema)
    .min(1, "At least one ticket holder is required")
    .required("Ticket holders information is required"),
});

// Validation schema for Step 3: Payment Information
export const paymentInfoSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(/^[\d\s]{13,19}$/, "Please enter a valid card number")
    .test("luhn-check", "Please enter a valid card number", function (value) {
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
    })
    .required("Card number is required"),
  expiry: yup
    .string()
    .matches(
      /^(0[1-9]|1[0-2])\/\d{2}$/,
      "Please enter expiry date in MM/YY format",
    )
    .test("expiry-date", "Card has expired or invalid date", function (value) {
      if (!value) return false;

      const [month, year] = value.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      const expYear = parseInt(year);
      const expMonth = parseInt(month);

      if (expYear < currentYear) return false;
      if (expYear === currentYear && expMonth < currentMonth) return false;

      return true;
    })
    .required("Expiry date is required"),
  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .required("CVV is required"),
  cardName: yup
    .string()
    .trim()
    .min(2, "Name on card must be at least 2 characters")
    .max(50, "Name on card must not exceed 50 characters")
    .matches(
      /^[a-zA-Z\s]*$/,
      "Name on card can only contain letters and spaces",
    )
    .required("Name on card is required"),
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
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "" as string,
  idNumber: "",
};

// Initial form values
export const initialCheckoutValues = {
  step1: {
    ticketQuantity: 2,
    selectedZone: "",
    transportationMode: "none" as "none" | "van" | "flight",
    transportOrigin: "",
    vanSeats: [] as string[],
    jerseySelected: [] as boolean[],
    jerseyPersonalized: [] as boolean[],
    jerseyNames: [] as string[],
    jerseyNumbers: [] as string[],
    jerseySizes: [] as string[],
  },
  step2: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  },
  step2_5: {
    ticketHolders: [] as TicketHolder[],
  },
  step3: {
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  },
};

// Type definitions for form values
export type TicketHolder = typeof initialTicketHolder;
export type CheckoutFormValues = typeof initialCheckoutValues;
export type Step1Values = CheckoutFormValues["step1"];
export type Step2Values = CheckoutFormValues["step2"];
export type Step2_5Values = CheckoutFormValues["step2_5"];
export type Step3Values = CheckoutFormValues["step3"];
