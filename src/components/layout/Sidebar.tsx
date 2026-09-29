import { Link, useLocation } from "react-router-dom";

import {
  House,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart3,
  Trophy,
  Medal,
  Settings,
  Flame,
  TrendingUp,
  Target,
  Star,
  Calendar,
  ShoppingCart,
  Dice5,
} from "lucide-react";

import {
  getQuizResults,
  getTotalXP,
  getLevel,
  getOverallAverage,
  type QuizResult,
} from "../../utils/quizStorage";

const menuItems = [
  {
    name: "홈",
    path: "/",
    icon: House,
  },
  {
    name: "시험목록",
    path: "/exams",
    icon: BookOpen,
  },
  {
    name: "학습노트",
    path: "/notes",
    icon: FileText,
  },
  {
    name: "모의고사",
    path: "/quiz",
    icon: ClipboardList,
  },
  {
    name: "통계",
    path: "/dashboard",
    icon: BarChart3,
  },

  {
    name: "스트릭",
    path: "/streak",
    icon: Flame,
  },

  {
    name: "즐겨찾기",
    path: "/favorites",
    icon: Star,
  },

  {
    name: "약점 집중",
    path: "/weakness",
    icon: Target,
  },

  {
    name: "랜덤 시험",
    path: "/random-exam",
    icon: Dice5,
  },

  {
    name: "학습 캘린더",
    path: "/calendar",
    icon: Calendar,
  },

  {
    name: "XP 상점",
    path: "/xp-shop",
    icon: ShoppingCart,
  },

  {
    name: "랭킹",
    path: "/ranking",
    icon: Trophy,
  },
  {
    name: "배지",
    path: "/badges",
    icon: Medal,
  },
  {
    name: "설정",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const location = useLocation();

  const results: QuizResult[] =
    getQuizResults();

  const totalXP =
    getTotalXP();

  const level =
    getLevel();

  const averageScore =
    getOverallAverage();

  const totalAttempts =
    results.length;

  const currentXP =
    totalXP % 500;

  const progress =
    (currentXP / 500) * 100;

  let badge =
    "🌱 새싹";

  if (level >= 5)
    badge = "🎯 입문자";

  if (level >= 10)
    badge = "🔥 중급자";

  if (level >= 15)
    badge = "🏆 전문가";

  if (level >= 20)
    badge = "👑 마스터";

  return (
    <aside
      className="
        w-72
        min-h-screen
        shrink-0

        bg-white
        dark:bg-slate-900

        border-r
        border-slate-200
        dark:border-slate-800

        transition-colors
        duration-300
      "
    >
      <div
        className="
          p-6

          border-b
          border-slate-200
          dark:border-slate-800
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-blue-600
          "
        >
          EduByte
        </h1>

        <p
          className="
            mt-1
            text-sm

            text-slate-500
            dark:text-slate-400
          "
        >
          Smart Learning Platform
        </p>
      </div>

      <div className="p-4">

        <div
          className="
            mb-5

            rounded-2xl
            p-4

            bg-gradient-to-r
            from-blue-600
            to-indigo-600

            text-white

            shadow-lg
          "
        >
          <div className="flex items-center gap-2">
            <Flame size={18} />

            <span className="font-semibold">
              Level {level}
            </span>
          </div>

          <p className="mt-2 text-sm">
            누적 XP {totalXP}
          </p>

          <div
            className="
              mt-3

              h-2
              rounded-full

              bg-white/30
            "
          >
            <div
              className="
                h-2
                rounded-full

                bg-white

                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm">
            {currentXP}
            /500 XP
          </p>

          <p className="mt-2 text-sm">
            {badge}
          </p>
        </div>

        <div
          className="
            mb-5

            rounded-xl

            border
            border-slate-200
            dark:border-slate-800

            p-4

            bg-slate-50
            dark:bg-slate-800/50
          "
        >
          <h3
            className="
              font-semibold
              mb-4
            "
          >
            학습 현황
          </h3>

          <div className="space-y-4">

            <div className="flex items-center gap-3">
              <TrendingUp
                size={18}
                className="text-blue-500"
              />

              <div>
                <p className="text-xs text-slate-500">
                  평균 점수
                </p>

                <p className="font-semibold">
                  {averageScore}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target
                size={18}
                className="text-green-500"
              />

              <div>
                <p className="text-xs text-slate-500">
                  총 응시 횟수
                </p>

                <p className="font-semibold">
                  {totalAttempts}회
                </p>
              </div>
            </div>

          </div>
        </div>

        <nav>
          {menuItems.map((item) => {
            const Icon =
              item.icon;

            const active =
              location.pathname ===
              item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex
                  items-center
                  gap-3

                  p-3
                  mb-2

                  rounded-xl

                  transition-all
                  duration-200

                  ${
                    active
                      ? `
                        bg-blue-600
                        text-white
                        shadow-lg
                      `
                      : `
                        text-slate-700
                        dark:text-slate-300

                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                      `
                  }
                `}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}