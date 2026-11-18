import {
  ARABIC_FRAMES,
  DECORATION_SYMBOLS_PACK,
  ENGLISH_FONT_MAPS,
  NUMBER_STYLES,
  SAMPLE_ARABIC_NAMES,
  SAMPLE_ENGLISH_NAMES,
  SAMPLE_NUMBERS,
  SAMPLE_SENTENCES,
  SENTENCE_FRAMES,
} from "@/bot/data/decorations";
import { escapeHtml } from "@/lib/security";

const NON_CONNECTING_ARABIC = new Set(["ا", "أ", "إ", "آ", "د", "ذ", "ر", "ز", "و", "ؤ", "ة", "ى", "ء"]);
const ARABIC_LETTER_REGEX = /[\u0621-\u064A]/;

function applyArabicKashida(text: string, stretchCount = 1): string {
  const chars = [...text];
  const tatweel = "ـ".repeat(stretchCount);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const next = chars[i + 1];
    out += ch;
    if (
      ARABIC_LETTER_REGEX.test(ch) &&
      !NON_CONNECTING_ARABIC.has(ch) &&
      next !== undefined &&
      ARABIC_LETTER_REGEX.test(next)
    ) {
      out += tatweel;
    }
  }
  return out;
}

function applySoftArabicTashkeel(text: string): string {
  const marks = ["َ", "ِ", "ُ", "ْ"];
  const chars = [...text];
  let out = "";
  let idx = 0;
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    out += ch;
    if (ARABIC_LETTER_REGEX.test(ch) && ch !== "ا" && ch !== "ى" && ch !== "ة") {
      if (i % 2 === 0) {
        out += marks[idx % marks.length];
        idx += 1;
      }
    }
  }
  return out;
}

function mapEnglishText(
  text: string,
  upper: string[],
  lower: string[],
  digits?: string[]
): string {
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      out += upper[code - 65] ?? ch;
    } else if (code >= 97 && code <= 122) {
      out += lower[code - 97] ?? ch;
    } else if (digits && code >= 48 && code <= 57) {
      out += digits[code - 48] ?? ch;
    } else {
      out += ch;
    }
  }
  return out;
}

function normalizeAsciiDigits(input: string): string {
  const arabicIndic = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return [...input]
    .map((ch) => {
      const aIdx = arabicIndic.indexOf(ch);
      if (aIdx !== -1) return String(aIdx);
      const pIdx = persian.indexOf(ch);
      if (pIdx !== -1) return String(pIdx);
      return ch;
    })
    .join("");
}

export function decorateArabicName(rawName: string): { html: string; count: number } {
  const name = rawName.trim().slice(0, 60);
  const kashida1 = applyArabicKashida(name, 1);
  const kashida2 = applyArabicKashida(name, 2);
  const tashkeel = applySoftArabicTashkeel(name);

  const variants: string[] = [];
  for (let i = 0; i < ARABIC_FRAMES.length; i++) {
    const frame = ARABIC_FRAMES[i];
    let core = name;
    if (i % 4 === 1) core = kashida1;
    else if (i % 4 === 2) core = tashkeel;
    else if (i % 4 === 3) core = kashida2;
    variants.push(`${frame.left}${core}${frame.right}`);
  }

  const lines = variants.map((v, idx) => `${idx + 1}. <code>${escapeHtml(v)}</code>`);
  const header = `✨ <b>زخرفة عربية احترافية</b> — لـ: <b>${escapeHtml(name)}</b>\n💜 اضغط على أي زخرفة لنسخها مباشرة (${variants.length} شكلاً):\n`;
  return {
    html: `${header}\n${lines.join("\n")}\n\n📌 أرسل أي اسم عربي آخر أو رُد على هذه الرسالة لزخرفة جديدة.`,
    count: variants.length,
  };
}

export function decorateEnglishName(rawName: string): { html: string; count: number } {
  const name = rawName.trim().slice(0, 60);
  const results: string[] = [];

  for (const font of ENGLISH_FONT_MAPS) {
    results.push(mapEnglishText(name, font.upper, font.lower, font.digits));
  }

  const extraFrames: Array<{ fontIdx: number; left: string; right: string }> = [
    { fontIdx: 0, left: "꧁༺ ", right: " ༻꧂" },
    { fontIdx: 4, left: "★彡 ", right: " 彡★" },
    { fontIdx: 6, left: "♛ ", right: " ♛" },
    { fontIdx: 7, left: "『 ", right: " 』" },
    { fontIdx: 8, left: "🤍✨ ", right: " ✨🤍" },
    { fontIdx: 9, left: "💜⚡ ", right: " ⚡💜" },
    { fontIdx: 10, left: "🖤┆ ", right: " ┆🖤" },
    { fontIdx: 11, left: "⫷ ", right: " ⫸" },
    { fontIdx: 17, left: "⋆｡°✩ ", right: " ✩°｡⋆" },
    { fontIdx: 1, left: "𓆩 ", right: " 𓆪" },
    { fontIdx: 3, left: "✿ ", right: " ✿" },
    { fontIdx: 4, left: "❖ ", right: " ❖" },
    { fontIdx: 5, left: "꧁ ", right: " ꧂" },
    { fontIdx: 8, left: "【 ", right: " 】" },
    { fontIdx: 12, left: "「 ", right: " 」" },
    { fontIdx: 0, left: "•°• ", right: " •°•" },
  ];

  for (const ef of extraFrames) {
    const f = ENGLISH_FONT_MAPS[ef.fontIdx];
    const mapped = mapEnglishText(name, f.upper, f.lower, f.digits);
    results.push(`${ef.left}${mapped}${ef.right}`);
  }

  const lines = results.map((v, idx) => `${idx + 1}. <code>${escapeHtml(v)}</code>`);
  const header = `🔤 <b>زخرفة إنجليزية احترافية</b> — لـ: <b>${escapeHtml(name)}</b>\n💜 اضغط على أي زخرفة لنسخها مباشرة (${results.length} شكلاً):\n`;
  return {
    html: `${header}\n${lines.join("\n")}\n\n📌 أرسل أي اسم إنجليزي آخر لزخرفة جديدة.`,
    count: results.length,
  };
}

export function decorateNumbers(rawNumber: string): { html: string; count: number } {
  const normalized = normalizeAsciiDigits(rawNumber.trim()).slice(0, 30);
  const results: string[] = [];

  for (const style of NUMBER_STYLES) {
    const mapped = [...normalized]
      .map((ch) => {
        const code = ch.charCodeAt(0);
        if (code >= 48 && code <= 57) {
          return style.digits[code - 48] ?? ch;
        }
        return ch;
      })
      .join("");
    results.push(`${style.prefix ?? ""}${mapped}${style.suffix ?? ""}`);
  }

  const lines = results.map((v, idx) => `${idx + 1}. <code>${escapeHtml(v)}</code>`);
  const header = `🔢 <b>زخرفة الأرقام</b> — للرقم: <b>${escapeHtml(normalized)}</b>\n💜 اضغط على أي شكل لنسخه مباشرة (${results.length} شكلاً):\n`;
  return {
    html: `${header}\n${lines.join("\n")}\n\n📌 أرسل أي رقم (مثل 2026 أو 777) لزخرفته فوراً.`,
    count: results.length,
  };
}

export function decorateSentence(rawSentence: string): { html: string; count: number } {
  const sentence = rawSentence.trim().slice(0, 180);
  const hasLatin = /[A-Za-z]/.test(sentence);
  const hasArabic = /[\u0600-\u06FF]/.test(sentence);
  const results: string[] = [];

  for (let i = 0; i < SENTENCE_FRAMES.length; i++) {
    const frame = SENTENCE_FRAMES[i];
    let body = sentence;
    if (hasArabic && i % 5 === 1) {
      body = applyArabicKashida(sentence, 1);
    } else if (hasLatin && !hasArabic && i % 3 === 1) {
      const f = ENGLISH_FONT_MAPS[8];
      body = mapEnglishText(sentence, f.upper, f.lower, f.digits);
    }
    const formatted = frame.linePrefix
      ? body
          .split("\n")
          .map((line) => `${frame.linePrefix}${line}`)
          .join("\n")
      : body;
    results.push(`${frame.prefix}${formatted}${frame.suffix}`);
  }

  const blocks = results.slice(0, 15).map((v, idx) => `<b>${idx + 1})</b>\n<code>${escapeHtml(v)}</code>`);
  const header = `📝 <b>زخرفة الجمل والعبارات</b> (${results.length} تنسيقاً متاحاً — أفضل 15 تنسيقاً):\n`;
  return {
    html: `${header}\n${blocks.join("\n\n")}\n\n📌 أرسل أي جملة عربية أو إنجليزية لزخرفتها فوراً.`,
    count: results.length,
  };
}

export function getSymbolsAndDividersMessage(): string {
  const lines = DECORATION_SYMBOLS_PACK.map((item, idx) => `${idx + 1}. <code>${escapeHtml(item)}</code>`);
  return `🔣 <b>مكتبة الرموز والفواصل الجاهزة</b>\n🤍 اضغط على أي صف لنسخه واستخدامه في الأسماء والبايو:\n\n${lines.join("\n")}`;
}

export function pickRandomSample(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}

export { SAMPLE_ARABIC_NAMES, SAMPLE_ENGLISH_NAMES, SAMPLE_NUMBERS, SAMPLE_SENTENCES };
