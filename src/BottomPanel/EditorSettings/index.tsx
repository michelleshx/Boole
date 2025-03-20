import styles from "./EditorSettings.module.css";
import { Button } from "../../components";

interface EditorSettingsProps {
  autocomplete: boolean;
  setAutocomplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditorSettings: React.FC<EditorSettingsProps> = ({
  autocomplete,
  setAutocomplete,
}) => {
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
            variant="caution"
            size="medium"
            onClick={handleButtonClick}
            title="Report bug"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorSettings;
