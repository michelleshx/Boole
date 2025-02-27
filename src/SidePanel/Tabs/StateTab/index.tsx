import React, { useState, useEffect, useContext } from "react";
import styles from "./StateTab.module.css";
import { StateContext } from "../../../context/StateContext";

// TODO replace with actual data
import data from "../../../data/test-data.json";
const stateTestData = data.dataForStateTab;

const StateTab = () => {
  const {
    currentStateSpace,
    types,
    constants,
    setStateSpace,
    setTypes,
    setConstants,
  } = useContext(StateContext);

  // Map keys to their state values and setters
  const stateMap = {
    currentStateSpace: { value: currentStateSpace, setter: setStateSpace },
    types: { value: types, setter: setTypes },
    constants: { value: constants, setter: setConstants },
  };

  // Helper to update both state and localStorage for a given key
  const updateStateAndStorage = (key: keyof typeof stateMap, newValue: any) => {
    stateMap[key].setter(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  useEffect(() => {
    try {
      const keys: (keyof typeof stateMap)[] = ["currentStateSpace", "types", "constants"];
      const localData = keys.reduce((acc, key) => {
        const item = localStorage.getItem(key);
        if (item) {
          acc[key] = JSON.parse(item);
        }
        return acc;
      }, {} as Partial<typeof stateMap>);

      if (Object.keys(localData).length !== keys.length) {
        updateStateAndStorage("currentStateSpace", stateTestData.currentStateSpace);
        updateStateAndStorage("types", stateTestData.types);
        updateStateAndStorage("constants", stateTestData.constants);
      } else {
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
                className={styles.col}
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
                className={styles.col}
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
                className={styles.col}
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
