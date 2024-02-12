"use client";
import styles from "@/styles/home/sidebarElements.module.css";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function CalendarButton() {
  const pathname = usePathname();
  const [path, setPath] = useState(pathname);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return (
    <Link href="/">
      <CalendarIcon
        color={`${path == "/" ? "var(--secondary)" : "var(--white)"}`}
        className={`${styles.iconButtonCalendar} ${styles.iconButton}`}
        title="Calendar"
      />
    </Link>
  );
}
