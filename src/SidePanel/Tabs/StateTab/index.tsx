import React, { useEffect, useContext } from "react";
import styles from "./StateTab.module.css";
import { StateContext } from "../../../context/StateContext";

const StateTab = () => {
  const {
    currentStateSpace,
    types,
    constants,
    stateMap,
    updateStateAndStorage,
  } = useContext(StateContext);

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
    event: React.ChangeEvent<HTMLInputElement>,
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
      <div className={styles.section}>
        <h2>Current State Space</h2>
        {currentStateSpace.map((states, index) => {
          return (
            <div className={styles.row} key={index}>
              <div className={styles.col}>{states.state}</div>
              <div className={styles.col}>{states.type}</div>
              <input
                type="text"
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
              <input
                type="text"
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
              <input
                type="text"
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
    </div>
  );
};

export default StateTab;
