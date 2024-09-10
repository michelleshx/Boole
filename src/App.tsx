/* global gtag */

import SplitPane from "react-split-pane";
import { useState } from "react";

import { download } from "./common/download";
import { File } from "./common/files";

import './App.css';
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor";
import FileExplorer from "./FileExplorer";
import SideBar from "./SideBar";

function App() {
  const [value, setValue] = useState("");
  const [openFile, setOpenFile] = useState<File>(new File("test-file.grg")); // TODO update when files implemented
  const [feedback, setFeedback] = useState(
    'Click the "Ask George" button to get feedback or Start Debugging a Z-Spec'
  );
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("files");

  const onDownload = () => {
    gtag("event", "download", {
      event_label: openFile.name,
    });
    download(openFile.name, value);
  };

  // onValueChange = (value) => {
  //   this.setState({ value });
  //   if (this.state.openFile !== null) this.state.openFile.set(value);
  // };

  const onVerify = (feedback: string) => {
    setFeedback(feedback);
    setFeedbackExpanded(true);
  };

  const onFileOpen = async (file: File) => {
    try {
      // to do handle null values
      setValue(await file.get() ?? "");
      setOpenFile(file);
    } catch {
      alert("Failed to open file!"); // TODO debug this
    }

    // TODO reset editor
  };

  return (
    <div className="App">
      <AppBar
        value={value}
        onDownload={onDownload}
        onVerify={(feedback) => onVerify(feedback)}
      />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* TODO: incompatible https://github.com/tomkp/react-split-pane/issues/826 */}
        {/* @ts-ignore TS2322 */}
        <SplitPane
          split="vertical"
          minSize={464}
          maxSize={800}
          style={{ position: "relative" }}
        >
          {activeTab == "files" ? (
            <FileExplorer openFile={openFile} onFileOpen={onFileOpen} />
          ) : (
            <SidePanel />
          )}
          <CodeEditor
            value={value}
            setValue={setValue}
            // openFile={openFile} not used?
          />
        </SplitPane>
      </div>
      {/* <BottomPanel
        feedback={feedback}
        feedbackExpanded={feedbackExpanded}
        setFeedbackExpanded={setFeedbackExpanded}
      /> */}
    </div>
  );
}

export default App;
