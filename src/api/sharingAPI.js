import { doc, getDoc, collection, writeBatch, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/config/firebase";
import { getUserData } from "./userAPI";
import { calendarColors, getEvent, getEventsArray } from "./calendarAPI";

export async function shareCalendar(userId, calendarName, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
  const calendarsDocRef = doc(sharingsSubcollectionRef, "calendars");
  const targetCalendarsDocRef = doc(targetSharingsSubcollectionRef, "calendars");

  const userData = await getUserData(userId);

  batch.update(calendarsDocRef, {
    outcoming: arrayUnion({ calendarName, targetUserId }),
  });

  batch.update(targetCalendarsDocRef, {
    incoming: arrayUnion({ calendarName, ...userData }),
  });

  await batch.commit();
}

export async function shareEvent(userId, calendarName, eventName, dtstamp, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
  const eventsDocRef = doc(sharingsSubcollectionRef, "events");
  const targetEventsDocRef = doc(targetSharingsSubcollectionRef, "events");

  const userData = await getUserData(userId);

  batch.update(eventsDocRef, {
    outcoming: arrayUnion({ calendarName, eventName, dtstamp, targetUserId }),
  });

  batch.update(targetEventsDocRef, {
    incoming: arrayUnion({ calendarName, eventName, dtstamp, ...userData }),
  });

  await batch.commit();
}

export async function removeCalendar(userId, calendarName, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
  const calendarsDocRef = doc(sharingsSubcollectionRef, "calendars");
  const targetCalendarsDocRef = doc(targetSharingsSubcollectionRef, "calendars");

  const targetUserData = await getUserData(targetUserId);

  batch.update(calendarsDocRef, {
    incoming: arrayRemove({ calendarName, ...targetUserData }),
  });

  batch.update(targetCalendarsDocRef, {
    outcoming: arrayRemove({ calendarName, targetUserId: userId }),
  });

  await batch.commit();
}

export async function removeEvent(userId, calendarName, eventName, dtstamp, targetUserId) {
  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
  const eventsDocRef = doc(sharingsSubcollectionRef, "events");
  const targetEventsDocRef = doc(targetSharingsSubcollectionRef, "events");

  const targetUserData = await getUserData(targetUserId);

  batch.update(eventsDocRef, {
    incoming: arrayRemove({ calendarName, eventName, dtstamp, ...targetUserData }),
  });

  batch.update(targetEventsDocRef, {
    outcoming: arrayRemove({ calendarName, eventName, dtstamp, targetUserId: userId }),
  });

  await batch.commit();
}

export async function addCalendar(userId, calendarName, uniqueCalendarName, targetUserId) {
  const events = await getEventsArray(targetUserId, calendarName);

  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
  const calendarsDocRef = doc(sharingsSubcollectionRef, "calendars");
  const targetCalendarsDocRef = doc(targetSharingsSubcollectionRef, "calendars");

  const targetUserData = await getUserData(targetUserId);

  batch.update(calendarsDocRef, {
    incoming: arrayRemove({ calendarName, ...targetUserData }),
  });

  batch.update(targetCalendarsDocRef, {
    outcoming: arrayRemove({ calendarName, targetUserId: userId }),
  });

  const calendarsSubcollectionRef = collection(userRef, "calendars");

  batch.set(doc(calendarsSubcollectionRef, uniqueCalendarName), { color: calendarColors[0], events });

  await batch.commit();
}

export async function addEvent(userId, calendarName, targetCalendarName, eventName, dtstamp, targetUserId) {
  const event = await getEvent(targetUserId, targetCalendarName, eventName, dtstamp);

  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const targetUserRef = doc(db, "users", targetUserId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
  const eventsDocRef = doc(sharingsSubcollectionRef, "events");
  const targetEventsDocRef = doc(targetSharingsSubcollectionRef, "events");

  const targetUserData = await getUserData(targetUserId);

  batch.update(eventsDocRef, {
    incoming: arrayRemove({ calendarName: targetCalendarName, eventName, dtstamp, ...targetUserData }),
  });

  batch.update(targetEventsDocRef, {
    outcoming: arrayRemove({ calendarName: targetCalendarName, eventName, dtstamp, targetUserId: userId }),
  });

  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);

  batch.update(calendarDocRef, {
    events: arrayUnion({ ...event, dtstamp: new Date() }),
  });

  await batch.commit();
}

export async function getIncomingCalendars(userId) {
  const userRef = doc(db, "users", userId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const calendarsDocRef = doc(sharingsSubcollectionRef, "calendars");
  const calendarsDoc = await getDoc(calendarsDocRef);

  const incomingCalendars = calendarsDoc.data().incoming;

  return incomingCalendars;
}

export async function getIncomingEvents(userId) {
  const userRef = doc(db, "users", userId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const eventsDocRef = doc(sharingsSubcollectionRef, "events");
  const eventsDoc = await getDoc(eventsDocRef);

  const incomingEvents = eventsDoc.data().incoming;

  return incomingEvents;
}

export async function getOutcomingCalendars(userId) {
  const userRef = doc(db, "users", userId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const calendarsDocRef = doc(sharingsSubcollectionRef, "calendars");
  const calendarsDoc = await getDoc(calendarsDocRef);

  const outcomingCalendars = calendarsDoc.data().outcoming;

  return outcomingCalendars;
}

export async function getOutcomingEvents(userId) {
  const userRef = doc(db, "users", userId);
  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const eventsDocRef = doc(sharingsSubcollectionRef, "events");
  const eventsDoc = await getDoc(eventsDocRef);

  const outcomingEvents = eventsDoc.data().outcoming;

  return outcomingEvents;
}
