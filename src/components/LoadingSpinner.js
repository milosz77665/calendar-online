import styles from "@/styles/loadingSpinner.module.css";
import SpinnerIcon from "@/assets/icons/SpinnerIcon";

export default function LoadingSpinner({ className }) {
  const loadingSpinnerContainerClasses = className
    ? `${className} ${styles.loadingSpinnerContainer}`
    : styles.loadingSpinnerContainer;
  const loadingSpinnerClasses = className ? `${className} ${styles.loadingSpinner}` : styles.loadingSpinner;

  return (
    <div className={loadingSpinnerContainerClasses}>
      <SpinnerIcon className={loadingSpinnerClasses} />
    </div>
  );
}
