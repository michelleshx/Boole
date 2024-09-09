import React, { useState, useEffect } from "react";

import { ExpandableListItem } from "../../../components";
import Button from "../../../components/Button";
import styles from "./OperationsTab.module.css";

// TODO replace with actual data
import data from "../../../data/test-data.json";
const operationTestData = data.dataForOperationsTab;

interface OperationsData {
  name: string;
  parameters: {
    name: string;
    type: string;
    value: string;
  }[];
}

const OperationsTab = () => {
  const [operationData, setOperationData] = useState<OperationsData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = operationTestData; // TODO replace with local storage fetch
        setOperationData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, operationIndex: number, parameterIndex: number) => {
    const { value } = event.target;
    const updatedData = [...operationData];
    updatedData[operationIndex].parameters[parameterIndex].value = value;
    setOperationData(updatedData);
  };

  return (
    <ul className={styles.operationsTab}>
      {operationData.map((operation, opIdx) => (
        <ExpandableListItem title={operation.name} key={opIdx}>
          {operation.parameters.map((inputs, inputIdx) => {
            return (
              <div className={styles.row} key={inputIdx}>
                <div className={styles.col}>{inputs.name}</div>
                <div className={styles.col}>{inputs.type}</div>
                <input
                  type="text"
                  value={inputs.value}
                  className={styles.col}
                  onChange={(event) =>
                    handleInputChange(event, opIdx, inputIdx)
                  }
                />
              </div>
            );
          })}
          <div className={styles.rightAlign}>
            <Button text="Apply Operation" variant="primary" size="small" />
          </div>
        </ExpandableListItem>
      ))}
    </ul>
  );
};

export default OperationsTab;
