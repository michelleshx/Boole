/* global gtag */

import { useState, useEffect } from "react";
import styles from "./FileExplorer.module.css";

import Directories from "../common/directories";
import { File } from "../common/files";

import ExpandableListItem from "../components/ExpandableListItem";

const FileExplorer = ({ openFile, onFileOpen }) => {
  const [directories, setDirectories] = useState(null);

  useEffect(() => {
    const fetchDirectories = async () => {
      let directories = await Directories.get();
      onFileOpen(directories[0].files[0]);
      setDirectories(directories);
    };

    fetchDirectories();
  }, [onFileOpen]);

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
                <li key={file.name}>
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
                        className="file-explorer-reset-button"
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
