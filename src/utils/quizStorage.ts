export interface QuizResult {
  examId: number;
  score: number;
  total: number;
  date: string;

  percentage?: number;
  xpEarned?: number;

  streakBonus?: number;
  perfectBonus?: number;
}

const STORAGE_KEY =
  "edubyte_quiz_results";

const BONUS_XP_KEY =
  "edubyte_bonus_xp";

const STREAK_KEY =
  "edubyte_current_streak";

const BEST_STREAK_KEY =
  "edubyte_best_streak";

const STUDY_DAYS_KEY =
  "edubyte_study_days";

const XP_BOOSTER_KEY =
  "edubyte_xp_booster";

const BOOSTER_COUNT_KEY =
  "edubyte_xp_booster_count";

/* =========================
   시험 결과 저장
========================= */

export function saveQuizResult(
  result: QuizResult
) {
  const existing =
    localStorage.getItem(
      STORAGE_KEY
    );

  const results: QuizResult[] =
    existing
      ? JSON.parse(existing)
      : [];

  const percentage =
    result.total > 0
      ? Math.round(
          (result.score /
            result.total) *
            100
        )
      : 0;

  let xpEarned =
    percentage;

  let perfectBonus = 0;

  if (percentage === 100) {
    perfectBonus = 50;
    xpEarned += 50;
  }

  xpEarned += 20;

  const streak =
    getCurrentStreak();

  let streakBonus = 0;

  if (streak >= 5) {
    streakBonus += 30;
  }

  if (streak >= 10) {
    streakBonus += 50;
  }

  xpEarned += streakBonus;

  if (hasXPBooster()) {
    xpEarned *= 2;
  }

  const newResult: QuizResult = {
    ...result,
    percentage,
    xpEarned,
    perfectBonus,
    streakBonus,
  };

  results.push(newResult);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(results)
  );

  addStudyDay();

  return newResult;
}

/* =========================
   전체 결과 조회
========================= */

export function getQuizResults(): QuizResult[] {
  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : [];
}

/* =========================
   XP 추가
========================= */

export function addXP(
  amount: number
) {
  const current =
    Number(
      localStorage.getItem(
        BONUS_XP_KEY
      ) ?? 0
    );

  localStorage.setItem(
    BONUS_XP_KEY,
    String(current + amount)
  );
}

/* =========================
   XP 차감
========================= */

export function removeXP(
  amount: number
) {
  const current =
    Number(
      localStorage.getItem(
        BONUS_XP_KEY
      ) ?? 0
    );

  const next =
    Math.max(
      0,
      current - amount
    );

  localStorage.setItem(
    BONUS_XP_KEY,
    String(next)
  );
}

/* =========================
   보너스 XP
========================= */

export function getBonusXP(): number {
  return Number(
    localStorage.getItem(
      BONUS_XP_KEY
    ) ?? 0
  );
}

/* =========================
   전체 XP
========================= */

export function getTotalXP(): number {

  return Number(
    localStorage.getItem(
      BONUS_XP_KEY
    ) ?? 0
  );

}

/* =========================
   레벨
========================= */

export function getLevel(): number {
  const xp =
    getTotalXP();

  return (
    Math.floor(xp / 500) + 1
  );
}

/* =========================
   현재 레벨 XP
========================= */

export function getCurrentLevelXP(): number {
  return (
    getTotalXP() % 500
  );
}

/* =========================
   다음 레벨
========================= */

export function getXPToNextLevel(): number {
  return (
    500 -
    getCurrentLevelXP()
  );
}
/* =========================
   스트릭 저장
========================= */

export function getCurrentStreak(): number {
  return Number(
    localStorage.getItem(
      STREAK_KEY
    ) ?? 0
  );
}

export function setCurrentStreak(
  value: number
) {
  localStorage.setItem(
    STREAK_KEY,
    String(value)
  );

  const best =
    getBestStreak();

  if (value > best) {
    setBestStreak(value);
  }
}

export function increaseStreak() {
  const current =
    getCurrentStreak();

  setCurrentStreak(
    current + 1
  );
}

export function resetStreak() {
  localStorage.setItem(
    STREAK_KEY,
    "0"
  );
}

/* =========================
   최고 스트릭
========================= */

export function getBestStreak(): number {
  return Number(
    localStorage.getItem(
      BEST_STREAK_KEY
    ) ?? 0
  );
}

export function setBestStreak(
  value: number
) {
  localStorage.setItem(
    BEST_STREAK_KEY,
    String(value)
  );
}

/* =========================
   학습일 기록
========================= */

export function addStudyDay() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const saved =
    localStorage.getItem(
      STUDY_DAYS_KEY
    );

  const days: string[] =
    saved
      ? JSON.parse(saved)
      : [];

  if (!days.includes(today)) {
    days.push(today);

    localStorage.setItem(
      STUDY_DAYS_KEY,
      JSON.stringify(days)
    );
  }
}

export function getStudyDays(): string[] {
  const saved =
    localStorage.getItem(
      STUDY_DAYS_KEY
    );

  return saved
    ? JSON.parse(saved)
    : [];
}

export function getStudyDayCount(): number {
  return getStudyDays()
    .length;
}

/* =========================
   XP 부스터
========================= */

export function activateXPBooster() {
  localStorage.setItem(
    XP_BOOSTER_KEY,
    "true"
  );
}

export function deactivateXPBooster() {
  localStorage.removeItem(
    XP_BOOSTER_KEY
  );
}

export function hasXPBooster(): boolean {
  return (
    localStorage.getItem(
      XP_BOOSTER_KEY
    ) === "true"
  );
}

/* =========================
   시험별 결과
========================= */

export function getExamResults(
  examId: number
): QuizResult[] {
  return getQuizResults().filter(
    (item) =>
      item.examId === examId
  );
}

/* =========================
   시험 응시 횟수
========================= */

export function getExamAttemptCount(
  examId: number
): number {
  return getExamResults(
    examId
  ).length;
}

/* =========================
   시험 최고 점수
========================= */

export function getExamBestScore(
  examId: number
): number {
  const results =
    getExamResults(examId);

  if (results.length === 0)
    return 0;

  return Math.max(
    ...results.map(
      (item) =>
        Math.round(
          (item.score /
            item.total) *
            100
        )
    )
  );
}

/* =========================
   시험 평균 점수
========================= */

export function getExamAverageScore(
  examId: number
): number {
  const results =
    getExamResults(examId);

  if (results.length === 0)
    return 0;

  const avg =
    results.reduce(
      (sum, item) =>
        sum +
        (item.score /
          item.total) *
          100,
      0
    ) /
    results.length;

  return Math.round(avg);
}

/* =========================
   최근 결과
========================= */

export function getLatestResult(
  examId?: number
): QuizResult | null {
  const results =
    examId
      ? getExamResults(examId)
      : getQuizResults();

  if (results.length === 0)
    return null;

  return results[
    results.length - 1
  ];
}

/* =========================
   전체 평균
========================= */

export function getOverallAverage(): number {
  const results =
    getQuizResults();

  if (results.length === 0)
    return 0;

  const avg =
    results.reduce(
      (sum, item) =>
        sum +
        (item.score /
          item.total) *
          100,
      0
    ) /
    results.length;

  return Math.round(avg);
}

/* =========================
   전체 최고 점수
========================= */

export function getOverallBestScore(): number {
  const results =
    getQuizResults();

  if (results.length === 0)
    return 0;

  return Math.max(
    ...results.map(
      (item) =>
        Math.round(
          (item.score /
            item.total) *
            100
        )
    )
  );
}

/* =========================
   총 풀이 문제 수
========================= */

export function getTotalSolvedQuestions(): number {
  return getQuizResults().reduce(
    (sum, item) =>
      sum + item.total,
    0
  );
}

/* =========================
   XP 초기화
========================= */

export function clearXP() {
  localStorage.removeItem(
    BONUS_XP_KEY
  );

  localStorage.removeItem(
    XP_BOOSTER_KEY
  );
}

/* =========================
   결과 초기화
========================= */

export function clearQuizResults() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}

/* =========================
   전체 진행도 초기화
========================= */

export function clearAllProgress() {
  localStorage.removeItem(
    STORAGE_KEY
  );

  localStorage.removeItem(
    BONUS_XP_KEY
  );

  localStorage.removeItem(
    STREAK_KEY
  );

  localStorage.removeItem(
    BEST_STREAK_KEY
  );

  localStorage.removeItem(
    STUDY_DAYS_KEY
  );

  localStorage.removeItem(
    XP_BOOSTER_KEY
  );
}
export function getXPBoosterCount(): number {

  return Number(
    localStorage.getItem(
      BOOSTER_COUNT_KEY
    ) ?? 0
  );

}

export function addXPBooster(
  count: number = 1
) {

  const current =
    getXPBoosterCount();

  localStorage.setItem(
    BOOSTER_COUNT_KEY,
    String(
      current + count
    )
  );

}

export function consumeXPBooster() {

  const current =
    getXPBoosterCount();

  if (current <= 0)
    return false;

  localStorage.setItem(
    BOOSTER_COUNT_KEY,
    String(
      current - 1
    )
  );

  return true;

}