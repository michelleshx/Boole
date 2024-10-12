import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
  faBug,
  faCalculator,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import ExpressionEvaluator from "./ExpressionEvaluator";
import styles from "./BottomPanel.module.css";

interface BottomPanelProps {
  feedback: string;
  feedbackExpanded: boolean;
  setFeedbackExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  showBottomPanel: boolean;
  setShowBottomPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomPanel = ({
  feedback,
  feedbackExpanded,
  setFeedbackExpanded,
  showBottomPanel,
  setShowBottomPanel,
}: BottomPanelProps) => {
  const [expressionExpanded, setExpressionExpanded] = useState(false);

  return (
    <div className={styles.container}>
      <button
        className={styles.topHeader}
        onClick={() => setShowBottomPanel(!showBottomPanel)}
        aria-label={
          showBottomPanel ? "Minimize Panel Size" : "Maximize Panel Size"
        }
        title={showBottomPanel ? "Minimize Panel Size" : "Maximize Panel Size"}
      >
        <FontAwesomeIcon icon={showBottomPanel ? faChevronDown : faChevronUp} />
      </button>
      {showBottomPanel && (
        <div className={styles.bottomPanel}>
          <div
            className={[
              styles.panel,
              styles[`panel--${feedbackExpanded ? "horizontal" : "vertical"}`],
            ].join(" ")}
          >
            <button
              className={[
                styles.button,
                styles[
                  `button--${feedbackExpanded ? "horizontal" : "vertical"}`
                ],
              ].join(" ")}
              onClick={() => setFeedbackExpanded(!feedbackExpanded)}
              aria-label="Debug Console"
              title="Debug Console"
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
              styles[
                `panel--${expressionExpanded ? "horizontal" : "vertical"}`
              ],
            ].join(" ")}
          >
            <button
              className={[
                styles.button,
                styles[
                  `button--${expressionExpanded ? "horizontal" : "vertical"}`
                ],
              ].join(" ")}
              onClick={() => setExpressionExpanded(!expressionExpanded)}
              aria-label="Expression Evaluator"
              title="Expression Evaluator"
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
        </div>
      )}
    </div>
  );
};

export default BottomPanel;
