import styles from "@/styles/home/sidebarElements.module.css";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import UserCircleIcon from "@/assets/icons/UserCircleIcon";

export default function UserButton() {
  const { user } = useContext(AuthContext);

  return (
    <UserCircleIcon
      className={styles.iconButton}
      title="User"
      onClick={() => {
        console.log(user.uid);
      }}
    />
  );
}
