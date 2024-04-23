/* global gtag */

import { useState } from "react";
import SplitPane from "react-split-pane";

import { download } from "./common/download";

import "./App.css";
import AppBar from "./AppBar";
import BottomPanel from "./BottomPanel";
import SidePanel from "./SidePanel";
import CodeEditor from "./CodeEditor/CodeEditor";

function App() {
  const [value, setValue] = useState(
    "#u j34ko\n#a p03\n\n#q 02\n\n#check Z\n\n//Types\n[People, Teams, Time]\n\n//Errors\n\nErrors ::= TeamAlreadyRegistered | PersonAlreadyRegistered\n\n//Constants\nschema Constants begin\n    MaxRunnersPerTeam: nat\n    MaxTeams: nat\n    Faster: Time prod Time --> bool //Faster(t1, t2) means that t1 is faster than t2\n    Sum: pow(nat) --> nat //returns the sum of all numbers in the set\n    Min: nat prod nat --> nat //Min(x, y) returns the smaller of x and y\npred\nend\n\n"
  );
  const [openFile, setOpenFile] = useState({ name: "test-file.grg" }); // TODO update when files implemented
  const [feedback, setFeedback] = useState(
    'Click the "Ask George" button to get feedback or Start Debugging a Z-Spec'
  );
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);

  const onDownload = () => {
    gtag("event", "download", {
      event_label: openFile.name,
    });
    download(openFile.name, value);
  };

  const onVerify = (feedback) => {
    setFeedback(feedback);
    setFeedbackExpanded(true);
  };

  return (
    <div className="App">
      <AppBar onVerify={onVerify} onDownload={onDownload} />
      <SplitPane
        split="vertical"
        minSize={464}
        maxSize={800}
        style={{ position: "relative" }}
      >
        <SidePanel />
        <CodeEditor value={value} setValue={setValue} />
      </SplitPane>
      <BottomPanel feedback={feedback} />
    </div>
  );
}

export default App;
