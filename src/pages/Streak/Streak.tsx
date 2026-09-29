import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  getCurrentStreak,
  getBestStreak,
  hasStudiedToday,
  getStudyHistory,
} from "../../utils/studyHistoryStorage";

export default function Streak() {

  const currentStreak =
    getCurrentStreak();

  const bestStreak =
    getBestStreak();

  const studiedToday =
    hasStudiedToday();

  const totalDays =
    getStudyHistory().length;

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="학습 스트릭"
          description="연속 학습 기록"
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
          <h2 className="text-3xl font-bold">
            🔥 현재 스트릭
          </h2>

          <p className="text-5xl font-bold mt-4 text-orange-500">
            {currentStreak}일
          </p>
        </div>

        <div
          className="
            grid
            md:grid-cols-2
            gap-4
          "
        >
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
            <h3 className="font-semibold">
              🏆 최고 스트릭
            </h3>

            <p className="text-3xl font-bold mt-3">
              {bestStreak}일
            </p>
          </div>

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
            <h3 className="font-semibold">
              📅 오늘 학습
            </h3>

            <p className="text-3xl font-bold mt-3">
              {studiedToday
                ? "✅ 완료"
                : "❌ 미완료"}
            </p>
          </div>
        </div>

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
          <h3 className="font-semibold">
            📊 누적 학습일
          </h3>

          <p className="text-3xl font-bold mt-3">
            {totalDays}일
          </p>
        </div>

      </div>
    </MainLayout>
  );
}