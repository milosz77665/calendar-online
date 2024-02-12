"use client";
import styles from "@/styles/home/calendarColorChooser.module.css";
import { useEffect, useState } from "react";
import { calendarColors, updateCalendarColor } from "@/api/calendarAPI";
import TickIcon from "@/assets/icons/TickIcon";
import { auth } from "@/config/firebase";

export default function CalendarColorChooser({ currentColor, id, calendarName, className }) {
  const colorCircleContainerClasses = className
    ? `${className} ${styles.colorCircleContainer}`
    : styles.colorCircleContainer;
  const colorPaletteClasses = className ? `${className} ${styles.colorPalette}` : styles.colorPalette;
  const colorCircleClasses = className ? `${className} ${styles.colorCircle}` : styles.colorCircle;
  const iconClasses = className ? `${className} ${styles.icon}` : styles.icon;

  const [isChooserOpen, setIsChooserOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      const colorChooserComponent = document.getElementById(id);
      if (colorChooserComponent && !colorChooserComponent.contains(event.target)) {
        setIsChooserOpen(false);
      }
    }

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  async function handleColorSelection(color) {
    await updateCalendarColor(auth.currentUser.uid, calendarName, color);
  }

  return (
    <div id={id} className={colorCircleContainerClasses}>
      {isChooserOpen ? (
        <div className={colorPaletteClasses}>
          {calendarColors.map((color, index) => {
            return color === currentColor ? (
              <div className={colorCircleClasses} style={{ backgroundColor: color }} key={index}>
                <TickIcon size={18} className={iconClasses} />
              </div>
            ) : (
              <div
                className={colorCircleClasses}
                style={{ backgroundColor: color }}
                onClick={() => {
                  handleColorSelection(color);
                }}
                key={index}
              ></div>
            );
          })}
        </div>
      ) : null}
      <div
        className={colorCircleClasses}
        onClick={() => {
          setIsChooserOpen((chooserOpen) => !chooserOpen);
        }}
        style={{ backgroundColor: currentColor }}
      ></div>
    </div>
  );
}
