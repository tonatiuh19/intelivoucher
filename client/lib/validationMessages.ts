import i18n from "../i18n";

/**
 * Helper function to get validation messages with i18n support
 * This function can be used in Yup validation schemas to get translated error messages
 */
export const getValidationMessage = (
  key: string,
  defaultMessage?: string,
): string => {
  try {
    return i18n.t(`validation.${key}`, defaultMessage || key);
  } catch (error) {
    // Fallback to default message or key if i18n fails
    return defaultMessage || key;
  }
};

/**
 * Factory function to create validation schemas with i18n support
 * This ensures messages are evaluated at validation time, not schema creation time
 */
export const createValidationMessage = (
  key: string,
  defaultMessage?: string,
) => {
  return () => getValidationMessage(key, defaultMessage);
};

/**
 * Validation message factory functions
 */
export const ValidationMessages = {
  ticketQuantity: {
    min: createValidationMessage("ticketQuantity.min"),
    max: createValidationMessage("ticketQuantity.max"),
    required: createValidationMessage("ticketQuantity.required"),
  },
  zone: {
    required: createValidationMessage("zone.required"),
  },
  transportationMode: {
    required: createValidationMessage("transportationMode.required"),
  },
  transportOrigin: {
    required: createValidationMessage("transportOrigin.required"),
  },
  jersey: {
    namesRequired: createValidationMessage("jersey.namesRequired"),
    numbersRequired: createValidationMessage("jersey.numbersRequired"),
    sizesRequired: createValidationMessage("jersey.sizesRequired"),
    typesRequired: createValidationMessage("jersey.typesRequired"),
  },
  firstName: {
    min: createValidationMessage("firstName.min"),
    max: createValidationMessage("firstName.max"),
    matches: createValidationMessage("firstName.matches"),
    required: createValidationMessage("firstName.required"),
  },
  lastName: {
    min: createValidationMessage("lastName.min"),
    max: createValidationMessage("lastName.max"),
    matches: createValidationMessage("lastName.matches"),
    required: createValidationMessage("lastName.required"),
  },
  email: {
    format: createValidationMessage("email.format"),
    required: createValidationMessage("email.required"),
  },
  phone: {
    format: createValidationMessage("phone.format"),
    required: createValidationMessage("phone.required"),
  },
  dateOfBirth: {
    max: createValidationMessage("dateOfBirth.max"),
    required: createValidationMessage("dateOfBirth.required"),
  },
  idNumber: {
    min: createValidationMessage("idNumber.min"),
    max: createValidationMessage("idNumber.max"),
    required: createValidationMessage("idNumber.required"),
  },
  ticketHolders: {
    min: createValidationMessage("ticketHolders.min"),
    required: createValidationMessage("ticketHolders.required"),
  },
  paymentMethod: {
    oneOf: createValidationMessage("paymentMethod.oneOf"),
    required: createValidationMessage("paymentMethod.required"),
  },
  installments: {
    min: createValidationMessage("installments.min"),
    max: createValidationMessage("installments.max"),
  },
  cardNumber: {
    format: createValidationMessage("cardNumber.format"),
    luhn: createValidationMessage("cardNumber.luhn"),
    required: createValidationMessage("cardNumber.required"),
  },
  expiry: {
    format: createValidationMessage("expiry.format"),
    expired: createValidationMessage("expiry.expired"),
    required: createValidationMessage("expiry.required"),
  },
  cvv: {
    format: createValidationMessage("cvv.format"),
    required: createValidationMessage("cvv.required"),
  },
  cardName: {
    min: createValidationMessage("cardName.min"),
    max: createValidationMessage("cardName.max"),
    matches: createValidationMessage("cardName.matches"),
    required: createValidationMessage("cardName.required"),
  },
} as const;
