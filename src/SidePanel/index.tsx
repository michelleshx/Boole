import { useContext } from "react";
import styles from "./SidePanel.module.css";

import StateTab from "./Tabs/StateTab";
import OperationsTab from "./Tabs/OperationsTab";
import TraceTab from "./Tabs/TraceTab";
import DefaultTab from "./Tabs/DefaultTab";
import ExpressionEvaluator from "./Tabs/ExpressionEvaluator";
import { FileContext } from "../context/FileContext";
import { FileType } from "../common/files";
import { Feedback, Tab } from "../common/types";

interface SidePanelProps {
  onVerify: ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => void;
  isDebugging: boolean;
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const SidePanel = ({
  onVerify,
  isDebugging,
  setIsDebugging,
  activeTab,
  setActiveTab,
}: SidePanelProps) => {
  const { fileType } = useContext(FileContext);

  return (
    <aside className={styles.sidePanel}>
      {!isDebugging ? (
        <DefaultTab setIsDebugging={setIsDebugging} onVerify={onVerify} />
      ) : fileType === FileType.COUNTEREXAMPLE || fileType === FileType.SET ? (
        <ExpressionEvaluator setIsDebugging={setIsDebugging} />
      ) : (
        <>
          <div className={styles.tabHeaders}>
            {Object.values(Tab).map((tabKey) => (
              <div
                key={tabKey}
                className={styles.tab}
                onClick={() => setActiveTab(tabKey)}
              >
                <p
                  className={
                    activeTab === tabKey
                      ? styles["tab--active"]
                      : styles["tabText"]
                  }
                >
                  {tabKey}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.tabContent}>
            {activeTab === Tab.State && (
              <StateTab setIsDebugging={setIsDebugging} onVerify={onVerify} />
            )}
            {activeTab === Tab.Operations && (
              <OperationsTab onApplyOperation={onVerify} />
            )}
            {activeTab === Tab.Trace && <TraceTab />}
          </div>
        </>
      )}
    </aside>
  );
};

export default SidePanel;
