"use client";
import { createContext, useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { getAllCalendarsEvents } from "@/api/calendarAPI";
import { auth, db } from "@/config/firebase";
import { datetime, RRule } from "rrule";
import moment from "moment";

export const CalendarContext = createContext();

export function CalendarContextProvider({ children }) {
  const [allCalendarsEvents, setAllCalendarsEvents] = useState({});

  useEffect(() => {
    async function fetchAllEvents() {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const allEvents = await getAllCalendarsEvents(currentUser.uid);
        setAllCalendarsEvents(allEvents);
      }
    }

    fetchAllEvents();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const calendarsSubcollectionRef = collection(userRef, "calendars");

    const unsubscribe = onSnapshot(calendarsSubcollectionRef, (calendarsSubcollection) => {
      const calendarsEvents = {};
      calendarsSubcollection.forEach((doc) => {
        if (doc.exists()) {
          calendarsEvents[doc.id] = {};
          calendarsEvents[doc.id].events = doc.data().events;
        }
      });
      setAllCalendarsEvents(calendarsEvents);
    });

    return () => unsubscribe();
  }, []);

  function getAllEventsForGivenMonth(calendars, month, year, allCalendarsColors) {
    let allEventsForGivenMonth = {};

    const firstDayOfTheMonth = moment([year, month]).startOf("month");
    const lastDayOfTheMonth = moment([year, month]).endOf("month");

    const firstDayOfTheWeek = moment(firstDayOfTheMonth).startOf("week");
    const lastDayOfTheWeek = moment(lastDayOfTheMonth).endOf("week");

    for (const calendarName of calendars) {
      const color = allCalendarsColors ? allCalendarsColors[calendarName].color : null;
      // Check if the given calendar contains at least one event in the events array
      if (allCalendarsEvents[calendarName].events.length > 0) {
        allCalendarsEvents[calendarName].events.forEach((event) => {
          const eventStart = event.dtstart.toMillis();
          const eventEnd = event.dtend.toMillis();
          // Check if the rrule value for a given event is empty (if the event doesn't recur)
          if (event.rrule === "") {
            // Check if the event occurs between firstDayOfTheWeek and lastDayOfTheWeek
            if ((eventStart >= firstDayOfTheWeek && eventEnd <= lastDayOfTheWeek) || eventEnd > firstDayOfTheWeek) {
              const eventStartDate = moment.unix(event.dtstart.seconds);
              const eventEndDate = moment.unix(event.dtend.seconds);
              let currentDate = eventStartDate.clone();
              // Check if the event lasts for at least one day and ends at 00:00 (to determine whether the last day of the event should be displayed in the CalendarGrid)
              if (
                (eventEndDate.diff(eventStartDate, "days") > 0 ||
                  eventEndDate.format("DMMY") !== eventStartDate.format("DMMY")) &&
                eventEndDate.format("HH:mm") === "00:00"
              ) {
                while (currentDate.isBefore(eventEndDate, "day")) {
                  allEventsForGivenMonth[currentDate.format("DDMMY")]
                    ? null
                    : (allEventsForGivenMonth[currentDate.format("DDMMY")] = []);
                  allEventsForGivenMonth[currentDate.format("DDMMY")].push({ calendarName, color, event });
                  currentDate.add(1, "day");
                }
              } else {
                while (currentDate.isSameOrBefore(eventEndDate, "day")) {
                  allEventsForGivenMonth[currentDate.format("DDMMY")]
                    ? null
                    : (allEventsForGivenMonth[currentDate.format("DDMMY")] = []);
                  allEventsForGivenMonth[currentDate.format("DDMMY")].push({ calendarName, color, event });
                  currentDate.add(1, "day");
                }
              }
            }
            // otherwise if event recurs
          } else {
            const firstDateOfRecurringEvent = moment.unix(event.dtstart.seconds);
            const untilDate = event.rrule.until ? moment.unix(event.rrule.until.seconds) : null;
            const until = untilDate
              ? datetime(
                  untilDate.year(),
                  untilDate.month() + 1,
                  untilDate.date(),
                  untilDate.hour(),
                  untilDate.minute(),
                  untilDate.second() - 1
                )
              : undefined;

            const rruleOptions = {
              dtstart: datetime(
                firstDateOfRecurringEvent.year(),
                firstDateOfRecurringEvent.month() + 1,
                firstDateOfRecurringEvent.date(),
                firstDateOfRecurringEvent.hour(),
                firstDateOfRecurringEvent.minute(),
                firstDateOfRecurringEvent.second()
              ),
              freq: event.rrule.freq,
              interval: event.rrule.interval,
              wkst: event.rrule.wkst,
              byweekday: event.rrule.byweekday,
              bysetpos: event.rrule.bysetpos,
              until,
              count: event.rrule.count ? event.rrule.count : undefined,
            };

            const rrule = new RRule(rruleOptions);

            const eventRecurrences = rrule.between(
              datetime(firstDayOfTheWeek.year(), firstDayOfTheWeek.month() + 1, firstDayOfTheWeek.date() - 1),
              datetime(lastDayOfTheWeek.year(), lastDayOfTheWeek.month() + 1, lastDayOfTheWeek.date() + 1)
            );

            if (eventRecurrences.length > 0) {
              eventRecurrences.forEach((recurrence) => {
                allEventsForGivenMonth[moment(recurrence).format("DDMMY")]
                  ? null
                  : (allEventsForGivenMonth[moment(recurrence).format("DDMMY")] = []);
                allEventsForGivenMonth[moment(recurrence).format("DDMMY")].push({ calendarName, color, event });
              });
            }
          }
        });
      }
    }
    return allEventsForGivenMonth;
  }

  return (
    <CalendarContext.Provider value={{ allCalendarsEvents, getAllEventsForGivenMonth }}>
      {children}
    </CalendarContext.Provider>
  );
}
