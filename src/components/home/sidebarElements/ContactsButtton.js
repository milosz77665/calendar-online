import styles from "@/styles/home/sidebarElements.module.css";
import ContactsIcon from "@/assets/icons/ContactsIcon";
import { useContext } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";

export default function ContactsButton() {
  const { handleOpenSlidePanel, panel } = useContext(SlidePanelContext);

  return (
    <ContactsIcon
      className={styles.iconButton}
      color={panel.openSlidePanel === "contacts" ? "var(--accent)" : "var(--white)"}
      title="Contacts"
      onClick={() => {
        handleOpenSlidePanel({ type: "TOGGLE_PANEL", slidePanelToOpen: "contacts" });
      }}
    />
  );
}
