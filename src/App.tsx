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

function App() {
  const [isDarkMode, setDarkMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState(
    'Click the "Ask George" button to get feedback or Start Debugging a Z-Spec'
  );
  const [feedbackExpanded, setFeedbackExpanded] = useState<boolean>(false);
  const [expressionExpanded, setExpressionExpanded] = useState(false);
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isFileTab, setIsFileTab] = useState<boolean>(true);
  const { value } = useContext(FileContext);

  const onVerify = (feedback: string) => {
    setFeedback(feedback);
    setShowBottomPanel(true);
    setFeedbackExpanded(true);
  };

  const { verifying, verifiedValue, valid, magicUsed, verify } =
    useVerification(value, onVerify);

  const onCheck = (val: string) => {
    verify(val);
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
                <CodeEditor isDarkMode={isDarkMode} onCheck={onCheck} />
              </SplitPane>
              <BottomPanel
                feedback={feedback}
                feedbackExpanded={feedbackExpanded}
                setFeedbackExpanded={setFeedbackExpanded}
                expressionExpanded={expressionExpanded}
                setExpressionExpanded={setExpressionExpanded}
                showBottomPanel={showBottomPanel}
                setShowBottomPanel={setShowBottomPanel}
              />
            </div>
          </div>
        </StateProvider>
      </FileProvider>
    </div>
  );
}

export default App;
