import { getAllEventsArray } from "./calendarAPI";
import moment from "moment";
import { datetime, RRule } from "rrule";

export async function getAllPossibleMeetingDates(userIdsArray, fromDate, toDate, fromTime, toTime, duration) {
  const allEventsFromDateToDate = await getAllEventsFromDateToDate(userIdsArray, fromDate, toDate);
  const arrayOfDates = allEventsFromDateToDate.flatMap(({ start, end }) => [start, end]);

  const [fromTimeHours, fromTimeMinutes] = fromTime.split(":");
  const [toTimeHours, toTimeMinutes] = toTime.split(":");
  const durationHours = Number(duration.slice(0, -1));
  const fromDateMoment = moment
    .unix(fromDate)
    .set("hour", parseInt(fromTimeHours, 10))
    .set("minute", parseInt(fromTimeMinutes, 10));
  const toDateMoment = moment
    .unix(toDate)
    .set("hour", parseInt(toTimeHours, 10))
    .set("minute", parseInt(toTimeMinutes, 10))
    .subtract(1, "days");

  const allPossibleMeetingDates = [];

  for (let i = 0; i <= arrayOfDates.length; i = i + 2) {
    const timeGapEnd = i === arrayOfDates.length ? toDateMoment.clone() : moment.unix(arrayOfDates[i]);
    const timeGapStart = i === 0 ? fromDateMoment.clone() : moment.unix(arrayOfDates[i - 1]);

    const hoursDiff = timeGapEnd.diff(timeGapStart, "hours") || timeGapEnd.diff(timeGapStart, "minutes") / 60;

    if (hoursDiff >= durationHours) {
      const possibleMeetingDates = getPossibleMeetingDatesInTimeGap(
        timeGapStart,
        timeGapEnd,
        fromTime,
        toTime,
        durationHours
      );
      if (possibleMeetingDates.length > 0) {
        allPossibleMeetingDates.push({
          start: timeGapStart.clone(),
          end: timeGapEnd.clone(),
          possibleMeetingDates,
        });
      }
    }
  }
  return allPossibleMeetingDates;
}

function getPossibleMeetingDatesInTimeGap(timeGapStart, timeGapEnd, fromTime, toTime, durationHours) {
  const possibleMeetingDatesForTimeGap = [];
  const [fromTimeHours, fromTimeMinutes] = fromTime.split(":");
  const [toTimeHours, toTimeMinutes] = toTime.split(":");

  const currentDate = timeGapStart.clone();

  let hoursDiffLeft = timeGapEnd.diff(currentDate, "hours") || timeGapEnd.diff(currentDate, "minutes") / 60;

  while (hoursDiffLeft >= durationHours) {
    if (
      currentDate
        .clone()
        .add(durationHours, "hour")
        .isSameOrBefore(
          currentDate.clone().set("hour", parseInt(toTimeHours, 10)).set("minute", parseInt(toTimeMinutes, 10)),
          "minute"
        )
    ) {
      possibleMeetingDatesForTimeGap.push({
        start: currentDate.clone(),
        end: currentDate.add(durationHours, "hour").clone(),
      });
    } else {
      currentDate.add(1, "day").set("hour", parseInt(fromTimeHours, 10)).set("minute", parseInt(fromTimeMinutes, 10));
    }

    hoursDiffLeft = timeGapEnd.diff(currentDate, "hours") || timeGapEnd.diff(currentDate, "minutes") / 60;
  }
  return possibleMeetingDatesForTimeGap;
}

async function getAllEventsFromDateToDate(userIdsArray, fromDate, toDate) {
  const eventsFromDateToDate = [];

  for (const userId of userIdsArray) {
    const allEventsArray = await getAllEventsArray(userId);
    for (const event of allEventsArray) {
      // check if event recurs
      if (event.rrule === "") {
        const eventStart = moment.unix(event.dtstart.seconds);
        const eventEnd = moment.unix(event.dtend.seconds);
        // check if event recurs between fromDate and toDate and if it is not allDayEvent
        if (
          eventStart.unix() >= fromDate &&
          eventEnd.unix() <= toDate &&
          eventStart.format("HH:mm") !== "00:00" &&
          eventEnd.format("HH:mm") !== "00:00"
        ) {
          eventsFromDateToDate.push({ start: eventStart.unix(), end: eventEnd.unix() });
        }
      } else {
        const eventRecurrences = getEventRecurrences(event, fromDate, toDate);
        for (const eventRecurrence of eventRecurrences) {
          const eventStart = moment.unix(eventRecurrence.start);
          const eventEnd = moment.unix(eventRecurrence.end);
          // check again if event recurs between fromDate and toDate and if it is not allDayEvent
          if (
            eventStart.unix() >= fromDate &&
            eventEnd.unix() <= toDate &&
            eventStart.format("HH:mm") !== "00:00" &&
            eventEnd.format("HH:mm") !== "00:00"
          ) {
            eventsFromDateToDate.push(eventRecurrence);
          }
        }
      }
    }

    eventsFromDateToDate.sort((a, b) => {
      return a.start - b.start;
    });
  }

  return eventsFromDateToDate;
}

function getEventRecurrences(event, fromDate, toDate) {
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
      firstDateOfRecurringEvent.hour() - 1,
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
    datetime(moment.unix(fromDate).year(), moment.unix(fromDate).month() + 1, moment.unix(fromDate).date()),
    datetime(moment.unix(toDate).year(), moment.unix(toDate).month() + 1, moment.unix(toDate).date())
  );

  return eventRecurrences.map((eventRecurrence) => {
    const eventStart = moment(eventRecurrence, "YYYY-MM-DDTHH:mm:ss").unix();
    const eventEnd =
      moment(eventRecurrence, "YYYY-MM-DDTHH:mm:ss").unix() + (event.dtend.seconds - event.dtstart.seconds);

    return { start: eventStart, end: eventEnd };
  });
}
