export type StickerCategoryKey = "love" | "funny" | "anime" | "sad" | "misc" | "expressive";
export type VoiceCategoryKey = "funny" | "love" | "trend" | "misc";

export interface StickerAsset {
  id: string;
  category: StickerCategoryKey;
  title: string;
  filename: string;
}

export interface VoiceAsset {
  id: string;
  category: VoiceCategoryKey;
  title: string;
  description: string;
  filename: string;
}

export const STICKER_ASSETS: StickerAsset[] = [
  { id: "love_1", category: "love", title: "ملصق حب 1 🤍", filename: "love_1.webp" },
  { id: "love_2", category: "love", title: "ملصق حب 2 ❤️", filename: "love_2.webp" },
  { id: "funny_1", category: "funny", title: "ملصق مضحك 1 😂", filename: "funny_1.webp" },
  { id: "funny_2", category: "funny", title: "ملصق مضحك 2 😄", filename: "funny_2.webp" },
  { id: "anime_1", category: "anime", title: "ملصق أنمي 1 ✦", filename: "anime_1.webp" },
  { id: "anime_2", category: "anime", title: "ملصق أنمي 2 ❖", filename: "anime_2.webp" },
  { id: "sad_1", category: "sad", title: "ملصق حزين 1 ☁️", filename: "sad_1.webp" },
  { id: "sad_2", category: "sad", title: "ملصق حزين 2 🌙", filename: "sad_2.webp" },
  { id: "misc_1", category: "misc", title: "ملصق ملكي 1 👑", filename: "misc_1.webp" },
  { id: "misc_2", category: "misc", title: "ملصق طاقة 2 ⚡", filename: "misc_2.webp" },
  { id: "expr_1", category: "expressive", title: "ملصق تعبيري 1 ✔️", filename: "expr_1.webp" },
  { id: "expr_2", category: "expressive", title: "ملصق تعبيري 2 ✿", filename: "expr_2.webp" },
];

export const VOICE_ASSETS: VoiceAsset[] = [
  {
    id: "funny_boing",
    category: "funny",
    title: "تأثير كرتوني مرح 😂",
    description: "مقطع صوتي قصير وخفيف للأجواء المضحكة",
    filename: "funny_boing.mp3",
  },
  {
    id: "funny_comedy",
    category: "funny",
    title: "نغمة كوميدية سريعة 🎭",
    description: "مؤثر صوتي طريف مناسب للمحادثات",
    filename: "funny_comedy.mp3",
  },
  {
    id: "love_harp",
    category: "love",
    title: "وتر هادئ رومانسي ❤️",
    description: "لحن دافئ وهادئ بإحساس لطيف",
    filename: "love_harp.mp3",
  },
  {
    id: "love_serenade",
    category: "love",
    title: "مقطوعة مودة هادئة 🤍",
    description: "نغمة ناعمة للرسائل الدافئة",
    filename: "love_serenade.mp3",
  },
  {
    id: "trend_drop",
    category: "trend",
    title: "إيقاع ترند إلكتروني 🔥",
    description: "مقطع إيقاعي سريع بطابع عصري",
    filename: "trend_drop.mp3",
  },
  {
    id: "trend_pulse",
    category: "trend",
    title: "نبض سينث حماسي ⚡",
    description: "تأثير صوتي شبابي بطاقة عالية",
    filename: "trend_pulse.mp3",
  },
  {
    id: "misc_calm",
    category: "misc",
    title: "سكون ليلي هادئ 🌙",
    description: "نغمة استرخاء لطيفة وقصيرة",
    filename: "misc_calm.mp3",
  },
  {
    id: "misc_royal",
    category: "misc",
    title: "فخامة ملكية 👑",
    description: "افتتاحية صوتية هادئة وفخمة",
    filename: "misc_royal.mp3",
  },
];
