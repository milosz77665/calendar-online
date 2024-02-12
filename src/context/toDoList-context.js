"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getToDoListsList } from "@/api/toDoListAPI";
import { auth, db } from "@/config/firebase";

export const ToDoListContext = createContext();

export function ToDoListContextProvider({ children }) {
  const [toDoLists, setToDoLists] = useState([]);

  useEffect(() => {
    async function fetchToDoLists() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const toDoListsArray = await getToDoListsList(currentUser.uid);
        setToDoLists(toDoListsArray);
      }
    }

    fetchToDoLists();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const toDoListsSubcollectionRef = collection(userRef, "toDoLists");
    const toDoListsDocRef = doc(toDoListsSubcollectionRef, "toDoListsDoc");

    const unsubscribe = onSnapshot(toDoListsDocRef, (toDoListsDoc) => {
      const toDoListsArray = [];
      toDoListsArray.push(...toDoListsDoc.data().toDoListsList.reverse());
      setToDoLists(toDoListsArray);
    });

    return () => unsubscribe();
  }, []);

  return <ToDoListContext.Provider value={{ toDoLists }}>{children}</ToDoListContext.Provider>;
}
