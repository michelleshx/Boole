/* global gtag */

import SplitPane from "react-split-pane";
import { useState } from "react";

import "./App.css";
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import SideBar from "./SideBar";
import FileProvider from "./context/FileContext";
import StateProvider from "./context/StateContext";

function App() {
  const [isDarkMode, setDarkMode] = useState<boolean>(true);
  const [feedback, setFeedback] = useState(
    'Click the "Ask George" button to get feedback or Start Debugging a Z-Spec'
  );
  const [feedbackExpanded, setFeedbackExpanded] = useState<boolean>(false);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(true);
  const [isFileTab, setIsFileTab] = useState<boolean>(true);

  const onVerify = (feedback: string) => {
    setFeedback(feedback);
    setFeedbackExpanded(true);
  };

  return (
    <div className="App">
      <FileProvider>
        <StateProvider>
          <AppBar 
            onVerify={(feedback) => onVerify(feedback)}
            isDarkMode={isDarkMode} 
            setDarkMode={setDarkMode}
            />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexGrow: "1",
              overflow: "hidden",
            }}
          >
            <SideBar
              isFileTab={isFileTab}
              setIsFileTab={setIsFileTab}
              showRightPanel={showRightPanel}
              setShowRightPanel={setShowRightPanel}
            />
            {/* TODO: incompatible https://github.com/tomkp/react-split-pane/issues/826 */}
            {/* @ts-ignore TS2322 */}
            <SplitPane
              split="vertical"
              minSize={showRightPanel ? (isFileTab ? 170 : 464) : 0}
              maxSize={showRightPanel ? 800 : 0}
              style={{ position: "relative" }}
            >
              {isFileTab ? (
                <FileExplorer />
              ) : (
                <SidePanel onVerify={(feedback) => onVerify(feedback)} />
              )}
              <CodeEditor isDarkMode={isDarkMode}/>
            </SplitPane>
          </div>
          <BottomPanel
            feedback={feedback}
            feedbackExpanded={feedbackExpanded}
            setFeedbackExpanded={setFeedbackExpanded}
          />
        </StateProvider>
      </FileProvider>
    </div>
  );
}

export default App;
