import { Link } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";

import { exams } from "../../data/exams";

export default function Quiz() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="모의고사"
          description="응시할 시험을 선택하세요."
        />

        <div className="grid md:grid-cols-2 gap-4">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              to={`/exam/${exam.id}/quiz`}
            >
              <Card className="hover:shadow-md transition cursor-pointer">
                <h2 className="text-xl font-semibold">
                  {exam.name}
                </h2>

                <p
                  className="
                    text-blue-600
                    dark:text-blue-400
                    text-sm
                    mt-1
                  "
                >
                  {exam.category}
                </p>

                <p
                  className="
                    text-slate-500
                    dark:text-slate-400
                    mt-3
                  "
                >
                  {exam.description}
                </p>

                <div className="mt-4 text-blue-600 font-medium">
                  모의고사 시작 →
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
