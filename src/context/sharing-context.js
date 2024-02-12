"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { getIncomingCalendars, getIncomingEvents } from "@/api/sharingAPI";

export const SharingContext = createContext();

export function SharingContextProvider({ children }) {
  const [incomingCalendars, setIncomingCalendars] = useState([]);
  const [incomingEvents, setIncomingEvents] = useState([]);

  useEffect(() => {
    async function fetchIncomingCalendars() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const incomingCalendarsArray = await getIncomingCalendars(currentUser.uid);
        setIncomingCalendars(incomingCalendarsArray);
      }
    }

    async function fetchIncomingEvents() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const incomingEventsArray = await getIncomingEvents(currentUser.uid);
        setIncomingEvents(incomingEventsArray);
      }
    }

    fetchIncomingCalendars();
    fetchIncomingEvents();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const sharingsSubcollectionRef = collection(userRef, "sharings");
    const calendarsDocRef = doc(sharingsSubcollectionRef, "calendars");
    const eventsDocRef = doc(sharingsSubcollectionRef, "events");

    const unsubscribeIncomingCalendars = onSnapshot(calendarsDocRef, (calendarsDoc) => {
      const incomingCalendarsArray = [];
      incomingCalendarsArray.push(...calendarsDoc.data().incoming);
      setIncomingCalendars(incomingCalendarsArray);
    });

    const unsubscribeIncomingEvents = onSnapshot(eventsDocRef, (eventsDoc) => {
      const incomingEventsArray = [];
      incomingEventsArray.push(...eventsDoc.data().incoming);
      setIncomingEvents(incomingEventsArray);
    });

    return () => {
      unsubscribeIncomingCalendars();
      unsubscribeIncomingEvents();
    };
  }, []);

  return <SharingContext.Provider value={{ incomingCalendars, incomingEvents }}>{children}</SharingContext.Provider>;
}
