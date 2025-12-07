import { cn } from "@/utils/utils";

export default function ChatWrapper({
  children,
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      {children}
    </div>
  );
}
