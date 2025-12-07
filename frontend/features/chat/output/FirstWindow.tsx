import OptionButton from "../input/OptionButton";
import ChatWrapper from "./ChatWrapper";

interface FirstWindowProps extends React.ComponentPropsWithoutRef<"div"> {
  onSend: (message: string) => void;
}

const optionMessages = [
  "What's the weather like in Genova?",
  "Do I need an umbrella in Milan?",
  "Weather this weekend in Rome",
  "Today's temperature in Bologna",
];

export default function FirstWindow({ onSend }: FirstWindowProps) {
  return (
    <ChatWrapper className="items-center justify-center gap-8 ">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-center text-4xl font-bold text-[#eeeeee]">How can i help you today?</h1>
        <h5 className="text-center font-bold text-[#999999]">Your personal assistant for real-time weather updates and forecasts</h5>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {optionMessages.map((message, index) => (
          <OptionButton key={index} message={message} onSend={onSend} />
        ))}
      </div>
    </ChatWrapper>
  );
}
