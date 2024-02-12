import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  arrayRemove,
  arrayUnion,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { RRule } from "rrule";
import { getUserData } from "./userAPI";

export const calendarColors = [
  "#6E0E0A",
  "#7F0799",
  "#004F2D",
  "#D78521",
  "#394648",
  "#331832",
  "#5B3000",
  "#D33E43",
  "#1B998B",
  "#FB5012",
  "#7C7F65",
  "#A68BA5",
  "#253237",
  "#BF1A2F",
  "#9F7833",
  "#C64191",
];

export async function addEvents(userId, calendarName, eventsToAdd, isCalendarNew = false) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);

  isCalendarNew
    ? setDoc(calendarDocRef, { color: calendarColors[0], events: [...eventsToAdd] }, { merge: true })
    : setDoc(calendarDocRef, { events: [...eventsToAdd] }, { merge: true });
}

export async function removeEvents(userId, calendarName, eventsToRemove) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);

  await updateDoc(calendarDocRef, {
    events: arrayRemove(...eventsToRemove),
  });
}

export async function addEvent(userId, calendarName, event) {
  event.rrule = createRruleObject(event.rrule, event.dtstart, event.until);
  delete event.until;

  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);

  await updateDoc(calendarDocRef, {
    events: arrayUnion(event),
  });
}

export async function addEventAndSendToParticipants(userId, calendarName, event, participants) {
  event.rrule = createRruleObject(event.rrule, event.dtstart, event.until);
  delete event.until;

  const batch = writeBatch(db);
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);

  batch.update(calendarDocRef, {
    events: arrayUnion(event),
  });

  const sharingsSubcollectionRef = collection(userRef, "sharings");
  const eventsDocRef = doc(sharingsSubcollectionRef, "events");

  const userData = await getUserData(userId);

  for (const participant of participants) {
    const targetUserRef = doc(db, "users", participant);
    const targetSharingsSubcollectionRef = collection(targetUserRef, "sharings");
    const targetEventsDocRef = doc(targetSharingsSubcollectionRef, "events");

    batch.update(eventsDocRef, {
      outcoming: arrayUnion({
        calendarName,
        eventName: event.summary,
        dtstamp: Math.floor(event.dtstamp.getTime() / 1000),
        targetUserId: participant,
      }),
    });

    batch.update(targetEventsDocRef, {
      incoming: arrayUnion({
        calendarName,
        eventName: event.summary,
        dtstamp: Math.floor(event.dtstamp.getTime() / 1000),
        ...userData,
      }),
    });
  }

  await batch.commit();
}

export async function removeEvent(userId, calendarName, event) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);

  await updateDoc(calendarDocRef, {
    events: arrayRemove(event),
  });
}

export async function updateEvent(userId, oldCalendarName, newCalendarName, oldEvent, newEvent) {
  if (oldCalendarName === newCalendarName) {
    newEvent.rrule = createRruleObject(newEvent.rrule, newEvent.dtstart, newEvent.until);
    delete newEvent.until;
    const eventsArray = await getEventsArray(userId, oldCalendarName);

    const updatedEventsArray = eventsArray.map((event) => {
      if (areObjectsEqual(event, oldEvent)) {
        return newEvent;
      }
      return event;
    });

    const userRef = doc(db, "users", userId);
    const calendarsSubcollectionRef = collection(userRef, "calendars");
    const calendarDocRef = doc(calendarsSubcollectionRef, oldCalendarName);
    await updateDoc(calendarDocRef, {
      events: updatedEventsArray,
    });
  } else {
    await removeEvent(userId, oldCalendarName, oldEvent);
    await addEvent(userId, newCalendarName, newEvent);
  }
}

export async function getEvent(userId, calendarName, eventName, dtstamp) {
  const events = await getEventsArray(userId, calendarName);
  const chosenEvent = events.find((event) => {
    return event.summary === eventName && event.dtstamp.seconds === dtstamp;
  });
  return chosenEvent;
}

export async function getEventsArray(userId, calendarName) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);
  const calendarDoc = await getDoc(calendarDocRef);

  const events = calendarDoc.data().events;

  return events;
}

export async function getCalendarIds(userId) {
  const calendarIds = [];

  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarsSubcollection = await getDocs(calendarsSubcollectionRef);

  calendarsSubcollection.forEach((doc) => {
    calendarIds.push(doc.id);
  });

  return calendarIds;
}

export async function getAllCalendarsEvents(userId) {
  const calendars = await getCalendarIds(userId);

  const allCalendarsEvents = {};

  for (const calendarName of calendars) {
    allCalendarsEvents[calendarName] = {};
    allCalendarsEvents[calendarName].events = await getEventsArray(userId, calendarName);
  }

  return allCalendarsEvents;
}

export async function getAllEventsArray(userId) {
  const calendars = await getCalendarIds(userId);

  const allEventsArray = [];

  for (const calendarName of calendars) {
    const calendarEventsArray = await getEventsArray(userId, calendarName);
    allEventsArray.push(...calendarEventsArray);
  }

  return allEventsArray;
}

export async function getAllCalendarsColors(userId) {
  const calendars = await getCalendarIds(userId);

  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");

  const allCalendarsColors = {};

  for (const calendarName of calendars) {
    const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);
    const calendarDoc = await getDoc(calendarDocRef);
    allCalendarsColors[calendarName] = {};
    allCalendarsColors[calendarName].color = calendarDoc.data().color;
  }

  return allCalendarsColors;
}

export async function updateCalendarColor(userId, calendarName, newColor) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);
  await updateDoc(calendarDocRef, { color: newColor });
}

export async function addCalendar(userId, calendarName) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);
  await setDoc(calendarDocRef, { color: calendarColors[0], events: [] });
}

export async function deleteCalendar(userId, calendarName) {
  const userRef = doc(db, "users", userId);
  const calendarsSubcollectionRef = collection(userRef, "calendars");
  const calendarDocRef = doc(calendarsSubcollectionRef, calendarName);
  await deleteDoc(calendarDocRef);
}

function createRruleObject(rrule, dtstart, until) {
  const byweekdayDate = new Date(dtstart.getDate() - 1);

  switch (rrule) {
    case "Daily":
      return {
        freq: RRule.DAILY,
        interval: 1,
        count: 0,
        until,
        byweekday: null,
        bysetpos: null,
        wkst: RRule.MO.weekday,
      };
    case "Weekly":
      return {
        freq: RRule.WEEKLY,
        count: 0,
        interval: 1,
        until,
        byweekday: null,
        bysetpos: null,
        wkst: RRule.MO.weekday,
      };
    case "Monthly":
      return {
        freq: RRule.MONTHLY,
        count: 0,
        interval: 1,
        until,
        byweekday: byweekdayDate.getDay(),
        bysetpos: Math.floor(dtstart.getDate() / 7) + 1,
        wkst: RRule.MO.weekday,
      };
    case "Annually":
      return {
        freq: RRule.YEARLY,
        count: 0,
        interval: 1,
        until,
        byweekday: null,
        bysetpos: null,
        wkst: RRule.MO.weekday,
      };
    case "Every weekday":
      return {
        freq: RRule.WEEKLY,
        count: 0,
        interval: 1,
        until,
        byweekday: [RRule.MO.weekday, RRule.TU.weekday, RRule.WE.weekday, RRule.TH.weekday, RRule.FR.weekday],
        bysetpos: null,
        wkst: RRule.MO.weekday,
      };
    default:
      return "";
  }
}

export function translateRruleObject(rrule, dtstartObject) {
  const dtstart = new Date(dtstartObject.seconds * 1000);
  const byweekdayDate = new Date(dtstart.getDate() - 1);

  const daily = {
    freq: RRule.DAILY,
    interval: 1,
    count: 0,
    until: rrule.until,
    byweekday: null,
    bysetpos: null,
    wkst: RRule.MO.weekday,
  };

  const weekly = {
    freq: RRule.WEEKLY,
    count: 0,
    interval: 1,
    until: rrule.until,
    byweekday: null,
    bysetpos: null,
    wkst: RRule.MO.weekday,
  };

  const monthly = {
    freq: RRule.MONTHLY,
    count: 0,
    interval: 1,
    until: rrule.until,
    byweekday: byweekdayDate.getDay(),
    bysetpos: Math.floor(dtstart.getDate() / 7) + 1,
    wkst: RRule.MO.weekday,
  };

  const annually = {
    freq: RRule.YEARLY,
    count: 0,
    interval: 1,
    until: rrule.until,
    byweekday: null,
    bysetpos: null,
    wkst: RRule.MO.weekday,
  };

  const everyWeekday = {
    freq: RRule.WEEKLY,
    count: 0,
    interval: 1,
    until: rrule.until,
    byweekday: [RRule.MO.weekday, RRule.TU.weekday, RRule.WE.weekday, RRule.TH.weekday, RRule.FR.weekday],
    bysetpos: null,
    wkst: RRule.MO.weekday,
  };

  if (areObjectsEqual(rrule, daily)) {
    return "Daily";
  } else if (areObjectsEqual(rrule, weekly)) {
    return "Weekly";
  } else if (areObjectsEqual(rrule, monthly)) {
    return "Monthly";
  } else if (areObjectsEqual(rrule, annually)) {
    return "Annually";
  } else if (areObjectsEqual(rrule, everyWeekday)) {
    return "Every weekday";
  } else {
    return null;
  }
}

function areObjectsEqual(objA, objB) {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let key of keysA) {
    if (
      Object.prototype.toString.call(objA[key]) === "[object Object]" &&
      Object.prototype.toString.call(objB[key]) === "[object Object]"
    ) {
      if (!areObjectsEqual(objA[key], objB[key])) {
        return false;
      }
    } else {
      if (objA[key] !== objB[key]) {
        return false;
      }
    }
  }

  return true;
}
