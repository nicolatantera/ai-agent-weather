"use client";

import TextArea from "./TextArea";
import SendButton from "./SendButton";

import { WRAPPER_MAX_WIDTH, TEXTAREA_MIN_HEIGHT, SEND_SIZE, WRAPPER_WIDTH, TEXTAERA_MB } from "@/utils/globals";
import { useState } from "react";

interface InputAreaProps extends React.ComponentPropsWithoutRef<"div"> {
  onSend: (message: string) => void;
  status: string | undefined;
}

export default function InputArea({ onSend, status }: InputAreaProps) {
  const [currentMessage, setCurrentMessage] = useState<string>("");

  function handleSendClick() {
    onSend(currentMessage);
    setCurrentMessage("");
  }

  return (
    <div
      className="fixed left-[50%] flex items-center justify-between rounded-4xl"
      style={{
        width: `${WRAPPER_WIDTH}`,
        maxWidth: `${WRAPPER_MAX_WIDTH}px`,
        transform: "translateX(-50%)",
        bottom: `${TEXTAERA_MB}px`,
      }}
    >
      <TextArea value={currentMessage} onTextChange={setCurrentMessage} onSendClick={handleSendClick} />
      {/* small circle */}
      <div
        className="absolute rounded-[50%] bg-[#444444]"
        style={{
          width: "10px",
          height: "10px",
          bottom: `calc(${TEXTAREA_MIN_HEIGHT / 2}px - 4px)`,
          right: `calc(${SEND_SIZE}px + 3.5px)`,
        }}
      />
      <SendButton onSendClick={handleSendClick} status={status} />
    </div>
  );
}
