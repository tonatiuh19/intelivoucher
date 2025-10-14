import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency (USD)
 * @param amount - The amount to format (can be string or number)
 * @param currency - The currency symbol (default: '$')
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: string | number,
  currency: string = "$",
  decimalPlaces: number = 2,
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return `${currency}0.${"0".repeat(decimalPlaces)}`;
  }

  // Format with commas using toLocaleString
  const formattedNumber = numericAmount.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return `${currency}${formattedNumber}`;
}

/**
 * Format a number as currency with locale-specific formatting
 * @param amount - The amount to format (can be string or number)
 * @param locale - The locale to use (default: 'en-US')
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string using Intl.NumberFormat
 */
export function formatCurrencyIntl(
  amount: string | number,
  locale: string = "en-US",
  currency: string = "USD",
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(0);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(numericAmount);
}

/**
 * Generate a unique purchase reference for reservation requests
 * Format: INV-YYYYMMDD-HHMMSS-RANDOM
 * @returns A unique purchase reference string
 */
export function generatePurchaseReference(): string {
  const now = new Date();

  // Format date as YYYYMMDD
  const date =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0");

  // Format time as HHMMSS
  const time =
    now.getHours().toString().padStart(2, "0") +
    now.getMinutes().toString().padStart(2, "0") +
    now.getSeconds().toString().padStart(2, "0");

  // Generate random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  return `INV-${date}-${time}-${random}`;
}
