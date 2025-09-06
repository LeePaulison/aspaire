export function parseDateTime(dateTimeString) {
  if (!dateTimeString) return null;

  const num = typeof dateTimeString === 'number' ? dateTimeString : Number(dateTimeString);

  let date;
  if (!Number.isNaN(num)) {
    // If it's a valid number, treat it as a timestamp (in seconds or milliseconds)
    date = num > 1e12 ? new Date(num) : new Date(num * 1000);
  } else {
    // Otherwise, try to parse it as an ISO date string
    date = new Date(dateTimeString);
  }

  return isNaN(date.getTime()) ? null : date;
}

export function formatDate(date) {
  if (!date) return 'Invalid date';

  const parsedDate = date instanceof Date ? date : parseDateTime(date);
  if (!parsedDate) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(parsedDate);
}
