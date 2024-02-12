"use client";
import NotesSlidePanel from "./NotesSlidePanel";
import { ExtensionContext } from "@/context/extension-context";
import { useContext } from "react";
import ToDoListSlidePanel from "./ToDoListSlidePanel";
import PomodoroSlidePanel from "./PomodoroSlidePanel";
import MeetingAssistantSlidePanel from "./MeetingAssistantSlidePanel";

export default function ExtensionsSlidePanel() {
  const { extensions } = useContext(ExtensionContext);
  return (
    <>
      {extensions.map((ext) => {
        return ext.isAdded ? (
          ext.name === "toDoLists" ? (
            <ToDoListSlidePanel key={ext.key} />
          ) : ext.name === "notes" ? (
            <NotesSlidePanel key={ext.key} />
          ) : ext.name === "pomodoro" ? (
            <PomodoroSlidePanel key={ext.key} />
          ) : ext.name === "meetingAssistant" ? (
            <MeetingAssistantSlidePanel key={ext.key} />
          ) : null
        ) : null;
      })}
    </>
  );
}
