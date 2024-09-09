import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import styles from "./Toggle.module.css";

const Toggle = () => {
  const [isDarkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    storedMode
      ? setDarkMode(JSON.parse(storedMode))
      : setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleClick = () => {
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
    setDarkMode(!isDarkMode);
  };

  return (
    <label className={styles.switch}>
      <input type="checkbox" onClick={handleClick} checked={isDarkMode} />
      <span className={styles.slider}>
        <FontAwesomeIcon
          icon={isDarkMode ? faMoon : faSun}
          className={`${styles.icon} ${isDarkMode ? styles.moon : styles.sun}`}
        />
      </span>
    </label>
  );
};

export default Toggle;
