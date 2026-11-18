import { EMOJI_PACKS } from "@/bot/data/emojis";
import { escapeHtml } from "@/lib/security";

const API_TIMEOUT_MS = 4500;

async function fetchJsonWithTimeout<T>(url: string, timeoutMs = API_TIMEOUT_MS): Promise<{ ok: true; data: T; latencyMs: number } | { ok: false; error: string; latencyMs: number }> {
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });
    const latencyMs = Date.now() - started;
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}`, latencyMs };
    }
    const data = (await res.json()) as T;
    return { ok: true, data, latencyMs };
  } catch (err) {
    const latencyMs = Date.now() - started;
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return { ok: false, error: isTimeout ? "timeout" : "network_error", latencyMs };
  } finally {
    clearTimeout(timer);
  }
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”");
}

export async function getRandomAdviceMessage(): Promise<string> {
  const res = await fetchJsonWithTimeout<{ slip?: { id?: number; advice?: string } }>(
    `https://api.adviceslip.com/advice?t=${Date.now()}`
  );
  if (!res.ok || !res.data.slip?.advice) {
    return "💡 <b>نصيحة عشوائية</b>\n\n⚠️ تعذر الاتصال بخدمة النصائح حالياً، حاول مرة أخرى بعد لحظات.";
  }
  return (
    `💡 <b>نصيحة عشوائية</b>\n\n` +
    `❝ <i>${escapeHtml(res.data.slip.advice)}</i> ❞\n\n` +
    `⚡ المصدر: Advice API (${res.latencyMs}ms)`
  );
}

export async function getRandomJokeMessage(): Promise<string> {
  interface JokeResponse {
    error?: boolean;
    type?: "single" | "twopart";
    joke?: string;
    setup?: string;
    delivery?: string;
    category?: string;
  }
  const res = await fetchJsonWithTimeout<JokeResponse>(
    "https://v2.jokeapi.dev/joke/Programming,Misc,Pun?safe-mode"
  );
  if (!res.ok || res.data.error) {
    return "😂 <b>نكتة عشوائية</b>\n\n⚠️ تعذر جلب النكتة حالياً، يرجى المحاولة لاحقاً.";
  }
  const content =
    res.data.type === "twopart"
      ? `${escapeHtml(res.data.setup ?? "")}\n\n— <b>${escapeHtml(res.data.delivery ?? "")}</b>`
      : escapeHtml(res.data.joke ?? "");
  return (
    `😂 <b>نكتة عشوائية</b> (${escapeHtml(res.data.category ?? "General")})\n\n` +
    `${content}\n\n` +
    `⚡ المصدر: JokeAPI Safe-Mode (${res.latencyMs}ms)`
  );
}

export async function getRandomQuoteMessage(): Promise<string> {
  const quotable = await fetchJsonWithTimeout<{ content?: string; author?: string }>(
    "https://api.quotable.io/random",
    2200
  );
  if (quotable.ok && quotable.data.content) {
    return (
      `📜 <b>اقتباس وحكمة</b>\n\n` +
      `❝ <i>${escapeHtml(quotable.data.content)}</i> ❞\n` +
      `— <b>${escapeHtml(quotable.data.author ?? "Unknown")}</b>\n\n` +
      `⚡ المصدر: Quotable (${quotable.latencyMs}ms)`
    );
  }

  const dummy = await fetchJsonWithTimeout<{ quote?: string; author?: string }>(
    "https://dummyjson.com/quotes/random",
    3000
  );
  if (dummy.ok && dummy.data.quote) {
    return (
      `📜 <b>اقتباس وحكمة</b>\n\n` +
      `❝ <i>${escapeHtml(dummy.data.quote)}</i> ❞\n` +
      `— <b>${escapeHtml(dummy.data.author ?? "Unknown")}</b>\n\n` +
      `⚡ المصدر: Quotes Service (${dummy.latencyMs}ms)`
    );
  }

  const zen = await fetchJsonWithTimeout<Array<{ q?: string; a?: string }>>(
    "https://zenquotes.io/api/random",
    3000
  );
  if (zen.ok && Array.isArray(zen.data) && zen.data[0]?.q) {
    return (
      `📜 <b>اقتباس وحكمة</b>\n\n` +
      `❝ <i>${escapeHtml(zen.data[0].q)}</i> ❞\n` +
      `— <b>${escapeHtml(zen.data[0].a ?? "Unknown")}</b>\n\n` +
      `⚡ المصدر: Quotes Service (${zen.latencyMs}ms)`
    );
  }

  return "📜 <b>اقتباس وحكمة</b>\n\n⚠️ خدمة الاقتباسات غير متاحة مؤقتاً، حاول مجدداً بعد قليل.";
}

export async function getTriviaQuestionMessage(): Promise<string> {
  interface TriviaResponse {
    response_code?: number;
    results?: Array<{
      category: string;
      difficulty: string;
      question: string;
      correct_answer: string;
      incorrect_answers: string[];
    }>;
  }
  const res = await fetchJsonWithTimeout<TriviaResponse>("https://opentdb.com/api.php?amount=1&type=multiple");
  const item = res.ok ? res.data.results?.[0] : undefined;
  if (!res.ok || !item) {
    return "❓ <b>سؤال معلومات عامة</b>\n\n⚠️ تعذر الاتصال بـ Open Trivia DB حالياً، حاول مرة أخرى.";
  }

  const options = [item.correct_answer, ...item.incorrect_answers];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  const letters = ["A", "B", "C", "D"];
  const formattedOptions = options
    .map((opt, idx) => `${letters[idx]}. ${escapeHtml(decodeHtmlEntities(opt))}`)
    .join("\n");

  return (
    `❓ <b>سؤال معلومات عامة</b>\n` +
    `📚 التصنيف: <b>${escapeHtml(decodeHtmlEntities(item.category))}</b> (${escapeHtml(item.difficulty)})\n\n` +
    `<b>${escapeHtml(decodeHtmlEntities(item.question))}</b>\n\n` +
    `${formattedOptions}\n\n` +
    `🔒 الإجابة الصحيحة (اضغط لإظهارها): <tg-spoiler>${escapeHtml(decodeHtmlEntities(item.correct_answer))}</tg-spoiler>`
  );
}

function describeWmoWeatherCode(code: number): string {
  if (code === 0) return "سماء صافية ☀️";
  if (code === 1 || code === 2) return "غائم جزئياً 🌤️";
  if (code === 3) return "غائم كلياً ☁️";
  if (code === 45 || code === 48) return "ضباب 🌫️";
  if (code >= 51 && code <= 57) return "رذاذ خفيف 🌦️";
  if (code >= 61 && code <= 67) return "أمطار 🌧️";
  if (code >= 71 && code <= 77) return "تساقط ثلوج ❄️";
  if (code >= 80 && code <= 82) return "زخات مطر 🌦️";
  if (code >= 95) return "عواصف رعدية ⛈️";
  return "طقس متقلب 🌡️";
}

export async function getWeatherByCityMessage(rawCity: string): Promise<string> {
  const city = rawCity.trim().slice(0, 80);
  if (!city) {
    return "🌤️ يرجى كتابة اسم المدينة بشكل صحيح مثل: الرياض أو Cairo.";
  }

  interface GeoResponse {
    results?: Array<{
      name: string;
      country?: string;
      latitude: number;
      longitude: number;
    }>;
  }

  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ar&format=json`;
  const geo = await fetchJsonWithTimeout<GeoResponse>(geoUrl);
  const loc = geo.ok ? geo.data.results?.[0] : undefined;
  if (!geo.ok || !loc) {
    return `🌤️ لم يتم العثور على المدينة: <b>${escapeHtml(city)}</b>.\n📌 جرب كتابة اسم المدينة بالإنجليزية أو اختر من المدن الجاهزة.`;
  }

  interface ForecastResponse {
    current_weather?: {
      temperature: number;
      windspeed: number;
      weathercode: number;
      is_day: number;
    };
  }

  const forecastUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}` +
    `&current_weather=true&timezone=auto`;
  const weather = await fetchJsonWithTimeout<ForecastResponse>(forecastUrl);
  const current = weather.ok ? weather.data.current_weather : undefined;
  if (!weather.ok || !current) {
    return "🌤️ تعذر جلب حالة الطقس من Open-Meteo حالياً، حاول مرة أخرى.";
  }

  const dayState = current.is_day === 1 ? "نهار ☀️" : "ليل 🌙";
  return (
    `🌤️ <b>حالة الطقس الآن</b>\n\n` +
    `📍 المدينة: <b>${escapeHtml(loc.name)}</b>${loc.country ? ` (${escapeHtml(loc.country)})` : ""}\n` +
    `🌡️ درجة الحرارة: <b>${current.temperature}°C</b>\n` +
    `☁️ الحالة: <b>${describeWmoWeatherCode(current.weathercode)}</b>\n` +
    `💨 سرعة الرياح: <b>${current.windspeed} كم/س</b>\n` +
    `🕒 التوقيت: <b>${dayState}</b>\n\n` +
    `⚡ المصدر: Open-Meteo (${weather.latencyMs}ms)`
  );
}

const ARABIC_COUNTRY_FALLBACK: Record<string, string> = {
  "مصر": "egypt",
  "السعودية": "saudi arabia",
  "المملكة العربية السعودية": "saudi arabia",
  "الإمارات": "united arab emirates",
  "الامارات": "united arab emirates",
  "المغرب": "morocco",
  "العراق": "iraq",
  "الأردن": "jordan",
  "الاردن": "jordan",
  "تونس": "tunisia",
  "الجزائر": "algeria",
  "الكويت": "kuwait",
  "قطر": "qatar",
  "البحرين": "bahrain",
  "عمان": "oman",
  "سلطنة عمان": "oman",
  "لبنان": "lebanon",
  "سوريا": "syria",
  "فلسطين": "palestine",
  "اليمن": "yemen",
  "السودان": "sudan",
  "ليبيا": "libya",
  "موريتانيا": "mauritania",
  "الصومال": "somalia",
  "تركيا": "turkey",
  "فرنسا": "france",
  "ألمانيا": "germany",
  "المانيا": "germany",
  "إيطاليا": "italy",
  "ايطاليا": "italy",
  "إسبانيا": "spain",
  "اسبانيا": "spain",
  "اليابان": "japan",
  "الصين": "china",
  "الهند": "india",
  "روسيا": "russia",
  "كندا": "canada",
  "البرازيل": "brazil",
  "أمريكا": "united states",
  "امريكا": "united states",
  "بريطانيا": "united kingdom",
};

export async function getCountryInfoMessage(rawCountry: string): Promise<string> {
  const input = rawCountry.trim().slice(0, 80);
  if (!input) {
    return "🌍 يرجى كتابة اسم الدولة بشكل صحيح مثل: مصر أو Egypt.";
  }

  interface CountryDevRecord {
    name?: string;
    nativeName?: string;
    capital?: string;
    region?: string;
    subregion?: string;
    population?: number;
    area?: number;
    currencies?: Array<{ code?: string; name?: string; symbol?: string }>;
    languages?: Array<{ name?: string; nativeName?: string }>;
    callingCodes?: string[];
    flag?: string;
  }

  const mapped = ARABIC_COUNTRY_FALLBACK[input] ?? input;
  const res = await fetchJsonWithTimeout<CountryDevRecord[]>(
    `https://countries.dev/name/${encodeURIComponent(mapped)}`
  );

  const country = res.ok && Array.isArray(res.data) ? res.data[0] : undefined;
  if (!country || !country.name) {
    return `🌍 لم يتم العثور على دولة باسم: <b>${escapeHtml(input)}</b>.\n📌 جرب كتابة الاسم بالإنجليزية أو اختر من الأزرار السريعة.`;
  }

  const displayName = country.nativeName ? `${country.nativeName} (${country.name})` : country.name;
  const capital = country.capital ?? "غير متاح";
  const population = typeof country.population === "number" ? country.population.toLocaleString("en-US") : "غير متاح";
  const area = typeof country.area === "number" ? `${country.area.toLocaleString("en-US")} كم²` : "غير متاح";
  const currencies = Array.isArray(country.currencies) && country.currencies.length > 0
    ? country.currencies
        .map((c) => `${c.name ?? c.code ?? ""}${c.symbol ? ` (${c.symbol})` : ""}`.trim())
        .join("، ")
    : "غير متاح";
  const languages = Array.isArray(country.languages) && country.languages.length > 0
    ? country.languages.map((l) => l.nativeName || l.name || "").filter(Boolean).join("، ")
    : "غير متاح";
  const dialCode = Array.isArray(country.callingCodes) && country.callingCodes[0] ? `+${country.callingCodes[0]}` : "غير متاح";

  return (
    `${country.flag ?? "🌍"} <b>معلومات الدولة: ${escapeHtml(displayName)}</b>\n\n` +
    `🏛️ العاصمة: <b>${escapeHtml(capital)}</b>\n` +
    `🌐 القارة: <b>${escapeHtml(country.region ?? "غير متاح")}</b>\n` +
    `👥 عدد السكان: <b>${escapeHtml(population)}</b>\n` +
    `📐 المساحة: <b>${escapeHtml(area)}</b>\n` +
    `💰 العملة: <b>${escapeHtml(currencies)}</b>\n` +
    `🗣️ اللغات: <b>${escapeHtml(languages)}</b>\n` +
    `📞 رمز الاتصال: <b>${escapeHtml(dialCode)}</b>\n\n` +
    `⚡ المصدر: Countries API (${res.ok ? res.latencyMs : 0}ms)`
  );
}

export function buildDiceBearAvatarUrl(rawSeed: string): { url: string; seed: string; style: string } {
  const styles = ["bottts", "avataaars", "lorelei", "thumbs", "fun-emoji"];
  const style = styles[Math.floor(Math.random() * styles.length)];
  const seed = rawSeed.trim().slice(0, 60) || `user-${Math.floor(Math.random() * 10000)}`;
  const url = `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(seed)}&size=512`;
  return { url, seed, style };
}

export function getEmojiCategoryMessage(packId?: string): string {
  const pack = packId
    ? EMOJI_PACKS.find((p) => p.id === packId)
    : EMOJI_PACKS[Math.floor(Math.random() * EMOJI_PACKS.length)];
  const selected = pack ?? EMOJI_PACKS[0];
  const joined = selected.items.join("  ");
  return (
    `😀 <b>مكتبة الإيموجي والرموز</b> — ${selected.title}\n\n` +
    `<code>${escapeHtml(joined)}</code>\n\n` +
    `🤍 اضغط على السطر لنسخ الرموز مباشرة.`
  );
}

export async function pingExternalApis(): Promise<Array<{ name: string; ok: boolean; status: string; latencyMs: number }>> {
  const checks = await Promise.all([
    fetchJsonWithTimeout("https://api.adviceslip.com/advice", 3500).then((r) => ({
      name: "Advice API",
      ok: r.ok,
      status: r.ok ? "متاح" : r.error,
      latencyMs: r.latencyMs,
    })),
    fetchJsonWithTimeout("https://v2.jokeapi.dev/joke/Programming?safe-mode", 3500).then((r) => ({
      name: "JokeAPI",
      ok: r.ok,
      status: r.ok ? "متاح" : r.error,
      latencyMs: r.latencyMs,
    })),
    fetchJsonWithTimeout("https://dummyjson.com/quotes/random", 3500).then((r) => ({
      name: "Quotes Service",
      ok: r.ok,
      status: r.ok ? "متاح" : r.error,
      latencyMs: r.latencyMs,
    })),
    fetchJsonWithTimeout("https://opentdb.com/api.php?amount=1", 3500).then((r) => ({
      name: "Open Trivia DB",
      ok: r.ok,
      status: r.ok ? "متاح" : r.error,
      latencyMs: r.latencyMs,
    })),
    fetchJsonWithTimeout("https://api.open-meteo.com/v1/forecast?latitude=30.04&longitude=31.23&current_weather=true", 3500).then((r) => ({
      name: "Open-Meteo",
      ok: r.ok,
      status: r.ok ? "متاح" : r.error,
      latencyMs: r.latencyMs,
    })),
    fetchJsonWithTimeout("https://countries.dev/name/egypt", 3500).then((r) => ({
      name: "Countries API",
      ok: r.ok,
      status: r.ok ? "متاح" : r.error,
      latencyMs: r.latencyMs,
    })),
    (async () => {
      const started = Date.now();
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3500);
      try {
        const res = await fetch("https://api.dicebear.com/9.x/bottts/png?seed=healthcheck", {
          method: "HEAD",
          signal: ctrl.signal,
        });
        return { name: "DiceBear", ok: res.ok, status: res.ok ? "متاح" : `HTTP ${res.status}`, latencyMs: Date.now() - started };
      } catch {
        return { name: "DiceBear", ok: false, status: "تعذر الاتصال", latencyMs: Date.now() - started };
      } finally {
        clearTimeout(timer);
      }
    })(),
  ]);

  return checks;
}
