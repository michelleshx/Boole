/* global gtag */

import { useState } from "react";
import axios from "axios";

// API URL and Authentication header token
const apiUrl = "https://markus.student.cs.uwaterloo.ca/markus_cs116ae_f/api/";
const authHeader = {
  Authorization: process.env.REACT_APP_MARKUS_AUTH,
  ContentType: "application/json",
};

const getUsername = (text: string) => {
  // #u userName
  const regex = /#u\s*(\S+)/g;
  let match;
  let results = [];

  while ((match = regex.exec(text)) !== null) results.push(match[1]);
  return results.toString();
};

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

  const getAssignments = async () => {
    try {
      const response = await axios.get("/assignments.json", {
        headers: authHeader,
      });
      console.log("Getting assignments in MarkUs:", response.status);
      response.data.forEach(
        (assn: {
          id: number;
          short_identifier: string;
          description: string;
        }) => {
          console.log(assn.id, assn.short_identifier, assn.description);
        }
      );
    } catch (error) {
      console.error("Error getting assignments:", error);
    }
  };

  const submit = (valueToValidate: string) => {
    setSubmitting(true);

    gtag("event", "submit");

    const username = getUsername(valueToValidate);
    const assignmentNum = getAssignmentNumber(valueToValidate);
    const questionNum = getQuestionNumber(valueToValidate);

    const data = {
      student_username: username, // The username of the student
      submit_action: "upload", // Upload to add or update a file
      files: [
        {
          filename: `a${assignmentNum}q${questionNum}.grg`, // Name of the file to submit
          encoding: "text", // We're submitting a text file
          content: valueToValidate, // The contents of the file
        },
      ],
    };

    axios
      .post(
        `/assignments/${assignmentNum}/student_submissions/submit.json`,
        data,
        {
          headers: authHeader,
        }
      )
      .then(() => {
        setSubmittedValue(valueToValidate);
        onVerify(
          `Successfully submitted a${assignmentNum}q${questionNum}.grg to Markus!`
        );
      })
      .catch(() => {
        onVerify("Error submitting assignment to Markus!");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return { submitting, submittedValue, submit };
};

export default useSubmission;
