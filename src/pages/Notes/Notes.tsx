import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

import {
  getWrongAnswers,
  deleteWrongAnswer,
  getDangerScore,
  type WrongAnswer,
} from "../../utils/wrongAnswerStorage";

import {
  getReviewStats,
  getReviewSuccessRateStat,
} from "../../utils/reviewStats";

import { exams } from "../../data/exams";

export default function Notes() {
  const navigate = useNavigate();

  const [wrongAnswers, setWrongAnswers] =
    useState<WrongAnswer[]>(
      getWrongAnswers()
    );

  /* =========================
     검색 / 필터
  ========================= */

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [selectedExam, setSelectedExam] =
    useState("all");

  const [riskFilter, setRiskFilter] =
    useState("all");

  const [sortType, setSortType] =
    useState("danger");

  const reviewStats =
    getReviewStats();

  const reviewSuccessRate =
    getReviewSuccessRateStat();

  const totalReviewCount =
    reviewStats.totalReview;

  const solvedWrongCount =
    reviewStats.successReview;

  const handleDelete = (
    examId: number,
    questionId: number
  ) => {
    const confirmed = window.confirm(
      "이 오답을 삭제하시겠습니까?"
    );

    if (!confirmed) return;

    deleteWrongAnswer(
      examId,
      questionId
    );

    setWrongAnswers(
      getWrongAnswers()
    );
  };

  /* =========================
     필터 적용
  ========================= */

  const filteredWrongAnswers =
    useMemo(() => {
      let data = [...wrongAnswers];

      if (
        selectedExam !== "all"
      ) {
        data = data.filter(
          (item) =>
            item.examId ===
            Number(selectedExam)
        );
      }

      if (
        searchKeyword.trim()
      ) {
        data = data.filter(
          (item) =>
            item.question
              .toLowerCase()
              .includes(
                searchKeyword.toLowerCase()
              )
        );
      }

      if (
        riskFilter ===
        "danger"
      ) {
        data = data.filter(
          (item) =>
            getDangerScore(
              item
            ) >= 50
        );
      }

      if (
        riskFilter ===
        "warning"
      ) {
        data = data.filter(
          (item) =>
            getDangerScore(
              item
            ) >= 25 &&
            getDangerScore(
              item
            ) < 50
        );
      }

      if (
        riskFilter ===
        "safe"
      ) {
        data = data.filter(
          (item) =>
            getDangerScore(
              item
            ) < 25
        );
      }

      switch (
        sortType
      ) {
        case "latest":
          data.sort(
            (
              a,
              b
            ) =>
              new Date(
                b.lastWrongDate
              ).getTime() -
              new Date(
                a.lastWrongDate
              ).getTime()
          );
          break;

        case "oldest":
          data.sort(
            (
              a,
              b
            ) =>
              new Date(
                a.lastWrongDate
              ).getTime() -
              new Date(
                b.lastWrongDate
              ).getTime()
          );
          break;

        case "wrong":
          data.sort(
            (
              a,
              b
            ) =>
              b.wrongCount -
              a.wrongCount
          );
          break;

        default:
          data.sort(
            (
              a,
              b
            ) =>
              getDangerScore(
                b
              ) -
              getDangerScore(
                a
              )
          );
      }

      return data;
    }, [
      wrongAnswers,
      searchKeyword,
      selectedExam,
      riskFilter,
      sortType,
    ]);
      /* =========================
     그룹화
  ========================= */

  const groupedWrongAnswers =
    useMemo(() => {
      return exams
        .map((exam) => ({
          exam,
          questions:
            filteredWrongAnswers.filter(
              (item) =>
                item.examId ===
                exam.id
            ),
        }))
        .filter(
          (group) =>
            group.questions.length >
            0
        );
    }, [
      filteredWrongAnswers,
    ]);

  const highRiskCount =
    wrongAnswers.filter(
      (item) =>
        getDangerScore(
          item
        ) >= 50
    ).length;

  const cautionCount =
    wrongAnswers.filter(
      (item) =>
        getDangerScore(
          item
        ) >= 25 &&
        getDangerScore(
          item
        ) < 50
    ).length;

  const safeCount =
    wrongAnswers.filter(
      (item) =>
        getDangerScore(
          item
        ) < 25
    ).length;

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="학습 노트"
          description="오답 문제를 복습하고 학습 내용을 정리하세요."
        />

        {/* 상단 통계 */}

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              전체 오답
            </p>

            <p className="text-3xl font-bold mt-2">
              {wrongAnswers.length}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              위험 문제
            </p>

            <p className="text-3xl font-bold text-red-500 mt-2">
              {highRiskCount}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              복습 성공률
            </p>

            <p className="text-3xl font-bold text-green-600 mt-2">
              {reviewSuccessRate}%
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              복습 완료
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              {solvedWrongCount}
            </p>
          </div>

        </div>

        {/* 추가 통계 */}

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              주의 문제
            </p>

            <p className="text-2xl font-bold text-yellow-500 mt-2">
              {cautionCount}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              안정 문제
            </p>

            <p className="text-2xl font-bold text-green-500 mt-2">
              {safeCount}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              전체 복습
            </p>

            <p className="text-2xl font-bold mt-2">
              {totalReviewCount}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 rounded-xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400">
              응시 시험 수
            </p>

            <p className="text-2xl font-bold mt-2">
              {
                exams.filter(
                  (exam) =>
                    wrongAnswers.some(
                      (item) =>
                        item.examId ===
                        exam.id
                    )
                ).length
              }
            </p>
          </div>

        </div>

        {/* 검색 / 필터 */}

        <div
          className="
            bg-white
            dark:bg-slate-900
            border
            border-slate-200
            dark:border-slate-700
            rounded-xl
            shadow-sm
            p-6
          "
        >
          <h2 className="text-lg font-bold mb-4">
            오답 검색 및 필터
          </h2>

          <div className="grid lg:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="문제 검색..."
              value={searchKeyword}
              onChange={(e) =>
                setSearchKeyword(
                  e.target.value
                )
              }
              className="
                border
                border-slate-300
                dark:border-slate-700
                rounded-lg
                px-3
                py-2
                bg-transparent
              "
            />

            <select
              value={selectedExam}
              onChange={(e) =>
                setSelectedExam(
                  e.target.value
                )
              }
              className="
                border
                border-slate-300
                dark:border-slate-700
                rounded-lg
                px-3
                py-2
                bg-transparent
              "
            >
              <option value="all">
                전체 시험
              </option>

              {exams.map(
                (exam) => (
                  <option
                    key={exam.id}
                    value={exam.id}
                  >
                    {exam.name}
                  </option>
                )
              )}
            </select>
                        <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
              }
              className="
                border
                border-slate-300
                dark:border-slate-700
                rounded-lg
                px-3
                py-2
                bg-transparent
              "
            >
              <option value="all">
                전체 위험도
              </option>

              <option value="danger">
                위험
              </option>

              <option value="warning">
                주의
              </option>

              <option value="safe">
                안정
              </option>
            </select>

            <select
              value={sortType}
              onChange={(e) =>
                setSortType(
                  e.target.value
                )
              }
              className="
                border
                border-slate-300
                dark:border-slate-700
                rounded-lg
                px-3
                py-2
                bg-transparent
              "
            >
              <option value="danger">
                위험도순
              </option>

              <option value="wrong">
                오답횟수순
              </option>

              <option value="latest">
                최신순
              </option>

              <option value="oldest">
                오래된순
              </option>
            </select>

          </div>
        </div>

        {groupedWrongAnswers.length === 0 ? (
          <div
            className="
              bg-white
              dark:bg-slate-900

              border
              border-slate-200
              dark:border-slate-700

              p-8
              rounded-xl
              shadow-sm

              text-center
            "
          >
            <h2 className="text-xl font-bold">
              🎉 오답이 없습니다
            </h2>

            <p
              className="
                mt-2
                text-slate-500
                dark:text-slate-400
              "
            >
              현재 저장된 오답이 없습니다.
            </p>
          </div>
        ) : (
          groupedWrongAnswers.map(
            (group) => (
              <div
                key={
                  group.exam.id
                }
                className="
                  bg-white
                  dark:bg-slate-900

                  border
                  border-slate-200
                  dark:border-slate-700

                  p-6
                  rounded-xl
                  shadow-sm
                "
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {group.exam.name}
                    </h2>

                    <p
                      className="
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      오답 {group.questions.length}개
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      navigate(
                        `/wrong-answer-quiz/${group.exam.id}`
                      )
                    }
                  >
                    시험 오답 다시 풀기
                  </Button>
                </div>

                <div className="space-y-4">

                  {group.questions.map(
                    (
                      wrong,
                      index
                    ) => (
                      <div
                        key={`${wrong.examId}-${wrong.questionId}-${index}`}
                        className="
                          bg-white
                          dark:bg-slate-800

                          border
                          border-slate-200
                          dark:border-slate-700

                          rounded-xl
                          p-5

                          hover:shadow-md
                          transition
                        "
                      >
                        <div className="flex flex-wrap gap-2 mb-3">

                          <span
                            className="
                              px-3
                              py-1
                              rounded-full
                              text-xs

                              bg-red-100
                              text-red-700
                            "
                          >
                            틀린 횟수 {wrong.wrongCount}회
                          </span>
                                                    {getDangerScore(
                            wrong
                          ) >= 50 ? (
                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                text-xs

                                bg-red-500
                                text-white
                              "
                            >
                              🔥 위험
                            </span>
                          ) : getDangerScore(
                              wrong
                            ) >=
                            25 ? (
                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                text-xs

                                bg-yellow-500
                                text-white
                              "
                            >
                              ⚠️ 주의
                            </span>
                          ) : (
                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                text-xs

                                bg-green-500
                                text-white
                              "
                            >
                              ✅ 안정
                            </span>
                          )}
                        </div>

                        <h3 className="font-semibold text-lg">
                          {wrong.question}
                        </h3>

                        <div
                          className="
                            mt-4

                            bg-slate-50
                            dark:bg-slate-700

                            rounded-lg
                            p-4
                          "
                        >
                          <p className="font-medium">
                            해설
                          </p>

                          <p
                            className="
                              mt-2
                              leading-relaxed

                              text-slate-700
                              dark:text-slate-300
                            "
                          >
                            {wrong.explanation}
                          </p>
                        </div>

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                            mt-4
                            text-xs
                          "
                        >
                          <span
                            className="
                              px-2
                              py-1
                              rounded
                              bg-blue-100
                              text-blue-700
                            "
                          >
                            복습 {wrong.reviewCount}회
                          </span>

                          <span
                            className="
                              px-2
                              py-1
                              rounded
                              bg-green-100
                              text-green-700
                            "
                          >
                            해결 {wrong.solvedCount}회
                          </span>

                          <span
                            className="
                              px-2
                              py-1
                              rounded
                              bg-red-100
                              text-red-700
                            "
                          >
                            위험도 {getDangerScore(wrong)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-4">

                          <Button
                            onClick={() =>
                              navigate(
                                `/wrong-answer-quiz/${group.exam.id}`
                              )
                            }
                          >
                            다시 풀기
                          </Button>

                          <Button
                            className="bg-gray-600 hover:bg-gray-700"
                            onClick={() =>
                              handleDelete(
                                wrong.examId,
                                wrong.questionId
                              )
                            }
                          >
                            삭제
                          </Button>

                        </div>

                        <p
                          className="
                            text-xs
                            mt-4

                            text-slate-400
                            dark:text-slate-500
                          "
                        >
                          최근 오답 :
                          {" "}
                          {new Date(
                            wrong.lastWrongDate
                          ).toLocaleString()}
                        </p>

                        {wrong.lastReviewDate && (
                          <p
                            className="
                              text-xs
                              mt-1

                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            최근 복습 :
                            {" "}
                            {new Date(
                              wrong.lastReviewDate
                            ).toLocaleString()}
                          </p>
                        )}

                      </div>
                    )
                  )}

                </div>
              </div>
            )
          )
        )}

      </div>
    </MainLayout>
  );
}