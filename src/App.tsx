import SplitPane from "react-split-pane";

import { useState, useCallback } from "react";

import styles from "./App.module.css";
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import SideBar from "./SideBar";

import useMessageHandler from "./hooks/useMessageHandler";
import useSubmission from "./hooks/useSubmission";

import { Feedback, Tab } from "./common/types";

function App() {
  const [isDarkMode, setDarkMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<Feedback>(
    'Click the "Ask George" button (Ctrl+Enter) to get feedback or Start Debugging a Z-Spec'
  );
  const [settingsExpanded, setSettingsExpanded] = useState<boolean>(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState<boolean>(false);
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(false);
  const [autocomplete, setAutocomplete] = useState<boolean>(true);
  const [submissionFeedback, setSubmissionFeedback] = useState<Feedback>("");

  // Side Panel Props
  const [isDebugging, setIsDebugging] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isFileTab, setIsFileTab] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState(Tab.State);
  const [sidePanelError, setSidePanelError] = useState(false);
  const [sidePanelFeedback, setSidePanelFeedback] = useState<Feedback>("");

  const onVerify = useCallback(
    ({
      feedback,
      method,
      valid,
    }: {
      feedback: Feedback;
      method: string;
      valid?: boolean;
    }) => {
      if (method !== "custom/runEvaluateExpression") {
        setFeedback(feedback);
        setShowBottomPanel(true);
        setFeedbackExpanded(true);
        setSettingsExpanded(false);
        setSubmissionFeedback(method === "markus" ? feedback : "");
      }
      if (method === "custom/getZSpecComponents" && valid) {
        setIsDebugging(true);
      }
      if (method === "custom/runOperations" && valid) {
        setActiveTab(Tab.State);
      }
      if (method === "custom/runEvaluateExpression") {
        setSidePanelError(!valid);
        setSidePanelFeedback(feedback);
      }
    },
    []
  );

  const { processing, processedValue, valid, magicUsed, sendMessage } =
    useMessageHandler({
      onSuccess: onVerify,
    });
  const { submitting, submittedValue, submit, assignments } =
    useSubmission(onVerify);

  const onCheck = useCallback(
    (val: string) => {
      sendMessage("custom/getFeedback", val);
    },
    [sendMessage]
  );

  const onSubmit = useCallback(
    (val: string, assignmentId: number, fileName: string) => {
      submit(val, assignmentId, fileName);
    },
    [submit]
  );

  return (
    <div className={styles.app}>
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
      <div className={styles.body}>
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
        <div className={styles.center}>
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
                isDebugging={isDebugging}
                setIsDebugging={setIsDebugging}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sendMessage={sendMessage}
                processing={processing}
                sidePanelError={sidePanelError}
                setSidePanelError={setSidePanelError}
                sidePanelFeedback={sidePanelFeedback}
                setSidePanelFeedback={setSidePanelFeedback}
              />
            )}
            <div className={styles.bottom}>
              {/* @ts-ignore TS2322 */}
              <SplitPane
                split="horizontal"
                minSize={showBottomPanel ? 350 : "auto"}
                maxSize={showBottomPanel ? -50 : "auto"}
                size={showBottomPanel ? 350 : window.innerHeight}
                allowResize={showBottomPanel}
                style={{
                  position: "relative",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
                pane2Style={{
                  overflow: "hidden",
                  background: "var(--background-3)",
                }}
                resizerStyle={{
                  maxHeight: 8,
                  background: "var(--background-4)",
                  borderTop: "2px solid var(--text-color-tertiary)",
                  cursor: "ns-resize",
                }}
              >
                <CodeEditor
                  isDarkMode={isDarkMode}
                  onCheck={onCheck}
                  autocomplete={autocomplete}
                />
                <BottomPanel
                  feedback={feedback}
                  feedbackExpanded={feedbackExpanded}
                  showBottomPanel={showBottomPanel}
                  setShowBottomPanel={setShowBottomPanel}
                  settingsExpanded={settingsExpanded}
                  autocomplete={autocomplete}
                  setAutocomplete={setAutocomplete}
                />
              </SplitPane>
            </div>
          </SplitPane>
        </div>
      </div>
    </div>
  );
}

export default App;
