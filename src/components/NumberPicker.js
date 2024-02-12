import styles from "@/styles/numberPicker.module.css";

export default function NumberPicker({ min, max, initialValue, onChange, disabled = false, className }) {
  const inputFieldClasses = className ? `${className} ${styles.inputField}` : styles.inputField;
  const inputClasses = className ? `${className} ${styles.input}` : styles.input;

  return (
    <div className={inputFieldClasses}>
      <input
        className={inputClasses}
        type="number"
        min={min}
        max={max}
        disabled={disabled}
        defaultValue={initialValue}
        onChange={(event) => {
          onChange(event);
        }}
      ></input>
    </div>
  );
}
