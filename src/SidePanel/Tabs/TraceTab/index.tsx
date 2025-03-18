import { useEffect, useContext } from "react";
import { StateContext } from "../../../context/StateContext";
import { ExpandableListItem } from "../../../components";
import styles from "./TraceTab.module.css";
import { TraceItem } from "../../../common/types";

const TraceTab = () => {
  const { traces, updateTracesAndStorage } = useContext(StateContext);

  useEffect(() => {
    try {
      const item = localStorage.getItem("traces");
      if (item) {
        const localData = JSON.parse(item);
        localData.forEach((trace: TraceItem) => {
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
          {trace.name !== "Initial State" && (
            <>
              <div className={styles.sectionHeading}>
                {trace.operation.name}
              </div>
              {trace.operation.declarations.map((decl, decl_idx) => {
                return (
                  <div className={styles.row} key={decl_idx}>
                    <div className={styles.col}>{decl.state}</div>
                    <div className={styles.col}>{decl.type}</div>
                    <div className={styles.col}>{decl.value}</div>
                  </div>
                );
              })}
            </>
          )}
          <div className={styles.sectionHeading}>State</div>
          {trace.state.map((states, decl_idx) => {
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
