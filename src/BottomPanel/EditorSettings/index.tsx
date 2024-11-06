import React, { useEffect } from "react";
import styles from "./EditorSettings.module.css";
import { Button, Loading, Toggle } from "../../components";

interface EditorSettingsProps {
  autocomplete: boolean;
  setAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
  keybinding: string;
  setKeybinding: React.Dispatch<React.SetStateAction<string>>;
}

const EditorSettings: React.FC<EditorSettingsProps> = ({
  autocomplete,
  setAutocomplete,
  keybinding,
  setKeybinding,
}) => {
  useEffect(() => {
    const storedMode = localStorage.getItem("keybinding");
    storedMode && setKeybinding(JSON.parse(storedMode));
  }, [keybinding, setKeybinding]);

  const handleKeybindingChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setKeybinding(event.target.value);
    localStorage.setItem("keybinding", JSON.stringify(event.target.value));
  };

  const handleAutocompleteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAutocomplete(event.target.value === "true");
  };

  const handleButtonClick = () => {
    window.open("https://forms.gle/VFa46GjTy2nDf9VPA", "_blank");
  };

  return (
    <div className={styles.editorSettings}>
      <label className={styles.label}>Settings</label>
      <div className={styles.settingsContainer}>
        <div className={styles.settingItem}>
          <label htmlFor="keybinding-select" className={styles.settingLabel}>
            Keybinding
          </label>
          <select
            id="keybinding-select"
            value={keybinding}
            onChange={handleKeybindingChange}
            className={styles.settingSelect}
          >
            <option value="default">Default</option>
            <option value="vim">Vim</option>
            <option value="emacs">Emacs</option>
          </select>
        </div>
        <div className={styles.settingItem}>
          <label htmlFor="autocomplete-select" className={styles.settingLabel}>
            Autocomplete
          </label>
          <select
            id="autocomplete-select"
            value={autocomplete.toString()}
            onChange={handleAutocompleteChange}
            className={styles.settingSelect}
          >
            <option value="true">On</option>
            <option value="false">Off</option>
          </select>
        </div>
      </div>
      <label className={styles.label}>Other</label>
      <div className={styles.settingsContainer}>
        <div className={styles.settingItem}>
          <label htmlFor="action-button" className={styles.settingLabel}>
            Spotted an Issue?
          </label>
          <Button
            text="Report bug"
            variant="primary"
            size="medium"
            onClick={handleButtonClick}
            title="Report bug"
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default EditorSettings;
