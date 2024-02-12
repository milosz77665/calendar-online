import styles from "@/styles/timePicker.module.css";
import { useState } from "react";

export default function TimePicker({
  timePickerRef,
  timePickerName,
  isCalendarIndicatorVisible = false,
  onChange,
  value,
  children,
  className,
}) {
  const inputFieldClasses = className ? `${className} ${styles.inputField}` : styles.inputField;
  const labelClasses = className ? `${className} ${styles.label}` : styles.label;
  const timePickerClasses = className ? `${className} ${styles.timePicker}` : styles.timePicker;
  const timePickerFilledClasses = className ? `${className} ${styles.timePickerFilled}` : styles.timePickerFilled;
  const [isTimePickerFilled, setIsTimePickerFilled] = useState(!!value);

  const inputClasses = `${timePickerClasses} ${isTimePickerFilled && timePickerFilledClasses} ${
    isCalendarIndicatorVisible ? null : styles.hideCalendar
  }`;

  function handleOnBlur(e) {
    if (e.target.value.length) {
      setIsTimePickerFilled(true);
    } else {
      setIsTimePickerFilled(false);
      if (timePickerRef) {
        timePickerRef.current.value = "";
      }
    }
  }

  return (
    <div className={inputFieldClasses}>
      <input
        ref={timePickerRef}
        name={timePickerName}
        type="time"
        className={inputClasses}
        onChange={onChange}
        value={value}
        onBlur={handleOnBlur}
      ></input>
      <label className={labelClasses}>{children}</label>
    </div>
  );
}
