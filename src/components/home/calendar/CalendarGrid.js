"use client";
import styles from "@/styles/home/calendar/calendarGrid.module.css";
import { useContext, useEffect, useState } from "react";
import DayCard from "./DayCard";
import moment from "moment";
import { VisibleCalendarContext } from "@/context/visible-calendar-context";
import { CalendarContext } from "@/context/calendar-context";
import { CalendarColorContext } from "@/context/calendar-color-context";
import useWindowSize from "@/hooks/useWindowSize";
import { requestNotificationPermission } from "@/utils/notificationService";
import { getReadyServiceWorker } from "@/utils/serviceWorkerManager";
import { getNameDaysList } from "@/api/nameDaysAPI";

export default function CalendarGrid({ month, year, isShowNameDaysChecked }) {
  const windowSize = useWindowSize();
  const { visibleCalendars } = useContext(VisibleCalendarContext);
  const { allCalendarsColors } = useContext(CalendarColorContext);
  const { getAllEventsForGivenMonth } = useContext(CalendarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [eventsForMonth, setEventsForMonth] = useState({});
  const [nameDays, setNameDays] = useState([]);

  const firstDayOfTheMonth = moment([year, month]).startOf("month");
  const lastDayOfTheMonth = moment([year, month]).endOf("month");

  const startDate = moment(firstDayOfTheMonth).startOf("week");
  const endDate = moment(lastDayOfTheMonth).endOf("week");

  useEffect(() => {
    async function fetchNameDays() {
      const nameDaysList = await getNameDaysList();
      setNameDays(nameDaysList);
    }
    fetchNameDays();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const allEventsForMonth = getAllEventsForGivenMonth(visibleCalendars, month, year, allCalendarsColors);
    setEventsForMonth(allEventsForMonth);

    setIsLoading(false);
  }, [visibleCalendars, month, year]);

  useEffect(() => {
    async function setNotifications() {
      const permission = await requestNotificationPermission();
      if (permission === "granted") {
        const notificationDate = moment();
        const numberOfNotificationDates = 5;
        const eventsList = [];
        for (let day = 0; day < numberOfNotificationDates; day++) {
          if (eventsForMonth[notificationDate.format("DDMMY")]) {
            for (const eventObject of eventsForMonth[notificationDate.format("DDMMY")]) {
              eventsList.push(
                JSON.stringify({
                  summary: eventObject.event.summary,
                  dtstart: eventObject.event.dtstart.seconds,
                  dtstamp: eventObject.event.dtstamp.seconds,
                  dtend: eventObject.event.dtend.seconds,
                })
              );
            }
          }
          notificationDate.add(1, "day");
        }
        if (eventsList.length > 0) {
          const registration = await getReadyServiceWorker();
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey:
              "BHsaEE4weaJwP0PFyzVruNHbf13eKNP9vAUoy8Fct0rkEyJ5lsYFlrZhmmgDq8I4j2Rva90YuqiVuTUKwmboRGI",
          });
          const payload = { subscription, eventsListString: JSON.stringify(eventsList) };

          await fetch("/api/notification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }
      }
    }

    if ("Notification" in window) {
      setNotifications();
    }
  }, [eventsForMonth]);

  const dayCardComponentsArray = [];

  let currentDate = startDate.clone();
  let index = 0;

  while (currentDate.isSameOrBefore(endDate, "day")) {
    if (eventsForMonth[currentDate.format("DDMMY")]) {
      dayCardComponentsArray.push(
        <DayCard
          eventObjects={eventsForMonth[currentDate.format("DDMMY")]}
          key={`${month}${index}`}
          month={currentDate.month()}
          year={year}
          isDayInCurrentMonth={month === currentDate.month()}
          dayNumber={currentDate.format("D")}
          nameDays={nameDays.length > 0 && nameDays[currentDate.format("M") - 1][currentDate.format("D")]}
          isShowNameDaysChecked={isShowNameDaysChecked}
        />
      );
    } else {
      dayCardComponentsArray.push(
        <DayCard
          key={`${month}${index}`}
          month={currentDate.month()}
          year={year}
          isDayInCurrentMonth={month === currentDate.month()}
          dayNumber={currentDate.format("D")}
          nameDays={nameDays.length > 0 && nameDays[currentDate.format("M") - 1][currentDate.format("D")]}
          isShowNameDaysChecked={isShowNameDaysChecked}
        />
      );
    }
    currentDate.add(1, "day");
    index++;
  }

  return (
    <div className={styles.calendarGrid}>
      <div className={styles.dayNamesContainer}>
        {moment.weekdays(true).map((weekday, index) => {
          return (
            <p key={index} className={styles.dayName}>
              {windowSize.width <= 600 ? weekday.substring(0, 3) : weekday}
            </p>
          );
        })}
      </div>
      <div className={styles.dayCardsContainer} style={{ gridTemplateRows: `repeat(${index / 7}, 1fr)` }}>
        {isLoading ? null : dayCardComponentsArray}
      </div>
    </div>
  );
}
