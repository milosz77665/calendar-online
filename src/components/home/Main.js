"use client";
import styles from "@/styles/home/main.module.css";
import { registerServiceWorker } from "@/utils/serviceWorkerManager";
import { useEffect } from "react";

export default function Main({ children }) {
  useEffect(() => {
    async function setUpServiceWorker() {
      await registerServiceWorker();
    }
    setUpServiceWorker();
  }, []);

  return <main className={styles.main}>{children}</main>;
}
