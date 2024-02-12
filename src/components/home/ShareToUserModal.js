import styles from "@/styles/home/shareToUserModal.module.css";
import modalBackgroundStyles from "@/styles/modalBackground.module.css";
import buttonStyles from "@/styles/button.module.css";
import modalStyles from "@/styles/modal.module.css";
import userStyles from "@/styles/home/user.module.css";
import { ShareToUserModalContext } from "@/context/share-to-user-modal-context";
import { ContactContext } from "@/context/contact-context";
import { useContext, useEffect, useState } from "react";
import { auth } from "@/config/firebase";
import { getOutcomingCalendars, getOutcomingEvents } from "@/api/sharingAPI";
import TwoArrowsRightIcon from "@/assets/icons/TwoArrowsRightIcon";
import ModalBackground from "../ModalBackground";
import Modal from "../Modal";
import User from "./User";
import LoadingSpinner from "../LoadingSpinner";
import Button from "../Button";

export default function ShareToUserModal() {
  const { shareToUserModal, shareCalendarToUser, shareEventToUser, handleShareToUserModalAction } =
    useContext(ShareToUserModalContext);
  const { contacts } = useContext(ContactContext);

  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function filterContacts() {
      if (shareToUserModal.objectType === "calendar") {
        const outcomingCalendars = await getOutcomingCalendars(auth.currentUser.uid);
        setFilteredContacts(
          contacts.filter((contact) => {
            const result = !outcomingCalendars.some(
              (outcomingCalendar) =>
                outcomingCalendar.calendarName === shareToUserModal.objectToShare &&
                outcomingCalendar.targetUserId === contact.uid
            );
            return result;
          })
        );
      } else if (shareToUserModal.objectType === "event") {
        const outcomingEvents = await getOutcomingEvents(auth.currentUser.uid);
        setFilteredContacts(
          contacts.filter((contact) => {
            const result = !outcomingEvents.some(
              (outcomingEvent) =>
                outcomingEvent.dtstamp === shareToUserModal.dtstamp &&
                outcomingEvent.eventName === shareToUserModal.objectToShare &&
                outcomingEvent.targetUserId === contact.uid
            );
            return result;
          })
        );
      }
      setIsLoading(false);
    }
    filterContacts();
  }, []);

  function handleClick(userData) {
    setIsLoading(true);
    if (shareToUserModal.objectType === "calendar") {
      shareCalendarToUser(auth.currentUser.uid, shareToUserModal.objectToShare, userData.uid);
    } else if (shareToUserModal.objectType === "event") {
      shareEventToUser(
        auth.currentUser.uid,
        shareToUserModal.calendarName,
        shareToUserModal.objectToShare,
        shareToUserModal.dtstamp,
        userData.uid
      );
    }
  }

  const backgroundId = "ShareToUserModal";
  return (
    <ModalBackground
      id={backgroundId}
      className={modalBackgroundStyles.shareToUserModal}
      onClick={(e) => {
        if (e.target.id === backgroundId) {
          handleShareToUserModalAction({ type: "CLOSE_MODAL" });
        }
      }}
    >
      <Modal className={modalStyles.shareToUserModal}>
        <Button
          className={buttonStyles.closeButton}
          onClick={() => {
            handleShareToUserModalAction({ type: "CLOSE_MODAL" });
          }}
        >
          X
        </Button>
        <p>{`Share "${shareToUserModal.objectToShare}" ${shareToUserModal.objectType} to:`}</p>
        <div className={styles.userContainer}>
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredContacts.length > 0 ? (
            filteredContacts.map((userData) => {
              return (
                <User
                  key={userData.email}
                  name={userData.name}
                  surname={userData.surname}
                  email={userData.email}
                  className={userStyles.shareToUserModal}
                  actionButton={
                    <TwoArrowsRightIcon
                      size={30}
                      className={styles.icon}
                      color="var(--black)"
                      title="Share"
                      onClick={() => {
                        handleClick(userData);
                      }}
                    />
                  }
                />
              );
            })
          ) : (
            <p className={styles.text}>No contacts available</p>
          )}
        </div>
      </Modal>
    </ModalBackground>
  );
}
