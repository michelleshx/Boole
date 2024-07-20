import React, { useState } from "react";
import Modal from "react-modal";

import Button from "../../Button";

Modal.setAppElement("#root"); // Bind modal to the root element to avoid screen reader issues

const FileUploadModal = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const fileContent = e.target.result;
        localStorage.setItem(selectedFile.name, fileContent);
        console.log("File saved to localStorage:", selectedFile.name);
        onClose(); // Close the modal after upload
      };

      // Read the file as a data URL
      reader.readAsDataURL(selectedFile);
    }
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      zIndex: 1000, // Ensure the modal is on top
      width: "30%", // Adjust the width of the modal
      height: "15%", // Adjust the height of the modal
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
      style={customStyles}
    >
      <h2 style={{ fontSize: "24px", marginBottom:"10px" }}>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "15px",
        }}
      >
        <Button text="Upload" variant="secondary" onClick={handleUpload} />
        <Button text="Close" variant="secondary" onClick={handleUpload} />
      </div>
    </Modal>
  );
};

export default FileUploadModal;
