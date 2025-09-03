/* global gtag */

import { useState, useEffect } from "react";
import axios from "axios";

import { Assignment, Feedback } from "../common/types";

const SUBMISSION_TIMEOUT = 5000;

const useSubmission = (
  onVerify: ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => void
) => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [defaultAssignment, setDefaultAssignment] = useState(-1);

  const getAssignments = async () => {
    try {
      const response = await axios.get(
		"/~se212/public_html/george/ask-george/cgi-bin/markus_get.cgi",
        {}
      );
      // Check if the response was successful
      if (response.data.success) {
        const assignments = response.data.assignments;
        setAssignments(assignments);
        if (assignments.length > 0) setDefaultAssignment(assignments[0].id);
      } else {
        onVerify({
          feedback: `Error fetching assignments from Markus`,
          method: "markus",
        });
        console.error("Error fetching assignments:", response.data.message);
      }
    } catch (error) {
      console.error("Error getting assignments:", error);
    }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const submit = (
    valueToValidate: string,
    assignmentId: number,
    filename: string
  ) => {
    setSubmitting(true);

    gtag("event", "submit");

    const data = {
      assignment_id: assignmentId !== -1 ? assignmentId : defaultAssignment,
      files: [
        {
          filename: filename,
          encoding: "text",
          content: valueToValidate,
        },
      ],
    };

    axios
      .post(`/~se212/public_html/george/ask-george/cgi-bin`, data, {
        timeout: SUBMISSION_TIMEOUT,
      })
      .then((response) => {
        if (response.data.status === 200) {
          setSubmittedValue(valueToValidate);
          onVerify({
            feedback: `Successfully submitted ${filename} to Markus!`,
            method: "markus",
          });
        } else {
          onVerify({
            feedback: `Error submitting assignment to Markus: ${response.data.message}`,
            method: "markus",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        const errorMessage =
          e.code === "ECONNABORTED"
            ? `Request timed out after ${
                SUBMISSION_TIMEOUT / 1000
              } seconds. Please try again later.`
            : "Error submitting assignment to Markus!";

        onVerify({
          feedback: errorMessage,
          method: "markus",
        });
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
