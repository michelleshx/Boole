import { useState, useContext } from "react";
import styles from "./ExpressionEvaluator.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import useMessageHandler from "../../../hooks/useMessageHandler";
import { FileContext } from "../../../context/FileContext";
import { Button, Loading } from "../../../components";

import { Feedback } from "../../../common/types";
import { FileType } from "../../../common/files";

interface ExpressionEvaluatorProps {
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpressionEvaluator = ({ setIsDebugging }: ExpressionEvaluatorProps) => {
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Feedback>();
  const { value, fileType } = useContext(FileContext);

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

  const onEvaluate = ({
    feedback,
    method,
    valid,
  }: {
    feedback: Feedback;
    method: string;
    valid?: boolean;
  }) => {
    if (method === "custom/runEvaluateExpression") {
      setError(!valid);
      setResult(feedback);
    }
  };

  const { processing, sendMessage } = useMessageHandler({
    method: "custom/runEvaluateExpression",
    onSuccess: onEvaluate,
  });

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

    // change #check CE, change to #check SET
    if (fileType === FileType.COUNTEREXAMPLE) {
      file = value.replace("#check CE", "#check SET");
    }
    sendMessage(file, expression);
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
        onClick={() => setIsDebugging(false)}
        disabled={false}
        fullWidth
        title="Stop debugging"
      />
    </div>
  );
};

export default ExpressionEvaluator;
