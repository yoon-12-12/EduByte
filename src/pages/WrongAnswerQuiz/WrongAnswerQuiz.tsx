import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

import { exams } from "../../data/exams";

import {
  getDangerSortedWrongAnswers,
  getDangerScore,
  recordReviewSuccess,
  recordReviewFail,
  deleteWrongAnswer,
  getReviewSuccessRate,
  type WrongAnswer,
} from "../../utils/wrongAnswerStorage";

import {
  addXP,
  getLevel,
  getTotalXP,
} from "../../utils/quizStorage";

import {
  recordReviewSuccessStat,
  recordReviewFailStat,
} from "../../utils/reviewStats";

import {
  saveStudyActivity,
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
`;

export default function WrongAnswerQuiz() {
  const { examId } = useParams();

  const initialQuestions =
    useMemo(() => {
      return getDangerSortedWrongAnswers()
        .filter(
          (item) =>
            item.examId ===
            Number(examId)
        );
    }, [examId]);

  const [questions, setQuestions] =
    useState<WrongAnswer[]>(
      initialQuestions
    );

  const [current, setCurrent] =
    useState(0);

  const [selected, setSelected] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const [showResult, setShowResult] =
    useState(false);

  const [isCorrect, setIsCorrect] =
    useState(false);

  const [earnedXP, setEarnedXP] =
    useState(0);

  const [streak, setStreak] =
    useState(0);

  const [bestStreak, setBestStreak] =
    useState(0);

  const [solvedCount, setSolvedCount] =
    useState(0);

  const examName =
    exams.find(
      (e) =>
        e.id === Number(examId)
    )?.name ?? "오답 복습";

  const successRate =
    getReviewSuccessRate();

  if (
    questions.length === 0 &&
    !finished
  ) {
    return (
      <MainLayout>
        <PageHeader
          title={examName}
          description="저장된 오답이 없습니다."
        />

        <div
          className={`${cardClass} p-8`}
        >
          <h2 className="text-2xl font-bold">
            🎉 축하합니다
          </h2>

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            현재 해당 시험에
            저장된 오답이 없습니다.
          </p>
        </div>
      </MainLayout>
    );
  }

  const question =
    questions[current];

  const progress =
    questions.length > 0
      ? ((current + 1) /
          questions.length) *
        100
      : 0;
        const handleSubmit = () => {
    if (selected === null) {
      alert("답을 선택해주세요.");
      return;
    }

    const correct =
      selected === question.answer;

    setIsCorrect(correct);

    if (correct) {
      
      console.log(
        "recordReviewSuccessStat 실행"
      );

      recordReviewSuccessStat();

      setScore(
        (prev) => prev + 1
      );

      const nextStreak =
        streak + 1;

      setStreak(nextStreak);

      if (
        nextStreak >
        bestStreak
      ) {
        setBestStreak(
          nextStreak
        );
      }

      recordReviewSuccess(
        question.examId,
        question.questionId
      );
    } else {

      recordReviewFailStat();

      setStreak(0);

      recordReviewFail(
        question.examId,
        question.questionId
      );
    }

    setShowResult(true);
  };

  const handleNext = () => {
    let gainedXP = 0;

    if (isCorrect) {
      gainedXP += 10;

      const dangerScore =
        getDangerScore(
          question
        );

      if (
        dangerScore >= 50
      ) {
        gainedXP += 20;
      }

      addXP(gainedXP);

      saveStudyActivity(
        gainedXP,
        0,
        1
      );

      setEarnedXP(
        (prev) =>
          prev + gainedXP
      );

      setSolvedCount(
        (prev) => prev + 1
      );

      deleteWrongAnswer(
        question.examId,
        question.questionId
      );
    }

    const updatedQuestions =
      getDangerSortedWrongAnswers()
        .filter(
          (item) =>
            item.examId ===
            Number(examId)
        );

    setQuestions(
      updatedQuestions
    );

    if (
      updatedQuestions.length === 0
    ) {
      setFinished(true);
      return;
    }

    const nextIndex =
      current >=
      updatedQuestions.length
        ? Math.max(
            0,
            updatedQuestions.length -
              1
          )
        : current;

    setCurrent(nextIndex);

    setSelected(null);

    setShowResult(false);
  };

  if (finished) {
    const currentLevel =
      getLevel();

    const totalXP =
      getTotalXP();

    return (
      <MainLayout>
        <div className="space-y-6">

          <PageHeader
            title="오답 복습 완료"
            description={examName}
          />
                    <div
            className={`${cardClass} p-8`}
          >
            <h2
              className="
                text-3xl
                font-bold
                mb-6
              "
            >
              🎉 복습 완료
            </h2>

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
              "
            >
              <div
                className="
                  rounded-xl
                  border
                  border-slate-200
                  dark:border-slate-700
                  p-5
                "
              >
                <h3
                  className="
                    font-semibold
                    mb-4
                  "
                >
                  복습 결과
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span>
                      해결한 오답
                    </span>

                    <span className="font-bold text-green-600">
                      {solvedCount}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      맞춘 문제 수
                    </span>

                    <span className="font-bold">
                      {score}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      복습 성공률
                    </span>

                    <span className="font-bold text-blue-600">
                      {successRate}%
                    </span>
                  </div>

                </div>
              </div>

              <div
                className="
                  rounded-xl
                  border
                  border-slate-200
                  dark:border-slate-700
                  p-5
                "
              >
                <h3
                  className="
                    font-semibold
                    mb-4
                  "
                >
                  성장 기록
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span>
                      획득 XP
                    </span>

                    <span className="font-bold text-green-600">
                      +{earnedXP}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      최고 연속 정답
                    </span>

                    <span className="font-bold text-orange-500">
                      {bestStreak}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      현재 레벨
                    </span>

                    <span className="font-bold">
                      Lv.{currentLevel}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      누적 XP
                    </span>

                    <span className="font-bold">
                      {totalXP}
                    </span>
                  </div>

                </div>
              </div>

            </div>

            <div
              className="
                mt-6
                rounded-xl
                border
                border-green-200
                dark:border-green-800

                bg-green-50
                dark:bg-green-950/30

                p-5
              "
            >
              <p
                className="
                  font-bold
                  text-lg
                  text-green-700
                  dark:text-green-300
                "
              >
                모든 오답을 해결했습니다!
              </p>

              <p
                className="
                  mt-2
                  text-slate-600
                  dark:text-slate-400
                "
              >
                이제 새로운 시험을
                풀거나 대시보드에서
                학습 통계를 확인해보세요.
              </p>
            </div>

          </div>

        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title={`${examName} 오답 복습`}
          description={`남은 오답 ${questions.length}개`}
        />
                <div
          className={`${cardClass} p-4`}
        >
          <div
            className="
              flex
              justify-between
              mb-2
            "
          >
            <span>
              문제 {current + 1}
              /
              {questions.length}
            </span>

            <span>
              진행률{" "}
              {Math.round(
                progress
              )}
              %
            </span>
          </div>

          <div
            className="
              w-full
              bg-slate-200
              dark:bg-slate-700

              h-3
              rounded-full
            "
          >
            <div
              className="
                bg-blue-600
                h-3
                rounded-full
                transition-all
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <div
          className={`${cardClass} p-6`}
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
              mb-4
            "
          >
            <span className="font-semibold">
              위험도
            </span>

            <span
              className={`
                px-2
                py-1
                rounded-full
                text-xs
                text-white

                ${
                  getDangerScore(
                    question
                  ) >= 50
                    ? "bg-red-500"
                    : getDangerScore(
                        question
                      ) >= 25
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }
              `}
            >
              {getDangerScore(
                question
              ) >= 50
                ? "🔥 매우 위험"
                : getDangerScore(
                    question
                  ) >= 25
                ? "⚠️ 주의"
                : "✅ 안정"}
            </span>

            <span
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              위험도 점수 :
              {" "}
              {getDangerScore(
                question
              )}
            </span>
          </div>

          <div
            className="
              mb-4
              flex
              flex-wrap
              gap-4

              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            <span>
              오답 횟수 :
              {" "}
              {question.wrongCount}
            </span>

            <span>
              복습 :
              {" "}
              {question.reviewCount}
            </span>

            <span>
              해결 :
              {" "}
              {question.solvedCount}
            </span>
          </div>

          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            {question.question}
          </h2>

          <div className="space-y-3">

            {question.options.map(
              (
                option,
                index
              ) => (
                <label
                  key={index}
                  className={`
                    flex
                    items-center
                    gap-3

                    border
                    rounded-lg
                    p-4

                    cursor-pointer

                    transition-all

                    bg-white
                    dark:bg-slate-800

                    border-slate-300
                    dark:border-slate-700

                    hover:bg-slate-50
                    dark:hover:bg-slate-700

                    ${
                      selected ===
                      index
                        ? `
                          border-blue-500
                          bg-blue-50
                          dark:bg-blue-950/40
                        `
                        : ""
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="answer"
                    checked={
                      selected ===
                      index
                    }
                    onChange={() =>
                      setSelected(
                        index
                      )
                    }
                    disabled={
                      showResult
                    }
                    className="
                      accent-blue-600
                    "
                  />

                  <span>
                    {option}
                  </span>

                </label>
              )
            )}

          </div>
                    {!showResult ? (
            <div className="mt-6">
              <Button
                onClick={
                  handleSubmit
                }
              >
                정답 제출
              </Button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">

              <div
                className={`
                  p-5
                  rounded-lg
                  border

                  ${
                    isCorrect
                      ? `
                        bg-green-50
                        dark:bg-green-950/30

                        border-green-200
                        dark:border-green-800

                        text-green-800
                        dark:text-green-300
                      `
                      : `
                        bg-red-50
                        dark:bg-red-950/30

                        border-red-200
                        dark:border-red-800

                        text-red-800
                        dark:text-red-300
                      `
                  }
                `}
              >
                <p
                  className="
                    font-bold
                    text-lg
                  "
                >
                  {isCorrect
                    ? "정답입니다! 🎉"
                    : "오답입니다 😢"}
                </p>

                <p className="mt-3">
                  <span className="font-semibold">
                    정답 :
                  </span>
                  {" "}
                  {
                    question.options[
                      question.answer
                    ]
                  }
                </p>

                <p className="mt-2">
                  <span className="font-semibold">
                    해설 :
                  </span>
                  {" "}
                  {
                    question.explanation
                  }
                </p>

                {isCorrect && (
                  <div
                    className="
                      mt-4
                      rounded-lg
                      bg-green-100
                      dark:bg-green-900/40
                      p-3
                    "
                  >
                    <p className="font-semibold">
                      획득 보상
                    </p>

                    <ul
                      className="
                        mt-2
                        text-sm
                        space-y-1
                      "
                    >
                      <li>
                        ✅ 복습 성공
                        +10 XP
                      </li>

                      {getDangerScore(
                        question
                      ) >= 50 && (
                        <li>
                          🔥 위험 문제
                          해결
                          +20 XP
                        </li>
                      )}

                      {streak >= 3 && (
                        <li>
                          ⚡ 연속 정답
                          보너스 진행 중
                        </li>
                      )}
                    </ul>
                  </div>
                )}

              </div>

              <div
                className="
                  grid
                  md:grid-cols-3
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
                      text-sm
                      text-slate-500
                    "
                  >
                    현재 연속 정답
                  </p>

                  <p
                    className="
                      text-xl
                      font-bold
                      text-orange-500
                    "
                  >
                    {streak}
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
                      text-sm
                      text-slate-500
                    "
                  >
                    최고 연속 정답
                  </p>

                  <p
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    {bestStreak}
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
                      text-sm
                      text-slate-500
                    "
                  >
                    누적 복습 XP
                  </p>

                  <p
                    className="
                      text-xl
                      font-bold
                      text-green-600
                    "
                  >
                    +{earnedXP}
                  </p>
                </div>
              </div>

              <Button
                onClick={
                  handleNext
                }
              >
                {isCorrect
                  ? "다음 문제"
                  : "다시 도전"}
              </Button>

            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}