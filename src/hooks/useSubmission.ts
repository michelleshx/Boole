/* global gtag */

import { useState, useEffect } from "react";
import axios from "axios";

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
    try {
      const response = await axios.get(
        "https://student.cs.uwaterloo.ca/~m272xu/george/ask-george/cgi-bin/markus_get.cgi",
        {}
      );
      // Check if the response was successful
      if (response.data.success) {
        const assignments = response.data.assignments;
        setAssignments(assignments);
      } else {
        onVerify(
          `Error fetching assignments from Markus`,
          true
        );
        console.error("Error fetching assignments:", response.data.message);
      }
    } catch (error) {
      console.error("Error getting assignments:", error);
    }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const submit = (valueToValidate: string, assignmentId: number, filename: string) => {
    setSubmitting(true);

    gtag("event", "submit");

    const data = {
      assignment_id: assignmentId,
      files: [
        {
          filename: filename,
          encoding: "text",
          content: valueToValidate,
        },
      ],
    };

    axios
      .post(`https://student.cs.uwaterloo.ca/~m272xu/george/ask-george/cgi-bin/markus_submit.cgi`, data)
      .then((response) => {
        if (response.data.status === 200) {
          setSubmittedValue(valueToValidate);
          onVerify(
            `Successfully submitted ${filename} to Markus!`,
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
