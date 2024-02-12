import styles from "@/styles/home/slidePanelElements.module.css";
import userStyles from "@/styles/home/user.module.css";
import { ContactContext } from "@/context/contact-context";
import { useContext } from "react";
import User from "../User";
import TrashIcon from "@/assets/icons/TrashIcon";
import { removeContact } from "@/api/contactAPI";
import { auth } from "@/config/firebase";
import { getUserIdByEmail } from "@/api/userAPI";
import { ConfirmContext } from "@/context/confirm-context";

export default function Contacts() {
  const { contacts } = useContext(ContactContext);
  const { showConfirm } = useContext(ConfirmContext);

  async function handleDeleteUser(targetUserEmail) {
    const targetUserId = await getUserIdByEmail(targetUserEmail);
    await removeContact(auth.currentUser.uid, targetUserId);
  }

  return (
    <div className={styles.section}>
      <div className={styles.usersContainer}>
        {contacts.length > 0 ? (
          contacts.map((userData) => {
            return (
              <User
                key={userData.email}
                name={userData.name}
                surname={userData.surname}
                email={userData.email}
                className={userStyles.contactsSlidePanel}
                actionButton={
                  <TrashIcon
                    size={20}
                    onClick={() => {
                      showConfirm(`User ${userData.name} ${userData.surname} will be deleted from contacts`, {
                        action: () => {
                          handleDeleteUser(userData.email);
                        },
                      });
                    }}
                    color="var(--black)"
                    title="Delete"
                    className={styles.trashIconContacts}
                  />
                }
              />
            );
          })
        ) : (
          <p className={styles.info}>No contacts</p>
        )}
      </div>
    </div>
  );
}
