"use client";
import styles from "@/styles/home/calendar/event.module.css";
import moment from "moment";
import { useContext, useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { removeEvent } from "@/api/calendarAPI";
import { ConfirmContext } from "@/context/confirm-context";
import { EventModalContext } from "@/context/event-modal-context";
import useWindowSize from "@/hooks/useWindowSize";
import EyeIcon from "@/assets/icons/EyeIcon";
import TrashIcon from "@/assets/icons/TrashIcon";

export default function Event({ color, event, calendarName, id }) {
  const windowSize = useWindowSize();

  const { eventModal, handleEventModalAction } = useContext(EventModalContext);
  const { showConfirm } = useContext(ConfirmContext);

  const isAllDayEvent = getStartTimeString(event) === "00:00";
  const eventSummaryClasses = isAllDayEvent
    ? styles.eventSummary
    : `${styles.allDayEventSummary} ${styles.eventSummary}`;
  const eventSummary = isAllDayEvent ? event.summary : `${getStartTimeString(event)} ${event.summary}`;

  const [isIconContainerOpen, setIsIconContainerOpen] = useState(false);

  const iconContainerClasses =
    windowSize.width <= 500
      ? isIconContainerOpen
        ? styles.iconContainerOpen
        : styles.iconContainerHidden
      : styles.iconContainer;

  function getStartTimeString(event) {
    return moment.unix(event.dtstart.seconds).format("HH:mm");
  }

  async function handleDelete() {
    await removeEvent(auth.currentUser.uid, calendarName, event);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      const iconContainerComponent = document.getElementById(id);
      if (iconContainerComponent && !iconContainerComponent.contains(event.target)) {
        setIsIconContainerOpen(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      id={id}
      className={styles.event}
      onClick={() => {
        windowSize.width <= 500 ? setIsIconContainerOpen((iconContainerOpen) => !iconContainerOpen) : null;
      }}
      style={{ backgroundColor: isAllDayEvent ? color : "var(--white)", borderColor: color }}
    >
      {!isAllDayEvent && <div className={styles.circle} style={{ backgroundColor: color }}></div>}
      <div className={styles.eventSummaryContainer}>
        <p className={eventSummaryClasses}>{eventSummary}</p>
      </div>
      <div
        className={iconContainerClasses}
        style={{ backgroundColor: isAllDayEvent ? color : "var(--white)", borderColor: color }}
      >
        <EyeIcon
          className={styles.icon}
          title="Details"
          color={isAllDayEvent ? "var(--white)" : "var(--black)"}
          onClick={() => {
            if (eventModal.isOpen) {
              handleEventModalAction({ type: "CLOSE_MODAL" });
            } else {
              handleEventModalAction({ type: "OPEN_EDIT_EVENT_MODAL", oldEvent: event, calendarName });
            }
          }}
        />
        <div className={styles.eventSummaryContainer}>
          <p className={eventSummaryClasses}>{eventSummary}</p>
        </div>
        <TrashIcon
          className={styles.icon}
          title="Delete"
          color={isAllDayEvent ? "var(--white)" : "var(--black)"}
          onClick={() => {
            showConfirm(`Event "${event.summary}" will be deleted`, { action: handleDelete });
          }}
        />
      </div>
    </div>
  );
}
