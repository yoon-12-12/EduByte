import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-blue-600
        hover:bg-blue-700

        dark:bg-blue-500
        dark:hover:bg-blue-600

        text-white

        px-4
        py-2

        rounded-lg

        font-medium

        transition-all
        duration-200

        cursor-pointer

        disabled:opacity-50
        disabled:cursor-not-allowed

        ${className}
      `}
    >
      {children}
    </button>
  );
}