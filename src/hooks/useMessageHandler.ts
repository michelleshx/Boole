import { useContext, useEffect, useState } from "react";
import {
  UncollectedFbItem,
  CollectedFbItem,
  Comments,
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
    | "custom/runOperations"
    | "custom/runEvaluateExpression";
  onSuccess: ({
    feedback,
    method,
  }: {
    feedback: Feedback;
    method: string;
  }) => void;
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
    sendRunEvaluateExpressionMessage,
  } = useContext(LanguageServerContext);

  const {
    currentStateSpace,
    traces,
    operations,
    updateStateAndStorage,
    updateOperationAndStorage,
    updateTracesAndStorage,
    resetTraces,
  } = useContext(StateContext);

  const checkItem = (item: string | UncollectedFbItem | CollectedFbItem) => {
    const stringToCheck =
      typeof item === "string"
        ? (item as string)
        : (item as CollectedFbItem | UncollectedFbItem)?.message;

    return {
      isValid:
        stringToCheck.indexOf("\n- Failed\n") === -1 &&
        stringToCheck.indexOf("BAD STRUCTURE:") === -1,
      isMagicUsed:
        stringToCheck.indexOf("\n-- Warning: magic rule has been used.\n") !==
          -1 || stringToCheck.indexOf("\n-- Warning: branch is open") !== -1,
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
            for (const ele of feedback) {
              if (!isValid && isMagicUsed) break;

              if (Array.isArray(ele)) {
                // ele is a list of comments
                for (const comment in ele) {
                  if (!isValid && isMagicUsed) break;
                  ({ isValid, isMagicUsed } = checkItem(comment));
                }
              } else {
                ({ isValid, isMagicUsed } = checkItem(ele));
              }
            }
          } else {
            ({ isValid, isMagicUsed } = checkItem(feedback));
          }

          setValid(isValid);
          setMagicUsed(isMagicUsed);
          config.onSuccess?.({
            feedback: feedback,
            method: "custom/getFeedback",
          });
        } else if (lastJsonMessage.method === "custom/getZSpecComponents") {
          const feedback = lastJsonMessage.params.components;

          setValid(true);
          config.onSuccess?.({
            feedback:
              typeof feedback === "object"
                ? "Z Spec successfully interpreted!"
                : feedback,
            method: "custom/getZSpecComponents",
          });

          if (!feedback) return; // Ensure feedback is defined before proceeding

          // Extract state space
          const stateSpaceList: CurrentStateSpaceItem[] =
            feedback.schemas
              ?.find(
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
          // Extract types
          const typesList: TypeItem[] =
            feedback.types?.map((type: string) => ({
              type,
              value: "",
            })) || [];

          // Extract constants
          const constantsList: ConstantItem[] = Object.entries(
            feedback.constants || {}
          ).map(([key, value]) => ({
            state: key,
            type: String(value),
            value: "",
          }));

          // Update state and storage
          updateStateAndStorage("currentStateSpace", stateSpaceList);
          updateStateAndStorage("types", typesList);
          updateStateAndStorage("constants", constantsList);

          // Extract operations
          const operations: OperationItem[] =
            feedback.schemas
              ?.filter(
                (schema: any) => schema.type === "DELTA" || schema.type === "XI"
              )
              .map((op: any) => ({
                name: op.name,
                declarations:
                  op.declarations?.map(
                    ({ name, type }: { name: string; type: string }) => ({
                      state: name,
                      type,
                      value: "",
                    })
                  ) || [],
              })) || [];

          // Update operations
          operations.forEach(updateOperationAndStorage);

          // Reset traces
          resetTraces();
        } else if (lastJsonMessage.method === "custom/runOperations") {
          const feedback = lastJsonMessage.params;
          if (!feedback) return;

          const opName = feedback.operation;

          // Add initial state to traces if traces are empty
          if (!traces.length) {
            updateTracesAndStorage({
              name: "Initial State",
              operation: {} as OperationItem,
              state: currentStateSpace,
            });
          }

          // Update existing state space items and format new values
          const updatedStateSpaceList = currentStateSpace.map((item) => {
            const newValue = feedback.interpretation[item.state]?.values;
            const formattedValue = Array.isArray(newValue)
              ? newValue
                  .map((subArray) =>
                    Array.isArray(subArray)
                      ? `(${subArray.join(", ")})`
                      : subArray
                  )
                  .join(", ")
              : newValue;

            return formattedValue !== undefined
              ? { ...item, value: formattedValue }
              : item;
          });

          // Add new items to state space
          const newItems = Object.entries(feedback.interpretation)
            .filter(
              ([key]) =>
                !currentStateSpace.some((item) => item.state === key) &&
                !key.includes("?") &&
                !key.includes("!")
            )
            .map(([key, value]) => ({
              state: key,
              type:
                operations
                  .find((op) => op.name === opName)
                  ?.declarations.find((decl) => decl.state === key)?.type || "",
              value: (value as { values: any }).values,
            }));

          // Merge updated and new items, then update state
          const mergedStateSpaceList = [...updatedStateSpaceList, ...newItems];
          updateStateAndStorage("currentStateSpace", mergedStateSpaceList);

          // Add to traces
          updateTracesAndStorage({
            name: `[${traces.length}] Run operation: ${opName}`,
            operation:
              operations.find((op) => op.name === opName) ||
              ({} as OperationItem),
            state: mergedStateSpaceList,
          });

          config.onSuccess({
            feedback: `"${opName}" operation applied!`,
            method: "custom/runOperations",
          });
        } else if (lastJsonMessage.method === "custom/runEvaluateExpression") {
          // TODO
          // const feedback: Feedback = lastJsonMessage.params.output;
          // let isValid = true;
          // if (Array.isArray(feedback)) {
          //   for (const item of feedback) {
          //     if (!isValid) break;
          //     const stringToCheck = Array.isArray(item) ? item[1] : item;
          //     ({ isValid } = checkString(stringToCheck));
          //   }
          // } else {
          //   ({ isValid } = checkString(feedback));
          // }
          // setValid(isValid);
          // config.onSuccess?.({
          //   feedback: feedback,
          //   method: "custom/runEvaluateExpression",
          // });
          // TODO format from output from Sharon
          // const feedback: Feedback = lastJsonMessage.params.output;
          // const filteredFeedback = (feedback: Feedback) => {
          //   const { isValid } = checkString(feedback as string);
          //   if (isValid) {
          //     const match = (feedback as string).match(/CE evaluates to (.*)/);
          //     if (match) return match[0];
          //   }
          //   return "Failed to evaluate expression!";
          // };
          // const result = filteredFeedback(feedback);
          // config.onSuccess?.({
          //   feedback: result as Feedback,
          //   method: "custom/runEvaluateExpression",
          // });
        }
      }
    } catch {
      config.onSuccess?.({
        feedback: "Failed to process message!",
        method: "custom/runEvaluateExpression",
      });
    }
    setProcessing(false);
  }, [lastJsonMessage]);

  const sendMessage = (value: string, ...args: any[]) => {
    setProcessing(true);

    switch (config.method) {
      case "custom/getFeedback":
        sendVerificationMessage(value);
        setProcessedValue(value);
        break;
      case "custom/getZSpecComponents":
        sendGetZSpecComponentsMessage(value);
        break;
      case "custom/runOperations":
        const [interpretation = "", opName = ""] = args;
        sendRunOperationsMessage(value, interpretation, opName);
        break;
      case "custom/runEvaluateExpression":
        const [expression] = args;
        sendRunEvaluateExpressionMessage(`${value}\n${expression}`);
        break;
      default:
        throw new Error(`Unsupported method: ${config.method}`);
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
