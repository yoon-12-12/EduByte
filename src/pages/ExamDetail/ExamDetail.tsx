import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

import { exams } from "../../data/exams";

import {
  getExamResults,
  getExamAttemptCount,
  getExamAverageScore,
  getExamBestScore,
  getLatestResult,
  getTotalXP,
  getLevel,
} from "../../utils/quizStorage";

import {
  getExamWrongAnswers,
  getDangerScore,
} from "../../utils/wrongAnswerStorage";

export default function ExamDetail() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const FAVORITE_KEY =
    "edubyte_favorites";

  const exam = exams.find(
    (item) =>
      item.id === Number(id)
  );

  const [isFavorite, setIsFavorite] =
    useState(false);

  useEffect(() => {
    if (!exam) return;

    const saved =
      localStorage.getItem(
        FAVORITE_KEY
      );

    const favorites: number[] =
      saved
        ? JSON.parse(saved)
        : [];

    setIsFavorite(
      favorites.includes(
        exam.id
      )
    );
  }, [exam]);

  const toggleFavorite = () => {
    if (!exam) return;

    const saved =
      localStorage.getItem(
        FAVORITE_KEY
      );

    let favorites: number[] =
      saved
        ? JSON.parse(saved)
        : [];

    if (
      favorites.includes(
        exam.id
      )
    ) {
      favorites =
        favorites.filter(
          (item) =>
            item !== exam.id
        );

      setIsFavorite(false);
    } else {
      favorites.push(
        exam.id
      );

      setIsFavorite(true);
    }

    localStorage.setItem(
      FAVORITE_KEY,
      JSON.stringify(
        favorites
      )
    );
  };

  if (!exam) {
    return (
      <MainLayout>
        <div
          className="
            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-slate-100

            p-8
            rounded-xl
            shadow-sm
          "
        >
          <h1 className="text-2xl font-bold">
            시험을 찾을 수 없습니다.
          </h1>
        </div>
      </MainLayout>
    );
  }

  /* =========================
     실제 데이터 연동
  ========================= */

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

  const latestResult =
    getLatestResult(
      exam.id
    );

  const examResults =
    getExamResults(
      exam.id
    );

  const wrongAnswers =
    getExamWrongAnswers(
      exam.id
    );

  const totalXP =
    getTotalXP();

  const level =
    getLevel();
      const highRiskCount =
    wrongAnswers.filter(
      (item) =>
        getDangerScore(
          item
        ) >= 50
    ).length;

  const warningCount =
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

  const topDangerQuestion =
    [...wrongAnswers].sort(
      (a, b) =>
        getDangerScore(b) -
        getDangerScore(a)
    )[0];

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title={exam.name}
          description={
            exam.description
          }
        />

        {/* 시험 정보 */}

        <div
          className="
            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-slate-100

            p-6
            rounded-xl
            shadow-sm
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            시험 정보
          </h2>

          <div className="space-y-3">

            <p>
              <span className="font-semibold">
                시험명:
              </span>{" "}
              {exam.name}
            </p>

            <p>
              <span className="font-semibold">
                분류:
              </span>{" "}
              {exam.category}
            </p>

            <p>
              <span className="font-semibold">
                설명:
              </span>{" "}
              {exam.description}
            </p>

          </div>
        </div>

        {/* 빠른 이동 */}

        <div
          className="
            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-slate-100

            p-6
            rounded-xl
            shadow-sm
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            빠른 이동
          </h2>

          <div className="flex flex-wrap gap-3">

            <Button
              onClick={() =>
                navigate(
                  `/exam/${exam.id}/notes`
                )
              }
            >
              학습 노트
            </Button>

            <Button
              onClick={() =>
                navigate(
                  `/exam/${exam.id}/quiz`
                )
              }
            >
              모의고사
            </Button>

            <Button
              onClick={
                toggleFavorite
              }
            >
              {isFavorite
                ? "⭐ 즐겨찾기 제거"
                : "☆ 즐겨찾기 추가"}
            </Button>

          </div>
        </div>

        {/* 실제 학습 현황 */}

        <div
          className="
            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-slate-100

            p-6
            rounded-xl
            shadow-sm
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            학습 현황
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
                        <div className="space-y-3">

              <p>
                <span className="font-semibold">
                  응시 횟수:
                </span>{" "}
                {attemptCount}회
              </p>

              <p>
                <span className="font-semibold">
                  평균 점수:
                </span>{" "}
                {averageScore}%
              </p>

              <p>
                <span className="font-semibold">
                  최고 점수:
                </span>{" "}
                {bestScore}%
              </p>

              <p>
                <span className="font-semibold">
                  저장된 오답:
                </span>{" "}
                {wrongAnswers.length}개
              </p>

              <p>
                <span className="font-semibold">
                  위험 문제:
                </span>{" "}
                {highRiskCount}개
              </p>

            </div>

            <div className="space-y-3">

              <p>
                <span className="font-semibold">
                  현재 레벨:
                </span>{" "}
                Lv.{level}
              </p>

              <p>
                <span className="font-semibold">
                  누적 XP:
                </span>{" "}
                {totalXP}
              </p>

              <p>
                <span className="font-semibold">
                  최근 응시:
                </span>{" "}
                {latestResult
                  ? new Date(
                      latestResult.date
                    ).toLocaleDateString()
                  : "기록 없음"}
              </p>

              <p>
                <span className="font-semibold">
                  풀이 기록:
                </span>{" "}
                {examResults.length}건
              </p>

            </div>

          </div>

          <div
            className="
              grid
              md:grid-cols-3
              gap-4
              mt-6
            "
          >
            <div
              className="
                rounded-xl
                border
                border-red-200
                dark:border-red-800

                bg-red-50
                dark:bg-red-950/30

                text-red-700
                dark:text-red-300

                p-4
              "
            >
              <p className="font-semibold">
                🔥 위험
              </p>

              <p className="text-2xl font-bold mt-2">
                {highRiskCount}
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-yellow-200
                dark:border-yellow-800

                bg-yellow-50
                dark:bg-yellow-950/30

                text-yellow-700
                dark:text-yellow-300

                p-4
              "
            >
              <p className="font-semibold">
                ⚠️ 주의
              </p>

              <p className="text-2xl font-bold mt-2">
                {warningCount}
              </p>
            </div>

            <div
              className="
                rounded-xl
                border
                border-green-200
                dark:border-green-800

                bg-green-50
                dark:bg-green-950/30

                text-green-700
                dark:text-green-300

                p-4
              "
            >
              <p className="font-semibold">
                ✅ 안정
              </p>

              <p className="text-2xl font-bold mt-2">
                {safeCount}
              </p>
            </div>
          </div>

          {topDangerQuestion && (
            <div
              className="
                mt-6

                rounded-xl

                border
                border-red-200
                dark:border-red-800

                bg-red-50
                dark:bg-red-950/30

                p-5
              "
            >
              <h3
                className="
                  text-lg
                  font-semibold

                  text-red-600
                  dark:text-red-300
                "
              >
                🔥 가장 위험한 문제
              </h3>

              <p
                className="
                  mt-3
                  text-slate-800
                  dark:text-slate-200
                  font-medium
                "
              >
                {topDangerQuestion.question}
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-3
                  mt-4
                  text-sm
                "
              >
                <span
                  className="
                    px-3
                    py-1
                    rounded-full

                    bg-red-500
                    text-white
                  "
                >
                  위험도 {getDangerScore(topDangerQuestion)}
                </span>

                <span
                  className="
                    px-3
                    py-1
                    rounded-full

                    bg-slate-200
                    dark:bg-slate-700

                    text-slate-800
                    dark:text-slate-200
                  "
                >
                  오답 {topDangerQuestion.wrongCount}회
                </span>

                <span
                  className="
                    px-3
                    py-1
                    rounded-full

                    bg-blue-200
                    dark:bg-blue-900

                    text-blue-900
                    dark:text-blue-100
                  "
                >
                  복습 {topDangerQuestion.reviewCount}회
                </span>

              </div>
            </div>
          )}

        </div>

        {/* 학습 가이드 */}

        <div
          className="
            bg-white
            dark:bg-slate-900

            text-slate-900
            dark:text-slate-100

            p-6
            rounded-xl
            shadow-sm
          "
        >
          <h2 className="text-xl font-semibold mb-4">
            학습 가이드
          </h2>

          <ol
            className="
              list-decimal
              list-inside
              space-y-2

              text-slate-700
              dark:text-slate-300
            "
          >
            <li>
              시험 정보를 확인하고
              학습 계획을 세웁니다.
            </li>

            <li>
              학습 노트에 핵심
              내용을 정리합니다.
            </li>

            <li>
              모의고사를 통해
              실력을 점검합니다.
            </li>

            <li>
              오답 복습으로
              위험 문제를
              줄여나갑니다.
            </li>

            <li>
              대시보드에서
              성장 통계를
              확인합니다.
            </li>
          </ol>
        </div>

      </div>
    </MainLayout>
  );
}