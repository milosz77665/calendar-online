import styles from "@/styles/home/calendarInvitation.module.css";
import { addCalendar, removeCalendar } from "@/api/sharingAPI";
import { getUserIdByEmail } from "@/api/userAPI";
import TickIcon from "@/assets/icons/TickIcon";
import CrossIcon from "@/assets/icons/CrossIcon";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import { auth } from "@/config/firebase";
import { useContext } from "react";
import { CalendarNameContext } from "@/context/calendar-name-context";
import createUniqueCalendarName from "@/utils/createUniqueCalendarName";

export default function CalendarInvitation({ name, surname, email, calendarName }) {
  const { calendarNames } = useContext(CalendarNameContext);
  const uniqueCalendarName = createUniqueCalendarName(calendarName, calendarNames);

  async function handleAcceptCalendarInvitation() {
    const targetUserId = await getUserIdByEmail(email);
    await addCalendar(auth.currentUser.uid, calendarName, uniqueCalendarName, targetUserId);
  }

  async function handleRejectCalendarInvitation() {
    const targetUserId = await getUserIdByEmail(email);
    await removeCalendar(auth.currentUser.uid, calendarName, targetUserId);
  }

  return (
    <div className={styles.calendarInvitationCard}>
      <CalendarIcon color="var(--black)" className={styles.calendarIcon} />
      <p className={styles.calendarName}>{uniqueCalendarName}</p>
      <p className={styles.name}>{`${name} ${surname}`}</p>
      <p className={styles.email}>{email}</p>
      <div className={styles.iconContainer}>
        <TickIcon
          color="var(--black)"
          title="Accept"
          className={styles.acceptIcon}
          onClick={handleAcceptCalendarInvitation}
        />
        <CrossIcon
          color="var(--black)"
          title="Reject"
          className={styles.rejectIcon}
          onClick={handleRejectCalendarInvitation}
        />
      </div>
    </div>
  );
}
