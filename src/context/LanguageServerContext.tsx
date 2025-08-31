import { createContext } from "react";
import useWebSocket from "react-use-websocket";
import React, { useContext, useRef } from "react";
import { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { FileContext } from "../context/FileContext";
import { SyntaxError, FeedbackError } from "../common/types";

type LanguageServerContextType = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
  setMarkers: (newMarkers: monaco.editor.IMarkerData[], owner: typeof SyntaxError | typeof FeedbackError) => void;
  addMarkers: (newMarkers: monaco.editor.IMarkerData[], owner: typeof SyntaxError | typeof FeedbackError) => void;
  lastJsonMessage: any;
  sendDidOpenMessage: (name: string, value: string) => void;
  sendDidChangeMessage: (model: monaco.editor.ITextModel) => void;
  sendDidCloseMessage: (name: string) => void;
  sendVerificationMessage: (value: string) => void;
  sendGetZSpecComponentsMessage: (value: string) => void;
  sendRunOperationsMessage: (
    value: string,
    interpretation: string,
    operation: string
  ) => void;
  sendRunEvaluateExpressionMessage: (value: string, expression: string) => void;
};

export const LanguageServerContext = createContext<LanguageServerContextType>(
  {} as LanguageServerContextType
);

const LanguageServerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const { openFile } = useContext(FileContext);
  // const url = "ws://127.0.0.1:8080"; // local testing
  // const url = "wss://se212-ws.student.cs.uwaterloo.ca/se212-dev01/"
  // const url = "wss://se212-ws.student.cs.uwaterloo.ca/se212-dev02/"
  const url = "wss://se212-ws.student.cs.uwaterloo.ca/se212/"

  const setMarkers = (newMarkers: monaco.editor.IMarkerData[], owner: typeof SyntaxError | typeof FeedbackError) => {
    if (monacoRef.current && editorRef.current?.getModel()) {
      monacoRef.current!.editor.setModelMarkers(
        editorRef.current?.getModel()!,
        owner,
        newMarkers
      );
    }
  };

  const addMarkers = (newMarkers: monaco.editor.IMarkerData[], owner: typeof SyntaxError | typeof FeedbackError) => {
    if (monacoRef.current && editorRef.current?.getModel()) {
      const existingMarkers = monacoRef.current!.editor.getModelMarkers({
        owner: owner,
      });
	  const uniqueNewMarkers = newMarkers.filter(newMarker => {
		return !existingMarkers.some(existingMarker =>
		  existingMarker.startLineNumber === newMarker.startLineNumber &&
		  existingMarker.startColumn === newMarker.startColumn &&
		  existingMarker.endLineNumber === newMarker.endLineNumber &&
		  existingMarker.endColumn === newMarker.endColumn &&
		  existingMarker.message === newMarker.message && 
		  existingMarker.severity === newMarker.severity
		);
	  });
      monacoRef.current!.editor.setModelMarkers(
        editorRef.current?.getModel()!,
        owner,
		[...existingMarkers, ...uniqueNewMarkers]
      );
    }
  };

  const createMessage = (method: string, params: Object) => {
    return JSON.stringify({
      // jsonrpc: "2.0",
      // id: Math.floor(Math.random() * 1000), // Unique ID for each request
      method,
      params,
    });
  };

  const { sendMessage, lastJsonMessage } = useWebSocket(url, {
    // TODO: onError, onClose
    shouldReconnect: (closeEvent) => true,
    onOpen: () => {
      const initMessage = createMessage("initialize", {
        // params: {
          // textDocument: {
          //   synchronization: {
          //     willSave: true,
          //     didSave: true,
          //     didChange: true,
          //   },
          // },
        // },
      });
      sendMessage(initMessage);
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      if (data.method === "didChange" || data.method === "didOpen") {
        if (data.res.diagnostics.length === 0) {
		  setMarkers([], SyntaxError)
          return;
        } else {
          const markers = data.res.diagnostics.map((diag: any) => ({
            startLineNumber: diag.startLineNumber,
            startColumn: diag.startColumn,
            endLineNumber: diag.endLineNumber,
            endColumn: diag.endColumn,
            message: diag.message,
            severity: diag.severity, 
          }));
		  setMarkers(markers, SyntaxError)
        }
      }
    },
  });

  const sendDidOpenMessage = (name: string, value: string) => {
    const didOpenMessage = createMessage("didOpen", {
      // params: {
        // uri: "file:///" + name,
        // languageId: "george",
        // version: 1,
        grg_code: value,
      // },
    });
    sendMessage(didOpenMessage);
  };

  const sendDidChangeMessage = (model: monaco.editor.ITextModel) => {
    const changeMessage = createMessage("didChange", {
      // params: {
        // uri: "file:///" + openFile.name,
        // languageId: "george",
        // version: 1,
        grg_code: model.getValue(),
      // },
      // contentChanges: [
      //   {
      //     text: model.getValue(),
      //   },
      // ],
    });
    sendMessage(changeMessage);
  };

  const sendDidCloseMessage = (name: string) => {
    const closeMessage = createMessage("didClose", {
      // params: {
      //   uri: "file:///" + name,
      // },
    });
    sendMessage(closeMessage);
  };

  const sendVerificationMessage = (value: string) => {
    const verificationMessage = createMessage("custom/getFeedback", {
      grg_code: value,
    });
    sendMessage(verificationMessage);
  };

  const sendGetZSpecComponentsMessage = (value: string) => {
    const getZSpecComponentsMessage = createMessage(
      "custom/getZSpecComponents",
      {
        data: value,
      }
    );
    sendMessage(getZSpecComponentsMessage);
  };

  const sendRunOperationsMessage = (
    value: string,
    interpretation: string,
    operation: string
  ) => {
    const runOperationsMessage = createMessage("custom/runOperations", {
      data: JSON.stringify({
        zSpec: value,
        interpretation,
        operation,
      }),
    });
    sendMessage(runOperationsMessage);
  };

  const sendRunEvaluateExpressionMessage = (
    value: string,
    expression: string
  ) => {
    const runEvaluateExpressionMessage = createMessage(
      "custom/runEvaluateExpression",
      {
        grg_code: JSON.stringify({ file: value, expression }),
      }
    );
    sendMessage(runEvaluateExpressionMessage);
  };

  return (
    <LanguageServerContext.Provider
      value={{
        editorRef,
        monacoRef,
		setMarkers,
        addMarkers,
        lastJsonMessage,
        sendDidOpenMessage,
        sendDidChangeMessage,
        sendDidCloseMessage,
        sendVerificationMessage,
        sendGetZSpecComponentsMessage,
        sendRunOperationsMessage,
        sendRunEvaluateExpressionMessage,
      }}
    >
      {children}
    </LanguageServerContext.Provider>
  );
};

export default LanguageServerProvider;
