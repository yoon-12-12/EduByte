import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        dark:bg-slate-900

        text-slate-900
        dark:text-slate-100

        border
        border-slate-200
        dark:border-slate-700

        rounded-xl
        shadow-sm
        p-6

        transition-colors
        duration-300

        ${className}
      `}
    >
      {children}
    </div>
  );
}