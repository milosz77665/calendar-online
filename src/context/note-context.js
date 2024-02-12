"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getNotesList } from "@/api/noteAPI";
import { auth, db } from "@/config/firebase";

export const NoteContext = createContext();

export function NoteContextProvider({ children }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    async function fetchNotes() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const notesArray = await getNotesList(currentUser.uid);
        setNotes(notesArray);
      }
    }

    fetchNotes();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const notesSubcollectionRef = collection(userRef, "notes");
    const notesDocRef = doc(notesSubcollectionRef, "notesDoc");

    const unsubscribe = onSnapshot(notesDocRef, (notesDoc) => {
      const notesArray = [];
      notesArray.push(...notesDoc.data().notesList.reverse());
      setNotes(notesArray);
    });

    return () => unsubscribe();
  }, []);

  return <NoteContext.Provider value={{ notes }}>{children}</NoteContext.Provider>;
}
