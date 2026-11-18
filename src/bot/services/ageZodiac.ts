import { getZodiacByDate, ZODIAC_SIGNS, type ZodiacSignInfo } from "@/bot/data/zodiac";

export interface ParsedBirthDate {
  year: number;
  month: number;
  day: number;
}

const ARABIC_DAYS = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function toAsciiDigits(raw: string): string {
  const arabicIndic = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return [...raw]
    .map((ch) => {
      const a = arabicIndic.indexOf(ch);
      if (a !== -1) return String(a);
      const p = persian.indexOf(ch);
      if (p !== -1) return String(p);
      return ch;
    })
    .join("");
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  const currentYear = new Date().getUTCFullYear();
  if (year < 1900 || year > currentYear) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const testDate = new Date(Date.UTC(year, month - 1, day));
  if (
    testDate.getUTCFullYear() !== year ||
    testDate.getUTCMonth() !== month - 1 ||
    testDate.getUTCDate() !== day
  ) {
    return false;
  }
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return testDate.getTime() <= todayUtc;
}

export function parseBirthDate(rawInput: string): ParsedBirthDate | null {
  const cleaned = toAsciiDigits(rawInput.trim());
  const ymdMatch = cleaned.match(/^(\d{4})[-/.\s](\d{1,2})[-/.\s](\d{1,2})$/);
  if (ymdMatch) {
    const year = Number(ymdMatch[1]);
    const month = Number(ymdMatch[2]);
    const day = Number(ymdMatch[3]);
    return isValidCalendarDate(year, month, day) ? { year, month, day } : null;
  }

  const dmyMatch = cleaned.match(/^(\d{1,2})[-/.\s](\d{1,2})[-/.\s](\d{4})$/);
  if (dmyMatch) {
    const day = Number(dmyMatch[1]);
    const month = Number(dmyMatch[2]);
    const year = Number(dmyMatch[3]);
    return isValidCalendarDate(year, month, day) ? { year, month, day } : null;
  }

  return null;
}

export interface AgeCalculationResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  daysUntilNextBirthday: number;
  isBirthdayToday: boolean;
  bornDayName: string;
  zodiac: ZodiacSignInfo;
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function birthdayInYear(birth: ParsedBirthDate, year: number): number {
  if (birth.month === 2 && birth.day === 29 && daysInMonth(year, 2) === 28) {
    return Date.UTC(year, 2, 1);
  }
  return Date.UTC(year, birth.month - 1, birth.day);
}

function monthsFromDate(year: number, month: number, day: number, count: number): number {
  const monthIndex = year * 12 + month - 1 + count;
  const resultYear = Math.floor(monthIndex / 12);
  const resultMonth = (monthIndex % 12) + 1;
  return Date.UTC(resultYear, resultMonth - 1, Math.min(day, daysInMonth(resultYear, resultMonth)));
}

export function calculateAgeDetails(birth: ParsedBirthDate, now: Date = new Date()): AgeCalculationResult {
  const todayYear = now.getUTCFullYear();
  const todayMonth = now.getUTCMonth() + 1;
  const todayDay = now.getUTCDate();
  const todayUtcMs = Date.UTC(todayYear, todayMonth - 1, todayDay);
  const birthUtcMs = Date.UTC(birth.year, birth.month - 1, birth.day);

  let years = todayYear - birth.year;
  if (birthdayInYear(birth, birth.year + years) > todayUtcMs) {
    years -= 1;
  }

  const ageYearStart = new Date(birthdayInYear(birth, birth.year + years));
  const anchorYear = ageYearStart.getUTCFullYear();
  const anchorMonth = ageYearStart.getUTCMonth() + 1;
  const anchorDay = ageYearStart.getUTCDate();
  let months = 0;
  while (months < 11 && monthsFromDate(anchorYear, anchorMonth, anchorDay, months + 1) <= todayUtcMs) {
    months += 1;
  }
  const days = Math.floor((todayUtcMs - monthsFromDate(anchorYear, anchorMonth, anchorDay, months)) / 86_400_000);
  const totalDays = Math.max(0, Math.floor((todayUtcMs - birthUtcMs) / 86_400_000));
  const totalHours = totalDays * 24;

  let nextBirthdayMs = birthdayInYear(birth, todayYear);
  if (nextBirthdayMs < todayUtcMs) {
    nextBirthdayMs = birthdayInYear(birth, todayYear + 1);
  }
  const isBirthdayToday = nextBirthdayMs === todayUtcMs;
  const daysUntilNextBirthday = Math.max(0, Math.round((nextBirthdayMs - todayUtcMs) / 86_400_000));

  const bornDayName = ARABIC_DAYS[new Date(birthUtcMs).getUTCDay()] ?? "";
  const zodiac = getZodiacByDate(birth.day, birth.month);

  return {
    years,
    months,
    days,
    totalDays,
    totalHours,
    daysUntilNextBirthday,
    isBirthdayToday,
    bornDayName,
    zodiac,
  };
}

export function formatAgeMessage(birth: ParsedBirthDate): string {
  const info = calculateAgeDetails(birth);
  const paddedMonth = String(birth.month).padStart(2, "0");
  const paddedDay = String(birth.day).padStart(2, "0");

  const birthdayLine = info.isBirthdayToday
    ? "🎉 <b>كل عام وأنت بخير! عيد ميلادك اليوم!</b> 🎂"
    : `⏳ المتبقي لعيد ميلادك القادم: <b>${info.daysUntilNextBirthday} يوم</b>`;

  return (
    `🎂 <b>نتيجة حساب العمر الدقيق</b>\n\n` +
    `📅 تاريخ الميلاد: <b>${birth.year}-${paddedMonth}-${paddedDay}</b> (${info.bornDayName})\n` +
    `🕰️ عمرك الحالي:\n` +
    `• <b>${info.years}</b> سنة، و<b>${info.months}</b> شهراً، و<b>${info.days}</b> يوماً\n\n` +
    `📊 إحصائيات عمرك:\n` +
    `• إجمالي الأيام: <b>${info.totalDays.toLocaleString("en-US")}</b> يوم\n` +
    `• إجمالي الساعات: <b>${info.totalHours.toLocaleString("en-US")}</b> ساعة\n\n` +
    `${birthdayLine}\n` +
    `${info.zodiac.symbol} برجك: <b>${info.zodiac.nameAr}</b> (${info.zodiac.element})`
  );
}

export function formatZodiacMessage(sign: ZodiacSignInfo): string {
  const traitsList = sign.traits.map((t) => `• ${t}`).join("\n");
  return (
    `${sign.symbol} <b>${sign.nameAr}</b>\n\n` +
    `📅 الفترة: <b>${sign.dateRange}</b>\n` +
    `✨ العنصر: <b>${sign.element}</b>\n` +
    `🪐 الكوكب الحاكم: <b>${sign.planet}</b>\n\n` +
    `💎 أبرز الصفات:\n${traitsList}\n\n` +
    `💞 الأبراج الأكثر توافقاً: <b>${sign.compatibleWith}</b>\n` +
    `🎭 لمسة ترفيهية: ${sign.funNote}\n\n` +
    `⚠️ <i>معلومات الأبراج للتسلية والترفيه فقط.</i>`
  );
}

export function findZodiacByButtonText(text: string): ZodiacSignInfo | undefined {
  return ZODIAC_SIGNS.find((s) => s.buttonText === text.trim());
}
