import ExpandableListItem from "../../../components/ExpandableListItem";
import styles from "./TraceTab.module.css";

// TODO replace with actual data
import data from "../../../data/test-data.json";
const traceData = data.dataForTraceTab;

const TraceTab = () => {
  return (
    <ul className={styles.traceTab}>
      {traceData.map((trace) => (
        <ExpandableListItem title={trace.name}>
          {trace.data.map((states) => {
            return (
              <div className={styles.row}>
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
