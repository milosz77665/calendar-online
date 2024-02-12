import extensionsSlidePanelStyles from "@/styles/home/extensionsSlidePanel.module.css";
import slidePanelStyles from "@/styles/home/slidePanel.module.css";
import SlidePanel from "./SlidePanel";
import { useContext, useState } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";
import AddToDoList from "./toDoListSlidePanelElements/AddToDoList";
import ToDoList from "./toDoListSlidePanelElements/ToDoList";
import ToDoListBackButton from "./toDoListSlidePanelElements/ToDoListBackButton";
import { ToDoListContext } from "@/context/toDoList-context";

export default function ToDoListSlidePanel() {
  const { panel } = useContext(SlidePanelContext);
  const { toDoLists } = useContext(ToDoListContext);
  const [chosenToDoList, setChosenToDoList] = useState(null);
  const [toDoListTitle, setToDoListTitle] = useState(null);
  const [toDoListTasks, setToDoListTasks] = useState(null);

  function handleToDoListClick(toDoListId, title, tasks) {
    setChosenToDoList({ id: toDoListId, title, tasks });
    setToDoListTitle(title);
    setToDoListTasks(tasks);
  }

  function handleToDoListTitleChange(event) {
    setToDoListTitle(event.target.value);
  }

  return (
    <SlidePanel
      title={"To do lists"}
      className={slidePanelStyles.extensionSlidePanel}
      isSlidePanelOpen={panel.openSlidePanel === "toDoLists"}
    >
      {!chosenToDoList && <AddToDoList />}
      <div className={extensionsSlidePanelStyles.documentContainer}>
        <div className={extensionsSlidePanelStyles.toDoListContainer}>
          {toDoLists.length !== 0 ? (
            toDoLists.map((toDoList) => {
              if (!chosenToDoList) {
                return (
                  <ToDoList
                    id={toDoList.id}
                    key={toDoList.id}
                    title={toDoList.title}
                    tasks={toDoList.tasks}
                    setChosenToDoList={setChosenToDoList}
                    handleToDoListClick={handleToDoListClick}
                  />
                );
              } else {
                if (chosenToDoList.id === toDoList.id) {
                  return (
                    <ToDoList
                      id={toDoList.id}
                      key={toDoList.id}
                      title={toDoListTitle}
                      tasks={toDoListTasks}
                      chosenToDoList={chosenToDoList}
                      setChosenToDoList={setChosenToDoList}
                      handleToDoListTitleChange={handleToDoListTitleChange}
                      handleToDoListTasksChange={setToDoListTasks}
                      isEditable={true}
                    />
                  );
                }
              }
            })
          ) : (
            <p className={extensionsSlidePanelStyles.text}>No to do lists</p>
          )}
        </div>
        {chosenToDoList && (
          <ToDoListBackButton
            title={toDoListTitle}
            tasks={toDoListTasks}
            chosenToDoList={chosenToDoList}
            setChosenToDoList={setChosenToDoList}
          />
        )}
      </div>
    </SlidePanel>
  );
}
