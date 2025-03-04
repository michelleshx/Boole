import { useState, useContext } from "react";
import styles from "./SidePanel.module.css";

import StateTab from "./Tabs/StateTab";
import OperationsTab from "./Tabs/OperationsTab";
import TraceTab from "./Tabs/TraceTab";
import DefaultTab from "./Tabs/DefaultTab";
import { FileContext } from "../context/FileContext";
import { FileType } from "../common/files";
import { Feedback } from "../common/types";

type Tabs = {
  state: string;
  operations: string;
  trace: string;
};

const tabs: Tabs = { state: "state", operations: "operations", trace: "trace" };

interface SidePanelProps {
  onVerify: (feedback: Feedback) => void;
  isDebugging: boolean;
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidePanel = ({
  onVerify,
  isDebugging,
  setIsDebugging,
}: SidePanelProps) => {
  const [activeTab, setActiveTab] = useState(tabs.state);
  const { fileType } = useContext(FileContext);

  return (
    <aside className={styles.sidePanel}>
      {!isDebugging ? (
        <DefaultTab setIsDebugging={setIsDebugging} onVerify={onVerify} />
      ) : (
        <>
          <div className={styles.tabHeaders}>
            {Object.keys(tabs).map((tabKey) => (
              <div
                key={tabKey}
                className={styles.tab}
                onClick={() => setActiveTab(tabs[tabKey as keyof Tabs])}
              >
                <p
                  className={
                    activeTab === tabs[tabKey as keyof Tabs]
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
            {activeTab === tabs.state && <StateTab />}
            {activeTab === tabs.operations && <OperationsTab />}
            {activeTab === tabs.trace && <TraceTab />}
          </div>
        </>
      )}
    </aside>
  );
};

export default SidePanel;
