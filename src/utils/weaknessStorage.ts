import {
  getDangerSortedWrongAnswers,
  type WrongAnswer,
} from "./wrongAnswerStorage";

const STORAGE_KEY =
  "edubyte_weak_questions";

export function generateWeakQuiz(
  count = 10
): WrongAnswer[] {
  const weakQuestions =
    getDangerSortedWrongAnswers();

  return weakQuestions.slice(
    0,
    count
  );
}

export function saveWeakQuiz(
  questions: WrongAnswer[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(questions)
  );
}

export function getWeakQuiz(): WrongAnswer[] {
  const data =
    localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function clearWeakQuiz() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}