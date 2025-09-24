import React, { useState, ChangeEvent, useContext } from "react";
import Modal from "react-modal";

import { Button } from "../../../components";
import styles from "./FileUploadModal.module.css";

import { FileContext } from "../../../context/FileContext";
import { LanguageServerContext } from "../../../context/LanguageServerContext";
import { editor } from "monaco-editor";

Modal.setAppElement("#root"); // Bind modal to the root element to avoid screen reader issues

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(); // not the File object in common/
  const { setValue, openFile } = useContext(FileContext);
  const { editorRef } = useContext(LanguageServerContext);

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
		  let model = editorRef.current?.getModel();
		  if(!model) return;
		  const range = model.getFullModelRange();
		  editorRef.current?.executeEdits("file-upload", [
		  	{
			  range,
			  text: fileContent,
			  forceMoveMarkers: true,
		  	},
		  ]);
		  // Mocaco will call the callback handleEditorChange in CodeEditor/index.tsx
		  // which will update value and openFile in FileContext
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
      zIndex: 1000,
      width: "400px",
      minHeight: "220px",
      borderRadius: "5px",
      padding: "20px",
      background: "white",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1000,
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
      <label className={styles.fileInput}>
        <input
          type="file"
          accept=".grg,.grx,.txt"
          onChange={handleFileChange}
        />
      </label>

      <div className={styles.buttonContainer}>
        <Button
          text="Upload"
          variant="secondary"
          onClick={handleUpload}
          disabled={!uploadedFile}
          title="Upload"
        />
        <Button text="Close" variant="exit" onClick={onClose} title="Close" />
      </div>
    </Modal>
  );
};

export default FileUploadModal;
