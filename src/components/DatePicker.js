import styles from "../styles/datePicker.module.css";
import { useState } from "react";

export default function DatePicker({
  datePickerRef,
  datePickerName,
  isCalendarIndicatorVisible = false,
  onChange,
  value,
  children,
  className,
}) {
  const inputFieldClasses = className ? `${className} ${styles.inputField}` : styles.inputField;
  const labelClasses = className ? `${className} ${styles.label}` : styles.label;
  const datePickerClasses = className ? `${className} ${styles.datePicker}` : styles.datePicker;
  const datePickerFilledClasses = className ? `${className} ${styles.datePickerFilled}` : styles.datePickerFilled;
  const [isDatePickerFilled, setIsDatePickerFilled] = useState(!!value);

  const inputClasses = `${datePickerClasses} ${isDatePickerFilled && datePickerFilledClasses} ${
    isCalendarIndicatorVisible ? null : styles.hideCalendar
  }`;

  function handleOnBlur(e) {
    if (e.target.value.length) {
      setIsDatePickerFilled(true);
    } else {
      setIsDatePickerFilled(false);
      if (datePickerRef) {
        datePickerRef.current.value = "";
      }
    }
  }

  return (
    <div className={inputFieldClasses}>
      <input
        ref={datePickerRef}
        name={datePickerName}
        type="date"
        max="9999-12-31"
        className={inputClasses}
        onChange={onChange}
        value={value}
        onBlur={handleOnBlur}
      ></input>
      <label className={labelClasses}>{children}</label>
    </div>
  );
}
