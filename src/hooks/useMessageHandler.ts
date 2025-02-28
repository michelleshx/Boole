/* global gtag */
import { useContext, useEffect, useState } from "react";
import { FeedBackWithLineRange, Feedback } from "../common/types";
import { LanguageServerContext } from "../context/LanguageServerContext";
// import { StateContext } from "../context/StateContext";

interface MessageHandlerConfig {
  method: "custom/getFeedback" | "custom/getZSpecComponents";
  onSuccess: (feedback: Feedback) => void;
  // validateResponse?: (feedback: Feedback) => {
  //   isValid: boolean;
  //   isMagicUsed: boolean;
  // };
}

const useMessageHandler = (config: MessageHandlerConfig) => {
  const [processing, setProcessing] = useState(false);
  const [processedValue, setProcessedValue] = useState<string | null>(null);
  const [valid, setValid] = useState(false);
  const [magicUsed, setMagicUsed] = useState(false);

  const {
    lastJsonMessage,
    sendVerificationMessage,
    sendGetZSpecComponentsMessage,
  } = useContext(LanguageServerContext);

  const checkString = (message: string) => {
    return {
      isValid:
        message.indexOf("\n- Failed\n") === -1 &&
        message.indexOf("BAD STRUCTURE:") === -1,
      isMagicUsed:
        message.indexOf("\n-- Warning: magic rule has been used.\n") !== -1 ||
        message.indexOf("\n-- Warning: branch is open") !== -1,
    };
  };

  useEffect(() => {
    try {
      if (lastJsonMessage && lastJsonMessage.type !== "ERROR") {
        if (lastJsonMessage.method === "custom/getFeedback") {
          const feedback: Feedback = lastJsonMessage.params.output;
          let isValid = true;
          let isMagicUsed = false;

          if (Array.isArray(feedback)) {
            for (const item of feedback) {
              if (!isValid && isMagicUsed) break;

              const stringToCheck = Array.isArray(item) ? item[1] : item;
              ({ isValid, isMagicUsed } = checkString(stringToCheck));
            }
          } else {
            ({ isValid, isMagicUsed } = checkString(feedback));
          }

          setValid(isValid);
          setMagicUsed(isMagicUsed);
          config.onSuccess?.(feedback);
        } else if (lastJsonMessage.method === "custom/getZSpecComponents") {
          const feedback: Feedback = lastJsonMessage.params.components;
          console.log("message", feedback);
          setValid(true);
          config.onSuccess?.(feedback);
        }
      }
    } catch {
      config.onSuccess?.("Failed to process message!");
    }
    setProcessing(false);
  }, [lastJsonMessage]);

  const sendMessage = (value: string) => {
    setProcessing(true);
    gtag("event", config.method === "custom/getFeedback" ? "verify" : "debug");

    if (config.method === "custom/getFeedback") {
      sendVerificationMessage(value);
      setProcessedValue(value);
    } else if (config.method == "custom/getZSpecComponents") {
      sendGetZSpecComponentsMessage(value);
    }
  };

  return {
    processing,
    processedValue,
    valid,
    magicUsed,
    sendMessage,
  };
};

export default useMessageHandler;
