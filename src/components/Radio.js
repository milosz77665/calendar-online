import styles from "@/styles/radio.module.css";

export default function Radio({ name, value, onChange, className, defaultChecked }) {
  const labelClasses = className ? `${className} ${styles.label}` : styles.label;
  const radioContainerClasses = className ? `${className} ${styles.radioContainer}` : styles.radioContainer;
  const radioClasses = className ? `${className} ${styles.radio}` : styles.radio;
  const id = value + name + "Radio";
  return (
    <div className={radioContainerClasses}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        className={radioClasses}
        onChange={onChange}
        defaultChecked={defaultChecked}
      />
      <label htmlFor={id} className={labelClasses}>
        {value}
      </label>
    </div>
  );
}
