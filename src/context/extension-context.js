"use client";
import { createContext, useState, useEffect } from "react";
import ExtensionModal from "@/components/home/ExtensionModal";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getExtensionsArray, updateExtensions } from "@/api/extensionAPI";
import { auth, db } from "@/config/firebase";

export const ExtensionContext = createContext();

export function ExtensionContextProvider({ children }) {
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [extensions, setExtensions] = useState([]);
  const extensionsToChange = [];

  useEffect(() => {
    async function fetchExtensions() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const extensionsData = await getExtensionsArray(currentUser.uid);
        setExtensions(extensionsData);
      }
    }

    fetchExtensions();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const extensionsSubcollectionRef = collection(userRef, "extensions");

    const unsubscribe = onSnapshot(extensionsSubcollectionRef, (extensionsSubcollection) => {
      const extensionsData = [];
      extensionsSubcollection.forEach((doc) => {
        if (doc.exists()) {
          extensionsData.push(doc.data());
        }
      });
      setExtensions(extensionsData);
    });

    return () => unsubscribe();
  }, []);

  function addToChange(extension, isAdded, key) {
    extensionsToChange.push({ name: extension, key, isAdded });
  }

  function removeFromChange(extension) {
    extensionsToChange.forEach((ext, index) => {
      ext.name === extension ? extensionsToChange.splice(index, 1) : null;
    });
  }

  function saveChanges() {
    updateExtensions(auth.currentUser.uid, extensionsToChange);
  }

  return (
    <ExtensionContext.Provider
      value={{ isExtensionModalOpen, setIsExtensionModalOpen, extensions, addToChange, removeFromChange, saveChanges }}
    >
      {children} {isExtensionModalOpen && <ExtensionModal />}
    </ExtensionContext.Provider>
  );
}
