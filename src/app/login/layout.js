import styles from "@/styles/login/loginLayout.module.css";

export default function LoginLayout({ children }) {
  return <main className={styles.loginBackground}>{children}</main>;
}
