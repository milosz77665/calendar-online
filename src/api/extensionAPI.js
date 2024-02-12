import { doc, getDocs, collection, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function updateExtensions(userId, extensionsToChange) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const extensionsSubcollectionRef = collection(userRef, "extensions");

  extensionsToChange.forEach((ext) => {
    batch.update(doc(extensionsSubcollectionRef, ext.name), ext);
  });

  await batch.commit();
}

export async function getExtensionsArray(userId) {
  const extensions = [];

  const userRef = doc(db, "users", userId);
  const extensionsSubcollectionRef = collection(userRef, "extensions");
  const extensionsSubcollection = await getDocs(extensionsSubcollectionRef);

  extensionsSubcollection.forEach((doc) => {
    extensions.push(doc.data());
  });

  return extensions;
}
