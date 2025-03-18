import { useEffect, useContext } from "react";
import { StateContext } from "../../../context/StateContext";
import { FileContext } from "../../../context/FileContext";

import useMessageHandler from "../../../hooks/useMessageHandler";
import { ExpandableListItem, Loading, Button } from "../../../components";
import styles from "./OperationsTab.module.css";
import { Feedback, OperationItem } from "../../../common/types";
interface OperationsTabProps {
  onApplyOperation: ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => void;
}

const OperationsTab = ({ onApplyOperation }: OperationsTabProps) => {
  const {
    currentStateSpace,
    operations,
    updateOperationAndStorage,
    formatStateAndOperation,
  } = useContext(StateContext);
  const { processing, sendMessage } = useMessageHandler({
    method: "custom/runOperations",
    onSuccess: onApplyOperation,
  });

  const { value } = useContext(FileContext);

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

  const onRunOperation = (opName: string) => {
    // Format string
    const interpretation = formatStateAndOperation(
      currentStateSpace,
      operations,
      opName
    );
    sendMessage(value, interpretation, opName);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    operationIndex: number,
    parameterIndex: number
  ) => {
    const { value } = event.target;
    const updatedData = [...operations];
    updatedData[operationIndex].declarations[parameterIndex].value = value;
    updateOperationAndStorage(updatedData[operationIndex]);
  };

  // Resize textarea to fit content
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    const textarea = e.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  return (
    <ul className={styles.operationsTab}>
      {operations.map((operation, opIdx) => (
        <ExpandableListItem title={operation.name} key={opIdx}>
          {operation.declarations.map((inputs, inputIdx) => {
            return (
              <div className={styles.row} key={inputIdx}>
                <div className={styles.col}>{inputs.state}</div>
                <div className={styles.col}>{inputs.type}</div>
                {inputs.state.indexOf("!") === -1 ? (
                  <textarea
                    onInput={handleInput}
                    value={inputs.value}
                    className={[styles.col, styles.input].join(" ")}
                    placeholder={inputs.type}
                    onChange={(event) =>
                      handleInputChange(event, opIdx, inputIdx)
                    }
                  />
                ) : (
                  // READONLY for Outputs!
                  <div className={styles.col} />
                )}
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
              disabled={processing}
              onClick={() => onRunOperation(operation.name)}
              fullWidth
            >
              {processing && <Loading />}
            </Button>
          </div>
        </ExpandableListItem>
      ))}
    </ul>
  );
};

export default OperationsTab;
