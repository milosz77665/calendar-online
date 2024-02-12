"use client";
import styles from "@/styles/home/slidePanelElements.module.css";
import buttonStyles from "@/styles/button.module.css";
import { useContext, useState } from "react";
import { CalendarNameContext } from "@/context/calendar-name-context";
import Button from "@/components/Button";
import { addCalendar } from "@/api/calendarAPI";
import { auth } from "@/config/firebase";
import createUniqueCalendarName from "@/utils/createUniqueCalendarName";
import { CalendarColorContext } from "@/context/calendar-color-context";
import CalendarElement from "./CalendarElement";

export default function CalendarsSection() {
  const { allCalendarsColors } = useContext(CalendarColorContext);
  const { calendarNames } = useContext(CalendarNameContext);
  const [newCalendarName, setNewCalendarName] = useState("");

  function handleInputChange(event) {
    setNewCalendarName(event.target.value);
  }

  function handleAddCalendar(event) {
    event.preventDefault();
    const uniqueCalendarName = createUniqueCalendarName(newCalendarName, calendarNames);
    addCalendar(auth.currentUser.uid, uniqueCalendarName);
    setNewCalendarName("");
  }

  return (
    <div className={styles.section}>
      <h4 className={styles.header}>All calendars</h4>
      <form className={styles.addNewCalendarContainer}>
        <input
          className={styles.calendarNameInput}
          onChange={handleInputChange}
          value={newCalendarName}
          name="calendarName"
          type="text"
          placeholder="New calendar name"
        />
        <Button
          className={buttonStyles.slidePanelButton}
          onClick={handleAddCalendar}
          disabled={newCalendarName.length === 0}
        >
          Add
        </Button>
      </form>
      <div className={styles.calendarsSection}>
        {Object.entries(allCalendarsColors).map(([calendarName, value]) => {
          return (
            <CalendarElement
              key={calendarName}
              id={`CalendarMoreActions${calendarName}`}
              calendarName={calendarName}
              color={value.color}
            />
          );
        })}
      </div>
    </div>
  );
}
