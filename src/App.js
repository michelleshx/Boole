import { useState } from "react";
import SplitPane from "react-split-pane";

import "./App.css";
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor/CodeEditor";

function App() {
  const [feedback, setFeedback] = useState(
    'Click the "Ask George" button to get feedback or Start Debugging a Z-Spec'
  );

  return (
    <div className="App">
      <AppBar />
      <SplitPane
        split="vertical"
        minSize={464}
        maxSize={800}
        style={{ position: "relative" }}
      >
        <SidePanel />
        <CodeEditor />
      </SplitPane>
      <BottomPanel feedback={feedback} />
    </div>
  );
}

export default App;
