import styles from "@/styles/paper.module.css";

export default function Paper({ children, onClick, className }) {
  const classes = className ? `${className} ${styles.paperContainer}` : styles.paperContainer;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
}
