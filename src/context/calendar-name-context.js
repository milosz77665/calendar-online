"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getCalendarIds } from "@/api/calendarAPI";
import { auth, db } from "@/config/firebase";

export const CalendarNameContext = createContext();

export function CalendarNameContextProvider({ children }) {
  const [calendarNames, setCalendarNames] = useState([]);

  useEffect(() => {
    async function fetchCalendarNames() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const calendarIds = await getCalendarIds(currentUser.uid);
        setCalendarNames(calendarIds);
      }
    }

    fetchCalendarNames();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const calendarsSubcollectionRef = collection(userRef, "calendars");

    const unsubscribe = onSnapshot(calendarsSubcollectionRef, (calendarsSubcollection) => {
      const calendarIds = [];
      calendarsSubcollection.forEach((doc) => {
        if (doc.exists()) {
          calendarIds.push(doc.id);
        }
      });
      setCalendarNames(calendarIds);
    });

    return () => unsubscribe();
  }, []);

  return <CalendarNameContext.Provider value={{ calendarNames }}>{children}</CalendarNameContext.Provider>;
}
