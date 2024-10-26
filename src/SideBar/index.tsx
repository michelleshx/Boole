import styles from "./SideBar.module.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faBug, faCalculator, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

interface SideBarProps {
  isFileTab: boolean;
  setIsFileTab: React.Dispatch<React.SetStateAction<boolean>>;
  showRightPanel: boolean;
  setShowRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
  feedbackExpanded: boolean;
  setFeedbackExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  expressionExpanded: boolean;
  setExpressionExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  showBottomPanel: boolean;
  setShowBottomPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({
  isFileTab,
  setIsFileTab,
  showRightPanel,
  setShowRightPanel,
  feedbackExpanded,
  setFeedbackExpanded,
  expressionExpanded,
  setExpressionExpanded,
  showBottomPanel,
  setShowBottomPanel
}: SideBarProps) => {
  return (
    <div className={styles.sideBar}>
      {/* Top Buttons */}
      <button
        className={[
          styles.button,
          styles[`button--${showRightPanel && isFileTab ? "active" : ""}`],
        ].join(" ")}
        onClick={() => {
          isFileTab
            ? setShowRightPanel(!showRightPanel)
            : setShowRightPanel(true);
          setIsFileTab(true);
        }}
        aria-label="File Explorer"
        title="File Explorer"
      >
        <FontAwesomeIcon icon={faFolder} />
      </button>
      <button
        className={[
          styles.button,
          styles[`button--${showRightPanel && !isFileTab ? "active" : ""}`],
        ].join(" ")}
        onClick={() => {
          !isFileTab
            ? setShowRightPanel(!showRightPanel)
            : setShowRightPanel(true);
          setIsFileTab(false);
        }}
        aria-label="Debug"
        title="Debug"
      >
        <FontAwesomeIcon icon={faBug} />
      </button>

      {/* Spacer to push bottom buttons */}
      <div className={styles.spacer}></div>

      {/* Bottom Buttons */}
      <button
        className={[
          styles.button,
          styles[`button--${feedbackExpanded ? "active" : ""}`],
          styles.bottomButton,
        ].join(" ")}
        onClick={() => {
          setFeedbackExpanded((prev) => {
            var newFeedbackExpanded = prev;
            if (showBottomPanel){
              newFeedbackExpanded = !prev;
            } else {
              newFeedbackExpanded = true;
            }
            setShowBottomPanel(newFeedbackExpanded || expressionExpanded);
            return newFeedbackExpanded;
          });
        }}
        aria-label="Feedback"
        title="Feedback"
      >
        <FontAwesomeIcon icon={faExclamationCircle} />
      </button>

      <button
        className={[
          styles.button,
          styles[`button--${expressionExpanded ? "active" : ""}`],
          styles.bottomButton,
        ].join(" ")}
        onClick={() => {
          setExpressionExpanded((prev) => {
            var newExpressionExpanded = prev;
            if (showBottomPanel){
              newExpressionExpanded = !prev;
            } else {
              newExpressionExpanded = true;
            }
            setShowBottomPanel(newExpressionExpanded || feedbackExpanded);
            return newExpressionExpanded;
          });
        }}
        aria-label="Expression Evaluator"
        title="Expression Evaluator"
      >
        <FontAwesomeIcon icon={faCalculator} />
      </button>
      
    </div>
  );
};

export default SideBar;
