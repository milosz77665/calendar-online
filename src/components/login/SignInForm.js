import styles from "@/styles/login/form.module.css";
import loadingSpinnerStyles from "@/styles/loadingSpinner.module.css";
import Button from "../Button";
import Input from "../Input";
import ValidationMessage from "../ValidationMessage";
import { useRef, useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import LoadingSpinner from "../LoadingSpinner";

export default function SignInForm({ setHasAccount }) {
  const { signIn, signInWithGoogle } = useContext(AuthContext);

  const emailRef = useRef();
  const passwordRef = useRef();
  const [authErrorMess, setAuthErrorMess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn(e) {
    authErrorMess ? setAuthErrorMess("") : null;
    setIsLoading(true);
    e.preventDefault();
    try {
      await signIn(emailRef.current.value, passwordRef.current.value);
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/invalid-email") {
        setAuthErrorMess("Email is invalid");
      } else if (error.code === "auth/wrong-password") {
        setAuthErrorMess("Password is invalid");
      } else if (error.code === "auth/missing-password") {
        setAuthErrorMess("Password is missing");
      } else {
        setAuthErrorMess("Unknown error");
      }
      setIsLoading(false);
    }
  }

  async function handleSignInWithGoogle(e) {
    authErrorMess ? setAuthErrorMess("") : null;
    setIsLoading(true);
    e.preventDefault();
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthErrorMess("Unknown error");
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className={styles.title}>Sign in</h2>
      {isLoading ? (
        <LoadingSpinner className={loadingSpinnerStyles.form} />
      ) : (
        <>
          <form className={styles.form}>
            <div className={styles.inputSection}>
              {authErrorMess && <ValidationMessage>{authErrorMess}</ValidationMessage>}
              <Input inputRef={emailRef} inputName="email" inputType="email">
                E-mail
              </Input>
              <Input inputRef={passwordRef} inputName="password" inputType="password">
                Password
              </Input>
            </div>
            <div className={styles.buttonSection}>
              <Button onClick={handleSignIn}>Sign in</Button>
              <Button onClick={handleSignInWithGoogle}>Sign in with Google</Button>
            </div>
          </form>
          <p className={styles.text}>
            You don&apos;t have an account?&nbsp;
            <a
              className={styles.link}
              onClick={() => {
                setHasAccount(false);
              }}
            >
              Register
            </a>
          </p>
        </>
      )}
    </>
  );
}
