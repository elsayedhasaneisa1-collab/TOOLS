import {
  DAILY_WISDOM,
  FORTUNE_DISCLAIMER,
  FORTUNE_MESSAGES,
  OPTIMISM_MESSAGES,
} from "@/bot/data/fortune";

function pickRandom(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? list[0];
}

export function getEntertainmentFortuneMessage(mode: "fortune" | "optimism" | "wisdom" = "fortune"): string {
  if (mode === "optimism") {
    return (
      `🌟 <b>رسالة تفاؤل</b>\n\n` +
      `${pickRandom(OPTIMISM_MESSAGES)}\n\n` +
      `${FORTUNE_DISCLAIMER}`
    );
  }
  if (mode === "wisdom") {
    return (
      `📜 <b>حكمة اليوم</b>\n\n` +
      `${pickRandom(DAILY_WISDOM)}\n\n` +
      `${FORTUNE_DISCLAIMER}`
    );
  }
  return (
    `🔮 <b>الخيرَة الترفيهية</b>\n\n` +
    `${pickRandom(FORTUNE_MESSAGES)}\n\n` +
    `${FORTUNE_DISCLAIMER}`
  );
}
