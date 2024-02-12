import styles from "@/styles/home/slidePanelElements.module.css";
import calendarColorChooserStyles from "@/styles/home/calendarColorChooser.module.css";
import { ConfirmContext } from "@/context/confirm-context";
import { useContext, useEffect, useState } from "react";
import CalendarColorChooser from "../CalendarColorChooser";
import VerticalDotsIcon from "@/assets/icons/VerticalDotsIcon";
import TrashIcon from "@/assets/icons/TrashIcon";
import ShareIcon from "@/assets/icons/ShareIcon";
import { auth } from "@/config/firebase";
import { ShareToUserModalContext } from "@/context/share-to-user-modal-context";
import DownloadIcon from "@/assets/icons/DownloadIcon";
import { ErrorContext } from "@/context/error-context";
import { generateIcsFileContent } from "@/api/icsAPI";
import { deleteCalendar } from "@/api/calendarAPI";

export default function CalendarElement({ id, calendarName, color }) {
  const { showConfirm } = useContext(ConfirmContext);
  const { showError } = useContext(ErrorContext);
  const { handleShareToUserModalAction } = useContext(ShareToUserModalContext);

  const [isMoreActionsContainerVisible, setIsMoreActionsContainerVisible] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      const moreActionsComponent = document.getElementById(id);
      if (moreActionsComponent && !moreActionsComponent.contains(event.target)) {
        setIsMoreActionsContainerVisible(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleShareCalendar(calendarName) {
    handleShareToUserModalAction({ type: "OPEN_SHARE_CALENDAR_TO_USER_MODAL", calendarName });
  }

  function handleDeleteCalendar(calendarName) {
    deleteCalendar(auth.currentUser.uid, calendarName);
  }

  async function handleExport() {
    if (calendarName) {
      const icsFileContent = await generateIcsFileContent(auth.currentUser.uid, calendarName);

      const blob = new Blob([icsFileContent], { type: "text/plain" });
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${calendarName}.ics`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(downloadLink.href);
    } else {
      showError("You need to choose a file to export first");
    }
  }

  return (
    <div id={id} className={styles.calendarsContainer} key={`Container${calendarName}`}>
      <CalendarColorChooser
        key={`Chooser${calendarName}`}
        id={`CalendarColorChooser${calendarName}`}
        currentColor={color}
        calendarName={calendarName}
        className={calendarColorChooserStyles.calendarColorsSection}
      />
      <p className={styles.calendarName}>{calendarName}</p>

      <VerticalDotsIcon
        size={20}
        color="var(--black)"
        className={styles.icon}
        title="More actions"
        onClick={() => {
          setIsMoreActionsContainerVisible((prevIsMoreActionsContainerVisible) => !prevIsMoreActionsContainerVisible);
        }}
      />
      {isMoreActionsContainerVisible ? (
        <div className={styles.moreActionsContainer}>
          <TrashIcon
            size={20}
            color="var(--black)"
            onClick={() => {
              showConfirm(`Calendar "${calendarName}" will be deleted`, {
                action: () => {
                  handleDeleteCalendar(calendarName);
                },
              });
            }}
            className={styles.trashIcon}
            title="Delete"
          />
          <ShareIcon
            title="Share"
            size={20}
            color="var(--black)"
            className={styles.icon}
            onClick={() => {
              handleShareCalendar(calendarName);
            }}
          />
          <DownloadIcon title="Export" size={20} color="var(--black)" className={styles.icon} onClick={handleExport} />
        </div>
      ) : null}
    </div>
  );
}
