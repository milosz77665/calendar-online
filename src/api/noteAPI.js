import { doc, getDoc, collection, updateDoc, arrayRemove, arrayUnion, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function addNote(userId, id, title) {
  const userRef = doc(db, "users", userId);
  const notesSubcollectionRef = collection(userRef, "notes");
  const notesDocRef = doc(notesSubcollectionRef, "notesDoc");

  await updateDoc(notesDocRef, {
    notesList: arrayUnion({ id, title, content: "" }),
  });
}

export async function removeNote(userId, id, title, content) {
  const userRef = doc(db, "users", userId);
  const notesSubcollectionRef = collection(userRef, "notes");
  const notesDocRef = doc(notesSubcollectionRef, "notesDoc");

  await updateDoc(notesDocRef, {
    notesList: arrayRemove({ id, title, content }),
  });
}

export async function updateNote(userId, id, oldTitle, oldContent, newTitle, newContent) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const notesSubcollectionRef = collection(userRef, "notes");
  const notesDocRef = doc(notesSubcollectionRef, "notesDoc");

  batch.update(notesDocRef, {
    notesList: arrayRemove({ id, title: oldTitle, content: oldContent }),
  });

  batch.update(notesDocRef, {
    notesList: arrayUnion({ id, title: newTitle, content: newContent }),
  });

  await batch.commit();
}

export async function getNotesList(userId) {
  const userRef = doc(db, "users", userId);
  const notesSubcollectionRef = collection(userRef, "notes");
  const notesDocRef = doc(notesSubcollectionRef, "notesDoc");
  const notesDoc = await getDoc(notesDocRef);

  const notesList = notesDoc.data().notesList.reverse();

  return notesList;
}
