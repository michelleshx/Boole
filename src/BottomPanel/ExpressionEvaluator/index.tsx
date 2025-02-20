import { useState, useContext } from "react";
import styles from "./ExpressionEvaluator.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import useEvaluator from "../../hooks/useEvaluator";
import { FileContext } from "../../context/FileContext";
import { Button, Loading } from "../../components";

const ExpressionEvaluator = () => {
  const [expression, setExpression] = useState("");
  const [error, setError] = useState(false);
  const [result, setResult] = useState("");
  const { value } = useContext(FileContext);

  const { evaluate, evaluating } = useEvaluator((feedback: string) => {
    setError(feedback.includes("error"));
    setResult(feedback);
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
    evaluate(value?.concat(expression) || expression);
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
        <Button
          text="Evaluate"
          title="Evaluate"
          variant="primary"
          disabled={evaluating}
          onClick={handleEvaluate}
        >
          {evaluating && <Loading />}
        </Button>
      </div>
      <p className={`${styles.result} ${error ? styles.error : ""}`}>
        {result}
      </p>
    </div>
  );
};

export default ExpressionEvaluator;
