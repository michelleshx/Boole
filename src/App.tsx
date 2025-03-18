import SplitPane from "react-split-pane";

import { useState } from "react";

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
  const [isDebugging, setIsDebugging] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState<boolean>(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState<boolean>(false);
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isFileTab, setIsFileTab] = useState<boolean>(true);
  const [autocomplete, setAutocomplete] = useState<boolean>(true);
  const [keybinding, setKeybinding] = useState<string>("default");
  const [submissionFeedback, setSubmissionFeedback] = useState<Feedback>("");
  const [activeTab, setActiveTab] = useState(Tab.State);

  const onVerify = ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => {
    if (method !== "custom/runEvaluateExpression") {
      setFeedback(feedback);
      setShowBottomPanel(true);
      setFeedbackExpanded(true);
      setSubmissionFeedback(method === "markus" ? feedback : "");
    }
    if (method === "custom/runOperations") {
      setActiveTab(Tab.State);
    }
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
                onVerify={onVerify}
                isDebugging={isDebugging}
                setIsDebugging={setIsDebugging}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            )}
            <div
              style={{
                flexGrow: 1,
                height: "100%",
                display: "flex",
                overflow: "hidden",
              }}
            >
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
                  keybinding={keybinding}
                  setKeybinding={setKeybinding}
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
