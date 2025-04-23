import { useState, useContext } from "react";
import styles from "./ExpressionEvaluator.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { FileContext } from "../../../context/FileContext";
import { Button, Loading } from "../../../components";

import { Feedback, SendMessageFn } from "../../../common/types";

interface ExpressionEvaluatorProps {
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: SendMessageFn;
  processing: boolean;
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  result: Feedback;
  setResult: React.Dispatch<React.SetStateAction<Feedback>>;
}

const ExpressionEvaluator = ({
  setIsDebugging,
  sendMessage,
  processing,
  error,
  setError,
  result,
  setResult,
}: ExpressionEvaluatorProps) => {
  const [expression, setExpression] = useState("");
  const { value } = useContext(FileContext);

  const renderFeedback = (feedback: Feedback | undefined): string => {
    if (!feedback) return "";
    return Array.isArray(feedback)
      ? feedback
          .map((item) =>
            typeof item === "string" ? item : JSON.stringify(item)
          )
          .join(" ")
      : String(feedback);
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
    setError(false);
  };

  const handleEvaluate = () => {
    let file = value;
    if (!expression.trim()) {
      setResult("Oops, please enter an expression!");
      setError(true);
      return;
    }

    sendMessage("custom/runEvaluateExpression", file, expression);
  };

  return (
    <div className={styles.expressionEvaluator}>
      <div className={styles.container}>
        <label className={styles.label}>Expression Evaluator</label>
        <div className={styles.row}>
          <input
            className={styles.input}
            placeholder="Enter an expression here"
            onChange={(e) => setExpression(e.target.value)}
            value={expression}
          />
          {expression && (
            <button
              className={styles.clearButton}
              onClick={handleClear}
              title="Clear Input"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <Button
          text="Evaluate"
          title="Evaluate"
          variant="primary"
          disabled={processing}
          onClick={handleEvaluate}
        >
          {processing && <Loading />}
        </Button>
        <p
          className={`${styles.result} ${error ? styles.error : ""}`}
          style={{
            display: "block",
            whiteSpace: "pre-wrap",
          }}
        >
          {renderFeedback(result)}
        </p>
      </div>
      <Button
        text="Stop debugging"
        variant="caution"
        onClick={() => {
          setIsDebugging(false);
          setExpression("");
          setResult("");
        }}
        disabled={false}
        fullWidth
        title="Stop debugging"
      />
    </div>
  );
};

export default ExpressionEvaluator;
