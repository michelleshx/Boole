import { useContext, useEffect, useState } from "react";
import {
  UncollectedFbItem,
  CollectedFbItem,
  FeedbackError,
  Feedback,
  CurrentStateSpaceItem,
  TypeItem,
  ConstantItem,
  OperationItem,
  MessageMethod,
} from "../common/types";
import { LanguageServerContext } from "../context/LanguageServerContext";
import { StateContext } from "../context/StateContext";

interface MessageHandlerConfig {
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
	sendEmailMessage,
    // sendGetZSpecComponentsMessage,
    // sendRunOperationsMessage,
    sendRunEvaluateExpressionMessage,
    setMarkers,
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

  // Handle getFeedback response
  const handleGetFeedback = (feedback: Feedback) => {
    setMarkers([], FeedbackError); // clear the existing feedback markers
    let isValid = true;
    let isMagicUsed = false;

    if (Array.isArray(feedback)) {
      for (const ele of feedback) {
        if (!isValid && isMagicUsed) break;

        if (typeof ele === "string") {
          ({ isValid, isMagicUsed } = checkItem(ele));
        } else {
          if (ele["comments"]) {
            for (const item in ele) {
              checkItem(item);
            }
          }
          if (ele["other_items"]) {
            for (const item in ele) {
              checkItem(item);
            }
          }
        }
      }
    } else {
      ({ isValid, isMagicUsed } = checkItem(feedback));
    }

    setMagicUsed(isMagicUsed);
    setValid(isValid);
    config.onSuccess?.({
      feedback: feedback,
      method: "custom/getFeedback",
      valid: isValid,
    });
  };

  // Handle getZSpecComponents response
  // const handleGetZSpecComponents = (feedback: string, components: any) => {
  //   const { isValid } = checkItem(feedback as string);
  //
  //   if (isValid) {
  //     // Extract state space
  //     const stateSpaceList: CurrentStateSpaceItem[] =
  //       components.schemas
  //         ?.find(
  //           (schema: any) =>
  //             schema.type === "DECLARE" && schema.name !== "Constants"
  //         )
  //         ?.declarations?.map(
  //           ({ name, type }: { name: string; type: string }) => ({
  //             state: name,
  //             type,
  //             value: "",
  //           })
  //         ) || [];
  //     // Extract types
  //     const typesList: TypeItem[] =
  //       components.types?.map((type: string) => ({
  //         type,
  //         value: "",
  //       })) || [];
  //
  //     // Extract constants
  //     const constantsList: ConstantItem[] = Object.entries(
  //       components.constants || {}
  //     ).map(([key, value]) => ({
  //       state: key,
  //       type: String(value),
  //       value: "",
  //     }));
  //
  //     // Update state and storage
  //     updateStateAndStorage("currentStateSpace", stateSpaceList);
  //     updateStateAndStorage("types", typesList);
  //     updateStateAndStorage("constants", constantsList);
  //
  //     // Extract operations
  //     const operations: OperationItem[] =
  //       components.schemas
  //         ?.filter(
  //           (schema: any) => schema.type === "DELTA" || schema.type === "XI"
  //         )
  //         .map((op: any) => ({
  //           name: op.name,
  //           declarations:
  //             op.declarations?.map(
  //               ({ name, type }: { name: string; type: string }) => ({
  //                 state: name,
  //                 type,
  //                 value: "",
  //               })
  //             ) || [],
  //         })) || [];
  //
  //     // Update operations
  //     operations.forEach(updateOperationAndStorage);
  //
  //     // Reset traces
  //     resetTraces();
  //   }
  //
  //   setValid(isValid);
  //   config.onSuccess?.({
  //     feedback: isValid
  //       ? `${feedback}\n++ Comment: Z Spec successfully interpreted`
  //       : feedback,
  //     method: "custom/getZSpecComponents",
  //     valid: isValid,
  //   });
  // };
  //
  // // Handle runOperations response
  // const handleRunOperations = (
  //   feedback: string,
  //   interpretation: any,
  //   opName: string
  // ) => {
  //   const { isValid } = checkItem(feedback as string);
  //
  //   if (isValid) {
  //     // Add initial state to traces if traces are empty
  //     if (!traces.length) {
  //       updateTracesAndStorage({
  //         name: "Initial State",
  //         operation: {} as OperationItem,
  //         state: currentStateSpace,
  //       });
  //     }
  //
  //     // Update existing state space items and format new values
  //     const updatedStateSpaceList = currentStateSpace.map((item) => {
  //       const newValue = interpretation[item.state]?.values;
  //       const formattedValue = Array.isArray(newValue)
  //         ? newValue
  //             .map((subArray) =>
  //               Array.isArray(subArray)
  //                 ? subArray.length === 1
  //                   ? subArray[0]
  //                   : `(${subArray.join(", ")})`
  //                 : subArray
  //             )
  //             .join(", ")
  //         : newValue;
  //
  //       return formattedValue !== undefined
  //         ? { ...item, value: formattedValue }
  //         : item;
  //     });
  //
  //     // Add new items to state space
  //     const newItems = Object.entries(interpretation)
  //       .filter(
  //         ([key]) =>
  //           !currentStateSpace.some((item) => item.state === key) &&
  //           !key.includes("?") &&
  //           !key.includes("!")
  //       )
  //       .map(([key, value]) => ({
  //         state: key,
  //         type:
  //           operations
  //             .find((op) => op.name === opName)
  //             ?.declarations.find((decl) => decl.state === key)?.type || "",
  //         value: (value as { values: any }).values,
  //       }));
  //
  //     // Merge updated and new items, then update state
  //     const mergedStateSpaceList = [...updatedStateSpaceList, ...newItems];
  //     updateStateAndStorage("currentStateSpace", mergedStateSpaceList);
  //
  //     // Updated operation results
  //     const operationResult =
  //       operations.find((op) => op.name === opName) || ({} as OperationItem);
  //
  //     Object.entries(interpretation)
  //       .filter(([key]) => key.includes("!"))
  //       .forEach(([key, value]) => {
  //         const decl = operationResult.declarations.find(
  //           (decl) => decl.state === key
  //         );
  //         if (decl) {
  //           decl.value = (value as { values: any }).values;
  //         }
  //       });
  //
  //     // Add to traces
  //     updateTracesAndStorage({
  //       name: `[${traces.length || 1}] Run operation: ${opName}`,
  //       operation: operationResult,
  //       state: mergedStateSpaceList,
  //     });
  //   }
  //
  //   setValid(isValid);
  //   config.onSuccess({
  //     feedback: isValid
  //       ? `${feedback}\n++ Comment: "${opName}" operation applied`
  //       : feedback,
  //     method: "custom/runOperations",
  //     valid: isValid,
  //   });
  // };

  // Handle runEvaluateExpression response
  const handleEvaluateExpression = (feedback: Feedback) => {
    const { isValid } = checkItem(feedback as string);

    const processedFeedback =
      isValid && typeof feedback === "string"
        ? feedback.match(/Expression evaluates to (.*)/)?.at(0) || feedback
        : feedback;

    setValid(isValid);
    config.onSuccess?.({
      feedback: processedFeedback,
      method: "custom/runEvaluateExpression",
      valid: isValid,
    });
  };


  const handleRequestPermission = (message: string, grg_code: string) => {
	if(!window.confirm(message + "\n\n" + grg_code)) return;
	sendEmailMessage(grg_code);
  }

  useEffect(() => {
    try {
      if (!lastJsonMessage || lastJsonMessage.type === "ERROR") {
        config.onSuccess?.({
          feedback: lastJsonMessage.res.message,
          method: lastJsonMessage.method,
        });
		return
      }
      switch (lastJsonMessage.method) {
        case "custom/getFeedback":
          handleGetFeedback(lastJsonMessage.res.output);
          break;
	    case "custom/requestStudentPermission":
		  handleRequestPermission(lastJsonMessage.res.message, lastJsonMessage.res.grg_code);
		  break;
        // case "custom/getZSpecComponents":
        //   handleGetZSpecComponents(
        //     lastJsonMessage.params.feedback,
        //     lastJsonMessage.params.components
        //   );
        //   break;
        // case "custom/runOperations":
        //   handleRunOperations(
        //     lastJsonMessage.params.feedback,
        //     lastJsonMessage.params.interpretation,
        //     lastJsonMessage.params.operation
        //   );
        //   break;
        // case "custom/runEvaluateExpression":
        //   handleEvaluateExpression(lastJsonMessage.res.output);
        //   break;
      }
    } catch {
      config.onSuccess?.({
        feedback: "Try the Ask George button",
        method: lastJsonMessage?.method || "unknown",
        valid: false,
      });
    }
  }, [lastJsonMessage]);

  const sendMessage = (
    method: MessageMethod,
    value: string,
    ...args: any[]
  ) => {
    setProcessing(true);

    switch (method) {
      case "custom/getFeedback":
        sendVerificationMessage(value);
        setProcessedValue(value);
        break;
      // case "custom/getZSpecComponents":
      //   sendGetZSpecComponentsMessage(value);
      //   break;
      // case "custom/runOperations":
      //   const [interpretation = "", opName = ""] = args;
      //   sendRunOperationsMessage(value, interpretation, opName);
      //   break;
      case "custom/runEvaluateExpression":
        const [expression] = args;
        sendRunEvaluateExpressionMessage(value, expression);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    setProcessing(false);
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
