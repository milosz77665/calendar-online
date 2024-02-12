import extensionsSlidePanelStyles from "@/styles/home/extensionsSlidePanel.module.css";
import { ConfirmContext } from "@/context/confirm-context";
import { useContext, useEffect, useState } from "react";
import TrashIcon from "@/assets/icons/TrashIcon";
import Task from "../Task";
import { removeToDoList } from "@/api/toDoListAPI";
import { auth } from "@/config/firebase";

export default function ToDoList({
  id,
  title,
  tasks,
  chosenToDoList,
  setChosenToDoList,
  handleToDoListTitleChange = () => {},
  handleToDoListTasksChange = () => {},
  handleToDoListClick = () => {},
  isEditable,
}) {
  const trashIconId = `trashIcon${id}`;
  const { showConfirm } = useContext(ConfirmContext);
  const [taskIdsArray, setTaskIdsArray] = useState();
  const [lastAddedTaskId, setLastAddedTaskId] = useState(tasks[tasks.length - 1].id);
  const toDoListCardClasses = isEditable
    ? `${extensionsSlidePanelStyles.toDoListCardOpen} ${extensionsSlidePanelStyles.toDoListCard}`
    : extensionsSlidePanelStyles.toDoListCard;

  useEffect(() => {
    setTaskIdsArray(tasks.map((task) => task.id).sort((a, b) => a - b));
  }, [tasks]);

  async function handleDeleteToDoList() {
    setChosenToDoList(null);
    if (chosenToDoList) {
      await removeToDoList(auth.currentUser.uid, id, chosenToDoList.title, chosenToDoList.tasks);
    } else {
      await removeToDoList(auth.currentUser.uid, id, title, tasks);
    }
  }

  function selectPreviousTask(taskId) {
    if (taskIdsArray.indexOf(taskId) > 0) {
      document.getElementById(taskIdsArray[taskIdsArray.indexOf(taskId) - 1]).focus();
    }
  }
  function selectNextTask(taskId) {
    if (taskIdsArray.indexOf(taskId) < taskIdsArray.length - 1) {
      document.getElementById(taskIdsArray[taskIdsArray.indexOf(taskId) + 1]).focus();
    }
  }

  function handleTaskContentChange(event, taskId) {
    handleToDoListTasksChange((prevToDoListTasks) =>
      prevToDoListTasks.map((task) => (task.id === taskId ? { ...task, content: event.target.value } : task))
    );
  }

  function handleTaskCheckboxChange(taskId, isDone) {
    handleToDoListTasksChange((prevToDoListTasks) =>
      prevToDoListTasks.map((task) => (task.id === taskId ? { ...task, isDone } : task))
    );
  }

  function handleDeleteTask(taskId) {
    handleToDoListTasksChange((prevToDoListTasks) => prevToDoListTasks.filter((task) => task.id !== taskId));
  }
  function handleAddTask(taskId) {
    const newTaskId = new Date().getTime();
    const index = taskIdsArray.indexOf(taskId);
    handleToDoListTasksChange((prevToDoListTasks) =>
      [
        ...prevToDoListTasks.slice(0, index + 1),
        { id: newTaskId, isDone: false, content: "" },
        ...prevToDoListTasks.slice(index + 1),
      ].sort((a, b) => a.id - b.id)
    );
    setLastAddedTaskId(newTaskId);
  }

  function handleKeyDown(event, taskId, content) {
    if (event.key === "ArrowUp") {
      selectPreviousTask(taskId);
    } else if (event.key === "ArrowDown") {
      selectNextTask(taskId);
    }
    if (event.key === "Enter") {
      handleAddTask(taskId);
    } else if (event.key === "Backspace" && !content && tasks.length > 1) {
      event.preventDefault();
      if (taskIdsArray.indexOf(taskId) === 0) {
        selectNextTask(taskId);
      } else {
        selectPreviousTask(taskId);
      }
      handleDeleteTask(taskId);
    }
  }

  return (
    <div
      id={`ToDoList${id}`}
      onClick={(event) => {
        if (event.target.id !== trashIconId) {
          handleToDoListClick(id, title, tasks);
        }
      }}
      className={toDoListCardClasses}
    >
      <div className={extensionsSlidePanelStyles.toDoListUpperSectionContainer}>
        {isEditable ? (
          <input
            className={extensionsSlidePanelStyles.titleInput}
            value={title}
            onInput={handleToDoListTitleChange}
            spellCheck={false}
          />
        ) : (
          <p className={extensionsSlidePanelStyles.toDoListTitle}>{title}</p>
        )}
        <TrashIcon
          id={trashIconId}
          size={20}
          color="var(--black)"
          onClick={() => {
            showConfirm(`To do list "${title}" will be deleted`, {
              action: handleDeleteToDoList,
            });
          }}
          className={extensionsSlidePanelStyles.trashIcon}
          title="Delete"
        />
      </div>
      {isEditable ? (
        <div className={extensionsSlidePanelStyles.tasksContainer}>
          {tasks.map((task) => {
            return (
              <Task
                key={task.id}
                id={task.id}
                isLastAddedTask={task.id === lastAddedTaskId}
                handleTaskContentChange={handleTaskContentChange}
                handleTaskCheckboxChange={handleTaskCheckboxChange}
                handleKeyDown={handleKeyDown}
                isDone={task.isDone}
                content={task.content}
              />
            );
          })}
        </div>
      ) : (
        <p className={extensionsSlidePanelStyles.toDoListContent}>
          {tasks
            .map((task) => {
              return task.content;
            })
            .join(", ")}
        </p>
      )}
    </div>
  );
}
