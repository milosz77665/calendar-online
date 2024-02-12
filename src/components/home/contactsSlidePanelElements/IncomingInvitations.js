import styles from "@/styles/home/slidePanelElements.module.css";
import userStyles from "@/styles/home/user.module.css";
import User from "../User";
import { useContext } from "react";
import { ContactContext } from "@/context/contact-context";

export default function IncomingInvitations() {
  const { incomingInvitations } = useContext(ContactContext);

  return (
    <div className={styles.section}>
      <h4 className={styles.header}>Incoming invitations</h4>
      <div className={styles.usersContainer}>
        {incomingInvitations.length > 0 &&
          incomingInvitations.map((userData) => {
            return (
              <User
                key={userData.email}
                name={userData.name}
                surname={userData.surname}
                email={userData.email}
                className={userStyles.contactsSlidePanel}
              />
            );
          })}
      </div>
      {incomingInvitations.length === 0 && <p className={styles.info}>No incoming invitations</p>}
    </div>
  );
}
