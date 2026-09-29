import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  getQuizResults,
  getTotalXP,
  getLevel,
  getOverallAverage,
  type QuizResult,
} from "../../utils/quizStorage";

import {
  getWrongAnswers,
  type WrongAnswer,
} from "../../utils/wrongAnswerStorage";

import { exams } from "../../data/exams";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import {
  getCurrentStreak,
  getBestStreak,
  getStudyHistory,
} from "../../utils/studyHistoryStorage";

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
  p-6
`;

const chartColors = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
];

export default function Dashboard() {
  const results: QuizResult[] =
    getQuizResults();

  const wrongAnswers: WrongAnswer[] =
    getWrongAnswers();

  const totalXP =
    getTotalXP();

  const level =
    getLevel();

  const averageScore =
    getOverallAverage();

  const totalAttempts =
    results.length;

  const totalSolved =
    results.reduce(
      (
        sum,
        item
      ) => sum + item.total,
      0
    );

  const highestScore =
    results.length > 0
      ? Math.max(
          ...results.map(
            (
              item
            ) =>
              Math.round(
                (item.score /
                  item.total) *
                  100
              )
          )
        )
      : 0;

  const currentXP =
    totalXP % 500;

  const progress =
    (currentXP / 500) * 100;

  let badge =
    "🌱 Beginner";

  if (level >= 5)
    badge = "🎯 Learner";

  if (level >= 10)
    badge = "🔥 Advanced";

  if (level >= 15)
    badge = "🏆 Expert";

  if (level >= 20)
    badge = "👑 Master";

  const latestResult =
    results.length > 0
      ? results[
          results.length - 1
        ]
      : null;

  const totalWrongCount =
    wrongAnswers.length;

  const topWrongQuestions =
    [...wrongAnswers]
      .sort(
        (a, b) =>
          b.wrongCount -
          a.wrongCount
      )
      .slice(0, 5);

  const recentChartData =
    results
      .slice(-10)
      .map(
        (
          item,
          index
        ) => ({
          attempt:
            index + 1,

          score:
            Math.round(
              (item.score /
                item.total) *
                100
            ),
        })
      );

  const examStats =
    exams.map(
      (exam) => ({
        id: exam.id,

        name: exam.name,

        attempts:
          results.filter(
            (
              result
            ) =>
              result.examId ===
              exam.id
          ).length,
      })
    );

  const mostPlayedExam =
    [...examStats].sort(
      (a, b) =>
        b.attempts -
        a.attempts
    )[0];

  /* =======================
     추가 성장 통계
  ======================= */

  const totalCorrect =
    results.reduce(
      (
        sum,
        item
      ) => sum + item.score,
      0
    );

  const totalWrong =
    results.reduce(
      (
        sum,
        item
      ) =>
        sum +
        (
          item.total -
          item.score
        ),
      0
    );

  const overallAccuracy =
    totalSolved > 0
      ? Math.round(
          (
            totalCorrect /
            totalSolved
          ) * 100
        )
      : 0;

  const passCount =
    results.filter(
      (
        item
      ) =>
        Math.round(
          (
            item.score /
            item.total
          ) * 100
        ) >= 60
    ).length;

  const passRate =
    totalAttempts > 0
      ? Math.round(
          (
            passCount /
            totalAttempts
          ) * 100
        )
      : 0;

  const recentFive =
    results.slice(-5);

  const recentAverage =
    recentFive.length > 0
      ? Math.round(
          recentFive.reduce(
            (
              sum,
              item
            ) =>
              sum +
              Math.round(
                (
                  item.score /
                  item.total
                ) * 100
              ),
            0
          ) /
            recentFive.length
        )
      : 0;
        const examAccuracyData =
    exams.map((exam) => {
      const examResults =
        results.filter(
          (result) =>
            result.examId ===
            exam.id
        );

      const average =
        examResults.length > 0
          ? Math.round(
              examResults.reduce(
                (
                  sum,
                  item
                ) =>
                  sum +
                  Math.round(
                    (
                      item.score /
                      item.total
                    ) *
                      100
                  ),
                0
              ) /
                examResults.length
            )
          : 0;

      return {
        name: exam.name,
        accuracy: average,
      };
    });

    const currentStreak =
      getCurrentStreak();

    const bestStreak =
      getBestStreak();

    const studyHistory =
      getStudyHistory();

    const totalStudyDays =
      studyHistory.length;

    const totalReviews =
      studyHistory.reduce(
        (sum, item) =>
          sum + item.reviewCount,
        0
      );

  const pieData =
    examStats.filter(
      (item) =>
        item.attempts > 0
    );

  const levelHistory =
    results
      .slice(-15)
      .map(
        (
          item,
          index
        ) => ({
          attempt:
            index + 1,

          score:
            Math.round(
              (
                item.score /
                item.total
              ) *
                100
            ),
        })
      );

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="학습 통계"
          description="학습 현황 및 성과 분석"
        />

        {/* 레벨 / XP 영역 */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >
          <div className={cardClass}>
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              현재 레벨
            </h3>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              Lv.{level}
            </p>
          </div>

          <div className={cardClass}>
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              누적 XP
            </h3>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {totalXP}
            </p>
          </div>

          <div className={cardClass}>
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              학습 등급
            </h3>

            <p
              className="
                text-xl
                font-bold
                mt-2
              "
            >
              {badge}
            </p>
          </div>

          <div className={cardClass}>
            <h3
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              다음 레벨 진행률
            </h3>

            <div
              className="
                w-full
                bg-slate-200
                dark:bg-slate-700
                rounded-full
                h-3
                mt-4
              "
            >
              <div
                className="
                  bg-blue-600
                  h-3
                  rounded-full
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-2
              "
            >
              {currentXP}/500 XP
            </p>
          </div>
        </div>

        {/* 핵심 통계 */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >
          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              총 응시 횟수
            </h3>

            <p className="text-3xl font-bold mt-2">
              {totalAttempts}
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              평균 점수
            </h3>

            <p className="text-3xl font-bold mt-2">
              {averageScore}%
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              최고 점수
            </h3>

            <p className="text-3xl font-bold mt-2">
              {highestScore}%
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              저장된 오답
            </h3>

            <p className="text-3xl font-bold mt-2 text-red-500">
              {totalWrongCount}
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              현재 스트릭 (연속 학습일)
            </h3>

            <p className="text-3xl font-bold mt-2 text-orange-500">
              {currentStreak}일
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              최고 스트릭
            </h3>

            <p className="text-3xl font-bold mt-2 text-red-500">
              {bestStreak}일
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              누적 학습일
            </h3>

            <p className="text-3xl font-bold mt-2 text-green-600">
              {totalStudyDays}일
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              총 복습 횟수
            </h3>

            <p className="text-3xl font-bold mt-2 text-blue-600">
              {totalReviews}
            </p>
          </div>
        </div>

        {/* 추가 성장 통계 */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >
          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              전체 정답률
            </h3>

            <p className="text-3xl font-bold mt-2 text-green-600">
              {overallAccuracy}%
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              합격률
            </h3>

            <p className="text-3xl font-bold mt-2 text-blue-600">
              {passRate}%
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              최근 5회 평균
            </h3>

            <p className="text-3xl font-bold mt-2">
              {recentAverage}%
            </p>
          </div>

          <div className={cardClass}>
            <h3 className="text-slate-500 dark:text-slate-400">
              정답 / 오답
            </h3>

            <p className="font-bold mt-2">
              {totalCorrect} / {totalWrong}
            </p>
          </div>
        </div>
                {/* 최근 점수 추이 */}

        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-4">
            최근 점수 추이
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={recentChartData}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="attempt" />

                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#60a5fa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 시험별 응시 횟수 */}

        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-4">
            시험별 응시 횟수
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={examStats}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="attempts"
                  fill="#2563eb"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 시험별 평균 정답률 */}

        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-4">
            시험별 평균 정답률
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={examAccuracyData}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="accuracy"
                  fill="#16a34a"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 시험 응시 비율 */}

        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-4">
            시험 응시 비율
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="attempts"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {pieData.map(
                    (
                      _entry,
                      index
                    ) => (
                      <Cell
                        key={index}
                        fill={
                          chartColors[
                            index %
                              chartColors.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 학습 성장 추세 */}

        <div className={cardClass}>
          <h2 className="text-xl font-semibold mb-4">
            학습 성장 추세
          </h2>

          <div className="h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={levelHistory}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="attempt" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
                {/* 최근 결과 + 오답 위험도 */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-4
          "
        >
          <div className={cardClass}>
            <h2 className="text-xl font-semibold mb-4">
              최근 응시 결과
            </h2>

            {latestResult ? (
              <div className="space-y-3">
                <p>
                  시험 :
                  {" "}
                  {
                    exams.find(
                      (e) =>
                        e.id ===
                        latestResult.examId
                    )?.name
                  }
                </p>

                <p>
                  점수 :
                  {" "}
                  {latestResult.score}
                  /
                  {latestResult.total}
                </p>

                <p
                  className="
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  응시일 :
                  {" "}
                  {new Date(
                    latestResult.date
                  ).toLocaleString()}
                </p>

                {"xpEarned" in latestResult && (
                  <p
                    className="
                      text-green-600
                      dark:text-green-400
                      font-semibold
                    "
                  >
                    획득 XP :
                    {" "}
                    {latestResult.xpEarned}
                  </p>
                )}
              </div>
            ) : (
              <p
                className="
                  text-slate-500
                  dark:text-slate-400
                "
              >
                아직 응시 기록이 없습니다.
              </p>
            )}
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold mb-4">
              오답 위험도 TOP 5
            </h2>

            <div className="space-y-3">
              {topWrongQuestions.length === 0 ? (
                <p
                  className="
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  저장된 오답이 없습니다.
                </p>
              ) : (
                topWrongQuestions.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={index}
                      className="
                        border
                        border-slate-200
                        dark:border-slate-700

                        rounded-lg
                        p-3
                      "
                    >
                      <p className="font-medium">
                        {item.question}
                      </p>

                      <p className="text-red-500 text-sm mt-1">
                        틀린 횟수 :
                        {" "}
                        {item.wrongCount}
                        회
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          dark:text-slate-400
                          mt-1
                        "
                      >
                        최근 오답 :
                        {" "}
                        {new Date(
                          item.lastWrongDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* 추가 통계 */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-4
          "
        >
          <div className={cardClass}>
            <h2 className="text-xl font-semibold mb-4">
              학습 요약
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between">
                <span>
                  총 풀이 문제
                </span>

                <span className="font-semibold">
                  {totalSolved}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  총 응시 횟수
                </span>

                <span className="font-semibold">
                  {totalAttempts}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  평균 정답률
                </span>

                <span className="font-semibold">
                  {averageScore}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  전체 정답률
                </span>

                <span className="font-semibold text-green-600">
                  {overallAccuracy}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  합격률
                </span>

                <span className="font-semibold text-blue-600">
                  {passRate}%
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  누적 XP
                </span>

                <span className="font-semibold text-indigo-600">
                  {totalXP}
                </span>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-semibold mb-4">
              가장 많이 응시한 시험
            </h2>

            {mostPlayedExam &&
            mostPlayedExam.attempts > 0 ? (
              <div className="space-y-3">
                <p className="text-2xl font-bold">
                  {mostPlayedExam.name}
                </p>

                <p
                  className="
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  응시 횟수 :
                  {" "}
                  {mostPlayedExam.attempts}
                  회
                </p>

                <p
                  className="
                    text-green-600
                    dark:text-green-400
                    font-medium
                  "
                >
                  가장 활발하게 학습 중인 시험입니다.
                </p>
              </div>
            ) : (
              <p
                className="
                  text-slate-500
                  dark:text-slate-400
                "
              >
                아직 응시 기록이 없습니다.
              </p>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}