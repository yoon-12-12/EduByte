export interface ReviewStats {
  totalReview: number;
  successReview: number;
}

const STORAGE_KEY =
  "edubyte_review_stats";

export function getReviewStats(): ReviewStats {
  const data =
    localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return {
      totalReview: 0,
      successReview: 0,
    };
  }

  return JSON.parse(data);
}

export function recordReviewSuccessStat() {
  const stats =
    getReviewStats();

  stats.totalReview += 1;
  stats.successReview += 1;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stats)
  );
}

export function recordReviewFailStat() {
  const stats =
    getReviewStats();

  stats.totalReview += 1;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stats)
  );
}

export function getReviewSuccessRateStat() {
  const stats =
    getReviewStats();

  if (stats.totalReview === 0)
    return 0;

  return Math.round(
    (stats.successReview /
      stats.totalReview) *
      100
  );
}

export function clearReviewStats() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}