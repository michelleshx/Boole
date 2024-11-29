/* global gtag */

import { useState, useEffect } from "react";
import axios from "axios";

// const getAssignmentNumber = (text: string) => {
//   // #a 01
//   const regex = /#a\s*(\S+)/g;
//   let match;
//   let results = [];

//   while ((match = regex.exec(text)) !== null) results.push(match[1]);

//   return parseInt(results.toString(), 10).toString();
// };

const getQuestionNumber = (text: string) => {
  // #q 001
  const regex = /#q\s*(\S+)/g;
  let match;
  let results = [];

  while ((match = regex.exec(text)) !== null) results.push(match[1]);

  return parseInt(results.toString(), 10).toString();
};

interface Assignment {
  id: number;
  short_identifier: string;
  description: string;
}

const useSubmission = (
  onVerify: (feedback: string, markus: boolean) => void
) => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const getAssignments = async () => {
    // TODO remove: testing
    const mockAssignments = [
      {
        id: 1,
        short_identifier: "A1",
        description: "Introduction to Programming Assignment",
      },
      {
        id: 2,
        short_identifier: "A2",
        description: "Data Structures and Algorithms Assignment",
      },
      { id: 3, short_identifier: "A3", description: "Web Development Project" },
      {
        id: 4,
        short_identifier: "A4",
        description: "Database Management Systems Assignment",
      },
    ];
    setAssignments(mockAssignments);

    // try {
    //   const response = await axios.get(
    //     "/george/ask-george/cgi-bin/markus_get.cgi",
    //     {}
    //   );
    //   console.log("Getting assignments in MarkUs:", response.status);
    //   const data = response.data.map(
    //     (assn: {
    //       id: number;
    //       short_identifier: string;
    //       description: string;
    //     }) => {
    //       console.log(assn.id, assn.short_identifier, assn.description);
    //       return assn; // Ensure each assignment object is returned
    //     }
    //   );
    //   setAssignments(data); // Update the state with the assignments list
    // } catch (error) {
    //   console.error("Error getting assignments:", error);
    // }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const submit = (valueToValidate: string, assignmentId: number) => {
    setSubmitting(true);

    gtag("event", "submit");

    console.log(assignmentId);
    const questionNum = getQuestionNumber(valueToValidate);

    const data = {
      assignment_id: assignmentId,
      files: [
        {
          filename: `a${assignmentId}q${questionNum}.grg`, // Name of the file to submit
          encoding: "text",
          content: valueToValidate,
        },
      ],
    };

    axios
      .post(`/george/ask-george/cgi-bin/markus_submit.cgi`, data)
      .then((response) => {
        if (response.data.status === 200) {
          setSubmittedValue(valueToValidate);
          onVerify(
            `Successfully submitted a${assignmentId}q${questionNum}.grg to Markus!`,
            true
          );
        } else {
          onVerify(
            `Error submitting assignment to Markus: ${response.data.message}`,
            true
          );
        }
      })
      .catch((e) => {
        console.error(e);
        onVerify("Error submitting assignment to Markus!", true);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return {
    submitting,
    submittedValue,
    submit,
    assignments,
  };
};

export default useSubmission;
