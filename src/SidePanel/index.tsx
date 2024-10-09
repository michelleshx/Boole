import { useState, useContext } from "react";
import styles from "./SidePanel.module.css";

import StateTab from "./Tabs/StateTab";
import OperationsTab from "./Tabs/OperationsTab";
import TraceTab from "./Tabs/TraceTab";
import DefaultTab from "./Tabs/DefaultTab";
import { FileContext } from "../context/FileContext";
import { FileType } from "../common/files";

type Tabs = {
  state: string;
  operations: string;
  trace: string;
};

const tabs: Tabs = { state: "state", operations: "operations", trace: "trace" };

interface SidePanelProps {
  onVerify: (feedback: string) => void;
}

const SidePanel = ({ onVerify }: SidePanelProps) => {
  const [activeTab, setActiveTab] = useState(tabs.state);
  const { fileType } = useContext(FileContext); // TODO set file type when setisdebugging clicked
  const [isDebugging, setIsDebugging] = useState(false); // TODO move this to global context (simplified or not)

  return (
    <aside className={styles.sidePanel}>
      {!isDebugging ? (
        <DefaultTab setIsDebugging={setIsDebugging} onVerify={onVerify} />
      ) : fileType === FileType.Z ? (
        <>
          <div className={styles.tabHeaders}>
            {Object.keys(tabs).map((tabKey) => (
              <div
                key={tabKey}
                className={styles.tab}
                onClick={() => setActiveTab(tabs[tabKey as keyof Tabs])}
              >
                <a
                  className={
                    activeTab === tabs[tabKey as keyof Tabs]
                      ? styles["tab--active"]
                      : undefined
                  }
                >
                  {tabKey}
                </a>
              </div>
            ))}
          </div>
          <div className={styles.tabContent}>
            {activeTab === tabs.state && <StateTab />}
            {activeTab === tabs.operations && <OperationsTab />}
            {activeTab === tabs.trace && <TraceTab />}
          </div>
        </>
      ) : (
        <>
          <div className={styles.tabHeaders}>
            <a
              className={
                activeTab === tabs["state"] ? styles["tab--active"] : undefined
              }
            >
              State
            </a>
          </div>
          <div className={styles.tabContent}>
            {activeTab === tabs.state && <StateTab />}
          </div>
        </>
      )}
    </aside>
  );
};

export default SidePanel;
