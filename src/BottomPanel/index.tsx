import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import ExpressionEvaluator from "./ExpressionEvaluator";
import styles from "./BottomPanel.module.css";
import EditorSettings from "./EditorSettings";

interface BottomPanelProps {
  feedback: string;
  feedbackExpanded: boolean;
  showBottomPanel: boolean;
  setShowBottomPanel: React.Dispatch<React.SetStateAction<boolean>>;
  expressionExpanded: boolean;
  settingsExpanded: boolean;
  autocomplete: boolean;
  setAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
  keybinding: string;
  setKeybinding: React.Dispatch<React.SetStateAction<string>>;
}

const BottomPanel = ({
  feedback,
  feedbackExpanded,
  showBottomPanel,
  setShowBottomPanel,
  expressionExpanded,
  settingsExpanded,
  autocomplete,
  setAutocomplete,
  keybinding,
  setKeybinding,
}: BottomPanelProps) => {
  return (
    <div className={styles.container}>
      <button
        className={styles.topHeader}
        onClick={() => {
            if ((settingsExpanded || feedbackExpanded)) {
              setShowBottomPanel(!showBottomPanel)
            }
          }
        }
        aria-label={
          showBottomPanel ? "Minimize Panel Size" : "Maximize Panel Size"
        }
        title={showBottomPanel ? "Minimize Panel Size" : "Maximize Panel Size"}
      >
        <FontAwesomeIcon icon={showBottomPanel ? faChevronDown : faChevronUp} />
      </button>
      {showBottomPanel && (
        <div className={styles.bottomPanel}>
          {feedbackExpanded && (
            <textarea
              className={styles.output}
              readOnly={true}
              value={feedback}
            />
          )}
          {expressionExpanded && <ExpressionEvaluator />}

          {settingsExpanded && (
            <EditorSettings
              autocomplete={autocomplete}
              setAutocomplete={setAutocomplete}
              keybinding={keybinding}
              setKeybinding={setKeybinding}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BottomPanel;
