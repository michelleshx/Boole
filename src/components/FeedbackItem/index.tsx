import React, { useContext } from "react";
import { LanguageServerContext } from "../../context/LanguageServerContext";
import * as monaco from "monaco-editor";
import styles from "./FeedbackItem.module.css";
import {
  CollectedFbItem,
  UncollectedFbItem,
  isUncollectedFbItem,
  isCollectedFbItem,
} from "../../common/types";

interface FeedbackItemProps {
  item: CollectedFbItem | UncollectedFbItem;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ item }) => {
  const { editorRef, monacoRef, addMarkers } = useContext(
    LanguageServerContext
  );

  const lines_str = (line_range: [number, number]) => {
    const begin_ln = line_range[0];
    const end_ln = line_range[1];
    if (begin_ln === end_ln) {
      return begin_ln.toString();
    }
    return begin_ln.toString() + "-" + end_ln.toString();
  };

  const highlightPrefix = (prefix: string) => {
    const prefixDict: Record<
      "++ Comment" | "-- Warning" | "-- Error" | "-- Timeouts",
      JSX.Element
    > = {
      "++ Comment": (
        <span>
          <span>++ </span>
          <span className={styles.commentPrefix}>Comment</span>
        </span>
      ),
      "-- Warning": (
        <span>
          <span>-- </span>
          <span className={styles.warningPrefix}>Warning</span>
        </span>
      ),
      "-- Error": (
        <span>
          <span>-- </span>
          <span className={styles.errorPrefix}>Error</span>
        </span>
      ),
      "-- Timeouts": (
        <span>
          <span>-- </span>
          <span className={styles.timeoutsPrefix}>Timeouts</span>
        </span>
      ),
    };

    return (
      prefixDict[prefix as keyof typeof prefixDict] || <span>{prefix}</span>
    );
  };

  const handleClick = (line_range: [number, number], message: string) => {
    if (line_range && monacoRef.current && editorRef.current?.getModel()) {
      editorRef.current?.revealLineInCenter(line_range[0]);

      const feedbackMarker = [
        {
          startLineNumber: line_range[0],
          startColumn: 1,
          endLineNumber: line_range[1],
          endColumn:
            editorRef.current?.getModel()?.getLineMaxColumn(line_range[1]) ?? 1, // Ending column (end of the line)
          message: message,
          severity: monaco.MarkerSeverity.Error, // Set severity as Error
        },
      ];

      addMarkers(feedbackMarker);
    }
  };

  return (
    <p style={{display: "block"}}>
      <span>{item.indentation}</span>

      <span>{highlightPrefix(item.prefix)}: </span>

      {isUncollectedFbItem(item) && item.line_part && (
        <span>
          <span
            onClick={() => handleClick(item.line_range, item.message)}
			className={styles.lineRange}
          >
            {item.line_part}
          </span>
          <span>: </span>
        </span>
      )}

      <span
		className={styles.message}
      >
        {item.message}
      </span>

      {isCollectedFbItem(item) && (
        <span>
          {item.collected_line_ranges.map((line_range, idx) => {
            return (
              <React.Fragment key={idx}>
                {idx > 0 && ", "}
                <span
                  onClick={() => handleClick(line_range, item.message)}
                  key={idx}
				  className={styles.lineRange}
                >
                  {lines_str(line_range)}
                </span>
              </React.Fragment>
            );
          })}
        </span>
      )}
    </p>
  );
};

export default FeedbackItem;
