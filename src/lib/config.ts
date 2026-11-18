import type { SectionKey } from "@/bot/types";

export const DEVELOPER_SIGNATURE = "Developed by EL-sayed Hasan";

export const SECTION_LABELS: Record<SectionKey, string> = {
  decoration_ar: "✨ زخرفة عربية",
  decoration_en: "🔤 زخرفة إنجليزية",
  decoration_num: "🔢 زخرفة أرقام",
  decoration_sentence: "📝 زخرفة جمل",
  bio_ig: "🤍 بايو إنستجرام",
  bio_tg: "📖 نبذات تليجرام",
  age: "🎂 معرفة عمري",
  zodiac: "♈ معرفة برجي",
  stickers: "🎭 الملصقات",
  voices: "🎙️ الفويزات",
  fortune: "🔮 الخيرة الترفيهية",
  downloader: "📥 مركز التحميل",
  tools: "🧩 مركز الأدوات",
};

function parseAdminIds(raw: string | undefined): Set<number> {
  const ids = new Set<number>();
  if (!raw) {
    return ids;
  }
  for (const part of raw.split(",")) {
    const trimmed = part.trim();
    if (/^\d+$/.test(trimmed)) {
      const parsed = Number(trimmed);
      if (Number.isSafeInteger(parsed) && parsed > 0) {
        ids.add(parsed);
      }
    }
  }
  return ids;
}

function parseDisabledSections(raw: string | undefined): Set<SectionKey> {
  const disabled = new Set<SectionKey>();
  if (!raw) {
    return disabled;
  }
  const validKeys = new Set<string>(Object.keys(SECTION_LABELS));
  for (const part of raw.split(",")) {
    const key = part.trim();
    if (validKeys.has(key)) {
      disabled.add(key as SectionKey);
    }
  }
  return disabled;
}

export interface BotConfig {
  botToken: string;
  webhookSecret: string;
  botUsername: string;
  adminIds: Set<number>;
  maintenanceMode: boolean;
  disabledSections: Set<SectionKey>;
  developerName: string;
}

export function getBotConfig(): BotConfig {
  const botToken = (process.env.BOT_TOKEN ?? "").trim();
  const webhookSecret = (process.env.WEBHOOK_SECRET ?? "").trim();
  const botUsername = (process.env.BOT_USERNAME ?? "").trim().replace(/^@/, "");
  const maintenanceRaw = (process.env.MAINTENANCE_MODE ?? "").trim().toLowerCase();
  const maintenanceMode = maintenanceRaw === "true" || maintenanceRaw === "1" || maintenanceRaw === "yes";

  return {
    botToken,
    webhookSecret,
    botUsername,
    adminIds: parseAdminIds(process.env.ADMIN_IDS),
    maintenanceMode,
    disabledSections: parseDisabledSections(process.env.DISABLED_SECTIONS),
    developerName: "EL-sayed Hasan",
  };
}

export function isSectionEnabled(section: SectionKey, config: BotConfig = getBotConfig()): boolean {
  return !config.disabledSections.has(section);
}
