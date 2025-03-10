import SplitPane from "react-split-pane";

import { useState } from "react";

import "./App.css";
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import SideBar from "./SideBar";

import useMessageHandler from "./hooks/useMessageHandler";
import useSubmission from "./hooks/useSubmission";
import ExpressionEvaluator from "./BottomPanel/ExpressionEvaluator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";

import { Feedback } from "./common/types";

function App() {
  const [isDarkMode, setDarkMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<Feedback>(
    'Click the "Ask George" button (Ctrl+Enter) to get feedback or Start Debugging a Z-Spec'
  );
  const [isDebugging, setIsDebugging] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState<boolean>(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState<boolean>(false);
  const [expressionExpanded, setExpressionExpanded] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isFileTab, setIsFileTab] = useState<boolean>(true);
  const [autocomplete, setAutocomplete] = useState<boolean>(true);
  const [keybinding, setKeybinding] = useState<string>("default");
  const [submissionFeedback, setSubmissionFeedback] = useState<Feedback>("");

  const onVerify = (feedback: Feedback, markus: boolean = false) => {
    setFeedback(feedback);
    setShowBottomPanel(true);
    setFeedbackExpanded(true);
    setSubmissionFeedback(markus ? feedback : "");
  };

  const { processing, processedValue, valid, magicUsed, sendMessage } =
    useMessageHandler({
      method: "custom/getFeedback",
      onSuccess: onVerify,
    });
  const { submitting, submittedValue, submit, assignments } =
    useSubmission(onVerify);

  const onCheck = (val: string) => {
    sendMessage(val);
  };

  const onSubmit = (val: string, assignmentId: number, fileName: string) => {
    submit(val, assignmentId, fileName);
  };

  return (
    <div
      className="App"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <AppBar
        isDarkMode={isDarkMode}
        setDarkMode={setDarkMode}
        verifying={processing}
        verifiedValue={processedValue}
        valid={valid}
        magicUsed={magicUsed}
        onCheck={onCheck}
        onSubmit={onSubmit}
        assignments={assignments}
        submittedValue={submittedValue}
        submitting={submitting}
        submissionFeedback={submissionFeedback}
        setSubmissionFeedback={setSubmissionFeedback}
      />
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        <SideBar
          isFileTab={isFileTab}
          setIsFileTab={setIsFileTab}
          showRightPanel={showRightPanel}
          setShowRightPanel={setShowRightPanel}
          feedbackExpanded={feedbackExpanded}
          setFeedbackExpanded={setFeedbackExpanded}
          showBottomPanel={showBottomPanel}
          setShowBottomPanel={setShowBottomPanel}
          settingsExpanded={settingsExpanded}
          setSettingsExpanded={setSettingsExpanded}
        />
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* TODO: incompatible https://github.com/tomkp/react-split-pane/issues/826 */}
          {/* @ts-ignore TS2322 */}
          <SplitPane
            split="vertical"
            minSize={showRightPanel ? (isFileTab ? 170 : 464) : 0}
            maxSize={showRightPanel ? 800 : 0}
            style={{ position: "relative", flexGrow: 1 }}
          >
            {isFileTab ? (
              <FileExplorer />
            ) : (
              <SidePanel
                onVerify={(feedback) => onVerify(feedback)}
                isDebugging={isDebugging}
                setIsDebugging={setIsDebugging}
              />
            )}
            <CodeEditor
              isDarkMode={isDarkMode}
              onCheck={onCheck}
              autocomplete={autocomplete}
              // keybinding={keybinding}
            />
          </SplitPane>
          {/*Expression Evaluator*/}
          {isDebugging && (
            <div
              style={{
                position: "absolute",
                right: "-20px",
                width: expressionExpanded ? "600px" : "0px",
                height: expressionExpanded ? "inherit" : "50px",
                background: "var(--text-color-tertiary)",
                padding: "0px 10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                borderRadius: "5px 0px 0px 5px",
                zIndex: 999,
                transition: "0.2s",
              }}
            >
              <button
                style={{
                  backgroundColor: "transparent",
                  fontSize: "24px",
                  height: "48px",
                  background: "var(--text-color-tertiary)",
                  color: "var(--text-color-highlighted)",
                  position: "absolute",
                  left: "-44px",
                  top: "0",
                  width: "50px",
                  borderRadius: "8px 0px 0px 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => {
                  setExpressionExpanded(!expressionExpanded);
                }}
                aria-label="Expression Evaluator"
                title="Expression Evaluator"
              >
                <FontAwesomeIcon icon={faCalculator} />
              </button>
              <ExpressionEvaluator />
            </div>
          )}
          <BottomPanel
            feedback={feedback}
            feedbackExpanded={feedbackExpanded}
            showBottomPanel={showBottomPanel}
            setShowBottomPanel={setShowBottomPanel}
            settingsExpanded={settingsExpanded}
            autocomplete={autocomplete}
            setAutocomplete={setAutocomplete}
            keybinding={keybinding}
            setKeybinding={setKeybinding}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
