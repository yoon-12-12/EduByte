export interface RandomQuestion {
  examId: number;

  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const STORAGE_KEY =
  "edubyte_random_quiz";

export function saveRandomQuiz(
  questions: RandomQuestion[]
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(questions)
  );
}

export function getRandomQuiz(): RandomQuestion[] {
  const data =
    localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function clearRandomQuiz() {
  localStorage.removeItem(STORAGE_KEY);
}

export function shuffleArray<T>(
  array: T[]
): T[] {
  const copy = [...array];

  for (
    let i = copy.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [copy[i], copy[j]] = [
      copy[j],
      copy[i],
    ];
  }

  return copy;
}