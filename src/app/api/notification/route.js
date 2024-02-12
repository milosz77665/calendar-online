import moment from "moment";
import momentTz from "moment-timezone";
import webpush from "web-push";
import { NextResponse } from "next/server";

let timeout1;
let timeout2;

webpush.setVapidDetails(
  "mailto:test@test.com",
  "BHsaEE4weaJwP0PFyzVruNHbf13eKNP9vAUoy8Fct0rkEyJ5lsYFlrZhmmgDq8I4j2Rva90YuqiVuTUKwmboRGI",
  "JvBEwJIT8kTNOVks_B9o0Sb_tBhIc0fghlBS5nqzB3g"
);

export async function POST(req) {
  try {
    const { subscription, eventsListString } = await req.json();
    const eventsList = JSON.parse(eventsListString);
    clearScheduledEventNotifications();
    for (const event of eventsList) {
      scheduleEventNotification(subscription, JSON.parse(event));
    }
    return NextResponse.json({ message: "Push subscription saved" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function scheduleEventNotification(subscription, event) {
  const payload = {
    body: `${moment.tz(moment.unix(event.dtstart), "Europe/Warsaw").format("HH:mm")} - ${moment
      .tz(moment.unix(event.dtend), "Europe/Warsaw")
      .format("HH:mm")}`,
  };

  const eventDtStartMilliseconds = event.dtstart * 1000;
  const currentTime = new Date().getTime();
  const timeDiff = eventDtStartMilliseconds - currentTime;

  if (timeDiff > 300000) {
    timeout1 = setTimeout(() => {
      async function sendEventNotification() {
        payload.title = `Event starts in 5 minutes: ${event.summary}`;
        payload.tag = `${event.dtstamp}1`;
        await webpush.sendNotification(subscription, JSON.stringify(payload));
      }
      sendEventNotification();
    }, timeDiff - 300000);
  }

  if (timeDiff > -60000) {
    timeout2 = setTimeout(() => {
      async function sendEventNotification() {
        payload.title = `Event is starting now: ${event.summary}`;
        payload.tag = `${event.dtstamp}2`;
        await webpush.sendNotification(subscription, JSON.stringify(payload));
      }
      sendEventNotification();
    }, timeDiff);
  }
}

export function clearScheduledEventNotifications() {
  clearTimeout(timeout1);
  clearTimeout(timeout2);
}
