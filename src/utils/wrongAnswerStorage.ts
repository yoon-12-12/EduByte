export interface WrongAnswer {
  examId: number;
  questionId: number;

  question: string;
  options: string[];
  answer: number;
  explanation: string;

  wrongCount: number;

  reviewCount: number;
  solvedCount: number;

  lastWrongDate: string;
  lastReviewDate?: string;
}

const STORAGE_KEY =
  "edubyte_wrong_answers";

/* =========================
   오답 저장
========================= */

export function saveWrongAnswer(
  wrongAnswer: Omit<
    WrongAnswer,
    | "wrongCount"
    | "reviewCount"
    | "solvedCount"
    | "lastWrongDate"
    | "lastReviewDate"
  >
) {
  const existing =
    localStorage.getItem(STORAGE_KEY);

  const wrongAnswers: WrongAnswer[] =
    existing
      ? JSON.parse(existing)
      : [];

  const existingIndex =
    wrongAnswers.findIndex(
      (item) =>
        item.examId ===
          wrongAnswer.examId &&
        item.questionId ===
          wrongAnswer.questionId
    );

  if (existingIndex >= 0) {
    wrongAnswers[
      existingIndex
    ].wrongCount += 1;

      // 다시 틀렸으므로 해결 상태 해제
    wrongAnswers[
      existingIndex
    ].solvedCount = 0;

    wrongAnswers[
      existingIndex
    ].lastWrongDate =
      new Date().toISOString();
  } else {
    wrongAnswers.push({
      ...wrongAnswer,

      wrongCount: 1,

      reviewCount: 0,
      solvedCount: 0,

      lastWrongDate:
        new Date().toISOString(),
    });
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(wrongAnswers)
  );
}

/* =========================
   전체 조회
========================= */

export function getWrongAnswers(): WrongAnswer[] {
  const data =
    localStorage.getItem(STORAGE_KEY);

  return data
    ? JSON.parse(data)
    : [];
}

/* =========================
   특정 시험 오답
========================= */

export function getExamWrongAnswers(
  examId: number
): WrongAnswer[] {
  return getWrongAnswers().filter(
    (item) =>
      item.examId === examId
  );
}

/* =========================
   오답 삭제
========================= */

export function deleteWrongAnswer(
  examId: number,
  questionId: number
) {
  const wrongAnswers =
    getWrongAnswers();

  const filtered =
    wrongAnswers.filter(
      (item) =>
        !(
          item.examId === examId &&
          item.questionId ===
            questionId
        )
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  );
}

/* =========================
   복습 성공 기록
========================= */

export function recordReviewSuccess(
  examId: number,
  questionId: number
) {
  const wrongAnswers =
    getWrongAnswers();

  const target =
    wrongAnswers.find(
      (item) =>
        item.examId === examId &&
        item.questionId ===
          questionId
    );

  if (!target) return;

  target.reviewCount += 1;
  target.solvedCount += 1;

  target.lastReviewDate =
    new Date().toISOString();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(wrongAnswers)
  );
}

/* =========================
   복습 실패 기록
========================= */

export function recordReviewFail(
  examId: number,
  questionId: number
) {
  const wrongAnswers =
    getWrongAnswers();

  const target =
    wrongAnswers.find(
      (item) =>
        item.examId === examId &&
        item.questionId ===
          questionId
    );

  if (!target) return;

  target.reviewCount += 1;

  target.lastReviewDate =
    new Date().toISOString();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(wrongAnswers)
  );
}

/* =========================
   위험도 계산
========================= */

export function getDangerScore(
  item: WrongAnswer
): number {
  return (
    item.wrongCount * 10 +
    (item.reviewCount -
      item.solvedCount) *
      3
  );
}

/* =========================
   위험도 정렬
========================= */

export function getDangerSortedWrongAnswers(): WrongAnswer[] {
  return getWrongAnswers().sort(
    (a, b) =>
      getDangerScore(b) -
      getDangerScore(a)
  );
}

/* =========================
   전체 오답 수
========================= */

export function getTotalWrongCount(): number {
  return getWrongAnswers()
    .length;
}

/* =========================
   해결된 오답 수
========================= */

export function getSolvedWrongCount(): number {
  return getWrongAnswers().reduce(
    (sum, item) =>
      sum + item.solvedCount,
    0
  );
}

/* =========================
   전체 복습 횟수
========================= */

export function getTotalReviewCount(): number {
  return getWrongAnswers().reduce(
    (sum, item) =>
      sum + item.reviewCount,
    0
  );
}

/* =========================
   복습 성공률
========================= */

export function getReviewSuccessRate(): number {
  const wrongAnswers =
    getWrongAnswers();

  let reviewCount = 0;
  let solvedCount = 0;

  wrongAnswers.forEach(
    (item) => {
      reviewCount +=
        item.reviewCount;

      solvedCount +=
        item.solvedCount;
    }
  );

  if (reviewCount === 0)
    return 0;

  return Math.round(
    (solvedCount /
      reviewCount) *
      100
  );
}

/* =========================
   위험도 TOP 5
========================= */

export function getTopDangerQuestions(
  limit = 5
): WrongAnswer[] {
  return getDangerSortedWrongAnswers().slice(
    0,
    limit
  );
}

/* =========================
   데이터 초기화
========================= */

export function clearWrongAnswers() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}

export function clearAllNotes() {
  Object.keys(localStorage).forEach(
    (key) => {
      if (key.startsWith("notes_")) {
        localStorage.removeItem(key);
      }
    }
  );
}