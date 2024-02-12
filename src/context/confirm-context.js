"use client";
import ConfirmModal from "@/components/home/ConfirmModal";
import { createContext, useState } from "react";

export const ConfirmContext = createContext();

export function ConfirmContextProvider({ children }) {
  const [actionObject, setActionObject] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);

  function showConfirm(message, actionObj) {
    setConfirmMessage(message);
    setActionObject(actionObj);
  }

  function hideConfirm() {
    setConfirmMessage(null);
  }

  return (
    <ConfirmContext.Provider value={{ showConfirm, hideConfirm }}>
      {children} {confirmMessage && <ConfirmModal confirmMessage={confirmMessage} handleAction={actionObject.action} />}
    </ConfirmContext.Provider>
  );
}
