import React, { useState, useContext } from "react";
import Modal from "react-modal";

import { Button, Loading } from "../../../components";
import { FileContext } from "../../../context/FileContext";
import styles from "./MarkusModal.module.css";

import { Assignment, Feedback } from "../../../common/types";

Modal.setAppElement("#root"); // Bind modal to the root element to avoid screen reader issues

interface MarkusModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignments: Assignment[];
  onSubmit: (val: string, assignmentId: number, fileName: string) => void;
  value: string;
  submittedValue: string | null;
  submitting: boolean;
  submissionFeedback: Feedback;
  setSubmissionFeedback: React.Dispatch<React.SetStateAction<Feedback>>;
}

const MarkusModal: React.FC<MarkusModalProps> = ({
  isOpen,
  onClose,
  assignments,
  onSubmit,
  value,
  submittedValue,
  submitting,
  submissionFeedback,
  setSubmissionFeedback,
}) => {
  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      zIndex: 1000,
      width: "440px",
      minHeight: "120px",
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

  const { openFile } = useContext(FileContext);
  const [assignmentId, setAssignmentId] = useState(-1);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value, 10);
    setAssignmentId(selectedId);
    setSubmissionFeedback("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Markus Submission Modal"
      style={modalStyles}
    >
      <h2 className={styles.modalHeader}>Select assignment to submit to </h2>
      {assignments.length > 0 ? (
        <select
          name="assignments"
          id="assignments"
          className={styles.dropdown}
          onChange={handleSelectChange}
        >
          {assignments.map((assn) => (
            <option key={assn.id} value={assn.id}>
              {assn.short_identifier}: {assn.description}
            </option>
          ))}
        </select>
      ) : (
        <p className={styles.noAssignmentsMessage}>No assignments available</p>
      )}
      <p>{submissionFeedback as string}</p>
      <div className={styles.buttonContainer}>
        <Button
          text="Submit"
          variant="primary"
          onClick={() => onSubmit(value, assignmentId, openFile.name)}
          title="Submit"
          disabled={assignments.length === 0}
        >
          {submitting && <Loading />}
          {submittedValue && submittedValue === value && "✔"}
        </Button>
        <Button text="Close" variant="exit" onClick={onClose} title="Close" />
      </div>
    </Modal>
  );
};

export default MarkusModal;
