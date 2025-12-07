import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// merge the className values inside components so that they are not repeated in case they are written in their parent as well
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
