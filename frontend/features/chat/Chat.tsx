"use client";

import ChatWindow from "@/features/chat/output/ChatWindow";
import FirstWindow from "@/features/chat/output/FirstWindow";

import { TEXTAERA_MB, TEXTAREA_MIN_HEIGHT } from "@/utils/globals";
import InputArea from "./input/InputArea";
import { useChatStream } from "@/hooks/useChatStream";

const HEIGHT = `calc(100% - ${TEXTAERA_MB}px - ${TEXTAREA_MIN_HEIGHT / 2}px)`;

export default function Chat() {
  // custom hook to handle/retrieve the messages, how to handle the API using sendMessage, and the last one a UI handler for the "SEND" button
  const { messages, sendMessage, agentLastMessageStatus } = useChatStream();

  //console.log(messages); // debug messages
  //console.log("agent: ", agentLastMessageStatus); // debug status of agent last message

  return (
    <>
      <div
        className="no-scrollbar overflow-scroll"
        style={{
          width: "100%",
          height: `${HEIGHT}`,
        }}
      >
        {messages.length === 0 ? <FirstWindow onSend={sendMessage} /> : <ChatWindow messages={messages} />}
      </div>
      <InputArea onSend={sendMessage} status={agentLastMessageStatus} />
    </>
  );
}
