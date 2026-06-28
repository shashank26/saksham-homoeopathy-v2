export type PhoneCountry = {
  id: string;
  label: string;
  dialCode: `+${number}`;
  minLength: number;
  maxLength: number;
  placeholder?: string;
};

export const PHONE_COUNTRIES: PhoneCountry[] = [
  {
    id: "IN",
    label: "India",
    dialCode: "+91",
    minLength: 10,
    maxLength: 10,
    placeholder: "Enter your mobile number",
  },
  {
    id: "US",
    label: "USA",
    dialCode: "+1",
    minLength: 10,
    maxLength: 10,
    placeholder: "Enter your mobile number",
  },
  {
    id: "CA",
    label: "Canada",
    dialCode: "+1",
    minLength: 10,
    maxLength: 10,
    placeholder: "Enter your mobile number",
  },
  {
    id: "SG",
    label: "Singapore",
    dialCode: "+65",
    minLength: 8,
    maxLength: 8,
    placeholder: "Enter your mobile number",
  },
  {
    id: "DE",
    label: "Germany",
    dialCode: "+49",
    minLength: 10,
    maxLength: 11,
    placeholder: "Enter your mobile number",
  },
  {
    id: "AU",
    label: "Australia",
    dialCode: "+61",
    minLength: 9,
    maxLength: 9,
    placeholder: "Enter your mobile number",
  },
  {
    id: "AE",
    label: "UAE (Dubai)",
    dialCode: "+971",
    minLength: 9,
    maxLength: 9,
    placeholder: "Enter your mobile number",
  },
];

export const DEFAULT_PHONE_COUNTRY = PHONE_COUNTRIES[0];

export function isValidNationalNumber(
  country: PhoneCountry,
  digits: string,
): boolean {
  const len = digits.length;
  return len >= country.minLength && len <= country.maxLength;
}

export function getPhoneCountryById(id: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.id === id) ?? DEFAULT_PHONE_COUNTRY;
}
