"use client";

import { useLayoutEffect, useRef } from "react";
import ChatWrapper from "./ChatWrapper";
import MessageBox from "./MessageBox";
import { Message } from "@/utils/chat";

interface ChatWindowProps extends React.ComponentPropsWithoutRef<"div"> {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function goToLastMessage() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Scroll to bottom when new message added
  useLayoutEffect(() => {
    goToLastMessage();
  }, [messages]);

  return (
    <ChatWrapper className="relative">
      <div className="h-full flex-1 min-h-0 overflow-y-auto overflow-scroll no-scrollbar pt-10">
        {messages.map((message, index) => {
          return (
            <MessageBox key={`${message.id}-${index}`} message={message} />
          );
        })}
        <div ref={messagesEndRef} className="pb-10" />
      </div>
    </ChatWrapper>
  );
}
