import styles from "../styles/modal.module.css";

export default function Modal({ children, className }) {
  const classes = className ? `${className} ${styles.modalContainer}` : styles.modalContainer;

  return <div className={classes}>{children}</div>;
}
