"use client";
import styles from "@/styles/home/confirmModal.module.css";
import alertStyles from "@/styles/home/alert.module.css";
import buttonStyles from "@/styles/button.module.css";
import modalStyles from "@/styles/modal.module.css";
import modalBackgroundStyles from "@/styles/modalBackground.module.css";
import { useContext } from "react";
import { ConfirmContext } from "@/context/confirm-context";
import Button from "../Button";
import Modal from "../Modal";
import ModalBackground from "../ModalBackground";

export default function ConfirmModal({ confirmMessage, handleAction }) {
  const { hideConfirm } = useContext(ConfirmContext);

  function handleClick() {
    handleAction();
    hideConfirm();
  }

  return (
    <ModalBackground className={modalBackgroundStyles.confirmModal}>
      <Modal className={modalStyles.confirmModal}>
        <p className={alertStyles.message}> {confirmMessage}</p>
        <div className={styles.buttonContainer}>
          <Button className={buttonStyles.saveButton} onClick={handleClick}>
            Ok
          </Button>
          <Button className={buttonStyles.cancelButton} onClick={hideConfirm}>
            Cancel
          </Button>
        </div>
      </Modal>
    </ModalBackground>
  );
}
