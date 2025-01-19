import { ButtonProps } from "../constant/buttonProps";
import clsx from "clsx";

export function Button({ content, onClick, className }: ButtonProps) {
  return (
    <div
      className={clsx(
        "bg-[var(--color-primary)] flex items-center gap-2 py-3 px-10 text-[var(--text-color-button)] rounded-full uppercase font-semibold text-sm font-[mulish] cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {content}
    </div>
  );
}
