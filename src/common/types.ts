export interface Assignment {
  id: number;
  short_identifier: string;
  description: string;
}

export type FeedBackWithLineRange = [[number, number] | null, string];

export type Feedback = (string | FeedBackWithLineRange)[] | string;

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
  declarations: {
    name: string;
    type: string;
    value: string;
  }[];
}
