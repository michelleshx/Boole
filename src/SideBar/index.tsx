import styles from "./SideBar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faBug } from "@fortawesome/free-solid-svg-icons";

interface SideBarProps {
  isFileTab: boolean;
  setIsFileTab: React.Dispatch<React.SetStateAction<boolean>>;
  showRightPanel: boolean;
  setShowRightPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({
  isFileTab,
  setIsFileTab,
  showRightPanel,
  setShowRightPanel,
}: SideBarProps) => {
  return (
    <div className={styles.sideBar}>
      <button
        className={[
          styles.button,
          styles[`button--${isFileTab ? "active" : ""}`],
        ].join(" ")}
        onClick={() => {
          isFileTab
            ? setShowRightPanel(!showRightPanel)
            : setShowRightPanel(true);
          setIsFileTab(true);
        }}
      >
        <FontAwesomeIcon icon={faFolder} />
      </button>
      <button
        className={[
          styles.button,
          styles[`button--${!isFileTab ? "active" : ""}`],
        ].join(" ")}
        onClick={() => {
          !isFileTab
            ? setShowRightPanel(!showRightPanel)
            : setShowRightPanel(true);
          setIsFileTab(false);
        }}
      >
        <FontAwesomeIcon icon={faBug} />
      </button>
    </div>
  );
};

export default SideBar;
