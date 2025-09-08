import { useContext, useState } from "react";
import { Popover } from "react-tiny-popover";

import styles from "./SidePanel.module.css";

import { Loading, Button } from "../components";

import StateTab from "./Tabs/StateTab";
import OperationsTab from "./Tabs/OperationsTab";
import TraceTab from "./Tabs/TraceTab";
import ExpressionEvaluator from "./Tabs/ExpressionEvaluator";

import { FileContext } from "../context/FileContext";
import { FileType } from "../common/files";
import { Feedback, Tab, SendMessageFn } from "../common/types";
interface SidePanelProps {
  isDebugging: boolean;
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  sendMessage: SendMessageFn;
  processing: boolean;
  sidePanelError: boolean;
  setSidePanelError: React.Dispatch<React.SetStateAction<boolean>>;
  sidePanelFeedback: Feedback;
  setSidePanelFeedback: React.Dispatch<React.SetStateAction<Feedback>>;
}

const SidePanel = ({
  isDebugging,
  setIsDebugging,
  activeTab,
  setActiveTab,
  sendMessage,
  processing,
  sidePanelError,
  setSidePanelError,
  sidePanelFeedback,
  setSidePanelFeedback,
}: SidePanelProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { value, setFileType, getFileType, fileType } = useContext(FileContext);

  const onDebug = () => {
    const fileType = getFileType(value);
    setFileType(fileType); // set the file type

    // Check if the file is debuggable
    if (
      fileType === FileType.SEM_CE ||
      fileType === FileType.SEM_F ||
      fileType === FileType.SEM_T ||
      fileType === FileType.SEM
    ) {
      setIsDebugging(true);
    // } else if (fileType === FileType.Z) {
	  // sendMessage("custom/getZSpecComponents", value);
	} else {
      setErrorMessage(
        'Oops! this file does not support debugging, try using "Ask George" instead'
      );
    }
  };

  return (
    <aside className={styles.sidePanel}>
      {!isDebugging ? (
        <div className={styles.defaultTab}>
          <Popover
            isOpen={isPopoverOpen}
            positions={["bottom"]}
            padding={8}
            content={
              <div className={styles.popOverContainer}>
                Supported files include: #check SEM_CE, #check SEM_F, #check SEM_T, #check SEM.
              </div>
            }
          >
            <p className={styles.text}>
              Open a&nbsp;
              <span
                className={styles.hoverText}
                onMouseOver={() => setIsPopoverOpen(true)}
                onMouseLeave={() => setIsPopoverOpen(false)}
              >
                supported*
              </span>
              &nbsp;file to start debugging.
            </p>
          </Popover>
          <Button
            text="Start Debugging"
            variant="primary"
            size="medium"
            onClick={onDebug}
            disabled={processing}
            fullWidth
            title="Start Debugging"
          >
            {processing && <Loading />}
          </Button>
          <p className={styles.text}>{errorMessage}</p>
        </div>
      ) : fileType === FileType.SEM_CE ||
        fileType === FileType.SEM_F ||
        fileType === FileType.SEM_T ||
        fileType === FileType.SEM ? (
        <ExpressionEvaluator
          setIsDebugging={setIsDebugging}
          sendMessage={sendMessage}
          processing={processing}
          error={sidePanelError}
          setError={setSidePanelError}
          result={sidePanelFeedback}
          setResult={setSidePanelFeedback}
        />
      ) : (
			null
        // <>
        //   <div className={styles.tabHeaders}>
        //     {Object.values(Tab).map((tabKey) => (
        //       <div
        //         key={tabKey}
        //         className={styles.tab}
        //         onClick={() => setActiveTab(tabKey)}
        //       >
        //         <p
        //           className={
        //             activeTab === tabKey
        //               ? styles["tab--active"]
        //               : styles["tabText"]
        //           }
        //         >
        //           {tabKey}
        //         </p>
        //       </div>
        //     ))}
        //   </div>
        //   <div className={styles.tabContent}>
        //     {activeTab === Tab.State && (
        //       <StateTab
        //         setIsDebugging={setIsDebugging}
        //         onReload={onDebug}
        //         processing={processing}
        //       />
        //     )}
        //     {activeTab === Tab.Operations && (
        //       <OperationsTab
        //         sendMessage={sendMessage}
        //         processing={processing}
        //       />
        //     )}
        //     {activeTab === Tab.Trace && <TraceTab />}
        //   </div>
        // </>
      )}
    </aside>
  );
};

export default SidePanel;
