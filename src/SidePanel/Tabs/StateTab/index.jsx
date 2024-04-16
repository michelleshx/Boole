import React, { useState, useEffect } from "react";
import styles from "./StateTab.module.css";

// TODO replace with actual data
import data from "../../../data/test-data.json";
const stateTestData = data.dataForStateTab;

const StateTab = () => {
  const [stateData, setStateData] = useState({
    currentStateSpace: [],
    types: [],
    constants: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = stateTestData; // TODO replace with local storage fetch
        setStateData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event, index, type) => {
    const { value } = event.target;
    const updatedValues = [...stateData[type]];
    updatedValues[index].value = value;
    setStateData({
      ...stateData,
      type: updatedValues,
    });
  };

  return (
    <div className={styles.stateTab}>
      <div className={styles.section}>
        <h2>Current State Space</h2>
        {stateData.currentStateSpace.map((states, index) => {
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
        {stateData.types.map((types, index) => {
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
        {stateData.constants.map((constants, index) => {
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
