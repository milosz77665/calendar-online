"use-client";
import styles from "@/styles/home/calendar/dayCard.module.css";
import buttonStyles from "@/styles/button.module.css";
import moment from "moment";
import { useState, useEffect, useRef, useContext } from "react";
import useComponentHeight from "@/hooks/useComponentHeight";
import useWindowSize from "@/hooks/useWindowSize";
import Button from "@/components/Button";
import Event from "./Event";
import TickIcon from "@/assets/icons/TickIcon";
import CopyIcon from "@/assets/icons/CopyIcon";
import PlusIcon from "@/assets/icons/PlusIcon";
import { EventModalContext } from "@/context/event-modal-context";

export default function DayCard({
  dayNumber,
  month,
  year,
  isDayInCurrentMonth,
  eventObjects = [],
  nameDays,
  isShowNameDaysChecked,
}) {
  const { handleEventModalAction } = useContext(EventModalContext);

  const windowSize = useWindowSize();
  const eventHeight = windowSize.width <= 500 ? 15 : windowSize.width <= 700 ? 13 : windowSize.width <= 1000 ? 16 : 24;
  const gap = windowSize.width <= 700 ? 2 : 3;
  const [isCopied, setIsCopied] = useState(false);

  eventObjects.sort((a, b) => {
    const timeA = moment.unix(a.event.dtstart.seconds).format("HH:mm");
    const timeB = moment.unix(b.event.dtstart.seconds).format("HH:mm");
    return timeA.localeCompare(timeB);
  });

  const eventComponents = eventObjects.map((eventObject, index) => {
    const id = `${dayNumber}${eventObject.event.dtstamp.seconds}${index}`;
    return (
      <Event
        key={id}
        id={`event${id}`}
        calendarName={eventObject.calendarName}
        color={eventObject.color}
        event={eventObject.event}
      />
    );
  });

  const [eventSectionHeight, eventSectionRef] = useComponentHeight();
  const maxNumberOfEvents =
    Math.floor((eventSectionHeight - (Math.floor(eventSectionHeight / eventHeight) - 1) * gap) / eventHeight) || 1;

  const day = Number(dayNumber);
  const isToday = moment({ year, month, day }).isSame(moment(), "day");
  const [isShowMoreOpen, setIsShowMoreOpen] = useState(false);
  const showMoreContainerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isShowMoreOpen && !showMoreContainerRef.current.contains(e.target)) {
        setIsShowMoreOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isShowMoreOpen]);

  function handleCopy() {
    const tempTextArea = document.createElement("textarea");

    const eventsString = eventObjects.map((eventObject) => {
      const eventStartTime = moment.unix(eventObject.event.dtstart.seconds).format("HH:mm");
      const eventEndTime = moment.unix(eventObject.event.dtend.seconds).format("HH:mm");

      return eventStartTime === eventEndTime
        ? null
        : `\n${eventStartTime}-${eventEndTime} - "${eventObject.event.summary}"`;
    });
    tempTextArea.value = `Events on ${moment({ year, month, day }).format("DD.MM.YYYY")}: ${
      eventsString.toString().length > 0 ? eventsString : "\nNo events"
    }`;
    tempTextArea.value = tempTextArea.value.replace(",", "");
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  }

  return (
    <div
      className={styles.dayCardContainer}
      style={
        isToday
          ? { borderColor: "var(--secondary)", borderWidth: "0.2rem" }
          : isDayInCurrentMonth
          ? {}
          : moment({ day: dayNumber, month, year }).day() === 0 || moment({ day: dayNumber, month, year }).day() === 6
          ? { border: "none", boxShadow: "0 0 0 0.05rem var(--dark-red)" }
          : { border: "none", boxShadow: "0 0 0 0.05rem var(--grey)" }
      }
    >
      {isCopied ? (
        <TickIcon color="var(--grey)" className={styles.tickIcon} title={"Copied"} />
      ) : (
        <CopyIcon color="var(--grey)" onClick={handleCopy} className={styles.copyIcon} title={"Copy"} />
      )}
      <PlusIcon
        color="var(--grey)"
        className={styles.plusIcon}
        title={"Add event"}
        onClick={() => {
          handleEventModalAction({
            type: "OPEN_ADD_EVENT_MODAL_WITH_DATE",
            date: {
              start: moment({ day, month, year }),
              end: moment({ day, month, year }),
            },
          });
        }}
      />
      <p
        className={styles.dayNumber}
        style={
          isToday
            ? {
                color: "var(--secondary)",
              }
            : {}
        }
      >
        {dayNumber}
      </p>

      {isShowNameDaysChecked ? (
        <div className={styles.nameDaysContainer}>
          <p className={styles.nameDays}>{nameDays && nameDays.join(", ")}</p>
        </div>
      ) : (
        <div ref={eventSectionRef} className={styles.eventSection}>
          {eventComponents.length <= maxNumberOfEvents
            ? eventComponents
            : eventComponents.slice(0, maxNumberOfEvents - 1)}
          {eventComponents.length > maxNumberOfEvents && (
            <button
              className={styles.showMoreButton}
              onClick={() => {
                setIsShowMoreOpen(true);
              }}
            >
              {windowSize.width <= 500 ? "..." : "Show more..."}
            </button>
          )}
        </div>
      )}
      {isShowMoreOpen && (
        <div ref={showMoreContainerRef} className={styles.showMoreContainer}>
          <Button
            className={buttonStyles.smallCloseButton}
            onClick={() => {
              setIsShowMoreOpen(false);
            }}
          >
            X
          </Button>
          <p className={styles.showMoreDayNumber}>{dayNumber}</p>
          <div className={styles.showMoreEventSection}>{eventComponents}</div>
        </div>
      )}
    </div>
  );
}
