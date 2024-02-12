"use client";
import styles from "@/styles/home/sidebar.module.css";
import CalendarButton from "./sidebarElements/CalendarButton";
import ContactsButton from "./sidebarElements/ContactsButtton";
import ExtensionManageButton from "./sidebarElements/ExtensionManageButton";
import ExtensionList from "./sidebarElements/ExtensionList";
import UserButton from "./sidebarElements/UserButton";
import SettingsButton from "./sidebarElements/SettingsButton";
import LogoutButton from "./sidebarElements/LogoutButton";

export default function Sidebar() {
  return (
    <aside className={styles.aside}>
      <div className={styles.upperSection}>
        <nav>
          <ul className={styles.navList}>
            <li>
              <CalendarButton />
            </li>
            <li>
              <ContactsButton />
            </li>
            <li>
              <ExtensionManageButton />
            </li>
          </ul>
        </nav>
        <ExtensionList />
      </div>
      <div className={styles.lowerSection}>
        <SettingsButton />
        <LogoutButton />
      </div>
    </aside>
  );
}
