import { doc, getDoc, collection, updateDoc, arrayRemove, arrayUnion, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function addToDoList(userId, id, title) {
  const userRef = doc(db, "users", userId);
  const toDoListsSubcollectionRef = collection(userRef, "toDoLists");
  const toDoListsDocRef = doc(toDoListsSubcollectionRef, "toDoListsDoc");

  await updateDoc(toDoListsDocRef, {
    toDoListsList: arrayUnion({ id, title, tasks: [{ id: new Date().getTime(), idDone: false, content: "" }] }),
  });
}

export async function removeToDoList(userId, id, title, tasks) {
  const userRef = doc(db, "users", userId);
  const toDoListsSubcollectionRef = collection(userRef, "toDoLists");
  const toDoListsDocRef = doc(toDoListsSubcollectionRef, "toDoListsDoc");

  await updateDoc(toDoListsDocRef, {
    toDoListsList: arrayRemove({ id, title, tasks }),
  });
}

export async function updateToDoList(userId, id, oldTitle, oldTasks, newTitle, newTasks) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const toDoListsSubcollectionRef = collection(userRef, "toDoLists");
  const toDoListsDocRef = doc(toDoListsSubcollectionRef, "toDoListsDoc");

  batch.update(toDoListsDocRef, {
    toDoListsList: arrayRemove({ id, title: oldTitle, tasks: oldTasks }),
  });

  batch.update(toDoListsDocRef, {
    toDoListsList: arrayUnion({ id, title: newTitle, tasks: newTasks }),
  });

  await batch.commit();
}

export async function getToDoListsList(userId) {
  const userRef = doc(db, "users", userId);
  const toDoListsSubcollectionRef = collection(userRef, "toDoLists");
  const toDoListsDocRef = doc(toDoListsSubcollectionRef, "toDoListsDoc");
  const toDoListsDoc = await getDoc(toDoListsDocRef);

  const toDoListsList = toDoListsDoc.data().toDoListsList.reverse();

  return toDoListsList;
}
