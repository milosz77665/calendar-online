"use client";
import styles from "@/styles/error.module.css";
import buttonStyles from "@/styles/button.module.css";
import Button from "@/components/Button";

export default function Error({ error, reset }) {
  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong!</h2>
      <Button className={buttonStyles.error} onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
