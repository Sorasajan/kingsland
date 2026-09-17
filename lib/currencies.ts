export interface CurrencyOption {
  code: string;
  label: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "AUD", label: "AUD — Australian Dollar" },
  { code: "GBP", label: "GBP — British Pound" },
  { code: "CAD", label: "CAD — Canadian Dollar" },
  { code: "USD", label: "USD — US Dollar" },
  { code: "EUR", label: "EUR — Euro" },
  { code: "NZD", label: "NZD — New Zealand Dollar" },
  { code: "JPY", label: "JPY — Japanese Yen" },
  { code: "NPR", label: "NPR — Nepali Rupee" },
  { code: "INR", label: "INR — Indian Rupee" },
  { code: "CHF", label: "CHF — Swiss Franc" },
  { code: "SEK", label: "SEK — Swedish Krona" },
  { code: "NOK", label: "NOK — Norwegian Krone" },
  { code: "DKK", label: "DKK — Danish Krone" },
  { code: "SGD", label: "SGD — Singapore Dollar" },
  { code: "HKD", label: "HKD — Hong Kong Dollar" },
  { code: "KRW", label: "KRW — South Korean Won" },
  { code: "CNY", label: "CNY — Chinese Yuan" },
  { code: "MYR", label: "MYR — Malaysian Ringgit" },
  { code: "AED", label: "AED — UAE Dirham" },
];
