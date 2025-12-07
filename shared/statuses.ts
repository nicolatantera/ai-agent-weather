// shared file between the frontend and backend, containing the the possible message statuses

export const MESSAGE_STATUSES = {
  PENDING: "pending",
  IN_TRANSIT: "in_transit",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type MessageStatus = (typeof MESSAGE_STATUSES)[keyof typeof MESSAGE_STATUSES];
