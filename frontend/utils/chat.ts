import {MessageStatus} from "../../shared/statuses"

// Type for the message
export type Message = {
  id: string;
  msg: string;
  role: "user" | "agent";
  status: MessageStatus;
}
