export interface FavoriteQuestion {
  examId: number;
  questionId: number;

  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const STORAGE_KEY =
  "edubyte_favorite_questions";

export function getFavorites(): FavoriteQuestion[] {
  const data =
    localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

export function addFavorite(
  question: FavoriteQuestion
) {
  const favorites =
    getFavorites();

  const exists =
    favorites.some(
      (item) =>
        item.examId === question.examId &&
        item.questionId === question.questionId
    );

  if (exists) return;

  favorites.push(question);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(favorites)
  );
}

export function removeFavorite(
  examId: number,
  questionId: number
) {
  const favorites =
    getFavorites();

  const filtered =
    favorites.filter(
      (item) =>
        !(
          item.examId === examId &&
          item.questionId === questionId
        )
    );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  );
}

export function isFavorite(
  examId: number,
  questionId: number
) {
  return getFavorites().some(
    (item) =>
      item.examId === examId &&
      item.questionId === questionId
  );
}