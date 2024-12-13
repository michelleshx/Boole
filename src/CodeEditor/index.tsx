// import React, { useRef, useEffect, useContext, useState } from "react";
// import AceEditor from "react-ace";
// import "./CodeEditor.css";

// import "ace-builds/src-noconflict/keybinding-vim";
// import "ace-builds/src-noconflict/keybinding-emacs";

// import { FileContext } from "../context/FileContext";

// import "ace-builds/src-noconflict/theme-monokai";
// import "ace-builds/src-noconflict/theme-xcode";
// import "./ace-mode-george";
// import "./ace-auto-complete-george";
// import "ace-builds/src-noconflict/ext-searchbox"; // Import the searchbox extension
// import "ace-builds/src-noconflict/ext-language_tools"; // Import language tools

// interface EditorProps {
//   isDarkMode: boolean;
//   onCheck: (val: string) => void;
//   autocomplete: boolean;
//   keybinding: string;
// }

// const CodeEditor = ({
//   isDarkMode,
//   // onCheck,
//   // autocomplete,
//   // keybinding,
// }: EditorProps) => {
//   const { value, setValue, openFile } = useContext(FileContext);

//   const onChange = (newValue: string) => {
//     setValue(newValue);
//     if (openFile !== null) openFile.set(newValue);
//   };

//   // Create a ref to store the editor instance
//   const editorRef = useRef<any>(null);

//   // Function to handle editor loading
//   const onEditorLoad = (editor: any) => {
//     editorRef.current = editor;
//     if (!editor.commands.commands.toggleComment) {
//       editor.commands.addCommand({
//         name: "toggleComment",
//         bindKey: { win: "Ctrl-/", mac: "Command-/" },
//         exec: function (editor: any) {
//           editor.toggleCommentLines();
//         },
//         multiSelectAction: "forEachLine",
//         scrollIntoView: "cursor",
//         readOnly: false,
//       });
//     }
//   };

//   // useEffect to add the keydown event listener
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.metaKey || event.ctrlKey) {
//         if (event.key === "f") {
//           event.preventDefault(); // Prevent the default browser search
//           if (editorRef.current) {
//             editorRef.current.execCommand("find"); // Trigger Ace Editor's search
//           }
//         } else if (event.key === "Enter") {
//           onCheck(value);
//         }
//       }
//     };

//     // Add the event listener to the document
//     document.addEventListener("keydown", handleKeyDown);

//     // Cleanup the event listener on component unmount
//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [value, onCheck]);

//   return (
//     <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
//       <div style={{ flexGrow: 1 }}>
//         <AceEditor
//           mode="george"
//           theme={isDarkMode ? "monokai" : "xcode"}
//           width="100%"
//           height="100%"
//           onChange={onChange}
//           onLoad={onEditorLoad} // Add the onLoad prop
//           value={value}
//           wrapEnabled={true}
//           keyboardHandler={keybinding === "default" ? undefined : keybinding}
//           setOptions={{
//             fontSize: 15,
//             highlightActiveLine: false,
//             fixedWidthGutter: true,
//             useSoftTabs: true,
//             tabSize: 4,
//             selectionStyle: "line",
//             behavioursEnabled: true,
//             showLineNumbers: true,
//             showPrintMargin: false,
//             scrollPastEnd: true,
//             displayIndentGuides: true,
//             enableBasicAutocompletion: autocomplete, // Toggle autocomplete via autocomplete state
//             enableLiveAutocompletion: autocomplete,
//           }}
//           name="UNIQUE_ID_OF_DIV"
//           editorProps={{ $blockScrolling: true }}
//         />
//       </div>
//     </div>
//   );
// };

// export default CodeEditor;

// CodeEditor.tsx
// CodeEditor.tsx

import { FileContext } from "../context/FileContext";
import React, { useEffect, useState, useContext, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import {registerGeorge} from './monaco-george';
import { BeforeMount, Monaco, OnMount } from "@monaco-editor/react";
import monaco from "monaco-editor";

interface EditorProps {
  isDarkMode: boolean;
  onCheck: (val: string) => void;
  autocomplete: boolean;
}

const CodeEditor = ({
  isDarkMode,
  onCheck,
  autocomplete,
}: EditorProps) => {
  const { value, setValue, openFile } = useContext(FileContext);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);


  const handleEditorWillMount: BeforeMount = (monaco) => {
    // Remove all keybindings we want to handle globally
    monaco.editor.addKeybindingRules([
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG,
        command: null,
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyB,
        command: null,
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ,
        command: null,
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK,
        command: null,
      },
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyU,
        command: null,
      }
    ]);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      if (openFile !== null) openFile.set(value);
    }
  };

  function setEditorTheme(){
    const rootStyles = getComputedStyle(document.body);
    const background1 = rootStyles.getPropertyValue('--background-1').trim();
    const background2 = rootStyles.getPropertyValue('--background-2').trim();
    const textColourEditor = rootStyles.getPropertyValue('--text-color-editor').trim();
    const textColourEditor2 = rootStyles.getPropertyValue('--text-color-editor-secondary').trim();
    const textColourEditor3 = rootStyles.getPropertyValue('--text-color-editor-tertiary').trim();
    const backgroundHighlighted = rootStyles.getPropertyValue('--background-highlighted').trim();
    const textHighlighted = rootStyles.getPropertyValue('--text-color-tertiary').trim();
    const cursorColour = rootStyles.getPropertyValue('--cursor').trim();

    var baseTheme = 'vs-dark'
    if (isDarkMode){
      baseTheme = 'vs-dark'
    } else {
      baseTheme = 'vs'
    }

    if (monacoRef.current) {
      monacoRef.current.editor.defineTheme('george-custom-theme', {
        base: 'hc-light',
        inherit: false,
        rules: [
          { token: 'comment', foreground: '6272a4' },
          { token: 'keyword', foreground: 'ff79c6' },
          { token: 'type', foreground: '66d9ef' },
          { token: 'constant', foreground: textColourEditor2 },
          { token: 'identifier', foreground: textColourEditor3 }, // Generic identifiers (e.g., variable names)
          {
            token: 'other', // Token type to style
            foreground: 'FFFFFF', // Example: White text
            background: 'FF0000', // Not natively supported in `rules`, needs workaround
          },
        ],
        colors: {
          'editor.background': background1,
          'editor.foreground': textColourEditor,
          'editorCursor.foreground': cursorColour,
          'editor.wordHighlightBackground': textHighlighted,
          'editor.lineHighlightBorder': background1,
      
          // Add line number coloring
          'editorLineNumber.foreground': '#6272a4', // Customize this to your desired color
      
          // cmd/ctrl F menu
          'editorWidget.background': background1,
          'editorWidget.foreground': textColourEditor, // Text color
          'editorWidget.resizeBorder': '#6272a4', // Resize handle color
          'input.background': background2, // Text field background
          'input.foreground': textColourEditor, // Text field text color
          'input.border': '#44475a', // Text field border color
        },
      });
      
    }
  }

  const handleEditorMount: OnMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {

    editorRef.current = editor;
    monacoRef.current = monaco;

    setEditorTheme()

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
      () => {
        const editorContent = editor.getValue();
        onCheck(editorContent);
      }
    );    
    
    // Apply the custom theme
    monaco.editor.setTheme('george-custom-theme');
    registerGeorge(editor, monaco);
    monaco.editor.setModelLanguage(editor.getModel()!, "george");

  }

  useEffect(() => {
    if (monacoRef.current) {
      
      setEditorTheme()

      // Re-apply the custom theme
      monacoRef.current.editor.setTheme('george-custom-theme');
    }
  }, [isDarkMode]);

  return (
    <Editor
      height="100%"
      width="100%"
      defaultLanguage="george"
      value={value}
      theme="vs"
      onMount={handleEditorMount}
      beforeMount={handleEditorWillMount}
      onChange={handleEditorChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        quickSuggestions: autocomplete,
      }}
    />
  );
};

export default CodeEditor;
