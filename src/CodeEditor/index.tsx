import { Loading } from "../components/"
import { FileContext } from "../context/FileContext";
import { LanguageServerContext } from "../context/LanguageServerContext";
import React, { useEffect, useContext } from "react";
import Editor from "@monaco-editor/react";
import { registerGeorge } from "./monaco-george";
import { BeforeMount, Monaco, OnMount } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

interface EditorProps {
  isDarkMode: boolean;
  onCheck: (val: string) => void;
  autocomplete: boolean;
}

const CodeEditor = ({ isDarkMode, onCheck, autocomplete }: EditorProps) => {
  const { value, setValue, openFile, isLoadingDefFile } = useContext(FileContext);
  const { editorRef, monacoRef, setHaveMonaco, sendDidChangeMessage } = useContext(
    LanguageServerContext
  );

  const handleEditorWillMount: BeforeMount = (monaco) => {
	monacoRef.current = monaco;
	setHaveMonaco(true);
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
      },
    ]);
  };

  /*
   * Callback function for Monaco Editor's onChange event
   * This should update value and openFile of FileContext
   * */
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value);
      if (openFile !== null) openFile.set(value);
    }

    if (editorRef.current?.getModel()) {
      sendDidChangeMessage(editorRef.current.getModel()!);
    }
  };

  function setEditorTheme() {
    const rootStyles = getComputedStyle(document.body);
    const background1 = rootStyles.getPropertyValue("--background-1").trim();
    const background2 = rootStyles.getPropertyValue("--background-2").trim();
    const textColourEditor = rootStyles
      .getPropertyValue("--text-color-editor")
      .trim();
    const textColourEditor2 = rootStyles
      .getPropertyValue("--text-color-editor-secondary")
      .trim();
    const textColourEditor3 = rootStyles
      .getPropertyValue("--text-color-editor-tertiary")
      .trim();
    const backgroundHighlighted = rootStyles
      .getPropertyValue("--background-highlighted")
      .trim();
    const textHighlighted = rootStyles
      .getPropertyValue("--text-color-tertiary")
      .trim();
    const cursorColour = rootStyles.getPropertyValue("--cursor").trim();

    var baseTheme = "vs-dark";
    if (isDarkMode) {
      baseTheme = "vs-dark";
    } else {
      baseTheme = "vs";
    }

    if (monacoRef.current) {
      monacoRef.current.editor.defineTheme("george-custom-theme", {
        base: "hc-light",
        inherit: false,
        rules: [
          { token: "comment", foreground: "6272a4" },
          { token: "keyword", foreground: "ff79c6" },
          { token: "type", foreground: "66d9ef" },
          { token: "constant", foreground: textColourEditor2 },
          { token: "identifier", foreground: textColourEditor3 }, // Generic identifiers (e.g., variable names)
          {
            token: "other", // Token type to style
            foreground: "FFFFFF", // Example: White text
            background: "FF0000", // Not natively supported in `rules`, needs workaround
          },
        ],
        colors: {
          "editor.background": background1,
          "editor.foreground": textColourEditor,
          "editorCursor.foreground": cursorColour,
          "editor.wordHighlightBackground": textHighlighted,
          "editor.lineHighlightBorder": background1,

          // Add line number coloring
          "editorLineNumber.foreground": "#6272a4", // Customize this to your desired color

          // cmd/ctrl F menu
          "editorWidget.background": background1,
          "editorWidget.foreground": textColourEditor, // Text color
          "editorWidget.resizeBorder": "#6272a4", // Resize handle color
          "input.background": background2, // Text field background
          "input.foreground": textColourEditor, // Text field text color
          "input.border": "#44475a", // Text field border color
        },
      });
    }
  }

  const handleEditorMount: OnMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    // monacoRef.current = monaco;

    setEditorTheme();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const editorContent = editor.getValue();
      onCheck(editorContent);
    });

    // Apply the custom theme
    monaco.editor.setTheme("george-custom-theme");
    registerGeorge(editor, monaco);
  };

  useEffect(() => {
    if (monacoRef.current) {
      setEditorTheme();

      // Re-apply the custom theme
      monacoRef.current.editor.setTheme("george-custom-theme");
    }
  }, [isDarkMode]);

  if(isLoadingDefFile || !openFile) {
	return <p>Reading File Content</p>
  } else {
  	return (
      <Editor
      	height="100%"
      	width="100%"
      	defaultLanguage="george"
	  	path={openFile.getKey()}
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
  }
};

export default CodeEditor;
