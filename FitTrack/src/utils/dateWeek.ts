/** Monday 00:00 local time as Date */
export function startOfIsoWeek(d = new Date()): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function toYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function mondayYmdOfWeek(d = new Date()): string {
  return toYmd(startOfIsoWeek(d));
}

/** Consecutive calendar days with ≥1 workout, counting back from last logged day (today if logged, else yesterday, …). */
export function currentWorkoutStreakFromDates(sessionDatesYmd: Set<string>): number {
  const today = toYmd(new Date());
  let check = new Date();
  if (!sessionDatesYmd.has(today)) {
    check.setDate(check.getDate() - 1);
  }
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const ymd = toYmd(check);
    if (sessionDatesYmd.has(ymd)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function ymdInCurrentWeek(ymd: string, now = new Date()): boolean {
  const mon = startOfIsoWeek(now);
  const sun = new Date(mon);
  sun.setDate(sun.getDate() + 6);
  const monS = toYmd(mon);
  const sunS = toYmd(sun);
  return ymd >= monS && ymd <= sunS;
}

export function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return toYmd(dt);
}
