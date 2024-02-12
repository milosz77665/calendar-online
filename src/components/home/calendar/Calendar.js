"use client";
import styles from "@/styles/home/calendar/calendar.module.css";
import buttonStyles from "@/styles/button.module.css";
import { useContext, useState } from "react";
import { EventModalContext } from "@/context/event-modal-context";
import CalendarGrid from "./CalendarGrid";
import Button from "@/components/Button";
import moment from "moment";
import PlusIcon from "@/assets/icons/PlusIcon";
import useWindowSize from "@/hooks/useWindowSize";
import Checkbox from "@/components/Checkbox";

export default function Calendar() {
  moment.updateLocale("en", {
    week: { dow: 1 },
  });

  const windowSize = useWindowSize();
  const { eventModal, handleEventModalAction } = useContext(EventModalContext);
  const [currentDate, setCurrentDate] = useState(moment());
  const [isShowNameDaysChecked, setIsShowNameDaysChecked] = useState(false);

  const currentMonth = currentDate.month();
  const currentYear = currentDate.year();

  return (
    <div className={styles.calendar}>
      <div className={styles.sectionWithCheckbox}>
        <div className={styles.sectionAboveCalendarGrid}>
          <Button
            className={buttonStyles.nextPreviousMonthButton}
            onClick={() => {
              setCurrentDate(currentDate.clone().subtract(1, "month"));
            }}
          >
            {"<"}
          </Button>
          <h2 className={styles.monthAndYear}>
            {`${
              windowSize.width <= 550
                ? moment().month(currentMonth).format("MMM")
                : moment().month(currentMonth).format("MMMM")
            } ${currentYear}`}
          </h2>
          <Button
            className={buttonStyles.nextPreviousMonthButton}
            onClick={() => {
              setCurrentDate(currentDate.clone().add(1, "month"));
            }}
          >
            {">"}
          </Button>
          <Button
            className={buttonStyles.addEventButton}
            onClick={() => {
              if (eventModal.isOpen) {
                handleEventModalAction({ type: "CLOSE_MODAL" });
              } else {
                handleEventModalAction({ type: "OPEN_ADD_EVENT_MODAL" });
              }
            }}
          >
            <PlusIcon color="var(--white)" size={20} className={styles.icon} />{" "}
            {windowSize.width <= 500 ? null : "Add event"}
          </Button>
        </div>
        <Checkbox
          name="isShowNameDaysChecked"
          value="Show name days"
          onChange={() => {
            setIsShowNameDaysChecked((prevIsShowNameDaysChecked) => !prevIsShowNameDaysChecked);
          }}
        />
      </div>
      <CalendarGrid month={currentMonth} year={currentYear} isShowNameDaysChecked={isShowNameDaysChecked} />
    </div>
  );
}
