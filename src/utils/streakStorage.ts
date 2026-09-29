export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
}

const STORAGE_KEY = "edubyte_streak";

/* =========================
   기본 데이터
========================= */

function getDefaultData(): StreakData {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
  };
}

/* =========================
   데이터 조회
========================= */

export function getStreakData(): StreakData {
  const data =
    localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return getDefaultData();
  }

  return JSON.parse(data);
}

/* =========================
   저장
========================= */

function saveData(
  data: StreakData
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

/* =========================
   날짜 문자열 생성
========================= */

function getTodayString() {
  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================
   날짜 차이
========================= */

function getDayDiff(
  date1: string,
  date2: string
) {
  const d1 =
    new Date(date1);

  const d2 =
    new Date(date2);

  const diff =
    d2.getTime() -
    d1.getTime();

  return Math.floor(
    diff /
      (1000 *
        60 *
        60 *
        24)
  );
}

/* =========================
   학습 기록
========================= */

export function recordStudy() {
  const data =
    getStreakData();

  const today =
    getTodayString();

  if (
    data.lastStudyDate ===
    today
  ) {
    return data;
  }

  if (
    data.lastStudyDate === null
  ) {
    data.currentStreak = 1;
  } else {
    const diff =
      getDayDiff(
        data.lastStudyDate,
        today
      );

    if (diff === 1) {
      data.currentStreak += 1;
    } else if (
      diff > 1
    ) {
      data.currentStreak = 1;
    }
  }

  if (
    data.currentStreak >
    data.longestStreak
  ) {
    data.longestStreak =
      data.currentStreak;
  }

  data.lastStudyDate =
    today;

  saveData(data);

  return data;
}

/* =========================
   현재 스트릭
========================= */

export function getCurrentStreak() {
  return getStreakData()
    .currentStreak;
}

/* =========================
   최고 스트릭
========================= */

export function getLongestStreak() {
  return getStreakData()
    .longestStreak;
}

/* =========================
   마지막 학습일
========================= */

export function getLastStudyDate() {
  return getStreakData()
    .lastStudyDate;
}

/* =========================
   오늘 학습 여부
========================= */

export function hasStudiedToday() {
  const data =
    getStreakData();

  return (
    data.lastStudyDate ===
    getTodayString()
  );
}

/* =========================
   초기화
========================= */

export function clearStreakData() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}