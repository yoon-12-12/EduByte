import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import { exams } from "../../data/exams";

const STORAGE_KEY =
  "edubyte_favorites";

export default function Favorites() {
  const navigate =
    useNavigate();

  const [favorites, setFavorites] =
    useState<number[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (saved) {
      setFavorites(
        JSON.parse(saved)
      );
    }
  }, []);

  const removeFavorite = (
    examId: number
  ) => {
    const updated =
      favorites.filter(
        (id) => id !== examId
      );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    setFavorites(updated);
  };

  const favoriteExams =
    exams.filter((exam) =>
      favorites.includes(exam.id)
    );

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="즐겨찾기"
          description="자주 학습하는 시험"
        />

        {favoriteExams.length === 0 ? (
          <div
            className="
              bg-white
              dark:bg-slate-900

              rounded-xl
              p-8

              border
              border-slate-200
              dark:border-slate-700
            "
          >
            <h2 className="text-2xl font-bold">
              ⭐ 즐겨찾기 없음
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              즐겨찾기에 추가된
              시험이 없습니다.
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              lg:grid-cols-2
              gap-5
            "
          >
            {favoriteExams.map(
              (exam) => (
                <div
                  key={exam.id}
                  className="
                    bg-white
                    dark:bg-slate-900

                    rounded-xl

                    border
                    border-slate-200
                    dark:border-slate-700

                    p-5
                  "
                >
                  <div className="flex justify-between items-start">

                    <div>

                      <h2
                        className="
                          text-xl
                          font-bold
                        "
                      >
                        {exam.name}
                      </h2>

                      <p
                        className="
                          text-sm
                          text-blue-600
                          mt-1
                        "
                      >
                        {exam.category}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        removeFavorite(
                          exam.id
                        )
                      }
                      className="
                        text-red-500
                        hover:text-red-700
                      "
                    >
                      삭제
                    </button>

                  </div>

                  <p
                    className="
                      mt-4
                      text-slate-600
                      dark:text-slate-400
                    "
                  >
                    {exam.description}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/exam/${exam.id}`
                      )
                    }
                    className="
                      mt-5
                      w-full

                      py-3

                      rounded-lg

                      bg-blue-600
                      hover:bg-blue-700

                      text-white
                      font-semibold

                      transition-colors
                    "
                  >
                    시험 바로가기
                  </button>

                </div>
              )
            )}
          </div>
        )}

      </div>
    </MainLayout>
  );
}