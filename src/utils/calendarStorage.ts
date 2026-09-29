const STORAGE_KEY =
  "edubyte_calendar";

export interface StudyDay {
  date: string;

  solvedQuestions: number;
  xpEarned: number;

  attempts: number;
}

export function getCalendarData(): StudyDay[] {
  const data =
    localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function recordCalendarStudy(
  solvedQuestions: number,
  xpEarned: number
) {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const data =
    getCalendarData();

  const existing =
    data.find(
      (item) =>
        item.date === today
    );

  if (existing) {
    existing.solvedQuestions +=
      solvedQuestions;

    existing.xpEarned +=
      xpEarned;

    existing.attempts += 1;
  } else {
    data.push({
      date: today,
      solvedQuestions,
      xpEarned,
      attempts: 1,
    });
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}