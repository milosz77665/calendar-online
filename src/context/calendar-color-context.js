"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getAllCalendarsColors } from "@/api/calendarAPI";
import { auth, db } from "@/config/firebase";

export const CalendarColorContext = createContext();

export function CalendarColorContextProvider({ children }) {
  const [allCalendarsColors, setAllCalendarsColors] = useState({});

  useEffect(() => {
    async function fetchAllColors() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const allColors = await getAllCalendarsColors(currentUser.uid);
        setAllCalendarsColors(allColors);
      }
    }

    fetchAllColors();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const calendarsSubcollectionRef = collection(userRef, "calendars");

    const unsubscribe = onSnapshot(calendarsSubcollectionRef, (calendarsSubcollection) => {
      const calendarsColors = {};
      calendarsSubcollection.forEach((doc) => {
        if (doc.exists()) {
          calendarsColors[doc.id] = {};
          calendarsColors[doc.id].color = doc.data().color;
        }
      });
      setAllCalendarsColors(calendarsColors);
    });

    return () => unsubscribe();
  }, []);

  return <CalendarColorContext.Provider value={{ allCalendarsColors }}>{children}</CalendarColorContext.Provider>;
}
