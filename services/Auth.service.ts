import auth from "@react-native-firebase/auth";

export type CountryCode = `+${number}`;

export class AuthService {
  static Auth() {
    return auth();
  }

  static async signIn(countryCode: CountryCode, phoneNumber: number) {
    return this.Auth().signInWithPhoneNumber(`${countryCode}${phoneNumber}`);
  }

  static async signOut() {
    return this.Auth().signOut();
  }

  static async validateOTP(otp: number) {

  }
}
