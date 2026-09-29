import { Link } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";

import {
  getQuizResults,
  getTotalXP,
  getLevel,
  getOverallAverage,
  type QuizResult,
} from "../../utils/quizStorage";

import {
  getWrongAnswers,
} from "../../utils/wrongAnswerStorage";

import { exams } from "../../data/exams";

export default function Home() {
  const results: QuizResult[] =
    getQuizResults();

  const wrongAnswers =
    getWrongAnswers();

  const totalXP =
    getTotalXP();

  const level =
    getLevel();

  const averageScore =
    getOverallAverage();

  const totalSolved =
    results.reduce(
      (
        sum: number,
        item: QuizResult
      ) => sum + item.total,
      0
    );

  const currentXP =
    totalXP % 500;

  const nextLevelXP = 500;

  const progress =
    (currentXP / nextLevelXP) *
    100;

  const highestScore =
    results.length > 0
      ? Math.max(
          ...results.map(
            (
              item: QuizResult
            ) =>
              Math.round(
                (item.score /
                  item.total) *
                  100
              )
          )
        )
      : 0;

  const badge =
    level >= 20
      ? "👑 Master"
      : level >= 15
      ? "🏆 Expert"
      : level >= 10
      ? "🔥 Advanced"
      : level >= 5
      ? "🎯 Learner"
      : "🌱 Beginner";

  const latestResults =
    [...results]
      .reverse()
      .slice(0, 5);

  const recommendedExam =
    exams.find(
      (
        exam
      ) =>
        !results.some(
          (
            result
          ) =>
            result.examId ===
            exam.id
        )
    ) ?? exams[0];

  return (
    <MainLayout>
      <div className="space-y-8">

        {/* 헤더 */}

        <div>
          <h1
            className="
              text-4xl
              font-bold
            "
          >
            EduByte 👋
          </h1>

          <p
            className="
              mt-2

              text-slate-500
              dark:text-slate-400
            "
          >
            스마트 자격증 학습 플랫폼
          </p>
        </div>

        {/* 레벨 카드 */}

        <div
          className="
            rounded-2xl
            p-6

            bg-gradient-to-r
            from-blue-600
            to-indigo-600

            text-white
            shadow-lg
          "
        >
          <h2
            className="
              text-xl
              font-bold
            "
          >
            현재 학습 레벨
          </h2>

          <p
            className="
              text-5xl
              font-bold
              mt-2
            "
          >
            Lv.{level}
          </p>

          <p className="mt-2 text-lg">
            {badge}
          </p>

          <p className="mt-2">
            누적 XP {totalXP}
          </p>

          <div className="mt-5">

            <div
              className="
                flex
                justify-between

                text-sm
                mb-2
              "
            >
              <span>
                다음 레벨 진행률
              </span>

              <span>
                {currentXP}
                /
                {nextLevelXP}
              </span>
            </div>

            <div
              className="
                h-3
                rounded-full
                bg-white/20
              "
            >
              <div
                className="
                  h-3
                  rounded-full
                  bg-white

                  transition-all
                  duration-500
                "
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </div>

          </div>
        </div>

        {/* 핵심 통계 */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-6
          "
        >
          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              shadow-sm
              p-6
            "
          >
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              저장 오답
            </h3>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {wrongAnswers.length}
            </p>
          </div>

          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              shadow-sm
              p-6
            "
          >
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              풀이 문제
            </h3>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {totalSolved}
            </p>
          </div>

          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              shadow-sm
              p-6
            "
          >
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              평균 정답률
            </h3>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {averageScore}%
            </p>
          </div>

          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              shadow-sm
              p-6
            "
          >
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              최고 점수
            </h3>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {highestScore}%
            </p>
          </div>
        </div>
                {/* 최근 학습 + 추천 시험 */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-6
          "
        >

          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              shadow-sm
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-semibold
                mb-4
              "
            >
              최근 학습 기록
            </h2>

            {latestResults.length ===
            0 ? (
              <p
                className="
                  text-slate-500
                  dark:text-slate-400
                "
              >
                아직 시험 기록이
                없습니다.
              </p>
            ) : (
              <ul className="space-y-3">
                {latestResults.map(
                  (
                    item,
                    index
                  ) => (
                    <li
                      key={index}
                      className="
                        flex
                        justify-between
                        items-center

                        border-b
                        border-slate-200
                        dark:border-slate-700

                        pb-3
                      "
                    >
                      <div>
                        <p className="font-medium">
                          {exams.find(
                            (
                              e
                            ) =>
                              e.id ===
                              item.examId
                          )?.name ??
                            `시험 ${item.examId}`}
                        </p>

                        <p
                          className="
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {new Date(
                            item.date
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      <span
                        className="
                          font-bold
                          text-blue-600
                        "
                      >
                        {Math.round(
                          (item.score /
                            item.total) *
                            100
                        )}
                        %
                      </span>
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              shadow-sm
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-semibold
                mb-4
              "
            >
              추천 학습
            </h2>

            <div
              className="
                p-4
                rounded-xl

                bg-blue-50
                dark:bg-blue-950/30

                border
                border-blue-200
                dark:border-blue-800
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                다음 추천 시험
              </p>

              <h3
                className="
                  text-xl
                  font-bold
                  mt-2
                "
              >
                {
                  recommendedExam.name
                }
              </h3>

              <p
                className="
                  mt-2

                  text-slate-600
                  dark:text-slate-300
                "
              >
                {
                  recommendedExam.description
                }
              </p>

              <Link
                to={`/exam/${recommendedExam.id}`}
                className="
                  inline-block
                  mt-4

                  px-4
                  py-2

                  rounded-lg

                  bg-blue-600
                  hover:bg-blue-700

                  text-white

                  transition
                "
              >
                바로 학습하기 →
              </Link>
            </div>
          </div>

        </div>

        {/* 오늘의 목표 */}

        <div
          className="
            bg-white
            dark:bg-slate-900

            rounded-xl
            shadow-sm
            p-6
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              mb-4
            "
          >
            오늘의 목표
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-4
            "
          >
            <div
              className="
                p-4
                rounded-xl

                bg-slate-50
                dark:bg-slate-800
              "
            >
              📚 오답 5문제 복습
            </div>

            <div
              className="
                p-4
                rounded-xl

                bg-slate-50
                dark:bg-slate-800
              "
            >
              📝 모의고사 1회 응시
            </div>

            <div
              className="
                p-4
                rounded-xl

                bg-slate-50
                dark:bg-slate-800
              "
            >
              🎯 평균 정답률 80% 이상
            </div>

            <div
              className="
                p-4
                rounded-xl

                bg-slate-50
                dark:bg-slate-800
              "
            >
              ⚡ XP 100 획득
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}