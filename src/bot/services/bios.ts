import { BIO_LIBRARY, type BioCategoryKey } from "@/bot/data/bios";
import { escapeHtml } from "@/lib/security";

function pickDiverseItems(items: string[], count: number): string[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

export function formatBioCategoryMessage(category: BioCategoryKey): string {
  const data = BIO_LIBRARY[category];
  const selected = pickDiverseItems(data.items, 4);
  const formatted = selected
    .map((item, index) => `<b>${index + 1})</b>\n<code>${escapeHtml(item)}</code>`)
    .join("\n\n");

  return (
    `${data.title}\n` +
    `🤍 اختر العبارة المناسبة واضغط عليها للنسخ (تتجدد مع كل ضغطة):\n\n` +
    `${formatted}\n\n` +
    `💜 اضغط على التصنيف مرة أخرى لمزيد من العبارات المختلفة.`
  );
}

export function getRandomBioAcrossAll(): string {
  const keys = Object.keys(BIO_LIBRARY) as BioCategoryKey[];
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const data = BIO_LIBRARY[randomKey];
  const item = data.items[Math.floor(Math.random() * data.items.length)];

  return (
    `🎲 <b>بايو عشوائي مقترح</b> — (${data.title})\n\n` +
    `<code>${escapeHtml(item)}</code>\n\n` +
    `🤍 اضغط على العبارة لنسخها فوراً.`
  );
}
