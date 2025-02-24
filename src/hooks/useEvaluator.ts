import { useState, useEffect } from "react";
import axios from "axios";

const useEvaluator = (onVerify: (feedback: string) => void) => {
  const [evaluating, setEvaluating] = useState(false);
  const [submittedValue, setSubmittedValue] = useState<string | null>(null);

  const evaluate = (valueToValidate: string) => {
    setEvaluating(true);

    axios
      .post("/george/ask-george/cgi-bin/george.cgi/check", valueToValidate, {
        headers: { "Content-type": "text/plain" },
      })
      .then((response) => {
        const feedback = response.data;
        setSubmittedValue(valueToValidate);
        onVerify(feedback);
      })
      .catch((e) => {
        onVerify("Failed to evaluate expression!");
      })
      .finally(() => {
        setEvaluating(false);
      });
  };

  return {
    evaluating,
    submittedValue,
    evaluate,
  };
};

export default useEvaluator;
