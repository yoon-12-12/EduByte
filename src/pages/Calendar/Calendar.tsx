import { useMemo, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  getStudyHistory,
  type StudyHistory,
} from "../../utils/studyHistoryStorage";

export default function Calendar() {
  const history =
    getStudyHistory();

  const today =
    new Date();

  const [selectedDate, setSelectedDate] =
    useState<StudyHistory | null>(
      null
    );

  const currentYear =
    today.getFullYear();

  const currentMonth =
    today.getMonth();

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  const calendarDays =
    useMemo(() => {
      const days = [];

      for (
        let i = 0;
        i < firstDay;
        i++
      ) {
        days.push(null);
      }

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        days.push(day);
      }

      return days;
    }, [
      firstDay,
      daysInMonth,
    ]);

  const getHistoryForDay = (
    day: number
  ) => {
    const date =
      `${currentYear}-${String(
        currentMonth + 1
      ).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

    return history.find(
      (
        item: StudyHistory
      ) =>
        item.date === date
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="학습 캘린더"
          description="날짜별 학습 기록을 확인하세요."
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
            shadow-sm
          "
        >
          <h2 className="text-2xl font-bold mb-6">
            📅 {currentYear}년 {currentMonth + 1}월
          </h2>

          <div className="grid grid-cols-7 gap-2 mb-4 text-center font-semibold">
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(
              (day, index) => {

                if (
                  day === null
                ) {
                  return (
                    <div
                      key={index}
                      className="h-16"
                    />
                  );
                }

                const study =
                  getHistoryForDay(
                    day
                  );

                const bgColor =
                  study
                    ? study.xp >=
                      200
                      ? "bg-yellow-400 text-black"
                      : "bg-green-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800";

                return (
                  <button
                    key={day}
                    onClick={() =>
                      setSelectedDate(
                        study ??
                          null
                      )
                    }
                    className={`
                      h-16
                      rounded-lg
                      border
                      text-sm
                      font-medium
                      transition
                      ${bgColor}
                    `}
                  >
                    {day}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {selectedDate && (
          <div
            className="
              bg-white
              dark:bg-slate-900
              border
              border-slate-200
              dark:border-slate-700
              rounded-xl
              p-6
              shadow-sm
            "
          >
            <h2 className="text-xl font-bold">
              {selectedDate.date}
            </h2>

            <div className="mt-4 space-y-2">

              <p>
                ⭐ 획득 XP :
                {" "}
                {selectedDate.xp}
              </p>

              <p>
                📝 시험 :
                {" "}
                {selectedDate.quizCount}
                회
              </p>

              <p>
                🔁 복습 :
                {" "}
                {selectedDate.reviewCount}
                회
              </p>

            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}