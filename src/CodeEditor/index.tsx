import React, { useRef, useEffect, useContext } from 'react';
import AceEditor from "react-ace";
import "./CodeEditor.css";

import { FileContext } from "../context/FileContext";

import "ace-builds/src-noconflict/theme-monokai";
import "./ace-mode-george";
import "./ace-auto-complete-george";
import "ace-builds/src-noconflict/ext-searchbox"; // Import the searchbox extension

interface EditorProps {}

const CodeEditor = ({}: EditorProps) => {
  const { value, setValue, openFile } = useContext(FileContext);

  const onChange = (newValue: string) => {
    setValue(newValue);
    if (openFile !== null) openFile.set(newValue);
  };

  // Create a ref to store the editor instance
  const editorRef = useRef<any>(null);

  // Function to handle editor loading
  const onEditorLoad = (editor: any) => {
    editorRef.current = editor;
  };

  // useEffect to add the keydown event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault();
        if (editorRef.current) {
          editorRef.current.execCommand('find');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="editor">
      <AceEditor
        mode="george"
        theme="monokai"
        width="100%"
        onChange={onChange}
        value={value}
        onLoad={onEditorLoad} // Set the onLoad prop to get the editor instance
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
