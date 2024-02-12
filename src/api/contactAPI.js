import { doc, collection, updateDoc, arrayUnion, arrayRemove, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/config/firebase";
import { getUserData } from "./userAPI";

export async function addContact(userId, targetUserId) {
  await removeInvitation(userId, targetUserId);
  const batch = writeBatch(db);

  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);

  const contactsSubcollectionRef = collection(userRef, "contacts");
  const targetContactsSubcollectionRef = collection(targetUserRef, "contacts");

  const friendsDocRef = doc(contactsSubcollectionRef, "friends");
  const targetFriendsDocRef = doc(targetContactsSubcollectionRef, "friends");

  const userData = await getUserData(userId);
  const targetUserData = await getUserData(targetUserId);

  batch.update(friendsDocRef, {
    contactList: arrayUnion({ ...targetUserData, uid: targetUserId }),
  });

  batch.update(targetFriendsDocRef, {
    contactList: arrayUnion({ ...userData, uid: userId }),
  });

  await batch.commit();
}

export async function addInvitation(userId, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const targetContactsSubcollectionRef = collection(targetUserRef, "contacts");
  const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");
  const targetInvitationsDocRef = doc(targetContactsSubcollectionRef, "invitations");

  const userData = await getUserData(userId);

  batch.update(invitationsDocRef, {
    outcoming: arrayUnion(targetUserId),
  });

  batch.update(targetInvitationsDocRef, {
    incoming: arrayUnion(userData),
  });

  await batch.commit();
}

export async function addIncomingInvitation(userId, targetUserId) {
  const targetUserRef = doc(db, "users", targetUserId);
  const targetContactsSubcollectionRef = collection(targetUserRef, "contacts");
  const targetInvitationsDocRef = doc(targetContactsSubcollectionRef, "invitations");

  const userData = await getUserData(userId);

  await updateDoc(targetInvitationsDocRef, {
    incoming: arrayUnion(userData),
  });
}

export async function addOutcomingInvitation(userId, targetUserId) {
  const userRef = doc(db, "users", userId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");

  await updateDoc(invitationsDocRef, {
    outcoming: arrayUnion(targetUserId),
  });
}

export async function getContactList(userId) {
  const userRef = doc(db, "users", userId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const friendsDocRef = doc(contactsSubcollectionRef, "friends");
  const friendsDoc = await getDoc(friendsDocRef);

  const contactList = friendsDoc.data().contactList;

  return contactList;
}

export async function getIncomingInvitations(userId) {
  const userRef = doc(db, "users", userId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");
  const invitationsDoc = await getDoc(invitationsDocRef);

  const incoming = invitationsDoc.data().incoming;

  return incoming;
}

export async function getOutcomingInvitations(userId) {
  const userRef = doc(db, "users", userId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");
  const invitationsDoc = await getDoc(invitationsDocRef);

  const outcoming = invitationsDoc.data().outcoming;

  return outcoming;
}

export async function removeContact(userId, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);

  const contactsSubcollectionRef = collection(userRef, "contacts");
  const targetContactsSubcollectionRef = collection(targetUserRef, "contacts");

  const friendsDocRef = doc(contactsSubcollectionRef, "friends");
  const targetFriendsDocRef = doc(targetContactsSubcollectionRef, "friends");

  const userData = await getUserData(userId);
  const targetUserData = await getUserData(targetUserId);

  batch.update(friendsDocRef, {
    contactList: arrayRemove({ uid: targetUserId, ...targetUserData }),
  });

  batch.update(targetFriendsDocRef, {
    contactList: arrayRemove({ uid: userId, ...userData }),
  });

  await batch.commit();
}

export async function removeInvitation(userId, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const targetContactsSubcollectionRef = collection(targetUserRef, "contacts");
  const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");
  const targetInvitationsDocRef = doc(targetContactsSubcollectionRef, "invitations");

  const targetUserData = await getUserData(targetUserId);

  batch.update(invitationsDocRef, {
    incoming: arrayRemove(targetUserData),
  });

  batch.update(targetInvitationsDocRef, {
    outcoming: arrayRemove(userId),
  });

  await batch.commit();
}

async function removeIncomingInvitation(userId, targetUserId) {
  const userRef = doc(db, "users", userId);
  const contactsSubcollectionRef = collection(userRef, "contacts");
  const invitationsDocRef = doc(contactsSubcollectionRef, "invitations");

  const targetUserData = await getUserData(targetUserId);

  await updateDoc(invitationsDocRef, {
    incoming: arrayRemove(targetUserData),
  });
}

async function removeOutcomingInvitation(userId, targetUserId) {
  const targetUserRef = doc(db, "users", targetUserId);
  const targetContactsSubcollectionRef = collection(targetUserRef, "contacts");
  const targetInvitationsDocRef = doc(targetContactsSubcollectionRef, "invitations");

  await updateDoc(targetInvitationsDocRef, {
    outcoming: arrayRemove(userId),
  });
}

export async function isFriend(userId, targetUserId) {
  const contactList = await getContactList(userId);
  return contactList.some((contact) => {
    return contact.uid === targetUserId;
  });
}

export async function isInvitationSent(userId, targetUserId) {
  const outcomingInvitations = await getOutcomingInvitations(userId);
  return outcomingInvitations.includes(targetUserId);
}
