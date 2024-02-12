"use client";
import styles from "@/styles/home/slidePanelElements.module.css";
import buttonStyles from "@/styles/button.module.css";
import { addInvitation, isFriend, isInvitationSent } from "@/api/contactAPI";
import { getUserIdByEmail } from "@/api/userAPI";
import Button from "@/components/Button";
import { auth } from "@/config/firebase";
import { useState } from "react";

export default function AddContact() {
  const [newContactEmail, setNewContactEmail] = useState("");
  const initialInfo = "Enter user email and click invite";
  const [info, setInfo] = useState(initialInfo);

  function handleInputChange(event) {
    setNewContactEmail(event.target.value);
    if (info !== initialInfo) {
      setInfo(initialInfo);
    }
  }

  async function handleSendInvitation(event) {
    event.preventDefault();
    const currentUser = auth.currentUser;
    const targetUserId = await getUserIdByEmail(newContactEmail);
    if (targetUserId) {
      if (targetUserId !== currentUser.uid) {
        const isAlreadyFriend = await isFriend(currentUser.uid, targetUserId);
        if (!isAlreadyFriend) {
          const isInvitationAlreadySent = await isInvitationSent(currentUser.uid, targetUserId);
          if (!isInvitationAlreadySent) {
            addInvitation(currentUser.uid, targetUserId);
            setInfo("Invitation sent");
          } else {
            setInfo("Invitation was already sent");
          }
        } else {
          setInfo("User is already in your contacts");
        }
      } else {
        setInfo("You can't invite this user");
      }
    } else {
      setInfo("User does not exist");
    }
    setNewContactEmail("");
  }

  return (
    <div className={styles.section}>
      <h4 className={styles.header}>Invite contact</h4>
      <form className={styles.addNewCalendarContainer}>
        <input
          className={styles.contactEmailInput}
          onChange={handleInputChange}
          value={newContactEmail}
          name="email"
          type="email"
          placeholder="Email"
        />
        <Button
          className={buttonStyles.slidePanelButton}
          onClick={handleSendInvitation}
          disabled={newContactEmail.length === 0}
        >
          Invite
        </Button>
      </form>
      {info && <p className={styles.info}>{info}</p>}
    </div>
  );
}
