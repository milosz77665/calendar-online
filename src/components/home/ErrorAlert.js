import alertStyles from "@/styles/home/alert.module.css";
import buttonStyles from "@/styles/button.module.css";
import modalStyles from "@/styles/modal.module.css";
import modalBackgroundStyles from "@/styles/modalBackground.module.css";
import { useContext } from "react";
import { ErrorContext } from "@/context/error-context";
import Modal from "../Modal";
import Button from "../Button";
import ModalBackground from "../ModalBackground";

export default function ErrorAlert({ errorMessage }) {
  const { hideError } = useContext(ErrorContext);

  return (
    <ModalBackground className={modalBackgroundStyles.errorAlertModalBackground}>
      <Modal className={modalStyles.errorModal}>
        <p className={alertStyles.message}>{errorMessage}</p>
        <Button className={buttonStyles.okButton} onClick={hideError}>
          Ok
        </Button>
      </Modal>
    </ModalBackground>
  );
}
