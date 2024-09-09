import React, { useState, ChangeEvent } from "react";
import Modal from "react-modal";

import Button from "../../Button";
import styles from "./FileUploadModal.module.css";

Modal.setAppElement("#root"); // Bind modal to the root element to avoid screen reader issues

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose }) => {
  // TODO: we might want to reconsider naming
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // @ts-ignore
        // TODO: fix these null errors
        const fileContent = e.target.result;
        if (typeof fileContent === "string") {
          localStorage.setItem(selectedFile.name, fileContent);
          console.log("File saved to localStorage:", selectedFile.name);
        } else {
          console.warn("No file content saved.")
        }
        onClose(); // Close the modal after upload
      };

      // Read the file as a data URL
      reader.readAsDataURL(selectedFile);
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
      height: "20%", // Adjust the height of the modal
      background: "#1F1C31",
      // maxWidth: "500px", // set a maximum width
      // maxHeight: "300px", // set a maximum height
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
        <Button text="Upload" variant="primary" onClick={handleUpload} />
        <Button text="Close" variant="exit" onClick={onClose} />
      </div>
    </Modal>
  );
};

export default FileUploadModal;
