import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import styles from "./ExpressionEvaluator.module.css";

const ExpressionEvaluator = () => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

  const evaluateExpression = () => {
    setResult("result!"); // TODO
  };

  return (
    <div className={styles.expressionEvaluator}>
      <label className={styles.label}>Expression</label>
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="Enter an expression here"
          onChange={(e) => setExpression(e.target.value)}
          value={expression}
        />
        <button
          className={styles.iconButton}
          onClick={() => evaluateExpression()}
          aria-label="Evaluate expression"
          title="Evaluate expression"
        >
          <FontAwesomeIcon icon={faPlay} style={{ marginLeft: "2px" }} />
        </button>
      </div>
      <label className={styles.label}>Result</label>
      <input className={styles.result} value={result} />
    </div>
  );
};

export default ExpressionEvaluator;
