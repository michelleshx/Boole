import styles from "./SideBar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faBug } from "@fortawesome/free-solid-svg-icons";

const SideBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.sideBar}>
      <button
        className={[
          styles.button,
          styles[`button--${activeTab == "files" ? "active" : ""}`],
        ].join(" ")}
        onClick={() => setActiveTab("files")}
      >
        <FontAwesomeIcon icon={faFolder} />
      </button>
      {/* <button
        className={[
          styles.button,
          styles[`button--${activeTab == "debug" ? "active" : ""}`],
        ].join(" ")}
        onClick={() => setActiveTab("debug")}
      >
        <FontAwesomeIcon icon={faBug} />
      </button> */}
    </div>
  );
};

export default SideBar;
