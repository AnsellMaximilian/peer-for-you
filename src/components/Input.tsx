import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ ...props }: Props) {
  return (
    <input
      {...props}
      className="border-2 border-white rounded-md bg-transparent outline-none p-2 w-42"
    />
  );
}
