import { useEffect, useState } from "react";

import {
  Moon,
  Sun,
  Trophy,
  Medal,
  Flame,
} from "lucide-react";

import {
  getQuizResults,
  getLevel,
  getTotalXP,
  type QuizResult,
} from "../../utils/quizStorage";

import {
  getSolvedWrongCount,
} from "../../utils/wrongAnswerStorage";

export default function Header() {
  const [darkMode, setDarkMode] =
    useState(false);

  const results: QuizResult[] =
    getQuizResults();

  const totalXP =
    getTotalXP();

  const level =
    getLevel();

  const currentXP =
    totalXP % 500;

  const nextLevelXP = 500;

  const progress =
    (currentXP / nextLevelXP) * 100;

  const solvedWrongCount =
    getSolvedWrongCount();

  const totalAttempts =
    results.length;

  const perfectCount =
    results.filter(
      (item) =>
        (item.percentage ?? 0) === 100
    ).length;

  const badgeCount = [
    level >= 2,
    level >= 5,
    level >= 10,
    level >= 20,
    level >= 50,

    totalAttempts >= 1,
    totalAttempts >= 10,
    totalAttempts >= 30,

    totalXP >= 1000,
    totalXP >= 5000,

    solvedWrongCount >= 10,
    solvedWrongCount >= 50,

    perfectCount >= 1,
    perfectCount >= 3,
    perfectCount >= 10,
  ].filter(Boolean).length;

  useEffect(() => {
    const syncTheme = () => {
      const saved =
        localStorage.getItem(
          "edubyte_darkmode"
        );

      const isDark =
        saved === "true";

      setDarkMode(isDark);

      if (isDark) {
        document.documentElement.classList.add(
          "dark"
        );
      } else {
        document.documentElement.classList.remove(
          "dark"
        );
      }
    };

    syncTheme();

    window.addEventListener(
      "darkmode-change",
      syncTheme
    );

    return () => {
      window.removeEventListener(
        "darkmode-change",
        syncTheme
      );
    };
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;

    setDarkMode(next);

    localStorage.setItem(
      "edubyte_darkmode",
      String(next)
    );

    if (next) {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }

    window.dispatchEvent(
      new Event("darkmode-change")
    );
  };

  return (
    <header
      className="
        bg-white
        dark:bg-slate-900

        border-b
        border-slate-200
        dark:border-slate-800

        px-6
        py-4

        flex
        items-center
        justify-between

        sticky
        top-0
        z-50

        transition-colors
        duration-300
      "
    >
      <div>
        <h2
          className="
            text-xl
            font-bold
          "
        >
          EduByte
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            dark:text-slate-400
          "
        >
          Smart Learning Platform
        </p>
      </div>

      <div
        className="
          flex
          items-center
          gap-6
        "
      >
        <div
          className="
            hidden
            md:flex

            items-center
            gap-3

            bg-orange-50
            dark:bg-orange-900/20

            px-3
            py-2
            rounded-xl

            transition-colors
          "
        >
          <Flame
            size={18}
            className="text-orange-500"
          />

          <div>
            <p
              className="
                text-xs
                text-gray-500
                dark:text-slate-400
              "
            >
              XP
            </p>

            <p className="font-semibold">
              {totalXP}
            </p>
          </div>
        </div>

        <div
          className="
            hidden
            md:flex

            items-center
            gap-3

            bg-blue-50
            dark:bg-blue-900/20

            px-3
            py-2
            rounded-xl

            transition-colors
          "
        >
          <Trophy
            size={18}
            className="text-blue-500"
          />

          <div>
            <p
              className="
                text-xs
                text-gray-500
                dark:text-slate-400
              "
            >
              Level
            </p>

            <p className="font-semibold">
              Lv.{level}
            </p>
          </div>
        </div>

        <div
          className="
            hidden
            md:flex

            items-center
            gap-3

            bg-yellow-50
            dark:bg-yellow-900/20

            px-3
            py-2
            rounded-xl

            transition-colors
          "
        >
          <Medal
            size={18}
            className="text-yellow-500"
          />

          <div>
            <p
              className="
                text-xs
                text-gray-500
                dark:text-slate-400
              "
            >
              Badge
            </p>

            <p className="font-semibold">
              {badgeCount}
            </p>
          </div>
        </div>

        <div
          className="
            hidden
            lg:flex
            flex-col
            w-48
          "
        >
          <div
            className="
              flex
              justify-between
              text-xs
              mb-1
            "
          >
            <span>
              Lv.{level}
            </span>

            <span>
              {currentXP}
              /
              {nextLevelXP}
            </span>
          </div>

          <div
            className="
              h-2
              bg-gray-200
              dark:bg-slate-700
              rounded-full
            "
          >
            <div
              className="
                h-2
                bg-blue-600
                rounded-full
                transition-all
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="
            p-2
            rounded-lg

            border
            border-slate-300
            dark:border-slate-700

            hover:bg-gray-100
            dark:hover:bg-slate-800

            transition
          "
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>
      </div>
    </header>
  );
}