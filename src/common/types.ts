export interface Assignment {
  id: number;
  short_identifier: string;
  description: string;
}

export type FeedBackWithLineRange = [[number, number] | null, string];

export type Feedback = ((string | FeedBackWithLineRange)[]) | string;

