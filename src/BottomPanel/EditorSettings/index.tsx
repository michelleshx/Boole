import { useState, useRef, useEffect } from "react";
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
  const [copyMessage, setCopyMessage] = useState("");
  const supportEmail = "nday@uwaterloo.ca";
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAutocompleteChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAutocomplete(event.target.value === "true");
  };

  const handleEmailClick = () => {
    // Try to open email client with mailto link
    const subject = encodeURIComponent("Bug Report: James IDE");
    const body = encodeURIComponent(
      "Please describe the issue you encountered:\n\n" +
        "Browser: " +
        navigator.userAgent
    );

    const ccEmails = "michelleshx462@gmail.com,m272xu@uwaterloo.ca,q34chen@uwaterloo.ca";
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}&cc=${encodeURIComponent(
      ccEmails
    )}`;

    setTimeout(() => {
      setCopyMessage(
        "If your email client didn't open, you can copy the email address"
      );

      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = setTimeout(() => setCopyMessage(""), 5000);
    }, 300);
  };

  const copyEmail = () => {
    navigator.clipboard
      .writeText(supportEmail)
      .then(() => {
        setCopyMessage("Email copied to clipboard!");

        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = setTimeout(() => setCopyMessage(""), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setCopyMessage("Failed to copy email");

        if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        tooltipTimeoutRef.current = setTimeout(() => setCopyMessage(""), 3000);
      });
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

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
          <div className={styles.bugReportActions}>
            <Button
              text="Email Bug Report"
              variant="caution"
              size="medium"
              onClick={handleEmailClick}
              title="Send a bug report via email"
            />
            <Button
              text="Copy Email Address"
              variant="secondary"
              size="medium"
              onClick={copyEmail}
              title="Copy support email to clipboard"
            />
            {copyMessage && (
              <span className={styles.copyMessage}>{copyMessage}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSettings;
