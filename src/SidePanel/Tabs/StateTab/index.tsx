import React, { useEffect, useContext, useState } from "react";
import styles from "./StateTab.module.css";
import useMessageHandler from "../../../hooks/useMessageHandler";
import { StateContext } from "../../../context/StateContext";
import { Button } from "../../../components";
import { FileContext } from "../../../context/FileContext";
import { FileType } from "../../../common/files";
import { Feedback } from "../../../common/types";

interface StateTabProps {
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
  onVerify: ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => void;
}

const StateTab = ({ setIsDebugging, onVerify }: StateTabProps) => {
  const {
    currentStateSpace,
    types,
    constants,
    stateMap,
    resetState,
    updateStateAndStorage,
  } = useContext(StateContext);

  const { value, setFileType, getFileType } = useContext(FileContext);
  const [errorMessage, setErrorMessage] = useState("");

  const { processing, sendMessage } = useMessageHandler({
    method: "custom/getZSpecComponents",
    onSuccess: onVerify,
  });

  const onReset = () => {
    setIsDebugging(false);
    resetState();
  };

  const onReload = () => {
    const fileType = getFileType(value);
    setFileType(fileType); // set the file type

    // Check if the file is debuggable
    if (fileType === FileType.Z) {
      sendMessage(value);
      setIsDebugging(true);
    } else if (
      fileType === FileType.COUNTEREXAMPLE ||
      fileType === FileType.SET
    ) {
      setIsDebugging(true);
    } else {
      setErrorMessage(
        'Oops! this file does not support debugging, try using "Ask George" instead'
      );
    }
  };

  useEffect(() => {
    try {
      const keys: (keyof typeof stateMap)[] = [
        "currentStateSpace",
        "types",
        "constants",
      ];
      const localData = keys.reduce((acc, key) => {
        const item = localStorage.getItem(key);
        if (item) {
          acc[key] = JSON.parse(item);
        }
        return acc;
      }, {} as Partial<typeof stateMap>);

      if (Object.keys(localData).length === keys.length) {
        // Update all states from localStorage
        keys.forEach((key) => {
          updateStateAndStorage(key, localData[key]);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  // Generic input change handler
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    type: keyof typeof stateMap
  ) => {
    const { value } = event.target;
    const currentData = stateMap[type].value;
    const updatedData = currentData.map((item: any, i: number) =>
      i === index ? { ...item, value } : item
    );
    updateStateAndStorage(type, updatedData);
  };

  return (
    <div className={styles.stateTab}>
      {currentStateSpace.length > 0 && (
        <div className={styles.section}>
          <h2>Current State Space</h2>
          {currentStateSpace.map((states, index) => {
            return (
              <div className={styles.row} key={index}>
                <div className={styles.col}>{states.state}</div>
                <div className={styles.col}>{states.type}</div>
                <textarea
                  value={states.value}
                  className={[styles.col, styles.input].join(" ")}
                  placeholder={states.type}
                  onChange={(event) =>
                    handleInputChange(event, index, "currentStateSpace")
                  }
                />
              </div>
            );
          })}
        </div>
      )}
      {types.length > 0 && (
        <div className={styles.section}>
          <h2>Types</h2>
          {types.map((types, index) => {
            return (
              <div className={styles.row} key={index}>
                <div className={styles.col}>{types.type}</div>
                <textarea
                  value={types.value}
                  className={[styles.col, styles.input].join(" ")}
                  placeholder={types.type}
                  onChange={(event) => handleInputChange(event, index, "types")}
                />
              </div>
            );
          })}
        </div>
      )}
      {constants.length > 0 && (
        <div className={styles.section}>
          <h2>Constants</h2>
          {constants.map((constants, index) => {
            return (
              <div className={styles.row} key={index}>
                <div className={styles.col}>{constants.state}</div>
                <div className={styles.col}>{constants.type}</div>
                <textarea
                  value={constants.value}
                  className={[styles.col, styles.input].join(" ")}
                  placeholder={constants.type}
                  onChange={(event) =>
                    handleInputChange(event, index, "constants")
                  }
                />
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px" }}>
        <Button
          text="Reload"
          variant="secondary"
          onClick={onReload}
          fullWidth
          title="Reload"
        />
        <Button
          text="Stop debugging"
          variant="caution"
          onClick={onReset}
          fullWidth
          title="Stop debugging"
        />
      </div>
    </div>
  );
};

export default StateTab;
