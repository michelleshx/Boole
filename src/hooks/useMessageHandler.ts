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
    valid,
  }: {
    feedback: Feedback;
    method: string;
    valid?: boolean;
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
        stringToCheck.indexOf("BAD STRUCTURE:") === -1 &&
        stringToCheck.indexOf("Error:") === -1,
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
          const feedback = lastJsonMessage.params.feedback;
          const components = lastJsonMessage.params.components;

          const { isValid } = checkItem(feedback as string);

          if (isValid) {
            // Extract state space
            const stateSpaceList: CurrentStateSpaceItem[] =
              components.schemas
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
              components.types?.map((type: string) => ({
                type,
                value: "",
              })) || [];

            // Extract constants
            const constantsList: ConstantItem[] = Object.entries(
              components.constants || {}
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
              components.schemas
                ?.filter(
                  (schema: any) =>
                    schema.type === "DELTA" || schema.type === "XI"
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
          }

          config.onSuccess?.({
            feedback: isValid
              ? `${feedback}\n++ Comment: Z Spec successfully interpreted`
              : feedback,
            method: "custom/getZSpecComponents",
            valid: isValid,
          });
        } else if (lastJsonMessage.method === "custom/runOperations") {
          const feedback = lastJsonMessage.params.feedback;
          const interpretation = lastJsonMessage.params.interpretation;
          const opName = lastJsonMessage.params.operation;

          const { isValid } = checkItem(feedback as string);

          if (isValid) {
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
              const newValue = interpretation[item.state]?.values;
              const formattedValue = Array.isArray(newValue)
                ? newValue
                    .map((subArray) =>
                      Array.isArray(subArray)
                        ? subArray.length === 1
                          ? subArray[0]
                          : `(${subArray.join(", ")})`
                        : subArray
                    )
                    .join(", ")
                : newValue;

              return formattedValue !== undefined
                ? { ...item, value: formattedValue }
                : item;
            });

            // Add new items to state space
            const newItems = Object.entries(interpretation)
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
                    ?.declarations.find((decl) => decl.state === key)?.type ||
                  "",
                value: (value as { values: any }).values,
              }));

            // Merge updated and new items, then update state
            const mergedStateSpaceList = [
              ...updatedStateSpaceList,
              ...newItems,
            ];
            updateStateAndStorage("currentStateSpace", mergedStateSpaceList);

            // Add to traces
            updateTracesAndStorage({
              name: `[${traces.length}] Run operation: ${opName}`,
              operation:
                operations.find((op) => op.name === opName) ||
                ({} as OperationItem),
              state: mergedStateSpaceList,
            });
          }

          config.onSuccess({
            feedback: isValid
              ? `${feedback}\n++ Comment: "${opName}" operation applied`
              : feedback,
            method: "custom/runOperations",
            valid: isValid,
          });
        } else if (lastJsonMessage.method === "custom/runEvaluateExpression") {
          const feedback: Feedback = lastJsonMessage.params.output;

          const { isValid } = checkItem(feedback as string);
          setValid(isValid);

          const filteredFeedback = (feedback: Feedback) => {
            if (isValid) {
              const match = (feedback as string).match(
                /Expression evaluates to (.*)/
              );
              if (match) return match[0];
            }
            return feedback;
          };

          config.onSuccess?.({
            feedback: filteredFeedback(feedback),
            method: "custom/runEvaluateExpression",
            valid: isValid,
          });
        }
      }
    } catch {
      config.onSuccess?.({
        feedback: "Failed to process message!",
        method: "custom/getFeedback",
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
        sendRunEvaluateExpressionMessage(value, expression);
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
