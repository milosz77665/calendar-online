import buttonStyles from "@/styles/button.module.css";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { updateToDoList } from "@/api/toDoListAPI";
import { auth } from "@/config/firebase";

export default function ToDoListBackButton({ title, tasks, chosenToDoList, setChosenToDoList }) {
  const [isToDoListChanged, setIsToDoListChanged] = useState(false);

  useEffect(() => {
    if ((title && title !== chosenToDoList.title) || JSON.stringify(tasks) !== JSON.stringify(chosenToDoList.tasks)) {
      setIsToDoListChanged(true);
    } else {
      setIsToDoListChanged(false);
    }
  }, [title, tasks]);

  useEffect(() => {
    async function handleBeforeUnload() {
      await updateToDoList(
        auth.currentUser.uid,
        chosenToDoList.id,
        chosenToDoList.title,
        chosenToDoList.tasks,
        title,
        tasks
      );
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [title, tasks]);

  async function handleBackButtonClick() {
    if (isToDoListChanged) {
      await updateToDoList(
        auth.currentUser.uid,
        chosenToDoList.id,
        chosenToDoList.title,
        chosenToDoList.tasks,
        title,
        tasks
      );
    }
    setChosenToDoList(null);
  }

  return (
    <Button className={buttonStyles.extensionsSlidePanelButton} onClick={handleBackButtonClick}>
      Save & quit
    </Button>
  );
}
