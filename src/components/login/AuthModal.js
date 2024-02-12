"use client";
import modalStyles from "@/styles/modal.module.css";
import Modal from "../Modal.js";
import RegisterForm from "./RegisterForm";
import SignInForm from "./SignInForm";
import { useState } from "react";

export default function AuthModal() {
  const [hasAccount, setHasAccount] = useState(true);

  const signInModalClasses = `${modalStyles.loginModal} ${hasAccount ? "" : modalStyles.hideLoginModal}`;
  const registerModalClasses = `${modalStyles.loginModal} ${hasAccount ? modalStyles.hideLoginModal : ""}`;

  return (
    <>
      <Modal className={signInModalClasses}>
        <SignInForm setHasAccount={setHasAccount} />
      </Modal>
      <Modal className={registerModalClasses}>
        <RegisterForm setHasAccount={setHasAccount} />
      </Modal>
    </>
  );
}
