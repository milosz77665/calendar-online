import styles from "../../styles/login/form.module.css";
import buttonStyles from "@/styles/button.module.css";
import loadingSpinnerStyles from "@/styles/loadingSpinner.module.css";
import Button from "../Button";
import Input from "../Input";
import ValidationMessage from "../ValidationMessage";
import DatePicker from "../DatePicker";
import { useRef, useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import LoadingSpinner from "../LoadingSpinner";

export default function RegisterForm({ setHasAccount }) {
  const { register } = useContext(AuthContext);

  const [authErrorMess, setAuthErrorMess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nameRef = useRef();
  const surnameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const repeatRef = useRef();

  async function handleRegister(e) {
    authErrorMess ? setAuthErrorMess("") : null;
    setIsLoading(true);
    e.preventDefault();
    if (passwordRef.current.value === repeatRef.current.value) {
      if (nameRef.current.value && surnameRef.current.value) {
        try {
          await register(
            nameRef.current.value,
            surnameRef.current.value,
            null,
            emailRef.current.value,
            passwordRef.current.value
          );
        } catch (error) {
          console.log(error.code);
          if (error.code === "auth/invalid-email") {
            setAuthErrorMess("Email is invalid");
          } else if (error.code === "auth/email-already-in-use") {
            setAuthErrorMess("Email is already in use");
          } else if (error.code === "auth/weak-password") {
            setAuthErrorMess("Password is too short (6)");
          } else if (error.code === "auth/missing-password") {
            setAuthErrorMess("Password is missing");
          } else {
            setAuthErrorMess("Unknown error");
          }
          setIsLoading(false);
        }
      } else {
        setAuthErrorMess("Name and surname are mandatory");
        setIsLoading(false);
      }
    } else {
      setAuthErrorMess("Passwords are different");
      passwordRef.current.value = "";
      repeatRef.current.value = "";
      setIsLoading(false);
    }
  }

  return (
    <>
      <h2 className={styles.title}>Register</h2>
      {isLoading ? (
        <LoadingSpinner className={loadingSpinnerStyles.form} />
      ) : (
        <>
          <form className={styles.form}>
            <div className={styles.inputSection}>
              {authErrorMess && <ValidationMessage>{authErrorMess}</ValidationMessage>}
              <Input inputRef={nameRef} inputName="name" inputType="text">
                Name*
              </Input>
              <Input inputRef={surnameRef} inputName="surname" inputType="text">
                Surname*
              </Input>
              <Input inputRef={emailRef} inputName="email" inputType="email">
                E-mail*
              </Input>
              <Input inputRef={passwordRef} inputName="password" inputType="password">
                Password*
              </Input>
              <Input inputRef={repeatRef} inputName="repeatPassword" inputType="password">
                Repeat password*
              </Input>
            </div>
            <Button className={buttonStyles.registerButton} onClick={handleRegister}>
              Register
            </Button>
          </form>
          <p className={styles.text}>
            You already have an account?&nbsp;
            <a
              className={styles.link}
              onClick={() => {
                setHasAccount(true);
              }}
            >
              Sign in
            </a>
          </p>
        </>
      )}
    </>
  );
}
