/* global gtag */

import { useContext, useEffect, useState } from "react";
import { FeedBackWithLineRange, Feedback } from "../common/types";
import { LanguageServerContext } from "../context/LanguageServerContext";

const useVerification = (
  value: string,
  onVerify: (feedback: Feedback) => void
) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedValue, setVerifiedValue] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [magicUsed, setMagicUsed] = useState(false);

  const { lastJsonMessage, sendVerificationMessage } = useContext(LanguageServerContext)

  const checkString = (message: string) => {
	return {
	  isValid: 
		message.indexOf("\n- Failed\n") === -1 &&
		message.indexOf("BAD STRUCTURE:") === -1,
	  isMagicUsed:
		message.indexOf("\n-- Warning: magic rule has been used.\n") !== -1 ||
		  message.indexOf("\n-- Warning: branch is open") !== -1,
	}
  }

  useEffect(() => {
	try{
	  if(lastJsonMessage && lastJsonMessage.type !== "ERROR" && lastJsonMessage.method === "getFeedback") {
		const feedback: Feedback = lastJsonMessage.params.output;
		var isValid = true;
		var isMagicUsed = false;

		if(Array.isArray(feedback)) {
		  let stringToCheck = "";
		  for(let i = 0; i < feedback.length; i++) {
			if(!isValid && isMagicUsed) break;

			if(Array.isArray(feedback[i])) {
			  const [, stringToCheck] = feedback[i] as FeedBackWithLineRange;
			} else {
			  stringToCheck = feedback[i] as string;
			}

			({isValid, isMagicUsed} = checkString(stringToCheck));
		  }
		} else {
		  ({isValid, isMagicUsed} = checkString(feedback));
		}
		setVerifiedValue(value);
		setValid(isValid);
		setMagicUsed(isMagicUsed);
		onVerify(feedback);
	  }
	} catch {
	  onVerify("Failed to verify (verification was not performed)!");
	}
	setVerifying(false);
  }, [lastJsonMessage]);

  const verify = (valueToValidate: string) => {
    setVerifying(true);

    gtag("event", "verify");

	sendVerificationMessage(valueToValidate);
  };

  return { verifying, verifiedValue, valid, magicUsed, verify };
};

export default useVerification;
