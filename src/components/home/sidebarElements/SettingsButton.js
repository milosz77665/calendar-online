import styles from "@/styles/home/sidebarElements.module.css";
import { useContext } from "react";
import { SlidePanelContext } from "@/context/slide-panel-context";
import SettingsIcon from "@/assets/icons/SettingsIcon";

export default function SettingsButton() {
  const { handleOpenSlidePanel, panel } = useContext(SlidePanelContext);

  return (
    <SettingsIcon
      className={styles.iconButton}
      color={panel.openSlidePanel === "settings" ? "var(--accent)" : "var(--white)"}
      title="Settings"
      onClick={() => {
        handleOpenSlidePanel({ type: "TOGGLE_PANEL", slidePanelToOpen: "settings" });
      }}
    />
  );
}
