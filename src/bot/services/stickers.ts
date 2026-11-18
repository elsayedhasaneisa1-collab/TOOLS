import { readFile } from "node:fs/promises";
import path from "node:path";
import { STICKER_ASSETS, type StickerAsset, type StickerCategoryKey } from "@/bot/data/assets";

export function pickStickerAsset(category?: StickerCategoryKey): StickerAsset {
  const pool = category ? STICKER_ASSETS.filter((s) => s.category === category) : STICKER_ASSETS;
  const list = pool.length > 0 ? pool : STICKER_ASSETS;
  return list[Math.floor(Math.random() * list.length)];
}

export async function loadStickerBuffer(asset: StickerAsset): Promise<Buffer> {
  const safeName = path.basename(asset.filename);
  const fullPath = path.join(process.cwd(), "src", "bot", "assets", "stickers", safeName);
  return readFile(fullPath);
}

export async function verifyStickersIntegrity(): Promise<{ ok: boolean; count: number }> {
  let valid = 0;
  for (const item of STICKER_ASSETS) {
    try {
      const buf = await loadStickerBuffer(item);
      if (buf.byteLength > 100) {
        valid += 1;
      }
    } catch {
      return { ok: false, count: valid };
    }
  }
  return { ok: valid === STICKER_ASSETS.length, count: valid };
}
