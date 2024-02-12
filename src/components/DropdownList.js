import styles from "@/styles/dropdownList.module.css";
import { useEffect, useState } from "react";

export default function DropdownList({ dropdownListRef, list, initialValue, colors, onChange, className }) {
  const dropdownClasses = className ? `${className} ${styles.dropdown}` : styles.dropdown;
  const listItemClasses = className ? `${className} ${styles.listItem}` : styles.listItem;
  const elementContainerClasses = className ? `${className} ${styles.elementContainer}` : styles.elementContainer;
  const [isOpen, setIsOpen] = useState(false);
  const [chosenElement, setChosenElement] = useState(initialValue || list[0]);

  useEffect(() => {
    if (onChange) {
      onChange(chosenElement);
    }
  }, [chosenElement]);

  return (
    <div
      className={dropdownClasses}
      onClick={() => {
        setIsOpen((open) => !open);
      }}
    >
      <div className={elementContainerClasses}>
        {colors ? <div className={styles.color} style={{ backgroundColor: colors[chosenElement].color }}></div> : null}
        <p ref={dropdownListRef} className={styles.element}>
          {chosenElement}
        </p>
      </div>
      {isOpen && (
        <ul className={styles.dropdownList}>
          {list.map((element, index) => {
            return chosenElement !== element ? (
              <li
                className={listItemClasses}
                key={`${index}${Math.floor(Math.random() * 1000)}`}
                onClick={() => {
                  setChosenElement(element);
                }}
              >
                <div className={elementContainerClasses}>
                  {colors ? (
                    <div className={styles.color} style={{ backgroundColor: colors[element].color }}></div>
                  ) : null}
                  <p className={styles.element}>{element}</p>
                </div>
              </li>
            ) : null;
          })}
        </ul>
      )}
    </div>
  );
}
