import styles from "@/styles/home/slidePanelElements.module.css";
import { SharingContext } from "@/context/sharing-context";
import { useContext } from "react";
import CalendarInvitation from "./CalendarInvitation";

export default function IncomingCalendars() {
  const { incomingCalendars } = useContext(SharingContext);

  return (
    <div className={styles.section}>
      <h4 className={styles.header}>Incoming calendars</h4>
      <div className={styles.incomingCalendarsContainer}>
        {incomingCalendars.length > 0 &&
          incomingCalendars.map((incomingCalendarData) => {
            return (
              <CalendarInvitation
                key={`${incomingCalendarData.email}${incomingCalendarData.calendarName}`}
                name={incomingCalendarData.name}
                surname={incomingCalendarData.surname}
                email={incomingCalendarData.email}
                calendarName={incomingCalendarData.calendarName}
              />
            );
          })}
      </div>
      {incomingCalendars.length === 0 && <p className={styles.info}>No incoming calendars</p>}
    </div>
  );
}
