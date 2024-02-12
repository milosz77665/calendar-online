import styles from "@/styles/textArea.module.css";

export default function TextArea({ textAreaRef, placeholder, initialValue, className }) {
  const classes = className ? `${className} ${styles.textArea}` : styles.textArea;

  return (
    <textarea ref={textAreaRef} className={classes} defaultValue={initialValue} placeholder={placeholder}></textarea>
  );
}
