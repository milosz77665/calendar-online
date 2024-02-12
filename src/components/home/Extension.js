import styles from "@/styles/home/extension.module.css";
import { useContext, useState } from "react";
import FileIcon from "@/assets/icons/FileIcon";
import ListIcon from "@/assets/icons/ListIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import { ExtensionContext } from "@/context/extension-context";
import UserCircleIcon from "@/assets/icons/UserCircleIcon";

export default function Extension({ isAdded, extension, extKey }) {
  const [isChosen, setIsChosen] = useState(false);
  const { addToChange, removeFromChange } = useContext(ExtensionContext);

  const addedExtensionClasses = `${isChosen ? styles.extensionToDelete : styles.extensionAdded}`;
  const notAddedExtensionClasses = `${isChosen ? styles.extensionToAdd : styles.extensionNotAdded}`;
  const extensionClassses = `${isAdded ? addedExtensionClasses : notAddedExtensionClasses}`;

  return (
    <div className={styles.extensionContainer}>
      <div
        className={extensionClassses}
        onClick={() => {
          !isChosen ? addToChange(extension, !isAdded, extKey) : removeFromChange(extension);
          setIsChosen((chosen) => !chosen);
        }}
      >
        {extension === "toDoLists" ? (
          <ListIcon title="To do lists" />
        ) : extension === "notes" ? (
          <FileIcon title="Notes" />
        ) : extension === "pomodoro" ? (
          <ClockIcon title="Pomodoro timer" />
        ) : extension === "meetingAssistant" ? (
          <UserCircleIcon title="Meeting assistant" />
        ) : null}
      </div>
      {extension === "toDoLists" ? (
        <p className={styles.text}>To do lists</p>
      ) : extension === "notes" ? (
        <p className={styles.text}>Notes</p>
      ) : extension === "pomodoro" ? (
        <p className={styles.text}>Pomodoro timer</p>
      ) : extension === "meetingAssistant" ? (
        <p className={styles.text}>Meeting assistant</p>
      ) : null}
    </div>
  );
}
