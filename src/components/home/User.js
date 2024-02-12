import styles from "@/styles/home/user.module.css";
import UserIcon from "@/assets/icons/UserIcon";
import TickIcon from "@/assets/icons/TickIcon";
import CrossIcon from "@/assets/icons/CrossIcon";
import { addContact, removeInvitation } from "@/api/contactAPI";
import { auth } from "@/config/firebase";
import { getUserIdByEmail } from "@/api/userAPI";

export default function User({ name, surname, email, actionButton, className }) {
  const userIconClasses = className ? `${className} ${styles.userIcon}` : styles.userIcon;
  const nameClasses = className ? `${className} ${styles.name}` : styles.name;
  const emailClasses = className ? `${className} ${styles.email}` : styles.email;
  const acceptIconClasses = className ? `${className} ${styles.acceptIcon}` : styles.acceptIcon;
  const rejectIconClasses = className ? `${className} ${styles.rejectIcon}` : styles.rejectIcon;

  async function handleAcceptInvitation() {
    const targetUserId = await getUserIdByEmail(email);
    await addContact(auth.currentUser.uid, targetUserId);
  }

  async function handleRejectInvitation() {
    const targetUserId = await getUserIdByEmail(email);
    await removeInvitation(auth.currentUser.uid, targetUserId);
  }

  return (
    <div className={styles.userCard}>
      <UserIcon color="var(--black)" className={userIconClasses} />
      <p className={nameClasses}>{`${name} ${surname}`}</p>
      <p className={emailClasses}>{email}</p>
      <div className={styles.iconContainer}>
        {!actionButton ? (
          <>
            <TickIcon
              color="var(--black)"
              title="Accept"
              className={acceptIconClasses}
              onClick={handleAcceptInvitation}
            />
            <CrossIcon
              color="var(--black)"
              title="Reject"
              className={rejectIconClasses}
              onClick={handleRejectInvitation}
            />
          </>
        ) : (
          actionButton
        )}
      </div>
    </div>
  );
}
