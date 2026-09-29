import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: Props) {
  return (
    <div
      className="
        flex
        min-h-screen

        bg-slate-50
        text-slate-900

        dark:bg-slate-950
        dark:text-slate-100

        transition-colors
        duration-300
      "
    >
      <div className="shrink-0">
        <Sidebar />
      </div>

      <div
        className="
          flex-1
          flex
          flex-col

          min-w-0
        "
      >
        <Header />

        <main
          className="
            flex-1
            overflow-y-auto

            p-6
            lg:p-8

            transition-colors
            duration-300
          "
        >
          <div
            className="
              max-w-7xl
              mx-auto
            "
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}