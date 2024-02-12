import styles from "../styles/modalBackground.module.css";

export default function ModalBackground({ id, children, className, onClick = () => {} }) {
  const classes = className ? `${className} ${styles.modalBackground}` : styles.modalBackground;

  return (
    <div id={id} className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
