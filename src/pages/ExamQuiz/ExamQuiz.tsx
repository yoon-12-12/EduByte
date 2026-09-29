import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

import { exams } from "../../data/exams";

import {
  saveQuizResult,
  addXP,
  getLevel,
  getTotalXP,
  getExamResults,
  consumeXPBooster,
  getXPBoosterCount,
} from "../../utils/quizStorage";

import {
  saveWrongAnswer,
} from "../../utils/wrongAnswerStorage";

import {
  saveStudyActivity,
} from "../../utils/studyHistoryStorage";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface FavoriteQuestion {
  examId: number;

  questionId: number;

  question: string;

  options: string[];

  answer: number;

  explanation: string;
}

const FAVORITE_KEY =
  "edubyte_favorites";

function shuffleArray<T>(
  array: T[]
): T[] {
  const copied = [...array];

  for (
    let i = copied.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [copied[i], copied[j]] = [
      copied[j],
      copied[i],
    ];
  }

  return copied;
}

export default function ExamQuiz() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const exam =
    exams.find(
      (item) =>
        item.id === Number(id)
    );

  const examName =
    exam?.name ??
    "모의고사";

  /* =========================
     문제
  ========================= */

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [current, setCurrent] =
    useState(0);

  const [selected, setSelected] =
    useState<number | null>(
      null
    );

  const [showResult, setShowResult] =
    useState(false);

  const [isCorrect, setIsCorrect] =
    useState(false);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  /* =========================
     XP / 레벨
  ========================= */

  const [earnedXP, setEarnedXP] =
    useState(0);

  const [oldLevel, setOldLevel] =
    useState(1);

  const [newLevel, setNewLevel] =
    useState(1);

  const [questionXP, setQuestionXP] =
    useState(0);

  /* =========================
     스트릭
  ========================= */

  const [streak, setStreak] =
    useState(0);

  const [bestStreak, setBestStreak] =
    useState(0);

  /* =========================
     즐겨찾기
  ========================= */

  const [favorites, setFavorites] =
    useState<number[]>([]);

  /* =========================
     타이머
  ========================= */

  const [
    elapsedSeconds,
    setElapsedSeconds,
  ] = useState(0);

  /* =========================
     결과 비교
  ========================= */

  const [
    previousScore,
    setPreviousScore,
  ] = useState<number | null>(
    null
  );

  const [badge, setBadge] =
    useState("");

  /* =========================
     현재 문제
  ========================= */

  const currentQuestion =
    questions[current];

  const progress =
    questions.length > 0
      ? ((current + 1) /
          questions.length) *
        100
      : 0;

  const totalXP =
    getTotalXP();

  const level =
    getLevel();

  const formattedTime =
    useMemo(() => {
      const minute =
        Math.floor(
          elapsedSeconds / 60
        );

      const second =
        elapsedSeconds % 60;

      return `${String(
        minute
      ).padStart(
        2,
        "0"
      )}:${String(
        second
      ).padStart(
        2,
        "0"
      )}`;
    }, [elapsedSeconds]);

  useEffect(() => {
    const timer =
      setInterval(() => {
        setElapsedSeconds(
          (prev) =>
            prev + 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, []);
    /* =========================
     문제 로딩
  ========================= */

  useEffect(() => {
    async function loadQuiz() {
      try {
        if (!exam) return;

        const response =
          await fetch(
            `./data/${exam.questionFile}`
          );

        const data =
          await response.json();

        setQuestions(
          shuffleArray(data)
        );

        /* 즐겨찾기 로드 */

        const savedFavorites =
          localStorage.getItem(
            FAVORITE_KEY
          );

        if (
          savedFavorites
        ) {
          const parsed =
            JSON.parse(
              savedFavorites
            );

          setFavorites(
            parsed.map(
              (
                item: FavoriteQuestion
              ) =>
                item.questionId
            )
          );
        }

        /* 이전 시험 결과 */

        const history =
          getExamResults(
            Number(id)
          );

        if (
          history.length > 0
        ) {
          const latest =
            history[
              history.length -
                1
            ];

          const percent =
            Math.round(
              (latest.score /
                latest.total) *
                100
            );

          setPreviousScore(
            percent
          );
        }
      } catch (error) {
        console.error(
          "문제 로딩 실패",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuiz();
  }, [exam, id]);

  /* =========================
     즐겨찾기
  ========================= */

  const toggleFavorite =
    () => {
      if (
        !currentQuestion
      )
        return;

      const saved =
        localStorage.getItem(
          FAVORITE_KEY
        );

      const favoriteData:
        FavoriteQuestion[] =
        saved
          ? JSON.parse(
              saved
            )
          : [];

      const exists =
        favoriteData.find(
          (item) =>
            item.examId ===
              Number(id) &&
            item.questionId ===
              currentQuestion.id
        );

      let updated:
        FavoriteQuestion[];

      if (exists) {
        updated =
          favoriteData.filter(
            (item) =>
              !(
                item.examId ===
                  Number(id) &&
                item.questionId ===
                  currentQuestion.id
              )
          );
      } else {
        updated = [
          ...favoriteData,
          {
            examId:
              Number(id),

            questionId:
              currentQuestion.id,

            question:
              currentQuestion.question,

            options:
              currentQuestion.options,

            answer:
              currentQuestion.answer,

            explanation:
              currentQuestion.explanation,
          },
        ];
      }

      localStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(
          updated
        )
      );

      setFavorites(
        updated.map(
          (item) =>
            item.questionId
        )
      );
    };

  const isFavorite =
    currentQuestion
      ? favorites.includes(
          currentQuestion.id
        )
      : false;

  /* =========================
     배지
  ========================= */

  const calculateBadge =
    (
      percent: number
    ): string => {
      if (
        percent === 100
      )
        return "🏆 완벽한 마스터";

      if (
        percent >= 90
      )
        return "🥇 최상위 학습자";

      if (
        percent >= 80
      )
        return "🥈 우수 학습자";

      if (
        percent >= 70
      )
        return "🥉 성장형 학습자";

      if (
        percent >= 50
      )
        return "📘 도전 중";

      return "🔥 포기하지 않는 학습자";
    };

  /* =========================
     정답 제출
  ========================= */

  const handleSubmit =
    () => {
      if (
        selected === null
      ) {
        alert(
          "답을 선택해주세요."
        );

        return;
      }

      const correct =
        selected ===
        currentQuestion.answer;

      setIsCorrect(
        correct
      );

      if (correct) {
        setScore(
          (prev) =>
            prev + 1
        );

        const nextStreak =
          streak + 1;

        setStreak(
          nextStreak
        );

        if (
          nextStreak >
          bestStreak
        ) {
          setBestStreak(
            nextStreak
          );
        }

        let gainedXP =
          10;

        if (
          nextStreak >= 3
        ) {
          gainedXP += 5;
        }

        if (
          nextStreak >= 5
        ) {
          gainedXP += 10;
        }

        setQuestionXP(
          gainedXP
        );
      } else {
        setStreak(0);

        setQuestionXP(0);

        saveWrongAnswer({
          examId:
            Number(id),

          questionId:
            currentQuestion.id,

          question:
            currentQuestion.question,

          options:
            currentQuestion.options,

          answer:
            currentQuestion.answer,

          explanation:
            currentQuestion.explanation,
        });
      }

      setShowResult(
        true
      );
    };
      /* =========================
     다음 문제
  ========================= */

  const handleNext =
    () => {
      if (
        current <
        questions.length - 1
      ) {
        setCurrent(
          (prev) =>
            prev + 1
        );

        setSelected(null);

        setShowResult(
          false
        );

        setQuestionXP(0);

        return;
      }

      finishExam();
    };

  /* =========================
     시험 종료
  ========================= */

  const finishExam =
    () => {
      const finalScore =
        score +
        (isCorrect
          ? 1
          : 0);

      const percentage =
        Math.round(
          (finalScore /
            questions.length) *
            100
        );

      let earned =
        percentage + 20;

      /* 만점 보너스 */

      if (
        percentage === 100
      ) {
        earned += 50;
      }

      /* 스트릭 보너스 */

      if (
        bestStreak >= 5
      ) {
        earned += 30;
      }

      if (
        bestStreak >= 10
      ) {
        earned += 50;
      }

      /* 빠른 완료 보너스 */

      if (
        elapsedSeconds <
        300
      ) {
        earned += 20;
      }

      if (
        getXPBoosterCount() > 0
      ) {

        earned *= 2;

        consumeXPBooster();

      }

      const beforeLevel =
        getLevel();

      addXP(
        earned
      );

      saveQuizResult({
        examId:
          Number(id),

        score:
          finalScore,

        total:
          questions.length,

        date:
          new Date().toISOString(),
      });

      saveStudyActivity(
        earned,
        1,
        0
      );

      const afterLevel =
        getLevel();

      setEarnedXP(
        earned
      );

      setOldLevel(
        beforeLevel
      );

      setNewLevel(
        afterLevel
      );

      setBadge(
        calculateBadge(
          percentage
        )
      );

      setFinished(
        true
      );
    };

  /* =========================
     로딩
  ========================= */

  if (loading) {
    return (
      <MainLayout>
        <PageHeader
          title="모의고사"
          description="문제를 불러오는 중..."
        />
      </MainLayout>
    );
  }

  /* =========================
     문제 없음
  ========================= */

  if (
    !currentQuestion
  ) {
    return (
      <MainLayout>
        <PageHeader
          title="오류"
          description="문제를 찾을 수 없습니다."
        />
      </MainLayout>
    );
  }

  /* =========================
     시험 완료
  ========================= */

  if (finished) {
    const finalScore =
      score +
      (isCorrect
        ? 1
        : 0);

    const percentage =
      Math.round(
        (finalScore /
          questions.length) *
          100
      );

    const difference =
      previousScore !==
        null
        ? percentage -
          previousScore
        : null;

    return (
      <MainLayout>
        <div className="space-y-6">

          <PageHeader
            title="시험 완료"
            description={
              examName
            }
          />

          <div
            className="
              bg-white
              dark:bg-slate-900

              border
              border-slate-200
              dark:border-slate-700

              rounded-xl
              p-8
            "
          >
            <h2
              className="
                text-3xl
                font-bold
                mb-4
              "
            >
              🎉 시험 종료
            </h2>

            <div
              className="
                bg-blue-50
                dark:bg-slate-800

                rounded-xl
                p-5
                mb-6
              "
            >
              <p
                className="
                  text-lg
                  font-bold
                "
              >
                {badge}
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-600
                  dark:text-slate-300
                "
              >
                이번 시험 정답률 :
                {percentage}%
              </p>
            </div>

            <div
              className="
                grid
                md:grid-cols-2
                gap-6
              "
            >
              <div
                className="
                  border
                  rounded-xl
                  p-5
                "
              >
                <h3
                  className="
                    font-bold
                    mb-4
                  "
                >
                  시험 결과
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span>
                      점수
                    </span>

                    <span className="font-bold">
                      {finalScore}
                      /
                      {questions.length}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      정답률
                    </span>

                    <span
                      className="
                        font-bold
                        text-blue-600
                      "
                    >
                      {percentage}%
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      시험 시간
                    </span>

                    <span className="font-bold">
                      {formattedTime}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      최고 스트릭
                    </span>

                    <span
                      className="
                        font-bold
                        text-orange-500
                      "
                    >
                      {bestStreak}
                    </span>
                  </div>

                </div>
              </div>

              <div
                className="
                  border
                  rounded-xl
                  p-5
                "
              >
                <h3
                  className="
                    font-bold
                    mb-4
                  "
                >
                  성장 결과
                </h3>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span>
                      획득 XP
                    </span>

                    <span
                      className="
                        font-bold
                        text-green-600
                      "
                    >
                      +{earnedXP}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      이전 레벨
                    </span>

                    <span>
                      Lv.{oldLevel}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      현재 레벨
                    </span>

                    <span
                      className="
                        font-bold
                        text-orange-500
                      "
                    >
                      Lv.{newLevel}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>
                      누적 XP
                    </span>

                    <span className="font-bold">
                      {getTotalXP()}
                    </span>
                  </div>

                </div>
              </div>
            </div>

                          {difference !== null && (
              <div
                className="
                  mt-6

                  rounded-xl
                  p-5

                  bg-slate-50
                  dark:bg-slate-800
                "
              >
                <p className="font-bold">
                  이전 시험 비교
                </p>

                <p className="mt-2">
                  이전 :
                  {previousScore}%
                </p>

                <p className="mt-1">
                  현재 :
                  {percentage}%
                </p>

                <p
                  className={`
                    mt-2
                    font-bold
                    ${
                      difference >= 0
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  `}
                >
                  {difference >= 0
                    ? `+${difference}% 향상`
                    : `${difference}% 하락`}
                </p>
              </div>
            )}

            {newLevel >
              oldLevel && (
              <div
                className="
                  mt-6

                  rounded-xl
                  p-5

                  bg-gradient-to-r
                  from-yellow-400
                  to-orange-500

                  text-white
                "
              >
                <p
                  className="
                    text-xl
                    font-bold
                  "
                >
                  🎊 레벨 업
                </p>

                <p className="mt-2">
                  Lv.{oldLevel}
                  →
                  Lv.{newLevel}
                </p>
              </div>
            )}

            {percentage === 100 && (
              <div
                className="
                  mt-6

                  rounded-xl
                  p-5

                  bg-green-50
                  dark:bg-green-950/30

                  border
                  border-green-300
                "
              >
                <p
                  className="
                    font-bold
                    text-green-700
                  "
                >
                  🏆 만점 달성
                </p>

                <p className="mt-2">
                  만점 보너스 XP가
                  지급되었습니다.
                </p>
              </div>
            )}

            <div
              className="
                mt-6

                grid
                md:grid-cols-4
                gap-3
              "
            >
              <Button
                onClick={() =>
                  navigate(
                    `/exam/${id}`
                  )
                }
              >
                시험 정보
              </Button>

              <Button
                onClick={() =>
                  navigate(
                    `/wrong-answer-quiz/${id}`
                  )
                }
              >
                오답 복습
              </Button>

              <Button
                onClick={() =>
                  navigate(
                    "/favorites"
                  )
                }
              >
                즐겨찾기
              </Button>

              <Button
                onClick={() =>
                  navigate(
                    "/dashboard"
                  )
                }
              >
                대시보드
              </Button>
            </div>

          </div>
        </div>
      </MainLayout>
    );
  }

  /* =========================
     메인 퀴즈 화면
  ========================= */

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title={examName}
          description={`문제 ${
            current + 1
          } / ${
            questions.length
          }`}
        />

        <div
          className="
            bg-white
            dark:bg-slate-900

            border
            border-slate-200
            dark:border-slate-700

            rounded-xl
            p-6
          "
        >
          <div
            className="
              flex
              justify-between
              flex-wrap
              gap-4
              mb-6
            "
          >
            <div>
              <p className="text-sm text-slate-500">
                레벨
              </p>

              <p className="font-bold">
                Lv.{level}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                누적 XP
              </p>

              <p className="font-bold text-green-600">
                {totalXP}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                스트릭
              </p>

              <p className="font-bold text-orange-500">
                {streak}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                시간
              </p>

              <p className="font-bold">
                {formattedTime}
              </p>
            </div>
          </div>

          <div className="mb-6">

            <div
              className="
                flex
                justify-between
                text-sm
                mb-2
              "
            >
              <span>
                진행률
              </span>

              <span>
                {Math.round(
                  progress
                )}
                %
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-200">
              <div
                className="
                  h-2
                  rounded-full
                  bg-blue-600
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

          </div>

          <div
            className="
              flex
              justify-between
              items-start
              gap-4
              mb-6
            "
          >
            <h2
              className="
                text-2xl
                font-bold
              "
            >
              {currentQuestion.question}
            </h2>

            <button
              onClick={
                toggleFavorite
              }
              className="text-3xl"
            >
              {isFavorite
                ? "⭐"
                : "☆"}
            </button>
          </div>

          <div className="space-y-3">

            {currentQuestion.options.map(
              (
                option,
                index
              ) => (
                <label
                  key={index}
                  className={`
                    flex
                    gap-3
                    p-4
                    rounded-lg
                    border
                    cursor-pointer

                    ${
                      selected ===
                      index
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : ""
                    }
                  `}
                >
                  <input
                    type="radio"
                    checked={
                      selected ===
                      index
                    }
                    disabled={
                      showResult
                    }
                    onChange={() =>
                      setSelected(
                        index
                      )
                    }
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
                        border-green-300
                        text-green-900

                        dark:bg-green-950/30
                        dark:border-green-800
                        dark:text-green-200
                      `
                      : `
                        bg-red-50
                        border-red-300
                        text-red-900

                        dark:bg-red-950/30
                        dark:border-red-800
                        dark:text-red-200
                      `
                  }
                `}
              >
                <p className="font-bold text-lg">
                  {isCorrect
                    ? "정답입니다 🎉"
                    : "오답입니다 😢"}
                </p>

                <p className="mt-3">
                  <b>정답 :</b>{" "}
                  {
                    currentQuestion.options[
                      currentQuestion.answer
                    ]
                  }
                </p>

                <p className="mt-2">
                  <b>해설 :</b>{" "}
                  {
                    currentQuestion.explanation
                  }
                </p>

                {questionXP >
                  0 && (
                  <p
                    className="
                      mt-3
                      font-bold
                      text-green-600
                    "
                  >
                    +{questionXP}
                    XP 획득
                  </p>
                )}
              </div>

              <Button
                onClick={
                  handleNext
                }
              >
                {current + 1 ===
                questions.length
                  ? "결과 보기"
                  : "다음 문제"}
              </Button>

            </div>
          )}

        </div>

      </div>
    </MainLayout>
  );
}