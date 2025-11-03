export const timeAgo = (timestamp: number | Date) => {
  const now = Date.now();
  const date = typeof timestamp === 'number' ? timestamp : timestamp.getTime();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 0) return 'in the future';
  if (seconds === 0) return 'just now';

  const intervals: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  let result: string[] = [];
  let remaining = seconds;

  for (const [unit, value] of intervals) {
    const count = Math.floor(remaining / value);
    if (count > 0) {
      const plural = count === 1 ? '' : 's';
      result.push(`${count} ${unit}${plural}`);
      remaining -= count * value;

      // Stop after 2 units
      if (result.length === 2) break;
    }
  }

  // Fallback: if less than a second
  if (result.length === 0) return 'just now';

  // Join with "and"
  return result.length === 1
    ? `${result[0]} ago`
    : `${result[0]} and ${result[1]} ago`;
};
