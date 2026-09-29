import type { Exam } from "../types/exam";

export const exams: Exam[] = [
  {
    id: 1,
    name: "정보처리기사",
    category: "국가기술자격",
    description:
      "소프트웨어 개발 및 정보시스템 관련 자격증",
    questionFile: "engineer.json",
  },

  {
    id: 2,
    name: "SQLD",
    category: "데이터베이스",
    description:
      "SQL 활용 능력을 평가하는 자격증",
    questionFile: "sqld.json",
  },

  {
    id: 3,
    name: "ADsP",
    category: "데이터 분석",
    description:
      "데이터 분석 입문 자격증",
    questionFile: "adsp.json",
  },

  {
    id: 4,
    name: "컴퓨터활용능력 1급",
    category: "OA",
    description:
      "엑셀 및 데이터 처리 능력 평가",
    questionFile: "computer.json",
  },
];