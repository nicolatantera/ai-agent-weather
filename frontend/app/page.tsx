import Chat from "@/features/chat/Chat";

import { WRAPPER_WIDTH, WRAPPER_MAX_WIDTH } from "@/utils/globals";

export default function Home() {
  return (
    <div
      className="m-auto justify-self-center"
      style={{
        width: `${WRAPPER_WIDTH}`,
        height: "100%",
        maxWidth: `${WRAPPER_MAX_WIDTH}px`,
      }}
    >
      {/* display the title */}
      <div className="absolute top-6 left-8 z-999 rounded-3xl px-3 py-2 uppercase backdrop-blur-sm select-none">ai weather</div>
      <Chat /> {/* display the Chat */}
    </div>
  );
}
