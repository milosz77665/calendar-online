import styles from "@/styles/validationMessage.module.css";

export default function ValidationMessage({ className, children }) {
  const textClasses = className ? `${className} ${styles.validationText}` : styles.validationText;
  const containerClasses = className ? `${className} ${styles.validationContainer}` : styles.validationContainer;

  return (
    <div className={containerClasses}>
      <p className={textClasses}>{children}</p>
    </div>
  );
}
