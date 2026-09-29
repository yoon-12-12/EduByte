import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  getLevel,
  getTotalXP,
  getQuizResults,
  clearXP,
  clearQuizResults,
  clearAllProgress,
} from "../../utils/quizStorage";

import {
  clearShopInventory,
} from "../../utils/xpShopStorage.ts";

import {
  clearStudyHistory,
} from "../../utils/studyHistoryStorage";

import {
  getWrongAnswers,
  clearWrongAnswers,
  clearAllNotes,
} from "../../utils/wrongAnswerStorage";
import { clearReviewStats } from "../../utils/reviewStats";

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

export default function Settings() {

  /* =========================
     다크모드
  ========================= */

  const [darkMode, setDarkMode] =
    useState(false);

  /* =========================
     학습 설정
  ========================= */

  const [
    autoSaveWrong,
    setAutoSaveWrong,
  ] = useState(true);

  const [
    dangerSort,
    setDangerSort,
  ] = useState(true);

  const [
    xpAnimation,
    setXpAnimation,
  ] = useState(true);

  /* =========================
     통계
  ========================= */

  const level =
    getLevel();

  const totalXP =
    getTotalXP();

  const totalAttempts =
    getQuizResults().length;

  const wrongCount =
    getWrongAnswers().length;

  /* =========================
     초기 로드
  ========================= */

  useEffect(() => {

    const savedDark =
      localStorage.getItem(
        "edubyte_darkmode"
      );

    setDarkMode(
      savedDark === "true"
    );

    const savedAutoSave =
      localStorage.getItem(
        "edubyte_auto_save_wrong"
      );

    const savedDangerSort =
      localStorage.getItem(
        "edubyte_danger_sort"
      );

    const savedXPAnimation =
      localStorage.getItem(
        "edubyte_xp_animation"
      );

    if (
      savedAutoSave !== null
    ) {
      setAutoSaveWrong(
        savedAutoSave === "true"
      );
    }

    if (
      savedDangerSort !== null
    ) {
      setDangerSort(
        savedDangerSort === "true"
      );
    }

    if (
      savedXPAnimation !== null
    ) {
      setXpAnimation(
        savedXPAnimation === "true"
      );
    }

  }, []);
    /* =========================
     다크모드 토글
  ========================= */

  const toggleDarkMode = () => {

    const next =
      !darkMode;

    setDarkMode(next);

    localStorage.setItem(
      "edubyte_darkmode",
      String(next)
    );

    if (next) {
      document.documentElement.classList.add(
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );
    }

    window.dispatchEvent(
      new Event(
        "darkmode-change"
      )
    );
  };

  /* =========================
     학습 설정 토글
  ========================= */

  const toggleAutoSaveWrong =
    () => {

      const next =
        !autoSaveWrong;

      setAutoSaveWrong(next);

      localStorage.setItem(
        "edubyte_auto_save_wrong",
        String(next)
      );
    };

  const toggleDangerSort =
    () => {

      const next =
        !dangerSort;

      setDangerSort(next);

      localStorage.setItem(
        "edubyte_danger_sort",
        String(next)
      );
    };

  const toggleXPAnimation =
    () => {

      const next =
        !xpAnimation;

      setXpAnimation(next);

      localStorage.setItem(
        "edubyte_xp_animation",
        String(next)
      );
    };

  /* =========================
     XP 초기화
  ========================= */

  const handleClearXP =
    () => {

      const confirmed =
        window.confirm(
          "누적 XP를 초기화하시겠습니까?"
        );

      if (!confirmed)
        return;

      clearXP();

      alert(
        "XP가 초기화되었습니다."
      );

      window.location.reload();
    };

  /* =========================
     시험 기록 초기화
  ========================= */

  const handleClearQuizResults =
    () => {

      const confirmed =
        window.confirm(
          "시험 기록을 모두 삭제하시겠습니까?"
        );

      if (!confirmed)
        return;

      clearQuizResults();

      alert(
        "시험 기록이 삭제되었습니다."
      );

      window.location.reload();
    };

  /* =========================
     오답노트 초기화
  ========================= */

  const handleClearWrongAnswers =
    () => {

      const confirmed =
        window.confirm(
          "오답노트를 모두 삭제하시겠습니까?"
        );

      if (!confirmed)
        return;

      clearWrongAnswers();

      alert(
        "오답노트가 삭제되었습니다."
      );

      window.location.reload();
    };

  /* =========================
     전체 데이터 초기화
  ========================= */

  const handleClearAll =
    () => {

      const confirmed =
        window.confirm(
          "모든 학습 데이터를 삭제하시겠습니까?\n\n레벨, XP, 시험기록, 오답노트가 모두 삭제됩니다."
        );

      if (!confirmed)
        return;

      clearAllProgress();
      clearWrongAnswers();
      clearReviewStats();
      clearAllNotes();

      clearShopInventory();

      clearStudyHistory();

      alert(
        "모든 데이터가 초기화되었습니다."
      );

      window.location.reload();
    };
      return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="설정"
          description="앱 환경 및 학습 설정"
        />

        {/* 학습 현황 */}

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
              시험 응시
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2

                text-green-600
              "
            >
              {totalAttempts}
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
              오답 개수
            </p>

            <p
              className="
                text-3xl
                font-bold
                mt-2

                text-red-500
              "
            >
              {wrongCount}
            </p>
          </div>

        </div>

        {/* 다크모드 */}

        <div
          className={`${cardClass} p-6`}
        >

          <div
            className="
              flex
              justify-between
              items-center
            "
          >

            <div>
              <h2
                className="
                  text-lg
                  font-semibold
                "
              >
                다크 모드
              </h2>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                화면 색상을 변경합니다.
              </p>
            </div>

            <button
              onClick={
                toggleDarkMode
              }
              className={`
                px-4
                py-2

                rounded-lg

                text-white
                font-medium

                transition

                ${
                  darkMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-slate-600 hover:bg-slate-700"
                }
              `}
            >
              {darkMode
                ? "ON"
                : "OFF"}
            </button>

          </div>

        </div>

        {/* 학습 설정 */}

        <div
          className={`${cardClass} p-6`}
        >

          <h2
            className="
              text-lg
              font-semibold
              mb-5
            "
          >
            학습 설정
          </h2>

          <div className="space-y-5">

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <div>
                <p className="font-medium">
                  자동 오답 저장
                </p>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  틀린 문제를 자동으로
                  오답노트에 저장합니다.
                </p>
              </div>

              <button
                onClick={
                  toggleAutoSaveWrong
                }
                className={`
                  px-4
                  py-2

                  rounded-lg

                  text-white
                  font-medium

                  ${
                    autoSaveWrong
                      ? "bg-green-600"
                      : "bg-slate-600"
                  }
                `}
              >
                {autoSaveWrong
                  ? "ON"
                  : "OFF"}
              </button>

            </div>

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <div>
                <p className="font-medium">
                  위험도 우선 정렬
                </p>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  위험도가 높은 오답을
                  먼저 표시합니다.
                </p>
              </div>

              <button
                onClick={
                  toggleDangerSort
                }
                className={`
                  px-4
                  py-2

                  rounded-lg

                  text-white
                  font-medium

                  ${
                    dangerSort
                      ? "bg-green-600"
                      : "bg-slate-600"
                  }
                `}
              >
                {dangerSort
                  ? "ON"
                  : "OFF"}
              </button>

            </div>

            <div
              className="
                flex
                justify-between
                items-center
              "
            >

              <div>
                <p className="font-medium">
                  XP 애니메이션
                </p>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  XP 획득 효과를
                  표시합니다.
                </p>
              </div>

              <button
                onClick={
                  toggleXPAnimation
                }
                className={`
                  px-4
                  py-2

                  rounded-lg

                  text-white
                  font-medium

                  ${
                    xpAnimation
                      ? "bg-green-600"
                      : "bg-slate-600"
                  }
                `}
              >
                {xpAnimation
                  ? "ON"
                  : "OFF"}
              </button>

            </div>

          </div>

        </div>
                {/* 데이터 관리 */}

        <div
          className={`${cardClass} p-6`}
        >

          <h2
            className="
              text-lg
              font-semibold
              mb-5
            "
          >
            데이터 관리
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-4
            "
          >

            <button
              onClick={
                handleClearXP
              }
              className="
                p-4

                rounded-xl

                bg-yellow-600
                hover:bg-yellow-700

                text-white
                font-medium

                transition
              "
            >
              XP 초기화
            </button>

            <button
              onClick={
                handleClearQuizResults
              }
              className="
                p-4

                rounded-xl

                bg-blue-600
                hover:bg-blue-700

                text-white
                font-medium

                transition
              "
            >
              시험 기록 초기화
            </button>

            <button
              onClick={
                handleClearWrongAnswers
              }
              className="
                p-4

                rounded-xl

                bg-orange-600
                hover:bg-orange-700

                text-white
                font-medium

                transition
              "
            >
              오답노트 초기화
            </button>

            <button
              onClick={
                handleClearAll
              }
              className="
                p-4

                rounded-xl

                bg-red-600
                hover:bg-red-700

                text-white
                font-medium

                transition
              "
            >
              전체 데이터 초기화
            </button>

          </div>

          <p
            className="
              mt-4
              text-sm

              text-slate-500
              dark:text-slate-400
            "
          >
            초기화된 데이터는 복구할 수 없습니다.
          </p>

        </div>

        {/* 앱 정보 */}

        <div
          className={`${cardClass} p-6`}
        >

          <h2
            className="
              text-lg
              font-semibold
              mb-4
            "
          >
            앱 정보
          </h2>

          <div className="space-y-3">

            <div
              className="
                flex
                justify-between
              "
            >
              <span>앱 이름</span>

              <span className="font-medium">
                EduByte
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>제작</span>

              <span className="font-medium">
                EduForge
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>버전</span>

              <span className="font-medium">
                v2.0.0
              </span>
            </div>

            <div
              className="
                flex
                justify-between
              "
            >
              <span>기술 스택</span>

              <span className="font-medium">
                React · TypeScript · TailwindCSS
              </span>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}