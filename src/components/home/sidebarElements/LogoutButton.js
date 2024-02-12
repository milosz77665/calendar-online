import styles from "@/styles/home/sidebarElements.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import LogoutIcon from "@/assets/icons/LogoutIcon";

export default function LogoutButton() {
  const { logout } = useContext(AuthContext);

  function handleLogout() {
    try {
      logout();
    } catch (error) {
      console.log(error);
    }
  }

  return <LogoutIcon className={styles.iconButton} onClick={handleLogout} title="Log out" />;
}
