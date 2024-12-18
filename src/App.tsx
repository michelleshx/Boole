import SplitPane from "react-split-pane";
import { useState, useContext } from "react";

import "./App.css";
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import SideBar from "./SideBar";
import FileProvider from "./context/FileContext";
import StateProvider from "./context/StateContext";

import useVerification from "./hooks/useVerification";
import { FileContext } from "./context/FileContext";
import useSubmission from "./hooks/useSubmission";

function App() {
  const [isDarkMode, setDarkMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState(
    'Click the "Ask George" button (Ctrl+Enter) to get feedback or Start Debugging a Z-Spec'
  );
  const [settingsExpanded, setSettingsExpanded] = useState<boolean>(false);
  const [feedbackExpanded, setFeedbackExpanded] = useState<boolean>(false);
  const [expressionExpanded, setExpressionExpanded] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isFileTab, setIsFileTab] = useState<boolean>(true);
  const { value } = useContext(FileContext);
  const [autocomplete, setAutocomplete] = useState<boolean>(true);
  const [keybinding, setKeybinding] = useState<string>("default");
  const [submissionFeedback, setSubmissionFeedback] = useState("");

  const onVerify = (feedback: string, markus: boolean = false) => {
    setFeedback(feedback);
    setShowBottomPanel(true);
    setFeedbackExpanded(true);
    setSubmissionFeedback(markus ? feedback : "");
  };

  const { verifying, verifiedValue, valid, magicUsed, verify } =
    useVerification(value, onVerify);
  const { submitting, submittedValue, submit, assignments } =
    useSubmission(onVerify);

  const onCheck = (val: string) => {
    verify(val);
  };

  const onSubmit = (val: string, assignmentId: number, fileName: string) => {
    submit(val, assignmentId, fileName);
  };

  return (
    <div
      className="App"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <FileProvider>
        <StateProvider>
          <AppBar
            isDarkMode={isDarkMode}
            setDarkMode={setDarkMode}
            verifying={verifying}
            verifiedValue={verifiedValue}
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
              expressionExpanded={expressionExpanded}
              setExpressionExpanded={setExpressionExpanded}
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
                overflow: "hidden",
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
                  <SidePanel onVerify={(feedback) => onVerify(feedback)} />
                )}
                <CodeEditor
                  isDarkMode={isDarkMode}
                  onCheck={onCheck}
                  autocomplete={autocomplete}
                  // keybinding={keybinding}
                />
              </SplitPane>
              <BottomPanel
                feedback={feedback}
                feedbackExpanded={feedbackExpanded}
                expressionExpanded={expressionExpanded}
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
        </StateProvider>
      </FileProvider>
    </div>
  );
}

export default App;
