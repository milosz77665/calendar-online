import styles from "@/styles/home/slidePanelElements.module.css";
import { SharingContext } from "@/context/sharing-context";
import { useContext } from "react";
import EventInvitation from "./EventInvitation";

export default function IncomingEvents() {
  const { incomingEvents } = useContext(SharingContext);

  return (
    <div className={styles.section}>
      <h4 className={styles.header}>Incoming events</h4>
      <div className={styles.incomingEventsContainer}>
        {incomingEvents.length > 0 &&
          incomingEvents.map((incomingEventData) => {
            return (
              <EventInvitation
                key={`${incomingEventData.email}${incomingEventData.calendarName}${incomingEventData.dtstamp}`}
                name={incomingEventData.name}
                surname={incomingEventData.surname}
                email={incomingEventData.email}
                eventName={incomingEventData.eventName}
                dtstamp={incomingEventData.dtstamp}
                targetCalendarName={incomingEventData.calendarName}
              />
            );
          })}
      </div>
      {incomingEvents.length === 0 && <p className={styles.info}>No incoming events</p>}
    </div>
  );
}
