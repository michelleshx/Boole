import { useState, useContext } from "react";
import styles from "./DefaultTab.module.css";
import Button from "../../../components/Button";
import Loading from "../../../components/Loading";
import { Popover } from "react-tiny-popover";

import useDebugger from "../../../hooks/useDebugger";
import { FileContext } from "../../../context/FileContext";
import { FileType } from "../../../common/files";

interface DefaultTabProps {
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
  onVerify: (feedback: string) => void;
}

const DefaultTab = ({ setIsDebugging, onVerify }: DefaultTabProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { value, fileType } = useContext(FileContext);

  const { debugging, debug } = useDebugger(onVerify);

  const onDebug = () => {
    if (
      fileType === FileType.PREDTYPE ||
      fileType === FileType.Z ||
      fileType === FileType.COUNTEREXAMPLE
    ) {
      debug(value);
      setIsDebugging(true);
    } else {
      setErrorMessage(
        'Oops! this file does not support debugging, try using "Ask George" instead'
      );
    }
  };

  return (
    <div className={styles.defaultTab}>
      <Popover
        isOpen={isPopoverOpen}
        positions={["bottom"]}
        padding={8}
        content={
          <div className={styles.popOverContainer}>
            Supported files include: #check PREDTYPE, #check Z, #check
            COUNTEREXAMPLE.
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
        onClick={() => onDebug()}
        disabled={debugging}
        fullWidth
        title="Start Debugging"
      >
        {debugging && <Loading />}
      </Button>
      <p className={styles.text}>{errorMessage}</p>
    </div>
  );
};

export default DefaultTab;
