import styles from "@/styles/home/sidebarElements.module.css";
import { ExtensionContext } from "@/context/extension-context";
import { useContext } from "react";
import ListIcon from "@/assets/icons/ListIcon";
import FileIcon from "@/assets/icons/FileIcon";
import ClockIcon from "@/assets/icons/ClockIcon";
import { SlidePanelContext } from "@/context/slide-panel-context";
import UserCircleIcon from "@/assets/icons/UserCircleIcon";

export default function ExtensionList() {
  const { extensions } = useContext(ExtensionContext);
  const { handleOpenSlidePanel, panel } = useContext(SlidePanelContext);

  function handleClick(extName) {
    handleOpenSlidePanel({ type: "TOGGLE_PANEL", slidePanelToOpen: extName });
  }

  return (
    <div className={styles.extensionList}>
      {extensions.map((ext) => {
        return ext.isAdded ? (
          ext.name === "toDoLists" ? (
            <ListIcon
              color={panel.openSlidePanel === "toDoLists" ? "var(--accent)" : "var(--white)"}
              className={styles.iconButton}
              key={ext.key}
              title="To do lists"
              onClick={() => {
                handleClick(ext.name);
              }}
            />
          ) : ext.name === "notes" ? (
            <FileIcon
              color={panel.openSlidePanel === "notes" ? "var(--accent)" : "var(--white)"}
              className={styles.iconButton}
              key={ext.key}
              title="Notes"
              onClick={() => {
                handleClick(ext.name);
              }}
            />
          ) : ext.name === "pomodoro" ? (
            <ClockIcon
              color={panel.openSlidePanel === "pomodoro" ? "var(--accent)" : "var(--white)"}
              className={styles.iconButton}
              key={ext.key}
              title="Pomodoro timer"
              onClick={() => {
                handleClick(ext.name);
              }}
            />
          ) : ext.name === "meetingAssistant" ? (
            <UserCircleIcon
              color={panel.openSlidePanel === "meetingAssistant" ? "var(--accent)" : "var(--white)"}
              className={styles.iconButton}
              key={ext.key}
              title="Meeting assistant"
              onClick={() => {
                handleClick(ext.name);
              }}
            />
          ) : null
        ) : null;
      })}
    </div>
  );
}
