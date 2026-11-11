import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import { exams } from "../../data/exams";

export default function RandomExam() {
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] =
    useState<number | "all">("all");

  const [questionCount, setQuestionCount] =
    useState(10);

  const [randomResult, setRandomResult] =
    useState<string>("");

  const startRandomExam = () => {
    let targetExam;

    if (selectedExam === "all") {
      targetExam =
        exams[Math.floor(Math.random() * exams.length)];
    } else {
      targetExam = exams.find(
        (exam) => exam.id === selectedExam
      );
    }

    if (!targetExam) return;

    setRandomResult(targetExam.name);

    setTimeout(() => {
      navigate(
        `/exam/${targetExam.id}/quiz?count=${questionCount}`
      );
    }, 800);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="랜덤 시험 생성"
          description="랜덤으로 시험을 선택하여 학습합니다."
        />

        <Card>
          <div className="space-y-5">
            <div>
              <label className="font-semibold">
                시험 선택
              </label>

              <select
                value={selectedExam}
                onChange={(e) =>
                  setSelectedExam(
                    e.target.value === "all"
                      ? "all"
                      : Number(e.target.value)
                  )
                }
                className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-800"
              >
                <option value="all">전체 시험 랜덤</option>

                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold">
                문제 수
              </label>

              <select
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(Number(e.target.value))
                }
                className="w-full mt-2 p-3 rounded-xl border dark:bg-slate-800"
              >
                <option value={5}>5문제</option>
                <option value={10}>10문제</option>
                <option value={20}>20문제</option>
                <option value={30}>30문제</option>
              </select>
            </div>

            <button
              onClick={startRandomExam}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
            >
              🎲 랜덤 시험 시작
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">
            랜덤 학습 안내
          </h2>
          <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-400">
            <li>• 시험 선택 없이 시작하면 전체 시험 중 랜덤 선택</li>
            <li>• 선택한 문제 수만큼 무작위 출제</li>
            <li>• 보유 문항 수가 선택한 수보다 적으면 전체 문항 출제</li>
            <li>• 기존 XP 및 통계에 결과 반영</li>
          </ul>
        </Card>

        {randomResult && (
          <Card>
            <div className="text-center py-6">
              <p className="text-slate-500">
                선택된 시험
              </p>

              <h2 className="text-3xl font-bold mt-3 text-blue-600">
                {randomResult}
              </h2>

              <p className="mt-4">
                {questionCount}문제 출제를 준비하고 있습니다...
              </p>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
