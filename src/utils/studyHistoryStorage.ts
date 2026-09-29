export interface StudyHistory {
  date: string;
  xp: number;
  quizCount: number;
  reviewCount: number;
}

const STORAGE_KEY =
  "edubyte_study_history";

export function getStudyHistory(): StudyHistory[] {
  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : [];
}

export function saveStudyActivity(
  xp: number,
  quizCount = 0,
  reviewCount = 0
) {
  const history =
    getStudyHistory();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const existing =
    history.find(
      (item: StudyHistory) =>
        item.date === today
    );

  if (existing) {
    existing.xp += xp;
    existing.quizCount +=
      quizCount;
    existing.reviewCount +=
      reviewCount;
  } else {
    history.push({
      date: today,
      xp,
      quizCount,
      reviewCount,
    });
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  );
}

export function clearStudyHistory() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}

export function hasStudiedToday() {
  const history =
    getStudyHistory();

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  return history.some(
    (item: StudyHistory) =>
      item.date === today
  );
}

export function getCurrentStreak() {
  const history =
    getStudyHistory();

  if (
    history.length === 0
  ) {
    return 0;
  }

  const dates =
    history
      .map(
        (
          item: StudyHistory
        ) => item.date
      )
      .sort()
      .reverse();

  let streak = 0;

  const current =
    new Date();

  while (true) {
    const targetDate =
      current
        .toISOString()
        .split("T")[0];

    if (
      dates.includes(
        targetDate
      )
    ) {
      streak++;

      current.setDate(
        current.getDate() - 1
      );
    } else {
      break;
    }
  }

  return streak;
}

export function getBestStreak() {
  const history =
    getStudyHistory();

  const dates =
    history
      .map(
        (
          item: StudyHistory
        ) => item.date
      )
      .sort();

  if (
    dates.length === 0
  ) {
    return 0;
  }

  let best = 1;
  let current = 1;

  for (
    let i = 1;
    i < dates.length;
    i++
  ) {
    const prev =
      new Date(
        dates[i - 1]
      );

    const next =
      new Date(
        dates[i]
      );

    const diff =
      (next.getTime() -
        prev.getTime()) /
      86400000;

    if (diff === 1) {
      current++;

      best = Math.max(
        best,
        current
      );
    } else {
      current = 1;
    }
  }

  return best;
}