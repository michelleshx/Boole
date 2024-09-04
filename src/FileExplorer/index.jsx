/* global gtag */

import { useState, useEffect } from "react";
import styles from "./FileExplorer.module.css";

import Directories from "../common/directories";
import { File } from "../common/files";

import ExpandableListItem from "../components/ExpandableListItem";

const FileExplorer = ({ openFile, onFileOpen }) => {
  const [directories, setDirectories] = useState(null);
  const [defaultFileSet, setDefaultFileSet] = useState(false);

  useEffect(() => {
    const fetchDirectories = async () => {
      let directories = await Directories.get();
      setDirectories(directories);
      if (!defaultFileSet && directories.length > 0 && directories[0].files.length > 0) {
        onFileOpen(directories[0].files[0]);
        setDefaultFileSet(true);
      }
    };

    fetchDirectories();
  }, [onFileOpen, defaultFileSet]);

  const toggleDirectoryExpanded = (directoryIndex) => {
    const updatedDirectories = [...directories];
    const directory = updatedDirectories[directoryIndex];
    updatedDirectories[directoryIndex] = {
      ...directory,
      expanded: !directory.expanded,
    };
    setDirectories(updatedDirectories);
  };

  const openFileHandler = (targetFile) => {
    if (targetFile === openFile) return;

    gtag("event", "open", {
      event_label: targetFile.name,
    });

    onFileOpen(targetFile);
  };

  const reset = async (targetFile) => {
    if (
      !window.confirm(
        "Are you sure you would like to reset this file?\nWARNING: You will lose all your changes for this file!"
      )
    )
      return;

    gtag("event", "reset", {
      event_label: targetFile.name,
    });

    await targetFile.reset();
    onFileOpen(targetFile);
  };

  return (
    <ul className={styles.fileExplorer}>
      {directories === null ? (
        <div
          className="file-explorer-loading"
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
            <ul
              className={
                directory.expanded ? "file-explorer-directory-expanded" : ""
              }
            >
              {directory.files.map((file, fileIndex) => (
                <li key={file.name} className={styles.directoryFileList}>
                  <div
                    className={
                      "file-explorer-label" +
                      (file === openFile ? " file-explorer-selected" : "")
                    }
                    onClick={() => openFileHandler(file)}
                  >
                    <span className="file-explorer-name">{file.name}</span>
                    {file === openFile ? (
                      <span
                        className={styles.fileExplorerResetutton}
                        role="img"
                        title="Reset"
                        aria-label="Reset"
                        onClick={(e) => {
                          e.stopPropagation();
                          reset(file);
                        }}
                      >
                        🔄
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