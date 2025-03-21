import { useState, useContext } from "react";
import styles from "./DefaultTab.module.css";
import { Loading, Button } from "../../../components";
import { Popover } from "react-tiny-popover";

import useMessageHandler from "../../../hooks/useMessageHandler";
import { FileContext } from "../../../context/FileContext";
import { FileType } from "../../../common/files";
import { Feedback } from "../../../common/types";

interface DefaultTabProps {
  setIsDebugging: React.Dispatch<React.SetStateAction<boolean>>;
  onVerify: ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => void;
}

const DefaultTab = ({ setIsDebugging, onVerify }: DefaultTabProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { value, setFileType, getFileType } = useContext(FileContext);

  const { processing, sendMessage } = useMessageHandler({
    method: "custom/getZSpecComponents",
    onSuccess: onVerify,
  });

  const onDebug = () => {
    const fileType = getFileType(value);
    setFileType(fileType); // set the file type

    // Check if the file is debuggable
    if (fileType === FileType.Z) {
      sendMessage(value);
    } else if (
      fileType === FileType.COUNTEREXAMPLE ||
      fileType === FileType.SET
    ) {
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
            Supported files include: #check Z, #check CE, and #check SET.
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
  );
};

export default DefaultTab;
