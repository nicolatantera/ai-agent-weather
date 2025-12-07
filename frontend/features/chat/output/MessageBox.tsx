import { cn } from "@/utils/utils";
import { MESSAGE_STATUSES } from "../../../../shared/statuses";

import Markdown from "react-markdown";
import { Message } from "@/utils/chat";
import LoadingResponseSVG from "@/components/svg/LoadingResponseSVG";

interface MessageBoxProps extends React.ComponentPropsWithoutRef<"div"> {
  message: Message;
}

export default function MessageBox({ className, message, ...rest }: MessageBoxProps) {
  const isAgent = message.role === "agent";
  const isPending = message.status === MESSAGE_STATUSES.PENDING;
  const isSuccess = message.status === MESSAGE_STATUSES.SUCCESS;
  const isInTransit = message.status === MESSAGE_STATUSES.IN_TRANSIT;
  const isError = message.status === MESSAGE_STATUSES.ERROR;

  //console.log("status: ", message);

  return (
    <>
      <div
        className={cn("flex h-fit min-h-10 w-fit flex-col justify-center rounded-xl px-4 py-2 wrap-break-word", className)}
        style={{
          maxWidth: `${!isAgent ? "65%" : "100%"}`,
          marginLeft: `${!isAgent && "auto"}`,
          backgroundColor: `${isAgent ? (!isError ? "#262525" : "rgba(120, 0, 0, 0.4)") : "#1f1b1b"}`,
          marginBottom: `${!isAgent && "24px"}`,
        }}
        {...rest}
      >
        {isPending && <LoadingResponseSVG />}
        {(isInTransit || isSuccess || isError) && <Markdown>{message.msg}</Markdown>}
      </div>
      {isAgent && <hr className="mt-5 mb-10 text-[#666666]" />}
    </>
  );
}
