import React, { useContext } from "react";
import { LanguageServerContext } from '../../context/LanguageServerContext'
import { FeedBackWithLineRange } from '../../common/types'
import * as monaco from "monaco-editor";

interface LinkedFeedbackProps {
  feedbackWithLineRange: FeedBackWithLineRange; 
}

const LinkedFeedback: React.FC<LinkedFeedbackProps> = ({feedbackWithLineRange}) => {
  const { editorRef, monacoRef, addMarkers } = useContext(LanguageServerContext);
  const [line_range, message] = feedbackWithLineRange;

  const handleClick = () => {
	if(line_range && monacoRef.current && editorRef.current?.getModel()) {
	  editorRef.current?.revealLineInCenter(line_range[0]);

	  const feedbackMarker = [{
		startLineNumber: line_range[0],
		startColumn: 1,
		endLineNumber: line_range[1],
		endColumn: editorRef.current?.getModel()?.getLineMaxColumn(line_range[1]) ?? 1, // Ending column (end of the line)
		message: message,
		severity: monaco.MarkerSeverity.Error, // Set severity as Error
	  }]

	  addMarkers(feedbackMarker);
	}
  }

  return (
	<p
	  onClick={handleClick}
	  style={{ textDecoration: line_range!=null ? "underline" : "none",
		cursor: line_range!=null ? "pointer" : "default",
		whiteSpace: "pre-wrap",
		fontFamily: "inherit",
		color: "inherit",
	  }}
	>
	  {message}
	</p>
  );
};

export default LinkedFeedback;
