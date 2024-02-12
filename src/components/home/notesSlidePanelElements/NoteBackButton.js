import buttonStyles from "@/styles/button.module.css";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { updateNote } from "@/api/noteAPI";
import { auth } from "@/config/firebase";

export default function NoteBackButton({ title, content, chosenNote, setChosenNote }) {
  const [isNoteChanged, setIsNoteChanged] = useState(false);

  useEffect(() => {
    if ((title && title !== chosenNote.title) || content !== chosenNote.content) {
      setIsNoteChanged(true);
    } else {
      setIsNoteChanged(false);
    }
  }, [title, content]);

  useEffect(() => {
    async function handleBeforeUnload() {
      await updateNote(auth.currentUser.uid, chosenNote.id, chosenNote.title, chosenNote.content, title, content);
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, content]);

  async function handleBackButtonClick() {
    if (isNoteChanged) {
      await updateNote(auth.currentUser.uid, chosenNote.id, chosenNote.title, chosenNote.content, title, content);
    }
    setChosenNote(null);
  }

  return (
    <Button className={buttonStyles.extensionsSlidePanelButton} onClick={handleBackButtonClick}>
      Save & quit
    </Button>
  );
}
