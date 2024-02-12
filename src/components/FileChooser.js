"use client";
import styles from "@/styles/fileChooser.module.css";
import { ErrorContext } from "@/context/error-context";
import { useContext, useState } from "react";

export default function FileChooser({ id, fileType, onFileChange, className }) {
  const fileChooserClasses = className ? `${className} ${styles.fileChooserContainer}` : styles.fileChooserContainer;
  const selectedFileClasses = className ? `${className} ${styles.selectedFile}` : styles.selectedFile;
  const textClasses = className ? `${className} ${styles.text}` : styles.text;
  const [selectedFile, setSelectedFile] = useState(null);
  const { showError } = useContext(ErrorContext);
  const wrongFileTypeErrorMessage = `Only files with the ${fileType} extension can be imported`;

  function handleOnDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.name.endsWith(fileType)) {
        setSelectedFile(file);
        onFileChange(file);
      } else {
        e.target.value = null;
        showError(wrongFileTypeErrorMessage);
      }
    }
  }

  function handleOnChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.name.endsWith(fileType)) {
        setSelectedFile(file);
        onFileChange(file);
      } else {
        e.target.value = null;
        showError(wrongFileTypeErrorMessage);
      }
    }
  }

  return (
    <label
      className={fileChooserClasses}
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={handleOnDrop}
    >
      {selectedFile ? (
        <p className={selectedFileClasses}>{selectedFile.name}</p>
      ) : (
        <p className={textClasses}>
          No file selected
          <br />
          Choose file...
        </p>
      )}
      <input id={id} type="file" className={styles.fileChooser} accept={fileType} onChange={handleOnChange} />
    </label>
  );
}
