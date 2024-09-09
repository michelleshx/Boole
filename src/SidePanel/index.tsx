import { useState } from "react";
import styles from "./SidePanel.module.css";

import StateTab from "./Tabs/StateTab";
import OperationsTab from "./Tabs/OperationsTab";
import TraceTab from "./Tabs/TraceTab";

type Tabs = {
  state: string;
  operations: string;
  trace: string;
};

const tabs: Tabs = { state: "state", operations: "operations", trace: "trace" };

const SidePanel = () => {
  const [activeTab, setActiveTab] = useState(tabs.state);

  return (
    <aside className={styles.sidePanel}>
      <div className={styles.tabHeaders}>
        {Object.keys(tabs).map((tabKey) => (
          <div
            key={tabKey}
            className={styles.tab}
            onClick={() => setActiveTab(tabs[tabKey as keyof Tabs])}
          >
            <a className={activeTab === tabs[tabKey as keyof Tabs] ? styles["tab--active"] : undefined}>
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
    </aside>
  );
};

export default SidePanel;
