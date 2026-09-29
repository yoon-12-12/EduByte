import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  Trophy,
  Medal,
  Star,
  Flame,
  Crown,
  ShieldCheck,
  Target,
  Award,
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

interface BadgeItem {
  name: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
}

const cardClass = `
  bg-white
  dark:bg-slate-900

  text-slate-900
  dark:text-slate-100

  border
  border-slate-200
  dark:border-slate-700

  rounded-xl
  shadow-sm
`;

export default function Badges() {

  const results: QuizResult[] =
    getQuizResults();

  const totalXP =
    getTotalXP();

  const level =
    getLevel();

  const solvedWrongCount =
    getSolvedWrongCount();

  const perfectCount =
    results.filter(
      (item) =>
        (item.percentage ?? 0) === 100
    ).length;

  const totalAttempts =
    results.length;

  const badges: BadgeItem[] = [

    /* =========================
       레벨 배지
    ========================= */

    {
      name: "Beginner",
      description:
        "레벨 2 달성",
      icon: Trophy,
      unlocked:
        level >= 2,
    },

    {
      name: "Intermediate",
      description:
        "레벨 5 달성",
      icon: Medal,
      unlocked:
        level >= 5,
    },

    {
      name: "Advanced",
      description:
        "레벨 10 달성",
      icon: Star,
      unlocked:
        level >= 10,
    },

    {
      name: "Expert",
      description:
        "레벨 20 달성",
      icon: Flame,
      unlocked:
        level >= 20,
    },

    {
      name: "Master",
      description:
        "레벨 50 달성",
      icon: Crown,
      unlocked:
        level >= 50,
    },
        /* =========================
       학습 배지
    ========================= */

    {
      name: "첫 시험",
      description:
        "첫 모의고사 완료",
      icon: Trophy,
      unlocked:
        totalAttempts >= 1,
    },

    {
      name: "꾸준한 학습자",
      description:
        "시험 10회 응시",
      icon: Medal,
      unlocked:
        totalAttempts >= 10,
    },

    {
      name: "시험 마스터",
      description:
        "시험 30회 응시",
      icon: Award,
      unlocked:
        totalAttempts >= 30,
    },

    {
      name: "XP 1000",
      description:
        "누적 XP 1000 달성",
      icon: Star,
      unlocked:
        totalXP >= 1000,
    },

    {
      name: "XP 5000",
      description:
        "누적 XP 5000 달성",
      icon: Flame,
      unlocked:
        totalXP >= 5000,
    },

    /* =========================
       오답 복습 배지
    ========================= */

    {
      name: "오답 복습가",
      description:
        "오답 10개 해결",
      icon: ShieldCheck,
      unlocked:
        solvedWrongCount >= 10,
    },

    {
      name: "오답 마스터",
      description:
        "오답 50개 해결",
      icon: ShieldCheck,
      unlocked:
        solvedWrongCount >= 50,
    },

    /* =========================
       연속 정답 배지
    ========================= */

    {
      name: "완벽한 한 번",
      description:
        "100점 시험 1회",
      icon: Target,
      unlocked:
        perfectCount >= 1,
    },

    {
      name: "연속 정답왕",
      description:
        "100점 시험 3회",
      icon: Target,
      unlocked:
        perfectCount >= 3,
    },

    {
      name: "무결점 학습자",
      description:
        "100점 시험 10회",
      icon: Crown,
      unlocked:
        perfectCount >= 10,
    },

  ];

  const unlockedCount =
    badges.filter(
      (badge) =>
        badge.unlocked
    ).length;

  const completionRate =
    Math.round(
      (unlockedCount /
        badges.length) *
        100
    );
      return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="배지"
          description="학습 성과와 달성 현황을 확인하세요."
        />

        {/* 획득 현황 */}

        <div
          className={`${cardClass} p-6`}
        >
          <h2
            className="
              text-xl
              font-bold
            "
          >
            배지 획득 현황
          </h2>

          <p
            className="
              mt-2
              text-slate-500
              dark:text-slate-400
            "
          >
            {unlockedCount}
            /
            {badges.length}
            개 획득
          </p>

          <div
            className="
              mt-4
              h-3
              rounded-full

              bg-slate-200
              dark:bg-slate-700
            "
          >
            <div
              className="
                h-3
                rounded-full

                bg-blue-600

                transition-all
                duration-500
              "
              style={{
                width: `${completionRate}%`,
              }}
            />
          </div>

          <p
            className="
              mt-2
              text-sm

              text-slate-500
              dark:text-slate-400
            "
          >
            달성률 {completionRate}%
          </p>
        </div>

        {/* 요약 통계 */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >

          <div
            className={`${cardClass} p-5`}
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              현재 레벨
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2

                text-orange-500
              "
            >
              Lv.{level}
            </p>
          </div>

          <div
            className={`${cardClass} p-5`}
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              누적 XP
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2

                text-blue-600
              "
            >
              {totalXP}
            </p>
          </div>

          <div
            className={`${cardClass} p-5`}
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              오답 해결
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2

                text-green-600
              "
            >
              {solvedWrongCount}
            </p>
          </div>

          <div
            className={`${cardClass} p-5`}
          >
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              100점 시험
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2

                text-purple-600
              "
            >
              {perfectCount}
            </p>
          </div>

        </div>
                {/* 배지 목록 */}

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {badges.map((badge) => {

            const Icon =
              badge.icon;

            return (

              <div
                key={badge.name}
                className={`
                  rounded-xl
                  border
                  p-6

                  transition-all
                  duration-300

                  hover:-translate-y-1

                  ${
                    badge.unlocked
                      ? `
                        bg-yellow-50
                        dark:bg-yellow-900/20

                        border-yellow-300
                        dark:border-yellow-700
                      `
                      : `
                        bg-white
                        dark:bg-slate-900

                        border-slate-200
                        dark:border-slate-700
                      `
                  }
                `}
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <div
                    className={`
                      p-3
                      rounded-xl

                      ${
                        badge.unlocked
                          ? `
                            bg-yellow-200
                            dark:bg-yellow-800
                          `
                          : `
                            bg-slate-200
                            dark:bg-slate-800
                          `
                      }
                    `}
                  >
                    <Icon size={36} />
                  </div>

                  <div>

                    <h3
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      {badge.name}
                    </h3>

                    <p
                      className="
                        text-sm

                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      {badge.description}
                    </p>

                  </div>

                </div>

                <div className="mt-5">

                  <span
                    className={`
                      px-3
                      py-1

                      rounded-full

                      text-sm
                      font-medium

                      ${
                        badge.unlocked
                          ? `
                            bg-green-100
                            text-green-700

                            dark:bg-green-900/30
                            dark:text-green-300
                          `
                          : `
                            bg-slate-200
                            text-slate-600

                            dark:bg-slate-800
                            dark:text-slate-400
                          `
                      }
                    `}
                  >
                    {badge.unlocked
                      ? "획득 완료"
                      : "미획득"}
                  </span>

                </div>

              </div>

            );
          })}

        </div>

      </div>
    </MainLayout>
  );
}