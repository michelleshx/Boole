import React, { useEffect, useContext } from "react";
import styles from "./StateTab.module.css";
import { StateContext } from "../../../context/StateContext";
import { Button } from "../../../components";

interface DefaultTabProps {
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
}

const StateTab = ({ setIsDebugging }: DefaultTabProps) => {
  const {
    currentStateSpace,
    types,
    constants,
    stateMap,
    resetState,
    updateStateAndStorage,
  } = useContext(StateContext);

  const onReset = () => {
    setIsDebugging(false);
    resetState();
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

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    const textarea = e.currentTarget;
    textarea.style.height = "auto"; // Reset height to shrink when needed
    textarea.style.height = textarea.scrollHeight + "px"; // Expand to fit content
  };

  return (
    <div className={styles.stateTab}>
      <div className={styles.section}>
        <h2>Current State Space</h2>
        {currentStateSpace.map((states, index) => {
          return (
            <div className={styles.row} key={index}>
              <div className={styles.col}>{states.state}</div>
              <div className={styles.col}>{states.type}</div>
              <textarea
                onInput={handleInput}
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
      <div className={styles.section}>
        <h2>Types</h2>
        {types.map((types, index) => {
          return (
            <div className={styles.row} key={index}>
              <div className={styles.col}>{types.type}</div>
              <textarea
                onInput={handleInput}
                value={types.value}
                className={[styles.col, styles.input].join(" ")}
                placeholder={types.type}
                onChange={(event) => handleInputChange(event, index, "types")}
              />
            </div>
          );
        })}
      </div>
      <div className={styles.section}>
        <h2>Constants</h2>
        {constants.map((constants, index) => {
          return (
            <div className={styles.row} key={index}>
              <div className={styles.col}>{constants.state}</div>
              <div className={styles.col}>{constants.type}</div>
              <textarea
                onInput={handleInput}
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
      <Button
        text="Stop debugging"
        variant="caution"
        onClick={onReset}
        fullWidth
        title="Stop debugging"
      />
    </div>
  );
};

export default StateTab;
