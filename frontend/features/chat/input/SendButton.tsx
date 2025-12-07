import SendSVG from "@/components/svg/SendSVG";

import { SEND_SIZE } from "@/utils/globals";
import { MESSAGE_STATUSES } from "../../../../shared/statuses";

interface SendButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  onSendClick: () => void;
  status: string | undefined;
}

export default function SendButton({ onSendClick, status }: SendButtonProps) {
  const isDisabled =
    status === MESSAGE_STATUSES.PENDING ||
    status === MESSAGE_STATUSES.IN_TRANSIT;

  return (
    <button
      className="absolute right-0 bottom-0 flex cursor-pointer items-center justify-center rounded-[50%] bg-white p-3 outline-none hover:opacity-80"
      style={{
        width: `${SEND_SIZE}px`,
        height: `${SEND_SIZE}px`,
        cursor: `${isDisabled ? "default" : "pointer"}`,
        opacity: `${isDisabled ? "30%" : "100%"}`,
      }}
      onClick={onSendClick}
      disabled={isDisabled}
    >
      <SendSVG />
    </button>
  );
}
