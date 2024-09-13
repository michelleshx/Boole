import styles from "./SideBar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faBug } from "@fortawesome/free-solid-svg-icons";

interface SideBarProps {
  isFileTab: boolean;
  setIsFileTab: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({ isFileTab, setIsFileTab }: SideBarProps) => {
  return (
    <div className={styles.sideBar}>
      <button
        className={[
          styles.button,
          styles[`button--${isFileTab ? "active" : ""}`],
        ].join(" ")}
        onClick={() => setIsFileTab(true)}
      >
        <FontAwesomeIcon icon={faFolder} />
      </button>
      <button
        className={[
          styles.button,
          styles[`button--${!isFileTab ? "active" : ""}`],
        ].join(" ")}
        onClick={() => setIsFileTab(false)}
      >
        <FontAwesomeIcon icon={faBug} />
      </button>
    </div>
  );
};

export default SideBar;
