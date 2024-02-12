import styles from "@/styles/home/extensionModal.module.css";
import buttonStyles from "@/styles/button.module.css";
import modalStyles from "@/styles/modal.module.css";
import Modal from "../Modal";
import Button from "../Button";
import Extension from "./Extension";
import { useContext } from "react";
import { ExtensionContext } from "@/context/extension-context";
import ModalBackground from "../ModalBackground";

export default function ExtensionModal() {
  const { setIsExtensionModalOpen, extensions, saveChanges } = useContext(ExtensionContext);
  const backgroundId = "ExtensionModal";
  return (
    <ModalBackground
      id={backgroundId}
      onClick={(e) => {
        if (e.target.id === backgroundId) {
          setIsExtensionModalOpen(false);
        }
      }}
    >
      <Modal className={modalStyles.extensionModal}>
        <Button
          className={buttonStyles.closeButton}
          onClick={() => {
            setIsExtensionModalOpen(false);
          }}
        >
          X
        </Button>
        <p className={styles.title}>Manage extensions</p>
        <div className={styles.extensionSection}>
          {extensions.map((ext) => (
            <Extension extension={ext.name} isAdded={ext.isAdded} key={ext.key} extKey={ext.key} />
          ))}
        </div>
        <div className={styles.buttonSection}>
          <Button
            className={buttonStyles.saveButton}
            onClick={() => {
              saveChanges();
              setIsExtensionModalOpen(false);
            }}
          >
            Save
          </Button>
          <Button
            className={buttonStyles.cancelButton}
            onClick={() => {
              setIsExtensionModalOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </ModalBackground>
  );
}
