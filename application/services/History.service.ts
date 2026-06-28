import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { db } from "./Firebase.service";

export type MedicineType = {
  name: string;
  dosage: string;
  startDate: Date;
  endDate: Date;
  phoneNumber: string;
  id?: string;
};

export class HistoryService {
  static HISTORY_COLLECTION = db.collection("history");

  static medicineHash = new Map<string, MedicineType>();

  static onMedicineUpdateForUser(
    phoneNumber: string,
    callback: (medicines: MedicineType[]) => void
  ) {
    const unsub = this.HISTORY_COLLECTION.where(
      "phoneNumber",
      "==",
      phoneNumber
    ).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const medicine: MedicineType = {
            name: change.doc.data().name,
            dosage: change.doc.data().dosage,
            startDate: change.doc.data().startDate.toDate(),
            endDate: change.doc.data().endDate.toDate(),
            phoneNumber: change.doc.data().phoneNumber,
            id: change.doc.id,
          };
          this.medicineHash.set(change.doc.id, medicine);
        } else if (change.type === "removed") {
          this.medicineHash.delete(change.doc.id);
        }
        callback(Array.from(this.medicineHash.values()));
      });
    });
    return unsub;
  }

  static async addMedicine(
    medicine: MedicineType,
  ): Promise<FirebaseFirestoreTypes.DocumentReference | null> {
    try {
      return await this.HISTORY_COLLECTION.add(medicine);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  static async deleteMedicine(id: string) {
    try {
      await this.HISTORY_COLLECTION.doc(id).delete();
    } catch (err) {
      console.log(err);
    }
  }
}
