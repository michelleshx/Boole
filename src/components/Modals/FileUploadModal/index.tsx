import React, { useState, ChangeEvent, useContext } from "react";
import Modal from "react-modal";

import { Button } from "../../../components";
import styles from "./FileUploadModal.module.css";

import { FileContext } from "../../../context/FileContext";

Modal.setAppElement("#root"); // Bind modal to the root element to avoid screen reader issues

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const { setValue, openFile } = useContext(FileContext);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (uploadedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e?.target?.result;
        if (typeof fileContent === "string") {
          openFile.set(fileContent);
          setValue(fileContent);
          localStorage.setItem(openFile.name, fileContent);
        } else {
          console.warn("No file content saved.");
        }
        onClose();
      };

      reader.readAsText(uploadedFile);
    }
  };

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      zIndex: 1000, // Ensure the modal is on top
      width: "30%", // Adjust the width of the modal
      minHeight: "180px",
      background: "var(--background-1)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      zIndex: 1000, // Ensure the overlay is on top
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="File Upload Modal"
      style={modalStyles}
    >
      <h2 className={styles.modalHeader}>Upload File</h2>
      <h2 className={styles.modalDescription}>
        The uploaded file will replace your current working file!
      </h2>
      <input type="file" accept=".txt,.grg" onChange={handleFileChange} />
      <div className={styles.buttonContainer}>
        <Button
          text="Upload"
          variant="primary"
          onClick={handleUpload}
          title="Upload"
        />
        <Button text="Close" variant="exit" onClick={onClose} title="Close" />
      </div>
    </Modal>
  );
};

export default FileUploadModal;
