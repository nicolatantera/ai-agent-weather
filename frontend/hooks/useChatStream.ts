import { Message } from "@/utils/chat";
import { useState } from "react";
import { MESSAGE_STATUSES } from "../../shared/statuses";

const BACKEND_DOMAIN = process.env.BACKEND_DOMAIN;

export function useChatStream() {
  const [messages, setMessages] = useState<Message[]>([]);
  const agentLastMessageStatus = [...messages].reverse().find((m) => m.role === "agent")?.status;

  async function sendMessage(message: string) {
    let id: string;

    try {
      // try to send the user message to the backend to retrieve the ID associated with this message
      const res = await fetch(`${BACKEND_DOMAIN}/api/chat`, {
        method: "POST",
        body: JSON.stringify({ message: message }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      id = data.id;
    } catch (err: unknown) {
      // either fetch or network error, show error as a bot message
      const errorMsg = (err as Error).message;
      // If there was an error, set the user message and the AI agent response as errors
      setMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, msg: message.trim(), role: "user", status: MESSAGE_STATUSES.SUCCESS },
        { id: `error-${Date.now()}-agent`, msg: `Error: ${errorMsg}`, role: "agent", status: MESSAGE_STATUSES.ERROR },
      ]);
      return;
    }

    // If everything was okay, set the user message, and an initial state for the AI agent response,
    // with an initial empty value for the message and a "PENDING" status
    setMessages((prev) => [
      ...prev,
      { id: id, msg: message.trim(), role: "user", status: MESSAGE_STATUSES.SUCCESS },
      { id: id + "-agent", msg: "", role: "agent", status: MESSAGE_STATUSES.PENDING },
    ]);

    // Create the EventSource for the SSE streaming
    const eventSource = new EventSource(`${BACKEND_DOMAIN}/api/chat/stream?id=${id}`);

    // In case the response is of the Event "status", update the message status accordingly
    eventSource.addEventListener("status", (e) => {
      const status = e.data;

      setMessages((prev) => prev.map((m) => (m.id === id + "-agent" ? { ...m, status: status } : m)));

      // If the status is "SUCCESS" or "ERROR", close the connection
      if (status === MESSAGE_STATUSES.SUCCESS || status === MESSAGE_STATUSES.ERROR) {
        eventSource.close();
      }
    });

    // In case the response is of the Event "token", update the message with the AI agent response
    eventSource.addEventListener("token", (e) => {
      const token = e.data;

      setMessages((prev) => prev.map((m) => (m.id === id + "-agent" ? { ...m, msg: m.msg + token } : m)));
    });
  }

  return { messages, sendMessage, agentLastMessageStatus };
}
