import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import styles from "./BottomPanel.module.css";
import EditorSettings from "./EditorSettings";
import { Feedback } from "../common/types";
import FeedbackItem from "../components/FeedbackItem";

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
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleDropdown = (index: number) => {
    setOpenIndexes((prevState) => {
      if (prevState.includes(index)) {
        return prevState.filter((i) => i !== index);
      } else {
        return [...prevState, index];
      }
    });
  };

  return (
    <div className={styles.container}>
	  {/*<div className={styles.topHeader}></div>*/}

      {showBottomPanel &&
        feedbackExpanded &&
        (Array.isArray(feedback) ? (
          <div className={styles.output}>
            {feedback.map((ele, index) =>
              typeof ele === "string" ? (
                <p
                  key={index}
                  style={{
                    display: "block",
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    color: "inherit",
                  }}
                >
                  {ele}
                </p>
              ) : Array.isArray(ele) ? (
                // ele is a list of comments
                <p key={index} style={{ display: "block" }}>
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Comments
                  </span>
                  <span onClick={() => toggleDropdown(index)}>
                    {openIndexes.includes(index) ? " ▲" : " ▼"}
                  </span>
                  {openIndexes.includes(index) &&
                    ele.map((comment, commentIndex) => (
                      <FeedbackItem item={comment} key={commentIndex} />
                    ))}
                </p>
              ) : (
                <FeedbackItem item={ele} key={index} />
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

      {showBottomPanel && settingsExpanded && (
        <EditorSettings
          autocomplete={autocomplete}
          setAutocomplete={setAutocomplete}
          keybinding={keybinding}
          setKeybinding={setKeybinding}
        />
      )}
    </div>
  );
};

export default BottomPanel;
