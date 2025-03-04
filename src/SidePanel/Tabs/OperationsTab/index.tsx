import { useEffect, useContext } from "react";
import { StateContext } from "../../../context/StateContext";

import { ExpandableListItem } from "../../../components";
import Button from "../../../components/Button";
import styles from "./OperationsTab.module.css";
import { OperationItem } from "../../../common/types";

const OperationsTab = () => {
  const { operations, updateOperationAndStorage } = useContext(StateContext);

  useEffect(() => {
    try {
      const item = localStorage.getItem("operations");
      if (item) {
        const localData = JSON.parse(item);
        localData.forEach((op: OperationItem) => {
          updateOperationAndStorage(op);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    operationIndex: number,
    parameterIndex: number
  ) => {
    const { value } = event.target;
    const updatedData = [...operations];
    updatedData[operationIndex].declarations[parameterIndex].value = value;
    updateOperationAndStorage(updatedData[operationIndex]);
  };

  return (
    <ul className={styles.operationsTab}>
      {operations.map((operation, opIdx) => (
        <ExpandableListItem title={operation.name} key={opIdx}>
          {operation.declarations.map((inputs, inputIdx) => {
            return (
              <div className={styles.row} key={inputIdx}>
                <div className={styles.col}>{inputs.name}</div>
                <div className={styles.col}>{inputs.type}</div>
                <input
                  type="text"
                  value={inputs.value}
                  className={[styles.col, styles.input].join(" ")}
                  placeholder={inputs.type}
                  onChange={(event) =>
                    handleInputChange(event, opIdx, inputIdx)
                  }
                />
              </div>
            );
          })}
          <div className={styles.rightAlign}>
            <Button
              text="Apply Operation"
              variant="primary"
              size="small"
              aria-label="Apply Operation"
              title="Apply Operation"
              fullWidth
            />
          </div>
        </ExpandableListItem>
      ))}
    </ul>
  );
};

export default OperationsTab;
