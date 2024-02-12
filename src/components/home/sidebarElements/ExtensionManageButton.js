import styles from "@/styles/home/sidebarElements.module.css";
import { useContext } from "react";
import { ExtensionContext } from "@/context/extension-context";
import GridIcon from "@/assets/icons/GridIcon";

export default function ExtensionManageButton() {
  const { setIsExtensionModalOpen } = useContext(ExtensionContext);

  return (
    <GridIcon
      className={styles.iconButton}
      title="Extensions"
      onClick={() => {
        setIsExtensionModalOpen(true);
      }}
    />
  );
}
