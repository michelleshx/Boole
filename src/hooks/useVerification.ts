/* global gtag */

import { useState } from "react";
import axios from "axios";

const useVerification = (
  value: string,
  onVerify: (feedback: string) => void
) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedValue, setVerifiedValue] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [magicUsed, setMagicUsed] = useState(false);

  const verify = (valueToValidate: string) => {
    setVerifying(true);

    gtag("event", "verify");

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

        const isMagicUsed =
          feedback.indexOf("\n-- Warning: magic rule has been used.\n") !==
            -1 || feedback.indexOf("\n-- Warning: branch is open") !== -1;

        setVerifiedValue(valueToValidate);
        setValid(isValid);
        setMagicUsed(isMagicUsed);
        onVerify(feedback);
      })
      .catch(() => {
        onVerify("Failed to verify (verification was not performed)!");
      })
      .finally(() => {
        setVerifying(false);
      });
  };

  return { verifying, verifiedValue, valid, magicUsed, verify };
};

export default useVerification;
