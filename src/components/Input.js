import styles from "../styles/input.module.css";
import { useState } from "react";
import CopyIcon from "@/assets/icons/CopyIcon";
import TickIcon from "@/assets/icons/TickIcon";

export default function Input({ inputRef, inputName, inputType, initialValue, className, copy = false, children }) {
  const inputFieldClasses = className ? `${className} ${styles.inputField}` : styles.inputField;
  const labelClasses = className ? `${className} ${styles.label}` : styles.label;
  const inputClasses = className
    ? copy
      ? `${className} ${styles.input} ${styles.inputCopy}`
      : `${className} ${styles.input}`
    : copy
    ? `${styles.input} ${styles.inputCopy}`
    : styles.input;
  const inputFilledClasses = className ? `${className} ${styles.inputFilled}` : styles.inputFilled;
  const [isInputFilled, setIsInputFilled] = useState(!!initialValue);
  const [isCopied, setIsCopied] = useState(false);

  function handleOnBlur(e) {
    e.target.value.length ? setIsInputFilled(true) : setIsInputFilled(false);
  }

  const handleCopy = () => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = inputRef.current.value;
    document.body.appendChild(tempTextArea);

    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };

  return (
    <div className={inputFieldClasses}>
      <input
        className={inputClasses}
        ref={inputRef}
        onBlur={handleOnBlur}
        name={inputName}
        type={inputType}
        defaultValue={initialValue}
      />
      <label className={`${labelClasses} ${isInputFilled ? inputFilledClasses : ""}`}>{children}</label>
      {copy &&
        (isCopied ? (
          <TickIcon color="var(--grey)" className={styles.tickIcon} />
        ) : (
          <CopyIcon color="var(--grey)" onClick={handleCopy} className={styles.copyIcon} />
        ))}
    </div>
  );
}
