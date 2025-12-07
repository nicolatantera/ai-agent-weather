"use client";

import { useEffect, useRef } from "react";

import { TEXTAREA_MIN_HEIGHT, LINE_HEIGHT, TEXTAREA_MAX_HEIGHT, SEND_SIZE } from "@/utils/globals";

interface TextAreaProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  onTextChange: (message: string) => void;
  onSendClick: () => void;
}

export default function TextArea({ value, onTextChange, onSendClick }: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // When the user writes a longer text, the input area increases (kind of like ChatGPT)
    function adjustTextAreaHeight() {
      const textArea = textAreaRef.current;
      if (!textArea) return;

      // Reset to min height to shrink when text is deleted
      textArea.style.height = `${TEXTAREA_MIN_HEIGHT}px`;

      // Calculate the content height in terms of lines
      let lines;
      if (textArea.scrollHeight === TEXTAREA_MIN_HEIGHT) {
        lines = Math.floor(textArea.scrollHeight / LINE_HEIGHT);
      } else {
        lines = Math.ceil(textArea.scrollHeight / LINE_HEIGHT);
      }

      // New height = lines * lineHeight + padding
      let newHeight = lines * LINE_HEIGHT;

      // Clamp to max height if needed
      newHeight = Math.min(newHeight, TEXTAREA_MAX_HEIGHT);

      textArea.style.height = `${newHeight}px`;
    }

    adjustTextAreaHeight();
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim().length > 0) {
        onSendClick();
      }
    }
  }

  return (
    <div
      className="relative"
      style={{
        width: `calc(100% - ${SEND_SIZE}px - 1rem)`,
      }}
    >
      <textarea
        id="textarea-input"
        ref={textAreaRef}
        placeholder="Type your message..."
        rows={1}
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)}
        className="no-scrollbar absolute bottom-0 h-full w-full origin-bottom resize-none rounded-4xl bg-[#444444] px-6 outline-none"
        style={{
          paddingTop: `calc(${TEXTAREA_MIN_HEIGHT}px / 2 - 12px)`,
          minHeight: `${TEXTAREA_MIN_HEIGHT}px`,
          maxHeight: `${TEXTAREA_MAX_HEIGHT}px`,
          lineHeight: `${LINE_HEIGHT}px`,
        }}
      />
    </div>
  );
}
