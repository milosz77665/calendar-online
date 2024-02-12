import styles from "@/styles/home/task.module.css";
import checkboxStyles from "@/styles/checkbox.module.css";
import Checkbox from "@/components/Checkbox";

export default function Task({
  id,
  isLastAddedTask,
  isDone,
  handleTaskContentChange,
  handleTaskCheckboxChange,
  handleKeyDown,
  content,
}) {
  const inputClasses = isDone ? `${styles.inputIsDone} ${styles.input}` : styles.input;

  function handleCheckboxChange() {
    handleTaskCheckboxChange(id, !isDone);
  }

  return (
    <div className={styles.taskContainer}>
      <Checkbox
        name={"task"}
        checkboxId={id}
        checked={isDone}
        className={checkboxStyles.task}
        onChange={handleCheckboxChange}
      />
      <input
        id={id}
        type="text"
        onKeyDown={(event) => {
          handleKeyDown(event, id, content);
        }}
        onChange={(event) => {
          handleTaskContentChange(event, id);
        }}
        value={content}
        className={inputClasses}
        spellCheck={false}
        autoFocus={isLastAddedTask}
        autoComplete="off"
      />
    </div>
  );
}
