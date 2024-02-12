import styles from "@/styles/home/eventInvitation.module.css";
import dropdownListStyles from "@/styles/dropdownList.module.css";
import { addEvent, removeEvent } from "@/api/sharingAPI";
import { getUserIdByEmail } from "@/api/userAPI";
import TickIcon from "@/assets/icons/TickIcon";
import CrossIcon from "@/assets/icons/CrossIcon";
import CheckCircleIcon from "@/assets/icons/CheckCircleIcon";
import { auth } from "@/config/firebase";
import { useContext, useRef } from "react";
import { CalendarNameContext } from "@/context/calendar-name-context";
import DropdownList from "@/components/DropdownList";
import { CalendarColorContext } from "@/context/calendar-color-context";

export default function EventInvitation({ name, surname, email, eventName, dtstamp, targetCalendarName }) {
  const { calendarNames } = useContext(CalendarNameContext);
  const { allCalendarsColors } = useContext(CalendarColorContext);
  const calendarNameRef = useRef();

  async function handleAcceptEventInvitation() {
    const targetUserId = await getUserIdByEmail(email);
    await addEvent(
      auth.currentUser.uid,
      calendarNameRef.current.textContent,
      targetCalendarName,
      eventName,
      dtstamp,
      targetUserId
    );
  }

  async function handleRejectEventInvitation() {
    const targetUserId = await getUserIdByEmail(email);
    await removeEvent(auth.currentUser.uid, targetCalendarName, eventName, dtstamp, targetUserId);
  }

  return (
    <div className={styles.eventInvitationCard}>
      <CheckCircleIcon color="var(--black)" className={styles.eventIcon} />
      <p className={styles.eventName}>{eventName}</p>
      <p className={styles.name}>{`${name} ${surname}`}</p>
      <p className={styles.email}>{email}</p>
      <div className={styles.lastRowContainer}>
        <DropdownList
          dropdownListRef={calendarNameRef}
          list={calendarNames}
          colors={allCalendarsColors}
          className={dropdownListStyles.eventInvitation}
        />
        <TickIcon
          color="var(--black)"
          title="Accept"
          className={styles.acceptIcon}
          onClick={handleAcceptEventInvitation}
        />
        <CrossIcon
          color="var(--black)"
          title="Reject"
          className={styles.rejectIcon}
          onClick={handleRejectEventInvitation}
        />
      </div>
    </div>
  );
}
