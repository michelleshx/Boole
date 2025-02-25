/* global gtag */

import { createContext } from "react";
import useWebSocket from "react-use-websocket";
import React, { useContext, useRef } from "react";
import { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { FileContext } from "../context/FileContext";

type LanguageServerContextType = {
  editorRef: React.MutableRefObject<monaco.editor.IStandaloneCodeEditor | null>;
  monacoRef: React.MutableRefObject<Monaco | null>;
  addMarkers: (newMarkers: monaco.editor.IMarkerData[]) => void;
  lastJsonMessage: any;
  sendDidOpenMessage: (name: string, value: string) => void;
  sendDidChangeMessage: (model: monaco.editor.ITextModel) => void;
  sendDidCloseMessage: (name: string) => void;
  sendVerificationMessage: (value: string) => void;
  sendGetZSpecComponentsMessage: (value: string) => void;
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
  // const url = "ws://se212-ws.student.cs.uwaterloo.ca:80/se212/language-server";
  const url = "ws://127.0.0.1:8080"; // local testing

  const addMarkers = (newMarkers: monaco.editor.IMarkerData[]) => {
    if (monacoRef.current && editorRef.current?.getModel()) {
      const existingMarkers = monacoRef.current!.editor.getModelMarkers({
        owner: "owner",
      });
      monacoRef.current!.editor.setModelMarkers(
        editorRef.current?.getModel()!,
        "owner",
        [...existingMarkers, ...newMarkers]
      );
    }
  };

  const createMessage = (method: string, params: Object) => {
    return JSON.stringify({
      jsonrpc: "2.0",
      id: Math.floor(Math.random() * 1000), // Unique ID for each request
      method,
      params,
    });
  };

  const { sendMessage, lastJsonMessage } = useWebSocket(url, {
    // TODO: onError, onClose
    shouldReconnect: (closeEvent) => true,
    onOpen: () => {
      const initMessage = createMessage("initialize", {
        capabilities: {
          textDocument: {
            synchronization: {
              willSave: true,
              didSave: true,
              didChange: true,
            },
          },
        },
      });
      sendMessage(initMessage);
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data);

      if (data.method === "textDocument/publishDiagnostics") {
        if (data.params.diagnostics.length === 0) {
          if (monacoRef.current && editorRef.current?.getModel()) {
            monacoRef.current!.editor.setModelMarkers(
              editorRef.current?.getModel()!,
              "owner",
              []
            );
          }
          return;
        } else {
          const markers = data.params.diagnostics.map((diag: any) => ({
            startLineNumber: diag.range.start.line,
            startColumn: diag.range.start.character,
            endLineNumber: diag.range.end.line,
            endColumn: diag.range.end.character,
            message: diag.message,
            severity: monaco.MarkerSeverity.Error, // Set severity as Error
          }));
          if (monacoRef.current && editorRef.current?.getModel()) {
            monacoRef.current!.editor.setModelMarkers(
              editorRef.current?.getModel()!,
              "owner",
              markers
            );
          }
        }
      }
    },
  });

  const sendDidOpenMessage = (name: string, value: string) => {
    const didOpenMessage = createMessage("textDocument/didOpen", {
      textDocument: {
        uri: "file:///" + name,
        languageId: "george",
        version: 1,
        text: value,
      },
    });
    sendMessage(didOpenMessage);
  };

  const sendDidChangeMessage = (model: monaco.editor.ITextModel) => {
    const changeMessage = createMessage("textDocument/didChange", {
      textDocument: {
        uri: "file:///" + openFile.name,
        languageId: "george",
        version: 1,
        text: model.getValue(),
      },
      contentChanges: [
        {
          text: model.getValue(),
        },
      ],
    });
    sendMessage(changeMessage);
  };

  const sendDidCloseMessage = (name: string) => {
    const closeMessage = createMessage("textDocument/didClose", {
      textDocument: {
        uri: "file:///" + name,
      },
    });
    sendMessage(closeMessage);
  };

  const sendVerificationMessage = (value: string) => {
    const verificationMessage = createMessage("custom/getFeedback", {
      data: value,
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

  return (
    <LanguageServerContext.Provider
      value={{
        editorRef,
        monacoRef,
        addMarkers,
        lastJsonMessage,
        sendDidOpenMessage,
        sendDidChangeMessage,
        sendDidCloseMessage,
        sendVerificationMessage,
        sendGetZSpecComponentsMessage,
      }}
    >
      {children}
    </LanguageServerContext.Provider>
  );
};

export default LanguageServerProvider;
