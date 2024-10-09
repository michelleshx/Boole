import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

import styles from "./Toggle.module.css";
interface ToggleProps {
  isDarkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}
const Toggle = ({ isDarkMode, setDarkMode }: ToggleProps) => {
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    storedMode
      ? setDarkMode(JSON.parse(storedMode))
      : setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode, setDarkMode]);

  const handleClick = () => {
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
    setDarkMode(!isDarkMode);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        onClick={handleClick}
        checked={isDarkMode}
        onChange={() => {}}
      />
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
