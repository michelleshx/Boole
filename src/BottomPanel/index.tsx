import React, { useState } from "react";
// import SplitPane from "react-split-pane";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faBug,
  faCalculator,
} from "@fortawesome/free-solid-svg-icons";
import ExpressionEvaluator from "./ExpressionEvaluator";
import styles from "./BottomPanel.module.css";

interface BottomPanelProps {
  feedback: string;
  feedbackExpanded: boolean;
  setFeedbackExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomPanel = ({ feedback, feedbackExpanded, setFeedbackExpanded }: BottomPanelProps) => {
  const [expressionExpanded, setExpressionExpanded] = useState(false);

  return (
    <div className={styles.bottomPanel}>
      {/* <SplitPane
        split="vertical"
        minSize={464}
        maxSize={1168}
        allowResize={feedbackExpanded && expressionExpanded}
        style={{ position: "relative" }}
      > */}
      <div
        className={[
          styles.panel,
          styles[`panel--${feedbackExpanded ? "horizontal" : "vertical"}`],
        ].join(" ")}
      >
        <button
          className={[
            styles.button,
            styles[`button--${feedbackExpanded ? "horizontal" : "vertical"}`],
          ].join(" ")}
          onClick={() => setFeedbackExpanded(!feedbackExpanded)}
        >
          <FontAwesomeIcon
            icon={feedbackExpanded ? faChevronDown : faChevronRight}
          />
          {feedbackExpanded ? "Feedback" : <FontAwesomeIcon icon={faBug} />}
        </button>
        {feedbackExpanded && (
          <textarea
            className={styles.output}
            readOnly={true}
            value={feedback}
          />
        )}
      </div>
      <div
        className={[
          styles.panel,
          styles[`panel--${expressionExpanded ? "horizontal" : "vertical"}`],
        ].join(" ")}
      >
        <button
          className={[
            styles.button,
            styles[`button--${expressionExpanded ? "horizontal" : "vertical"}`],
          ].join(" ")}
          onClick={() => setExpressionExpanded(!expressionExpanded)}
        >
          <FontAwesomeIcon
            icon={expressionExpanded ? faChevronDown : faChevronRight}
          />
          {expressionExpanded ? (
            "expression evaluator"
          ) : (
            <FontAwesomeIcon icon={faCalculator} />
          )}
        </button>
        {expressionExpanded && <ExpressionEvaluator />}
      </div>
      {/* </SplitPane> */}
    </div>
  );
};

export default BottomPanel;
