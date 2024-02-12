"use client";
import styles from "@/styles/home/calendar/bookmarkCalendars.module.css";
import checkboxStyles from "@/styles/checkbox.module.css";
import { useContext, useEffect, useState } from "react";
import { CalendarNameContext } from "@/context/calendar-name-context";
import Checkbox from "@/components/Checkbox";
import TwoHorizontalLinesIcon from "@/assets/icons/TwoHorizontalLinesIcon";
import { VisibleCalendarContext } from "@/context/visible-calendar-context";
import { CalendarColorContext } from "@/context/calendar-color-context";

export default function BookmarkCalendars() {
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const [hiddenCalendars, setHiddenCalendars] = useState([]);
  const bookmarkClasses = isBookmarkOpen ? `${styles.bookmark} ${styles.bookmarkOpen}` : styles.bookmark;

  const { calendarNames } = useContext(CalendarNameContext);
  const { setVisibleCalendars } = useContext(VisibleCalendarContext);
  const { allCalendarsColors } = useContext(CalendarColorContext);

  useEffect(() => {
    const visibleCalendars = calendarNames.filter((calendarName) => !hiddenCalendars.includes(calendarName));
    setVisibleCalendars(visibleCalendars);
  }, [calendarNames]);

  function onCheckboxChange(event) {
    const value = event.target.value;
    const isChecked = event.target.checked;
    setHiddenCalendars((prevHiddenCalendars) => {
      return !isChecked
        ? [...prevHiddenCalendars, value]
        : prevHiddenCalendars.filter((calendarName) => calendarName !== value);
    });

    setVisibleCalendars((prevVisibleCalendars) => {
      return isChecked
        ? [...prevVisibleCalendars, value]
        : prevVisibleCalendars.filter((calendarName) => calendarName !== value);
    });
  }

  return (
    <div
      className={bookmarkClasses}
      onMouseEnter={() => {
        setIsBookmarkOpen(true);
      }}
      onMouseLeave={() => {
        setIsBookmarkOpen(false);
      }}
    >
      <div className={styles.calendarNamesContainer}>
        {calendarNames.map((calendar) => {
          return (
            <Checkbox
              key={calendar}
              name="calendar"
              value={calendar}
              onChange={onCheckboxChange}
              className={checkboxStyles.bookmarkCalendars}
              checked={true}
              color={allCalendarsColors[calendar].color}
            />
          );
        })}
      </div>
      <div className={styles.bookmarkBottomButton}>
        <TwoHorizontalLinesIcon
          className={styles.twoLinesIcon}
          onClick={() => {
            setIsBookmarkOpen((bookmarkOpen) => !bookmarkOpen);
          }}
        />
      </div>
    </div>
  );
}
