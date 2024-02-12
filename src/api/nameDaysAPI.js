import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getNameDaysList() {
  const nameDaysRef = doc(db, "nameDays", "nameDaysDoc");
  const nameDaysDoc = await getDoc(nameDaysRef);

  const nameDaysList = nameDaysDoc.data().nameDaysList;

  return nameDaysList;
}
