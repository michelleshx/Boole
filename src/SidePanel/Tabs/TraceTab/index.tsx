import { useEffect, useContext } from "react";
import { StateContext } from "../../../context/StateContext";
import { ExpandableListItem } from "../../../components";
import styles from "./TraceTab.module.css";
import { OperationItem } from "../../../common/types";

const TraceTab = () => {
  const { traces, updateTracesAndStorage } = useContext(StateContext);

  useEffect(() => {
    try {
      const item = localStorage.getItem("traces");
      if (item) {
        const localData = JSON.parse(item);
        localData.array.forEach((trace: OperationItem) => {
          updateTracesAndStorage(trace);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <ul className={styles.traceTab}>
      {traces.map((trace) => (
        <ExpandableListItem title={trace.name}>
          {trace.declarations.map((states) => {
            return (
              <div className={styles.row}>
                <div className={styles.col}>{states.name}</div>
                <div className={styles.col}>{states.type}</div>
                <div className={styles.col}>{states.value}</div>
              </div>
            );
          })}
        </ExpandableListItem>
      ))}
    </ul>
  );
};

export default TraceTab;
