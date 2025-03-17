import { useState, useContext } from "react";
import styles from "./ExpressionEvaluator.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import useMessageHandler from "../../../hooks/useMessageHandler";
import { FileContext } from "../../../context/FileContext";
import { Button, Loading } from "../../../components";

import { Feedback } from "../../../common/types";

const ExpressionEvaluator = () => {
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState<Feedback>();
  const { value } = useContext(FileContext);

  const onEvaluate = ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => {
    setError(feedback.includes("error"));
    setResult(feedback);
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
    if (!expression.trim()) {
      setResult("Oops, please enter an expression!");
      setError(true);
      return;
    }
    // TODO if file is #check SET, change to #check CE
    sendMessage(value, expression);
  };

  return (
    <div className={styles.expressionEvaluator}>
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
      <p className={`${styles.result} ${error ? styles.error : ""}`}>
        {result}
      </p>
    </div>
  );
};

export default ExpressionEvaluator;
