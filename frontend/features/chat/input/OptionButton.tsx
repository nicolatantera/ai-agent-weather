interface OptionButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  message: string;
  onSend: (message: string) => void;
}

export default function OptionButton({ message, onSend }: OptionButtonProps) {
  return (
    <button
      className="min-w-70 cursor-pointer rounded-4xl bg-[#555555] px-5 py-3 text-sm font-bold text-[#cccccc] hover:bg-[#3f3f3f]"
      onClick={() => onSend(message)}
    >
      {message}
    </button>
  );
}
