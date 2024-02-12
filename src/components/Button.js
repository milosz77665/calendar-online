import styles from "../styles/button.module.css";

export default function Button({ children, onClick, className, disabled = false }) {
  const classes = className ? `${className} ${styles.button}` : styles.button;
  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {children}
    </button>
  );
}
