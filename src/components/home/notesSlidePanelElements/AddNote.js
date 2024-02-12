import extensionsSlidePanelStyles from "@/styles/home/extensionsSlidePanel.module.css";
import buttonStyles from "@/styles/button.module.css";
import Button from "@/components/Button";
import { useState } from "react";
import { addNote } from "@/api/noteAPI";
import { auth } from "@/config/firebase";

export default function AddNote() {
  const [newNoteTitle, setNewNoteTitle] = useState("");

  function handleInputChange(event) {
    setNewNoteTitle(event.target.value);
  }

  async function handleAddNote(event) {
    event.preventDefault();
    await addNote(auth.currentUser.uid, new Date().getTime(), newNoteTitle);
    setNewNoteTitle("");
  }

  return (
    <form className={extensionsSlidePanelStyles.addNewNoteTitleContainer}>
      <input
        className={extensionsSlidePanelStyles.noteTitleInput}
        onChange={handleInputChange}
        value={newNoteTitle}
        name="noteTitle"
        type="text"
        placeholder="New note title"
      />
      <Button
        className={buttonStyles.extensionsSlidePanelButton}
        onClick={handleAddNote}
        disabled={newNoteTitle.length === 0}
      >
        Add note
      </Button>
    </form>
  );
}
