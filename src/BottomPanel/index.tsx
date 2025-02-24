import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./BottomPanel.module.css";
import EditorSettings from "./EditorSettings";
import { Feedback } from "../common/types";
import LinkedFeedback from "../components/LinkedFeedback";

interface BottomPanelProps {
  feedback: Feedback;
  feedbackExpanded: boolean;
  showBottomPanel: boolean;
  setShowBottomPanel: React.Dispatch<React.SetStateAction<boolean>>;
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
          if (settingsExpanded || feedbackExpanded) {
            setShowBottomPanel(!showBottomPanel);
          }
        }}
        aria-label={
          showBottomPanel ? "Minimize Panel Size" : "Maximize Panel Size"
        }
        title={showBottomPanel ? "Minimize Panel Size" : "Maximize Panel Size"}
      >
        <FontAwesomeIcon icon={showBottomPanel ? faChevronDown : faChevronUp} />
      </button>
      {showBottomPanel && (
        <div className={styles.bottomPanel}>
          {feedbackExpanded &&
            (Array.isArray(feedback) ? (
              <div className={styles.output}>
                {feedback.map((item, index) =>
                  typeof item === "string" ? (
                    <p
                      key={index}
                      style={{
                        whiteSpace: "pre-wrap",
                        fontFamily: "inherit",
                        color: "inherit",
                      }}
                    >
                      {item}
                    </p>
                  ) : (
                    <LinkedFeedback feedbackWithLineRange={item} key={index} />
                  )
                )}
              </div>
            ) : (
              <textarea
                className={styles.output}
                readOnly={true}
                value={feedback}
              />
            ))}
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
