// All date utilities work in *local* time and key days as "YYYY-MM-DD"
// so the calendar, streak counter, and storage all agree on what "today" means.

const WEEKDAYS_LONG = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = MONTHS_LONG.map((m) => m.slice(0, 3));

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const dateKey = (d: Date): string =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const keyToDate = (key: string): Date => {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayKey = (): string => dateKey(new Date());

// "Sunday, September 13"
export const formatHeaderDate = (d: Date = new Date()): string => {
  return `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`;
};

export const monthLabel = (year: number, month: number): string =>
  `${MONTHS_LONG[month]} ${year}`;

export const monthLabelShort = (year: number, month: number): string =>
  `${MONTHS_SHORT[month]} ${year}`;

export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

export const firstWeekdayOfMonth = (year: number, month: number): number =>
  new Date(year, month, 1).getDay();

export const isSameDay = (a: Date, b: Date): boolean => dateKey(a) === dateKey(b);

export const addDays = (d: Date, amount: number): Date => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + amount);
  return copy;
};

export const formatDayLong = (key: string): string => {
  const d = keyToDate(key);
  return `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export const formatMMSS = (totalSeconds: number): string => {
  const clamped = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${pad2(m)}:${pad2(s)}`;
};

// Streak = consecutive logged days ending today (or yesterday, so a rest day
// this morning doesn't zero out last night's streak until the day fully lapses).
export const computeStreak = (loggedDateKeys: Set<string>): number => {
  if (loggedDateKeys.size === 0) return 0;

  let cursor = new Date();
  if (!loggedDateKeys.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!loggedDateKeys.has(dateKey(cursor))) return 0;
  }

  let streak = 0;
  while (loggedDateKeys.has(dateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
};

export { MONTHS_LONG, MONTHS_SHORT, WEEKDAYS_LONG };
