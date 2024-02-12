import ical from "cal-parser";
import { getEventsArray } from "./calendarAPI";
import { RRule } from "rrule";

export function getCalendarJsonDataFromIcsFile(icsFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const jsonData = ical.parseString(fileContent);

      if (fileContent.includes("PRODID:Microsoft")) {
        jsonData.events.forEach((event) => {
          event.dtstamp = correctTimezoneOffset(event.dtstamp);
          event.dtend.value =
            event.dtend.params.value === "DATE" ? event.dtend.value : correctTimezoneOffset(event.dtend.value);
          event.dtstart.value =
            event.dtstart.params.value === "DATE" ? event.dtstart.value : correctTimezoneOffset(event.dtstart.value);
        });
      }

      const events = jsonData.events.map((event) => {
        if (event.recurrenceRule) {
          delete event.recurrenceRule.options.tzid;
          delete event.recurrenceRule.options.bymonthday;
          delete event.recurrenceRule.options.bynweekday;
          delete event.recurrenceRule.options.byeaster;
          delete event.recurrenceRule.options.byminute;
          delete event.recurrenceRule.options.bysecond;
          delete event.recurrenceRule.options.byhour;
          delete event.recurrenceRule.options.byyearday;
          delete event.recurrenceRule.options.bynmonthday;
          delete event.recurrenceRule.options.bymonth;
          delete event.recurrenceRule.options.byweekno;
          delete event.recurrenceRule.options.dtstart;
        }

        return {
          summary: event.summary.value,
          description: event.description?.value || "",
          dtstart: event.dtstart.value,
          dtend: event.dtend?.value || event.dtstart.value,
          dtstamp: event.dtstamp,
          rrule: event.recurrenceRule?.options || "",
          location: event.location?.value || "",
        };
      });

      resolve({ calendarName: jsonData.calendarData["x-wr-calname"], events });
    };

    reader.onerror = (e) => {
      reject(new Error("Error occurred while reading the file"));
    };

    reader.readAsText(icsFile);
  });
}

export async function generateIcsFileContent(userId, calendarName) {
  const events = await getEventsArray(userId, calendarName);

  const icsContent = `BEGIN:VCALENDAR
METHOD:PUBLISH
PRODID:Calendar Miłosz Marchewka Praca Inżynierska
VERSION:2.0
X-WR-CALNAME:${calendarName}
BEGIN:VTIMEZONE
TZID:Europe/Warsaw
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
${events
  .map((event) => {
    const dtstart = convertDateToIcsFormat(event.dtstart);
    const dtend = convertDateToIcsFormat(event.dtend);
    const dtstamp = convertDateToIcsFormat(event.dtstamp);
    return `BEGIN:VEVENT
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
DTSTART:${dtstart}Z
DTEND:${dtend}Z
DTSTAMP:${dtstamp}Z${event.rrule ? `\nRRULE: ${getRruleString(event.rrule)}` : ""}
LOCATION:${event.location}
END:VEVENT`;
  })
  .join("\n")}
END:VCALENDAR`;
  return icsContent;
}

function convertDateToIcsFormat(inputDate) {
  const date = inputDate.toDate();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function correctTimezoneOffset(date) {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

function getRruleString(rrule) {
  const rruleString = new RRule(rrule).toString().replace(/^RRULE:/, "");
  return rruleString;
}
