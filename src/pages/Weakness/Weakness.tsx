import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import { exams } from "../../data/exams";

import {
  getDangerSortedWrongAnswers,
  getDangerScore,
} from "../../utils/wrongAnswerStorage";

export default function Weakness() {
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] =
    useState<number | "all">("all");

  const allWrongAnswers =
    getDangerSortedWrongAnswers();

  const filteredQuestions =
    useMemo(() => {
      if (selectedExam === "all") {
        return allWrongAnswers;
      }

      return allWrongAnswers.filter(
        (item) =>
          item.examId === selectedExam
      );
    }, [
      allWrongAnswers,
      selectedExam,
    ]);

  const dangerCount =
    filteredQuestions.filter(
      (item) =>
        getDangerScore(item) >= 50
    ).length;

  const warningCount =
    filteredQuestions.filter(
      (item) =>
        getDangerScore(item) >= 25 &&
        getDangerScore(item) < 50
    ).length;

  const safeCount =
    filteredQuestions.filter(
      (item) =>
        getDangerScore(item) < 25
    ).length;

  const mostDangerousExam =
    useMemo(() => {
      const scores: Record<
        number,
        number
      > = {};

      filteredQuestions.forEach(
        (item) => {
          scores[item.examId] =
            (scores[item.examId] || 0) +
            getDangerScore(item);
        }
      );

      const sorted =
        Object.entries(scores).sort(
          (a, b) =>
            b[1] - a[1]
        );

      if (sorted.length === 0)
        return null;

      return exams.find(
        (e) =>
          e.id ===
          Number(sorted[0][0])
      );
    }, [filteredQuestions]);

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="약점 집중 모드"
          description="자주 틀리는 문제를 우선 학습합니다."
        />

        <div
          className="
            grid
            md:grid-cols-4
            gap-4
          "
        >
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              전체 오답
            </p>

            <p className="text-3xl font-bold mt-2">
              {filteredQuestions.length}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-red-200 dark:border-red-800">
            <p className="text-sm">
              🔥 매우 위험
            </p>

            <p className="text-3xl font-bold text-red-500 mt-2">
              {dangerCount}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm">
              ⚠️ 주의
            </p>

            <p className="text-3xl font-bold text-yellow-500 mt-2">
              {warningCount}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-green-200 dark:border-green-800">
            <p className="text-sm">
              ✅ 안정
            </p>

            <p className="text-3xl font-bold text-green-500 mt-2">
              {safeCount}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">

          <div className="flex justify-between items-center flex-wrap gap-3">

            <h2 className="text-xl font-bold">
              위험도 분석
            </h2>

            <select
              value={selectedExam}
              onChange={(e) =>
                setSelectedExam(
                  e.target.value === "all"
                    ? "all"
                    : Number(
                        e.target.value
                      )
                )
              }
              className="
                px-3
                py-2
                rounded-lg
                border
                dark:bg-slate-800
              "
            >
              <option value="all">
                전체 시험
              </option>

              {exams.map((exam) => (
                <option
                  key={exam.id}
                  value={exam.id}
                >
                  {exam.name}
                </option>
              ))}
            </select>

          </div>

          {mostDangerousExam && (
            <div
              className="
                mt-4
                rounded-lg
                bg-red-50
                dark:bg-red-950/30
                border
                border-red-200
                dark:border-red-800
                p-4
              "
            >
              <p className="font-semibold">
                현재 가장 위험한 시험
              </p>

              <p className="text-red-600 font-bold mt-1">
                {mostDangerousExam.name}
              </p>
            </div>
          )}

        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700">

          <div className="flex justify-between items-center">

            <h2 className="text-xl font-bold">
              위험도 TOP 10
            </h2>

            <button
              onClick={() =>
                navigate(
                  "/wrong-answer-quiz/1"
                )
              }
              className="
                px-4
                py-2
                rounded-lg
                bg-blue-600
                text-white
              "
            >
              복습 시작
            </button>

          </div>

          <div className="mt-5 space-y-3">

            {filteredQuestions
              .slice(0, 10)
              .map((item) => {
                const danger =
                  getDangerScore(item);

                return (
                  <div
                    key={`${item.examId}-${item.questionId}`}
                    className="
                      border
                      rounded-xl
                      p-4
                    "
                  >
                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="font-semibold">
                          {item.question}
                        </p>

                        <p className="text-sm text-slate-500 mt-2">
                          오답 :
                          {item.wrongCount}
                          회 /
                          복습 :
                          {item.reviewCount}
                          회 /
                          해결 :
                          {item.solvedCount}
                          회
                        </p>

                      </div>

                      <div>

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-white
                            text-sm
                            ${
                              danger >= 50
                                ? "bg-red-500"
                                : danger >= 25
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }
                          `}
                        >
                          {danger}
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