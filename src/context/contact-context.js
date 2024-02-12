"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { getContactList, getIncomingInvitations } from "@/api/contactAPI";

export const ContactContext = createContext();

export function ContactContextProvider({ children }) {
  const [incomingInvitations, setIncomingInvitations] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const contactList = await getContactList(currentUser.uid);
        setContacts(contactList);
      }
    }

    async function fetchIncomingInvitations() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const incomingInvitationsArray = await getIncomingInvitations(currentUser.uid);
        setIncomingInvitations(incomingInvitationsArray);
      }
    }

    fetchContacts();
    fetchIncomingInvitations();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const contactsSubcollectionRef = collection(userRef, "contacts");
    const friendsDocRef = doc(contactsSubcollectionRef, "friends");
    const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");

    const unsubscribeContacts = onSnapshot(friendsDocRef, (friendsDoc) => {
      const contactArray = [];
      contactArray.push(...friendsDoc.data().contactList);
      setContacts(contactArray);
    });

    const unsubscribeIncomingInvitations = onSnapshot(invitationsDocRef, (invitationsDoc) => {
      const incomingInvitationsArray = [];
      incomingInvitationsArray.push(...invitationsDoc.data().incoming);
      setIncomingInvitations(incomingInvitationsArray);
    });

    return () => {
      unsubscribeContacts();
      unsubscribeIncomingInvitations();
    };
  }, []);

  return <ContactContext.Provider value={{ contacts, incomingInvitations }}>{children}</ContactContext.Provider>;
}
