import AsyncStorage from "@react-native-async-storage/async-storage";
import { TERMS_VERSION } from "@/constants/legal";

const STORAGE_KEY = "terms_acceptance";

export type TermsAcceptanceRecord = {
  version: string;
  acceptedAt: string;
};

let memoryFallback: TermsAcceptanceRecord | null = null;
let nativeStorageUnavailable = false;

export class TermsAcceptanceService {
  static async getAcceptance(): Promise<TermsAcceptanceRecord | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as TermsAcceptanceRecord;
      } catch {
        return null;
      }
    } catch {
      nativeStorageUnavailable = true;
      return memoryFallback;
    }
  }

  static async setAcceptance(
    version: string,
    acceptedAt: string,
  ): Promise<void> {
    const record = { version, acceptedAt };
    memoryFallback = record;

    if (nativeStorageUnavailable) {
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      nativeStorageUnavailable = true;
    }
  }

  static async hasAcceptedCurrentTerms(): Promise<boolean> {
    const record = await this.getAcceptance();
    return record?.version === TERMS_VERSION;
  }

  static async acceptCurrentTerms(): Promise<void> {
    await this.setAcceptance(TERMS_VERSION, new Date().toISOString());
  }
}
