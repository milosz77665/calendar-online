"use client";
import TickIcon from "@/assets/icons/TickIcon";
import styles from "@/styles/checkbox.module.css";
import { useState } from "react";

export default function Checkbox({
  checkboxId,
  name,
  value,
  onChange,
  className,
  checked = false,
  color = "var(--secondary)",
}) {
  const labelClasses = className ? `${className} ${styles.label}` : styles.label;
  const checkboxClasses = className ? `${className} ${styles.checkbox}` : styles.checkbox;
  const iconClasses = className ? `${className} ${styles.icon}` : styles.icon;

  const [isChecked, setIsChecked] = useState(checked);

  const id = checkboxId ? checkboxId + "Checkbox" : value + "Checkbox";

  return (
    <label htmlFor={id} className={labelClasses}>
      <input
        type="checkbox"
        id={id}
        name={name}
        value={value}
        onChange={(event) => {
          setIsChecked((checked) => !checked);
          onChange(event);
        }}
        checked={isChecked}
        className={styles.input}
      />
      <span
        className={checkboxClasses}
        style={{ backgroundColor: isChecked ? color : "var(--white)", borderColor: color }}
      >
        {isChecked && <TickIcon size={16} className={iconClasses} />}
      </span>
      {value}
    </label>
  );
}
