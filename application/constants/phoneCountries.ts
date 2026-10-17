import { db } from "@/services/Firebase.service";

export type PhoneCountry = {
  id: string;
  label: string;
  dialCode: `+${number}`;
  minLength: number;
  maxLength: number;
  placeholder?: string;
};

export function isValidNationalNumber(
  country: PhoneCountry,
  digits: string,
): boolean {
  const len = digits.length;
  return len >= country.minLength && len <= country.maxLength;
}

export async function getPhoneCountries(): Promise<PhoneCountry[]> {
  const docRef = db.collection("phone_countries").doc("list");
  const doc = await docRef.get();
  return doc.data()?.countries ?? [];
}
