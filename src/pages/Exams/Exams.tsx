import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";

import { exams } from "../../data/exams";

import {
  getExamAttemptCount,
  getExamAverageScore,
  getExamBestScore,
  getQuizResults,
} from "../../utils/quizStorage";

export default function Exams() {
  const [search, setSearch] =
    useState("");

  const navigate =
    useNavigate();

  const allResults =
    getQuizResults();

  const filteredExams =
    exams.filter((exam) =>
      exam.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  const getCompletionRate = (
    examId: number
  ) => {
    const attempts =
      getExamAttemptCount(examId);

    if (attempts === 0)
      return 0;

    const bestScore =
      getExamBestScore(examId);

    return Math.min(
      bestScore,
      100
    );
  };

  const getLatestExamDate = (
    examId: number
  ) => {
    const results =
      allResults.filter(
        (item) =>
          item.examId === examId
      );

    if (
      results.length === 0
    ) {
      return null;
    }

    return results[
      results.length - 1
    ].date;
  };

  const getExamBadge = (
    examId: number
  ) => {
    const best =
      getExamBestScore(examId);

    if (best >= 95)
      return "🏆";

    if (best >= 80)
      return "🥇";

    if (best >= 60)
      return "🥈";

    if (best > 0)
      return "🥉";

    return "📚";
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="시험 목록"
          description="공부할 시험을 선택하세요."
        />

        <input
          type="text"
          placeholder="시험 검색..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            p-3

            rounded-xl

            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-slate-100

            border
            border-slate-200
            dark:border-slate-700

            placeholder:text-slate-400
            dark:placeholder:text-slate-500

            transition-colors
            duration-300
          "
        />

        <div
          className="
            grid
            lg:grid-cols-2
            gap-5
          "
        >
          {filteredExams.map(
            (exam) => {
                            const attemptCount =
                getExamAttemptCount(
                  exam.id
                );

              const averageScore =
                getExamAverageScore(
                  exam.id
                );

              const bestScore =
                getExamBestScore(
                  exam.id
                );

              const completionRate =
                getCompletionRate(
                  exam.id
                );

              const latestDate =
                getLatestExamDate(
                  exam.id
                );

              const badge =
                getExamBadge(
                  exam.id
                );

              return (
                <Card
                  key={exam.id}
                  onClick={() =>
                    navigate(
                      `/exam/${exam.id}`
                    )
                  }
                  className="
                    hover:shadow-lg
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  <div className="space-y-4">

                    <div>

                      <div className="flex items-center justify-between">

                        <h2
                          className="
                            text-xl
                            font-semibold

                            text-slate-900
                            dark:text-slate-100
                          "
                        >
                          {exam.name}
                        </h2>

                        <span className="text-2xl">
                          {badge}
                        </span>

                      </div>

                      <p
                        className="
                          text-blue-600
                          dark:text-blue-400

                          text-sm
                          mt-1
                        "
                      >
                        {exam.category}
                      </p>

                      <p
                        className="
                          mt-3

                          text-slate-600
                          dark:text-slate-400
                        "
                      >
                        {exam.description}
                      </p>

                    </div>

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-3
                      "
                    >
                                            <div
                        className="
                          rounded-lg
                          border
                          border-slate-200
                          dark:border-slate-700
                          p-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          응시 횟수
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                            mt-1
                          "
                        >
                          {attemptCount}회
                        </p>
                      </div>

                      <div
                        className="
                          rounded-lg
                          border
                          border-slate-200
                          dark:border-slate-700
                          p-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          평균 점수
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                            mt-1
                            text-blue-600
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
                          p-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          최고 점수
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                            mt-1
                            text-green-600
                          "
                        >
                          {bestScore}%
                        </p>
                      </div>

                      <div
                        className="
                          rounded-lg
                          border
                          border-slate-200
                          dark:border-slate-700
                          p-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          완료율
                        </p>

                        <p
                          className="
                            text-xl
                            font-bold
                            mt-1
                            text-orange-500
                          "
                        >
                          {completionRate}%
                        </p>
                      </div>

                    </div>

                    <div>
                      <div
                        className="
                          flex
                          justify-between
                          text-sm
                          mb-2

                          text-slate-500
                          dark:text-slate-400
                        "
                      >
                        <span>
                          학습 진행도
                        </span>

                        <span>
                          {completionRate}%
                        </span>
                      </div>

                      <div
                        className="
                          h-2
                          rounded-full

                          bg-slate-200
                          dark:bg-slate-700
                        "
                      >
                        <div
                          className="
                            h-2
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
                    </div>
                                        <div
                      className="
                        flex
                        items-center
                        justify-between
                        pt-2
                      "
                    >
                      <div>

                        <p
                          className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          최근 응시일
                        </p>

                        <p
                          className="
                            text-sm
                            font-medium
                            mt-1
                          "
                        >
                          {latestDate
                            ? new Date(
                                latestDate
                              ).toLocaleDateString()
                            : "기록 없음"}
                        </p>

                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          navigate(
                            `/exam/${exam.id}`
                          );
                        }}
                        className="
                          px-4
                          py-2

                          rounded-lg

                          bg-blue-600
                          hover:bg-blue-700

                          text-white
                          text-sm
                          font-medium

                          transition-colors
                        "
                      >
                        시험 시작
                      </button>

                    </div>

                  </div>
                </Card>
              );
            }
          )}
        </div>

      </div>
    </MainLayout>
  );
}