"use client";
import styles from "@/styles/home/slidePanelElements.module.css";
import buttonStyles from "@/styles/button.module.css";
import fileChooserStyles from "@/styles/fileChooser.module.css";
import { useContext, useState } from "react";
import { addEvents } from "@/api/calendarAPI";
import { getCalendarJsonDataFromIcsFile } from "@/api/icsAPI";
import FileChooser from "@/components/FileChooser";
import Button from "@/components/Button";
import { auth } from "@/config/firebase";
import { CalendarNameContext } from "@/context/calendar-name-context";
import createUniqueCalendarName from "@/utils/createUniqueCalendarName";

export default function ImportCalendarSection() {
  const { calendarNames } = useContext(CalendarNameContext);
  const [isFileChosen, setIsFileChosen] = useState(false);
  const [calendarJsonData, setCalendarJsonData] = useState(null);

  async function handleFileChange(icsFile) {
    try {
      setIsFileChosen(true);
      const jsonData = await getCalendarJsonDataFromIcsFile(icsFile);
      setCalendarJsonData(jsonData);
    } catch (error) {
      setIsFileChosen(false);
      console.error(error.message);
    }
  }

  async function handleImport() {
    if (calendarJsonData) {
      console.log(calendarJsonData);

      await addEvents(
        auth.currentUser.uid,
        createUniqueCalendarName(calendarJsonData.calendarName, calendarNames),
        calendarJsonData.events,
        true
      );
    }
  }

  return (
    <div className={styles.section}>
      <h4 className={styles.header}>Import calendar</h4>
      <FileChooser
        id="icsImport"
        fileType=".ics"
        onFileChange={handleFileChange}
        className={fileChooserStyles.slidePanel}
      />
      <Button className={buttonStyles.slidePanelButton} disabled={!isFileChosen} onClick={handleImport}>
        Import
      </Button>
    </div>
  );
}
