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
        localData.forEach((trace: OperationItem) => {
          updateTracesAndStorage(trace);
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  return (
    <ul className={styles.traceTab}>
      {traces.map((trace, idx) => (
        <ExpandableListItem title={trace.name} key={idx}>
          {trace.declarations.map((states, decl_idx) => {
            return (
              <div className={styles.row} key={decl_idx}>
                <div className={styles.col}>{states.state}</div>
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
