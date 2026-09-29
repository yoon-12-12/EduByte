import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  getLevel,
  getTotalXP,
  getQuizResults,
} from "../../utils/quizStorage";

import {
  getTotalWrongCount,
  getSolvedWrongCount,
  getReviewSuccessRate,
  getTopDangerQuestions,
  getDangerScore,
} from "../../utils/wrongAnswerStorage";

import { exams } from "../../data/exams";

export default function Ranking() {

  const level =
    getLevel();

  const totalXP =
    getTotalXP();

  const nextLevelXP =
    level * 500;

  const currentLevelXP =
    totalXP -
    (level - 1) * 500;

  const remainXP =
    nextLevelXP -
    totalXP;

  const progress =
    Math.min(
      100,
      Math.round(
        (currentLevelXP / 500) *
          100
      )
    );

  const quizResults =
    getQuizResults();

  const totalAttempts =
    quizResults.length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          quizResults.reduce(
            (sum, item) =>
              sum +
              (item.percentage ??
                0),
            0
          ) /
            totalAttempts
        )
      : 0;

  const highestScore =
    totalAttempts > 0
      ? Math.max(
          ...quizResults.map(
            (item) =>
              item.percentage ??
              0
          )
        )
      : 0;

  const totalWrong =
    getTotalWrongCount();

  const solvedWrong =
    getSolvedWrongCount();

  const reviewRate =
    getReviewSuccessRate();

  const dangerQuestions =
    getTopDangerQuestions(
      5
    );

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
    return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="학습 랭킹"
          description="레벨 · XP · 복습 통계"
        />

        {/* 프로필 카드 */}

        <div className={cardClass}>

          <div
            className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-6
            "
          >

            <div>
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                현재 학습 레벨
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                Lv.{level}
              </h2>

              <p
                className="
                  mt-2
                  text-slate-500
                  dark:text-slate-400
                "
              >
                다음 레벨까지
                {" "}
                {remainXP > 0
                  ? remainXP
                  : 0}
                XP
              </p>
            </div>

            <div
              className="
                min-w-[220px]
              "
            >
              <div
                className="
                  flex
                  justify-between
                  text-sm
                  mb-2
                "
              >
                <span>
                  레벨 진행률
                </span>

                <span>
                  {progress}%
                </span>
              </div>

              <div
                className="
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
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* XP / 점수 카드 */}

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              총 XP
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

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              총 응시 횟수
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2
              "
            >
              {totalAttempts}
            </p>
          </div>

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              평균 점수
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2
                text-green-600
              "
            >
              {averageScore}%
            </p>
          </div>

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              최고 점수
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2
                text-orange-500
              "
            >
              {highestScore}%
            </p>
          </div>

        </div>
                {/* 오답 복습 통계 */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-4
          "
        >

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              저장된 오답
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2
                text-red-500
              "
            >
              {totalWrong}
            </p>
          </div>

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              해결한 오답
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2
                text-green-600
              "
            >
              {solvedWrong}
            </p>
          </div>

          <div className={cardClass}>
            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              복습 성공률
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2
                text-blue-600
              "
            >
              {reviewRate}%
            </p>
          </div>

        </div>

        {/* 학습 성과 요약 */}

        <div className={cardClass}>

          <h2
            className="
              text-xl
              font-semibold
              mb-5
            "
          >
            학습 성과
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
                rounded-lg
                border
                border-slate-200
                dark:border-slate-700
                p-4
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                풀이한 시험 수
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  mt-2
                "
              >
                {
                  new Set(
                    quizResults.map(
                      (item) =>
                        item.examId
                    )
                  ).size
                }
              </p>
            </div>

            <div
              className="
                rounded-lg
                border
                border-slate-200
                dark:border-slate-700
                p-4
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                응시한 총 문제 수
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  mt-2
                "
              >
                {quizResults.reduce(
                  (sum, item) =>
                    sum + item.total,
                  0
                )}
              </p>
            </div>

            <div
              className="
                rounded-lg
                border
                border-slate-200
                dark:border-slate-700
                p-4
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                평균 정답률
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  mt-2
                  text-green-600
                "
              >
                {averageScore}%
              </p>
            </div>

            <div
              className="
                rounded-lg
                border
                border-slate-200
                dark:border-slate-700
                p-4
              "
            >
              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                현재 달성 레벨
              </p>

              <p
                className="
                  text-2xl
                  font-bold
                  mt-2
                  text-orange-500
                "
              >
                Lv.{level}
              </p>
            </div>

          </div>

        </div>
                {/* 위험도 TOP 5 */}

        <div className={cardClass}>

          <h2
            className="
              text-xl
              font-semibold
              mb-5
            "
          >
            위험도 TOP 5
          </h2>

          {dangerQuestions.length === 0 ? (

            <p
              className="
                text-slate-500
                dark:text-slate-400
              "
            >
              저장된 오답이 없습니다.
            </p>

          ) : (

            <div className="space-y-3">

              {dangerQuestions.map(
                (item, index) => (

                  <div
                    key={`${item.examId}-${item.questionId}`}
                    className="
                      border
                      border-slate-200
                      dark:border-slate-700

                      rounded-lg
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        justify-between
                        items-start
                        gap-3
                      "
                    >

                      <div>

                        <p
                          className="
                            font-semibold
                          "
                        >
                          #{index + 1}
                        </p>

                        <p className="mt-2">
                          {item.question}
                        </p>

                      </div>

                      <span
                        className="
                          text-red-500
                          font-bold
                        "
                      >
                        {getDangerScore(
                          item
                        )}
                      </span>

                    </div>

                    <div
                      className="
                        mt-3
                        text-sm

                        text-slate-500
                        dark:text-slate-400

                        flex
                        gap-4
                        flex-wrap
                      "
                    >
                      <span>
                        오답 :
                        {" "}
                        {item.wrongCount}
                      </span>

                      <span>
                        복습 :
                        {" "}
                        {item.reviewCount}
                      </span>

                      <span>
                        해결 :
                        {" "}
                        {item.solvedCount}
                      </span>
                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* 시험별 통계 */}

        <div className={cardClass}>

          <h2
            className="
              text-xl
              font-semibold
              mb-5
            "
          >
            시험별 기록
          </h2>

          <div className="space-y-3">

            {exams.map((exam) => {

              const results =
                quizResults.filter(
                  (item) =>
                    item.examId ===
                    exam.id
                );

              const attempts =
                results.length;

              const avg =
                attempts > 0
                  ? Math.round(
                      results.reduce(
                        (
                          sum,
                          item
                        ) =>
                          sum +
                          (item.percentage ??
                            0),
                        0
                      ) / attempts
                    )
                  : 0;

              const best =
                attempts > 0
                  ? Math.max(
                      ...results.map(
                        (
                          item
                        ) =>
                          item.percentage ??
                          0
                      )
                    )
                  : 0;

              return (
                <div
                  key={exam.id}
                  className="
                    border
                    border-slate-200
                    dark:border-slate-700

                    rounded-lg
                    p-4
                  "
                >

                  <div
                    className="
                      flex
                      justify-between
                      items-center
                      flex-wrap
                      gap-3
                    "
                  >

                    <div>

                      <p
                        className="
                          font-semibold
                        "
                      >
                        {exam.name}
                      </p>

                      <p
                        className="
                          text-sm
                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        {exam.category}
                      </p>

                    </div>

                    <div
                      className="
                        flex
                        gap-5
                        text-sm
                      "
                    >

                      <span>
                        응시 :
                        {" "}
                        {attempts}
                      </span>

                      <span>
                        평균 :
                        {" "}
                        {avg}%
                      </span>

                      <span>
                        최고 :
                        {" "}
                        {best}%
                      </span>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </MainLayout>
  );
}