"use client";
import { createContext, useState } from "react";

export const VisibleCalendarContext = createContext();

export function VisibleCalendarContextProvider({ children }) {
  const [visibleCalendars, setVisibleCalendars] = useState([]);

  return (
    <VisibleCalendarContext.Provider value={{ visibleCalendars, setVisibleCalendars }}>
      {children}
    </VisibleCalendarContext.Provider>
  );
}
