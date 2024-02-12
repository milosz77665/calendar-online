import { doc, getDoc, Timestamp, collection, writeBatch, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { calendarColors } from "./calendarAPI";

const extensions = {
  toDoLists: {
    name: "toDoLists",
    key: 1,
    isAdded: false,
  },
  notes: {
    name: "notes",
    key: 2,
    isAdded: false,
  },
  pomodoro: {
    name: "pomodoro",
    key: 3,
    isAdded: false,
  },
  meetingAssistant: {
    name: "meetingAssistant",
    key: 4,
    isAdded: false,
  },
};

export async function createUserInFirestore(userId, name, surname, email, birthDate) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const extensionsSubcollectionRef = collection(userRef, "extensions");
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const notesSubcollectionRef = collection(userRef, "notes");
  const toDoListsSubcollectionRef = collection(userRef, "toDoLists");

  batch.set(userRef, {
    name,
    surname,
    email,
    birthDate: birthDate ? Timestamp.fromDate(new Date(birthDate)) : null,
  });

  for (const key in extensions) {
    batch.set(doc(extensionsSubcollectionRef, extensions[key].name), extensions[key]);
  }

  batch.set(doc(calendarsSubcollectionRef, name), { color: calendarColors[0], events: [] });

  batch.set(doc(contactsSubcollectionRef, "invitations"), { incoming: [], outcoming: [] });
  batch.set(doc(contactsSubcollectionRef, "friends"), { contactList: [] });

  batch.set(doc(sharingsSubcollectionRef, "calendars"), { incoming: [], outcoming: [] });
  batch.set(doc(sharingsSubcollectionRef, "events"), { incoming: [], outcoming: [] });

  batch.set(doc(notesSubcollectionRef, "notesDoc"), { notesList: [] });
  batch.set(doc(toDoListsSubcollectionRef, "toDoListsDoc"), { toDoListsList: [] });

  await batch.commit();
}

export async function doesUserExist(userId) {
  const result = await getDoc(doc(db, "users", userId));

  return result.exists();
}

export async function getUserIdByEmail(email) {
  const q = query(collection(db, "users"), where("email", "==", email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size === 0) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];
  return userDoc.id;
}

export async function getUserData(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  const userData = userDoc.data();

  return userData;
}
