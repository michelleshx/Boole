import React from "react";
import AceEditor from "react-ace";
import styles from "./CodeEditor.css";

import "ace-builds/src-noconflict/theme-monokai";
import "./ace-mode-george";
import "./ace-auto-complete-george";

function CodeEditor({ value, setValue }) {
  const onChange = (newValue) => {
    setValue(newValue);
    console.log("change", newValue);
  };

  return (
    <div className="editor">
      <AceEditor
        mode="george"
        theme="monokai"
        width="100%"
        onChange={onChange}
        value={value}
        setOptions={{
          fontSize: 15,
          highlightActiveLine: false,
          fixedWidthGutter: true,
          useSoftTabs: true,
          tabSize: 4,
          selectionStyle: "line",
          behavioursEnabled: true,
          showLineNumbers: true,
          showPrintMargin: false,
          scrollPastEnd: true,
          displayIndentGuides: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
        }}
        name="UNIQUE_ID_OF_DIV"
        editorProps={{ $blockScrolling: true }}
      />
    </div>
  );
}

export default CodeEditor;
