import { ExpandableListItem } from "../../../components";
import styles from "./TraceTab.module.css";

// TODO replace with actual data
import data from "../../../data/test-data.json";
const traceData = data.dataForTraceTab;

// interface TraceData {
//   name: string;
//   parameters: {
//     state: string;
//     type: string;
//     value: string;
//   }[];
// }

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
