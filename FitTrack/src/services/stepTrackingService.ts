import {PermissionsAndroid, Platform} from 'react-native';
import GoogleFit from 'react-native-google-fit';

export type StepDaySample = {
  date: string; // YYYY-MM-DD
  value: number;
};

export type StepPermissionResult = {
  granted: boolean;
  message?: string;
};

const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;

const fromYmd = (ymd: string) => new Date(`${ymd}T00:00:00`);

const addDays = (d: Date, days: number) => {
  const n = new Date(d);
  n.setDate(n.getDate() + days);
  return n;
};

function normalizeSamples(raw: any[]): StepDaySample[] {
  const map = new Map<string, number>();
  for (const source of raw || []) {
    const steps = Array.isArray(source?.steps) ? source.steps : [];
    for (const row of steps) {
      const dateRaw = typeof row?.date === 'string' ? row.date : '';
      const date = dateRaw.slice(0, 10);
      if (!date) {
        continue;
      }
      const value = Number(row?.value) || 0;
      map.set(date, (map.get(date) || 0) + value);
    }
  }
  return [...map.entries()]
    .map(([date, value]) => ({date, value: Math.max(0, Math.round(value))}))
    .sort((a, b) => a.date.localeCompare(b.date));
}

async function authorizeAndroid(): Promise<StepPermissionResult> {
  try {
    // Android 10+ requires runtime permission for step counters.
    const androidVersion =
      typeof Platform.Version === 'number'
        ? Platform.Version
        : parseInt(String(Platform.Version), 10) || 0;
    if (androidVersion >= 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        return {
          granted: false,
          message: 'ACTIVITY_RECOGNITION permission denied',
        };
      }
    }

    const auth = await GoogleFit.authorize({
      scopes: [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.location.read',
      ],
    } as any);
    const a = auth as unknown;
    const ok =
      a === true ||
      (typeof a === 'object' &&
        a !== null &&
        Boolean((a as {success?: boolean}).success));
    return {
      granted: !!ok,
      message: ok ? undefined : 'Google Fit authorization denied',
    };
  } catch (e) {
    return {granted: false, message: String(e)};
  }
}

async function authorizeIos(): Promise<StepPermissionResult> {
  try {
    // react-native-google-fit maps to HealthKit on iOS builds.
    const auth = await (GoogleFit as any).authorize?.();
    const a = auth as unknown;
    const ok =
      a === true ||
      (typeof a === 'object' &&
        a !== null &&
        Boolean((a as {success?: boolean}).success));
    return {granted: !!ok, message: ok ? undefined : 'Health permission denied'};
  } catch (e) {
    return {granted: false, message: String(e)};
  }
}

export async function requestStepAccess(): Promise<StepPermissionResult> {
  return Platform.OS === 'android' ? authorizeAndroid() : authorizeIos();
}

export async function getTodaySteps(): Promise<number> {
  const list = normalizeSamples(await GoogleFit.getDailySteps(new Date()));
  const today = toYmd(new Date());
  const found = list.find(x => x.date === today);
  return found?.value ?? 0;
}

export async function getStepHistory(days = 7): Promise<StepDaySample[]> {
  const end = new Date();
  const start = addDays(end, -(Math.max(1, days) - 1));
  const list = normalizeSamples(
    await GoogleFit.getDailyStepCountSamples({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    } as any),
  );

  const out: StepDaySample[] = [];
  for (let i = 0; i < days; i++) {
    const ymd = toYmd(addDays(fromYmd(toYmd(start)), i));
    const found = list.find(x => x.date === ymd);
    out.push({date: ymd, value: found?.value ?? 0});
  }
  return out;
}
