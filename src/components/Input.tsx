import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  extraClassName?: string;
};

export default function Input({ extraClassName, ...props }: Props) {
  return (
    <input
      {...props}
      className={twMerge([
        "border-2 border-white rounded-md bg-transparent outline-none p-2 w-42",
        extraClassName,
      ])}
    />
  );
}
