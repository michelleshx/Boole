/* global gtag */
import { useContext, useEffect, useState } from "react";
import {
  FeedBackWithLineRange,
  Feedback,
  CurrentStateSpaceItem,
  TypeItem,
  ConstantItem,
  OperationItem,
} from "../common/types";
import { LanguageServerContext } from "../context/LanguageServerContext";
import { StateContext } from "../context/StateContext";

interface MessageHandlerConfig {
  method: "custom/getFeedback" | "custom/getZSpecComponents";
  onSuccess: (feedback: Feedback) => void;
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

  const { updateStateAndStorage, addOperationAndStorage } =
    useContext(StateContext);

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
          const feedback = lastJsonMessage.params.components;

          setValid(true);
          config.onSuccess?.(
            typeof feedback === "object"
              ? "Z Spec successfully interpreted!"
              : feedback
          );
          if (!feedback) return; // Ensure feedback is defined before proceeding

          // Set state values
          // TODO update initial state once jacqueline changes getZSpec api
          const stateSpaceList: CurrentStateSpaceItem[] =
            // Assume: [1] contains the declarations, [2] contains the initial state
            feedback.state_space?.[1]?.declarations?.map(
              ({ name, type }: { name: string; type: string }) => ({
                state: name,
                type,
                value: "",
              })
            ) || [];
          const typesList: TypeItem[] =
            feedback.types?.map((type: string) => ({
              type,
              value: "",
            })) || [];
          const constantsList: ConstantItem[] = Object.entries(
            feedback.constants || {}
          ).map(([key, value]) => ({
            state: key,
            type: String(value),
            value: "",
          }));

          updateStateAndStorage("currentStateSpace", stateSpaceList);
          updateStateAndStorage("types", typesList);
          updateStateAndStorage("constants", constantsList);

          // Set operations
          const operations: OperationItem[] =
            feedback.operations?.map((op: any) => ({
              name: op.name,
              declarations:
                op.declarations?.map(
                  ({ name, type }: { name: string; type: string }) => ({
                    name,
                    type,
                    value: "",
                  })
                ) || [],
            })) || [];

          operations.forEach(addOperationAndStorage);
        }
      }
    } catch {
      config.onSuccess?.("Failed to process message!");
    }
    setProcessing(false);
  }, [lastJsonMessage, config]);

  const sendMessage = (value: string) => {
    setProcessing(true);
    gtag("event", config.method === "custom/getFeedback" ? "verify" : "debug");

    if (config.method === "custom/getFeedback") {
      sendVerificationMessage(value);
      setProcessedValue(value);
    } else if (config.method === "custom/getZSpecComponents") {
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
