import { createContext, useState, useContext } from "react";
import useWebSocket from "react-use-websocket";
import * as monaco from "monaco-editor";
import { FileContext } from "./FileContext";

type WebSocketContextType = {
  markers: monaco.editor.IMarkerData[];
  sendDidOpenMessage: (name: string, value: string) => void;
  sendDidChangeMessage: (model: monaco.editor.ITextModel) => void;
  sendDidCloseMessage: (name: string) => void;
};

export const WebSocketContext = createContext<WebSocketContextType>(
  {} as WebSocketContextType,
);

const createLSPMessage = (method: string, params: Object) => {
  return JSON.stringify({
    jsonrpc: "2.0",
    id: Math.floor(Math.random() * 1000), // Unique ID for each request
    method,
    params,
  });
};

const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<monaco.editor.IMarkerData[]>([]);
  const { openFile } = useContext(FileContext)
  const url = "ws://student.cs.uwaterloo.ca/~se212/language-server";

  const { sendMessage } = useWebSocket(url, {
    shouldReconnect: (closeEvent) => true,
    onOpen: () => {
      const initMessage = createLSPMessage("initialize", {
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
          setMarkers([]);
          return;
        } else {
          setMarkers(
            data.params.diagnostics.map((diag: any) => ({
              startLineNumber: diag.range.start.line,
              startColumn: diag.range.start.character,
              endLineNumber: diag.range.end.line,
              endColumn: diag.range.end.character,
              message: diag.message,
              severity: monaco.MarkerSeverity.Error, // Set severity as Error
            })),
          );
        }
      }
    },
  });

  const sendDidOpenMessage = (name: string, value: string) => {
    const didOpenMessage = createLSPMessage("textDocument/didOpen", {
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
    const changeMessage = createLSPMessage("textDocument/didChange", {
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
    const closeMessage = createLSPMessage("textDocument/didClose", {
      textDocument: {
        uri: "file:///" + name,
      },
    });
    sendMessage(closeMessage);
  };

  return (
    <WebSocketContext.Provider
      value={{
        markers,
        sendDidOpenMessage,
        sendDidChangeMessage,
        sendDidCloseMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
