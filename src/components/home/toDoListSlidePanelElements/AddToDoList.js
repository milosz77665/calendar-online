import extensionsSlidePanelStyles from "@/styles/home/extensionsSlidePanel.module.css";
import buttonStyles from "@/styles/button.module.css";
import Button from "@/components/Button";
import { useState } from "react";
import { addToDoList } from "@/api/toDoListAPI";
import { auth } from "@/config/firebase";

export default function AddToDoList() {
  const [newToDoListTitle, setNewToDoListTitle] = useState("");

  function handleInputChange(event) {
    setNewToDoListTitle(event.target.value);
  }

  async function handleAddToDoList(event) {
    event.preventDefault();
    await addToDoList(auth.currentUser.uid, new Date().getTime(), newToDoListTitle);
    setNewToDoListTitle("");
  }

  return (
    <form className={extensionsSlidePanelStyles.addNewToDoListTitleContainer}>
      <input
        className={extensionsSlidePanelStyles.toDoListTitleInput}
        onChange={handleInputChange}
        value={newToDoListTitle}
        name="toDoListTitle"
        type="text"
        placeholder="New to do list title"
      />
      <Button
        className={buttonStyles.extensionsSlidePanelButton}
        onClick={handleAddToDoList}
        disabled={newToDoListTitle.length === 0}
      >
        Add to do list
      </Button>
    </form>
  );
}
