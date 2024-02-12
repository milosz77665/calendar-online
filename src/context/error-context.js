"use client";
import ErrorAlert from "@/components/home/ErrorAlert";
import { createContext, useContext, useState } from "react";
import { ExtensionContext } from "./extension-context";

export const ErrorContext = createContext();

export function ErrorContextProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const { isExtensionModalOpen, setIsExtensionModalOpen } = useContext(ExtensionContext);

  function showError(error) {
    if (isExtensionModalOpen) {
      setIsExtensionModalOpen(false);
    }
    setErrorMessage(error);
  }

  function hideError() {
    setErrorMessage(null);
  }

  return (
    <ErrorContext.Provider value={{ showError, hideError }}>
      {children} {errorMessage && <ErrorAlert errorMessage={errorMessage} />}
    </ErrorContext.Provider>
  );
}
