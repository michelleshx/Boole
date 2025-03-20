/* global gtag */

import { useState, useEffect, useContext, useCallback } from "react";
import styles from "./FileExplorer.module.css";

import Directories, { Directory } from "../common/directories";
import { File } from "../common/files";
import ExpandableListItem from "../components/ExpandableListItem";

import { FileContext } from "../context/FileContext";
import { LanguageServerContext } from '../context/LanguageServerContext'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { dir } from "console";

interface FileExplorerProps { }

const FileExplorer: React.FC<FileExplorerProps> = () => {
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [defaultFileSet, setDefaultFileSet] = useState(false);

  const { setValue, openFile, setOpenFile } = useContext(FileContext);
  const { sendDidOpenMessage, sendDidCloseMessage } = useContext(LanguageServerContext);

  const onFileOpen = useCallback(
    async (file: File, directoryIndex: number, fileIndex: number) => {
      try {
        // to do handle null values
        setValue((await file.get()) ?? "");

        if (file.name) {
          sendDidOpenMessage(file.name, await file.get() ?? "");
        }

        setOpenFile(file);
        localStorage.setItem("openDirectoryIndex", directoryIndex.toString());
        localStorage.setItem("openFileIndex", fileIndex.toString());
      } catch {
        alert("Failed to open file!"); // TODO debug this
      }

      // TODO reset editor
    },
    [setValue, setOpenFile]
  );

  useEffect(() => {
    const fetchDirectories = async () => {
      let directories = await Directories.get();

      if (Array.isArray(directories)) {
        setDirectories(directories);
        if (localStorage.getItem("openDirectoryIndex") && localStorage.getItem("openFileIndex")) {
          var directoryIndex = parseInt(localStorage.getItem("openDirectoryIndex")!);
          var fileIndex = parseInt(localStorage.getItem("openFileIndex")!);
          if (directoryIndex < directories.length && fileIndex < directories[directoryIndex].files.length) {
            onFileOpen(directories[directoryIndex].files[fileIndex], directoryIndex, fileIndex);
          }
        } else if (!defaultFileSet && directories.length > 0 && directories[0].files.length > 0) {
          onFileOpen(directories[0].files[0], 0, 0);
          setDefaultFileSet(true);
        }
      } else {
        console.warn("Directories is not an array.");
      }
    };

    fetchDirectories();
  }, [defaultFileSet, onFileOpen]);

  const toggleDirectoryExpanded = (directoryIndex: number) => {
    const updatedDirectories = [...directories];
    const directory = updatedDirectories[directoryIndex];
    updatedDirectories[directoryIndex] = {
      ...directory,
      expanded: !directory.expanded,
    };
    setDirectories(updatedDirectories);
  };

  const openFileHandler = (targetFile: File, directoryIndex: number, fileIndex: number) => {
    if (targetFile === openFile) return;

    gtag("event", "open", {
      event_label: targetFile.name,
    });

    sendDidCloseMessage(openFile.name);
    onFileOpen(targetFile, directoryIndex, fileIndex);
  };

  const reset = async (targetFile: File, directoryIndex: number, fileIndex: number) => {
    if (
      !window.confirm(
        "Are you sure you would like to reset this file?\nWARNING: You will lose all your changes for this file!"
      )
    )
      return;

    gtag("event", "reset", {
      event_label: targetFile.name,
    });

    sendDidCloseMessage(openFile.name);

    await targetFile.reset();
    onFileOpen(targetFile, directoryIndex, fileIndex);
  };

  return (
    <ul className={styles.fileExplorer}>
      {directories === null ? (
        <div
          className={styles.fileExplorerLoading}
          role="img"
          title="Loading..."
          aria-label="Loading..."
        />
      ) : (
        directories.map((directory, directoryIndex) => (
          <ExpandableListItem
            title={directory.name}
            key={directory.name}
            onClick={() => toggleDirectoryExpanded(directoryIndex)}
          >
            <ul>
              {directory.files.map((file, fileIndex) => (
                <li
                  key={file.name}
                  className={[
                    styles.directoryFileList,
                    styles[
                    `fileExplorerLabel--${file === openFile ? "selected" : ""
                    }`
                    ],
                  ].join(" ")}
                >
                  <div
                    className={styles.fileExplorerLabel}
                    onClick={() => openFileHandler(file, directoryIndex, fileIndex)}
                  >
                    <span>{file.name}</span>
                    {file === openFile ? (
                      <span
                        className={styles.fileExplorerResetButton}
                        role="img"
                        title="Reset"
                        aria-label="Reset"
                        onClick={(e) => {
                          e.stopPropagation();
                          reset(file, directoryIndex, fileIndex);
                        }}
                      >
                        <FontAwesomeIcon icon={faRotate} />
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </ExpandableListItem>
        ))
      )}
    </ul>
  );
};

export default FileExplorer;
