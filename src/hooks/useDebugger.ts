/* global gtag */

import { useState, useContext } from "react";
import axios from "axios";
import { StateContext } from "../context/StateContext";

const useDebugger = (onVerify: (feedback: string) => void) => {
  const [debugging, setDebugging] = useState(false);
  const [valid, setValid] = useState(false);

  const {
    stateSpace,
    types,
    constants,
    setStateSpace,
    setTypes,
    setConstants,
  } = useContext(StateContext);

  const debug = (valueToValidate: string) => {
    setDebugging(true);
    gtag("event", "debug");

    // TODO change this to the correct check predtype endpoint?
    axios
      .post(
        "/~se212/george/ask-george/cgi-bin/george.cgi/check",
        valueToValidate,
        {
          headers: { "Content-type": "text/plain" },
        }
      )
      .then((response) => {
        const feedback = response.data;
        const isValid =
          feedback.indexOf("\n- Failed\n") === -1 &&
          feedback.indexOf("BAD STRUCTURE:") === -1;

        setValid(isValid);
        // TODO update these w proper response and data structure
        setStateSpace([""]);
        setTypes([""]);
        setConstants([""]);
        onVerify(feedback);
      })
      .catch(() => {
        onVerify("Failed to interpret State Space!");
      })
      .finally(() => {
        setDebugging(false);
      });
  };

  return { debugging, valid, debug };
};

export default useDebugger;
