import { useContext } from "react";
import AceEditor from "react-ace";
import "./CodeEditor.css";

import { FileContext } from "../context/FileContext";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import "./ace-mode-george";
import "./ace-auto-complete-george";

interface EditorProps {
  isDarkMode: boolean
}

const CodeEditor = ({isDarkMode}: EditorProps) => {
  const { value, setValue, openFile } = useContext(FileContext);

  const onChange = (newValue: string) => {
    setValue(newValue);
    if (openFile !== null) openFile.set(newValue);
  };

  return (
    <div className="editor">
      <AceEditor
        mode="george"
        theme={isDarkMode? "monokai": "xcode"}
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
};

export default CodeEditor;
