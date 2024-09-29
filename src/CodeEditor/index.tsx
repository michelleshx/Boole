import React, { useRef, useEffect, useContext } from 'react';
import AceEditor from "react-ace";
import "./CodeEditor.css";

import { FileContext } from "../context/FileContext";

import "ace-builds/src-noconflict/theme-monokai";
import "./ace-mode-george";
import "./ace-auto-complete-george";
import "ace-builds/src-noconflict/ext-searchbox"; // Import the searchbox extension
import "ace-builds/src-noconflict/ext-language_tools"; // Import language tools

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
    if (!editor.commands.commands.toggleComment) {
      editor.commands.addCommand({
        name: "toggleComment",
        bindKey: { win: "Ctrl-/", mac: "Command-/" },
        exec: function (editor: any) {
          editor.toggleCommentLines();
        },
        multiSelectAction: "forEachLine",
        scrollIntoView: "cursor",
        readOnly: false,
      });
    }
  };

  // useEffect to add the keydown event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'f') {
        event.preventDefault(); // Prevent the default browser search
        if (editorRef.current) {
          editorRef.current.execCommand('find'); // Trigger Ace Editor's search
        }
      }
    };

    // Add the event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div style={{ height: "100%" }} >
      <AceEditor
        mode="george"
        theme={"monokai"}
        width="100%"
        onChange={onChange}
        onLoad={onEditorLoad} // Add the onLoad prop
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
