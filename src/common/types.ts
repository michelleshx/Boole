export interface Assignment {
  id: number;
  short_identifier: string;
  description: string;
}

export interface UncollectedFbItem {
  indentation: string;
  prefix: string;
  line_part: string;
  message: string;
  line_range: [number, number];
}

export interface CollectedFbItem {
  indentation: string;
  prefix: string;
  line_part: string;
  message: string;
  collected_line_ranges: [number, number][];
}

export const isUncollectedFbItem = (
  item: UncollectedFbItem | CollectedFbItem
): item is UncollectedFbItem => {
  return "line_range" in item;
};

export const isCollectedFbItem = (
  item: UncollectedFbItem | CollectedFbItem
): item is CollectedFbItem => {
  return "collected_line_ranges" in item;
};

export type FbList = (UncollectedFbItem | CollectedFbItem)[];

export interface FeedbackOutput {
  "comments": FbList
  "other_items": FbList
}

export type Feedback = 
  | string
  | (string | FeedbackOutput)[]

export const SyntaxError = "syntax error"
export const FeedbackError = "feedback error"

export enum Tab {
  State = "state",
  Operations = "operations",
  Trace = "trace",
}

// 1) For the "currentStateSpace" array
export interface CurrentStateSpaceItem {
  state: string;
  type: string;
  value: string;
}

// 2) For the "types" array
export interface TypeItem {
  type: string;
  value: string;
}

// 3) For the "constants" array
export interface ConstantItem {
  state: string;
  type: string;
  value: string;
}

// Operations
export interface OperationItem {
  name: string;
  declarations: CurrentStateSpaceItem[];
}

export interface TraceItem {
  name: string;
  operation: OperationItem; // operation applied
  state: CurrentStateSpaceItem[]; // renamed from "declarations"
}

// sendMessage types

export type MessageMethod =
  | "custom/getFeedback"
  | "custom/getZSpecComponents"
  | "custom/runOperations"
  | "custom/runEvaluateExpression";

export type SendMessageFn = (
  method: MessageMethod,
  value: string,
  ...args: any[]
) => void;
