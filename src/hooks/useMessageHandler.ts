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
  method:
    | "custom/getFeedback"
    | "custom/getZSpecComponents"
    | "custom/runOperations";
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
    sendRunOperationsMessage,
  } = useContext(LanguageServerContext);

  const {
    currentStateSpace,
    updateStateAndStorage,
    updateOperationAndStorage,
    updateTracesAndStorage,
    resetTraces,
  } = useContext(StateContext);

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
          const stateSpaceList: CurrentStateSpaceItem[] =
            feedback.schemas
              .find(
                (schema: any) =>
                  schema.type === "DECLARE" && schema.name !== "Constants"
              )
              ?.declarations?.map(
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
          const operations: OperationItem[] = feedback.schemas
            .filter(
              (schema: any) => schema.type === "DELTA" || schema.type === "XI"
            )
            .map((op: any) => ({
              name: op.name,
              declarations:
                op.declarations
                  ?.filter((decl: any) => decl.name.indexOf("!") === -1)
                  .map(({ name, type }: { name: string; type: string }) => ({
                    state: name,
                    type,
                    value: "",
                  })) || [],
            }));

          operations.forEach(updateOperationAndStorage);

          // Reset traces
          resetTraces();
        } else if (lastJsonMessage.method === "custom/runOperations") {
          // TODO process run operation output
          const feedback = lastJsonMessage.params.components;

          setValid(true);
          config.onSuccess("[TEST] applied operation!");
          // config.onSuccess?.(
          //   typeof feedback === "object"
          //     ? "Successfully applied operation" // TODO Add operation name
          //     : feedback
          // );
          // if (!feedback) return;

          // Update traces with previous state
          updateTracesAndStorage({
            name: "[OPERATION NAME]",
            declarations: currentStateSpace,
          });

          // Update State Space with operation result
        }
      }
    } catch {
      config.onSuccess?.("Failed to process message!");
    }
    setProcessing(false);
  }, [lastJsonMessage, config]);

  const sendMessage = (value: string, interp?: string, opName?: string) => {
    setProcessing(true);
    gtag("event", config.method === "custom/getFeedback" ? "verify" : "debug");

    if (config.method === "custom/getFeedback") {
      sendVerificationMessage(value);
      setProcessedValue(value);
    } else if (config.method === "custom/getZSpecComponents") {
      sendGetZSpecComponentsMessage(value);
    } else if (config.method === "custom/runOperations") {
      sendRunOperationsMessage(value, interp ?? "", opName ?? "");
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
