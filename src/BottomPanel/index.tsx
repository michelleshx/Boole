import React, { useState } from "react";
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
}

const BottomPanel = ({
  feedback,
  feedbackExpanded,
  showBottomPanel,
  settingsExpanded,
  autocomplete,
  setAutocomplete,
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
      {showBottomPanel &&
        feedbackExpanded &&
        (Array.isArray(feedback) ? (
          <div className={styles.output}>
            {feedback.map((ele, index) =>
              typeof ele === "string" ? (
                <p key={index} className={styles.feedback}>
                  {ele}
                </p>
              ) : (
                <div key={index}>
				  {ele.comments && (
					<div>
					  <p style={{ display: "block" }}>
						<span style={{ color: "green", fontWeight: "bold" }}>
						  Comments
						</span>
						<span onClick={() => toggleDropdown(index)}>
						  {openIndexes.includes(index) ? " ▲" : " ▼"}
						</span>
					  </p>
					  {openIndexes.includes(index) &&
						ele.comments.map((comment, commentIndex) => (
						  <FeedbackItem item={comment} key={`comment-${commentIndex}`} />
						))}
					</div>
				  )}
				  {ele.other_items &&
					ele.other_items.map((item, itemIndex) => (
					  <FeedbackItem item={item} key={`other-${itemIndex}`} />
					))}
                </div>
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
        />
      )}
    </div>
  );
};

export default BottomPanel;
