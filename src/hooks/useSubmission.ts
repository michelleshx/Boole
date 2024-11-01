/* global gtag */

import { useState } from "react";
import axios from "axios";

const getAssignmentNumber = (text: string) => {
  // #a 01
  const regex = /#a\s*(\S+)/g;
  let match;
  let results = [];

  while ((match = regex.exec(text)) !== null) results.push(match[1]);

  return parseInt(results.toString(), 10).toString();
};

const getQuestionNumber = (text: string) => {
  // #q 001
  const regex = /#q\s*(\S+)/g;
  let match;
  let results = [];

  while ((match = regex.exec(text)) !== null) results.push(match[1]);

  return parseInt(results.toString(), 10).toString();
};

const useSubmission = (onVerify: (feedback: string) => void) => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  // const getAssignments = async () => {
  //   try {
  //     const response = await axios.get("/cgi-bin/markus_get_file.py", {});
  //     console.log("Getting assignments in MarkUs:", response.status);
  //     response.data.forEach(
  //       (assn: {
  //         id: number;
  //         short_identifier: string;
  //         description: string;
  //       }) => {
  //         console.log(assn.id, assn.short_identifier, assn.description);
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error getting assignments:", error);
  //   }
  // };

  const submit = (valueToValidate: string) => {
    setSubmitting(true);

    gtag("event", "submit");

    const assignmentNum = getAssignmentNumber(valueToValidate);
    const questionNum = getQuestionNumber(valueToValidate);

    const data = {
      assignment_id: assignmentNum,
      files: [
        {
          filename: `a${assignmentNum}q${questionNum}.grg`, // Name of the file to submit
          encoding: "text",
          content: valueToValidate,
        },
      ],
    };

    axios
      .post(`/george/ask-george/cgi-bin/markus_submit.cgi`, data)
      .then((response) => {
        console.log(response.data);
        setSubmittedValue(valueToValidate);
        onVerify(
          `Successfully submitted a${assignmentNum}q${questionNum}.grg to Markus!`
        );
      })
      .catch((e) => {
        console.error(e);
        onVerify("Error submitting assignment to Markus!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return { submitting, submittedValue, submit };
};

export default useSubmission;
